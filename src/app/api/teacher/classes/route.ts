import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { generateClassCode, mockDb } from "@/lib/server/auth-helpers";
import { requireTeacher, AuthUserSession } from "@/lib/server/auth";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "@/lib/demo/demo-school-data";
import { seedMockDatabase } from "@/lib/demo/seeder";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireTeacher(req);
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    return NextResponse.json(
      { error: err.message || "Teacher authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  const isDemoTeacher =
    session.id === DEMO_SCHOOL_CONFIG.teacher.id ||
    session.email?.toLowerCase() === DEMO_SCHOOL_CONFIG.teacher.email.toLowerCase();

  const supabaseActive = isSupabaseConfigured();

  if (supabaseActive) {
    const admin = getSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Database administration client unavailable: Missing service credentials." },
        { status: 503 }
      );
    }

    // 1. Fetch only classes owned by this teacher (strict isolation)
    let { data: classes, error } = await admin
      .from("classes")
      .select("id, name, grade, class_code, created_at")
      .eq("teacher_id", session.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Fetch enrolled students strictly belonging to these classes
    const classIds = (classes || []).map((c: any) => c.id);
    let members: any[] = [];

    if (classIds.length > 0) {
      const { data: memberRows, error: memberErr } = await admin
        .from("class_members")
        .select("class_id, student_id, joined_at, profiles(id, full_name, username, selected_class)")
        .in("class_id", classIds);

      if (!memberErr && memberRows) {
        members = memberRows;
      }
    }

    // 3. Fetch progress, concept mastery & diagnostic attempts for enrolled students
    const studentIds = members.map((m: any) => m.student_id);
    const studentMastery: Record<string, any[]> = {};
    const studentAttempts: Record<string, any[]> = {};

    if (studentIds.length > 0) {
      const { data: masteryData } = await admin
        .from("concept_mastery")
        .select("student_id, concept_id, mastery, difficulty, status, lesson_completed, worksheet_completed, last_attempt_at")
        .in("student_id", studentIds);

      if (masteryData) {
        for (const m of masteryData) {
          if (!studentMastery[m.student_id]) studentMastery[m.student_id] = [];
          studentMastery[m.student_id].push(m);
        }
      }

      const { data: attemptsData } = await admin
        .from("attempts")
        .select("student_id, type, identifier, score, total, created_at")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false });

      if (attemptsData) {
        for (const a of attemptsData) {
          if (!studentAttempts[a.student_id]) studentAttempts[a.student_id] = [];
          studentAttempts[a.student_id].push(a);
        }
      }
    }

    // Enrich member rows with real student progress data and demo metadata
    const enrichedMembers = members.map((m: any) => {
      const mastery = studentMastery[m.student_id] || [];
      const attempts = studentAttempts[m.student_id] || [];
      const masteredCount = mastery.filter((item) => Number(item.mastery) >= 75 || item.status === "mastered").length;
      const latestDiagnostic = attempts.find((a) => a.type === "diagnostic");
      const demoMeta = DEMO_STUDENTS.find(
        (s) => s.id === m.student_id || s.username === m.profiles?.username
      );

      return {
        ...m,
        conceptMastery: mastery,
        attempts,
        masteredCount,
        totalConceptsAttempted: mastery.length,
        latestDiagnosticScore: latestDiagnostic ? `${latestDiagnostic.score}/${latestDiagnostic.total}` : null,
        latestDiagnosticPercentage: latestDiagnostic ? Math.round((Number(latestDiagnostic.score) / Number(latestDiagnostic.total)) * 100) : null,
        persona: demoMeta?.persona || null,
        category: demoMeta?.category || null,
        identifiedGap: demoMeta?.identifiedGap || null,
        resolvedGap: demoMeta?.resolvedGap || null,
        strongConcepts: demoMeta?.strongConcepts || [],
        conceptsNeedingImprovement: demoMeta?.conceptsNeedingImprovement || [],
        completedLessons: demoMeta?.completedLessons || [],
        pendingTopics: demoMeta?.pendingTopics || [],
        recommendedActivity: demoMeta?.recommendedActivity || null,
        schoolName: isDemoTeacher ? DEMO_SCHOOL_CONFIG.schoolName : undefined,
      };
    });

    const enrichedClasses = (classes || []).map((cls: any) => ({
      ...cls,
      schoolName: isDemoTeacher || cls.class_code === DEMO_SCHOOL_CONFIG.classCode ? DEMO_SCHOOL_CONFIG.schoolName : undefined,
      isDemo: isDemoTeacher || cls.class_code === DEMO_SCHOOL_CONFIG.classCode,
    }));

    return NextResponse.json({ classes: enrichedClasses, members: enrichedMembers });
  } else {
    if (process.env.NODE_ENV === "production" && !isDemoTeacher) {
      return NextResponse.json(
        { error: "Database service unavailable in production: Supabase credentials not configured." },
        { status: 503 }
      );
    }

    // Auto-seed mockDb if demo teacher is accessing with empty classes
    if (isDemoTeacher && !mockDb.classes.has(`cls_${DEMO_SCHOOL_CONFIG.classCode.toLowerCase().replace(/[^a-z0-9]/g, "_")}`)) {
      seedMockDatabase();
    }

    // Mock store fallback (dev/test only)
    const teacherClasses = Array.from(mockDb.classes.values()).filter(
      (c) => c.teacherId === session.id
    ).map((cls) => ({
      ...cls,
      schoolName: isDemoTeacher || cls.classCode === DEMO_SCHOOL_CONFIG.classCode ? DEMO_SCHOOL_CONFIG.schoolName : undefined,
      isDemo: isDemoTeacher || cls.classCode === DEMO_SCHOOL_CONFIG.classCode,
    }));

    const classIds = new Set(teacherClasses.map((c) => c.id));
    const members = Array.from(mockDb.classMembers.values())
      .filter((m) => classIds.has(m.classId))
      .map((m) => {
        const student = mockDb.profiles.get(m.studentId);
        const mastery = Array.from(mockDb.conceptMastery.values()).filter(
          (cm) => cm.studentId === m.studentId
        );
        const attempts = mockDb.attempts.filter(
          (a) => a.studentId === m.studentId
        );
        const masteredCount = mastery.filter((item) => Number(item.mastery) >= 75 || item.status === "mastered").length;
        const latestDiagnostic = attempts.find((a) => a.type === "diagnostic");
        const demoMeta = DEMO_STUDENTS.find(
          (s) => s.id === m.studentId || s.username === student?.username
        );

        return {
          class_id: m.classId,
          student_id: m.studentId,
          joined_at: m.joinedAt,
          profiles: student
            ? {
                id: student.id,
                full_name: student.fullName,
                username: student.username,
                selected_class: student.selectedClass,
              }
            : null,
          conceptMastery: mastery,
          attempts,
          masteredCount,
          totalConceptsAttempted: mastery.length,
          latestDiagnosticScore: latestDiagnostic ? `${latestDiagnostic.score}/${latestDiagnostic.total}` : null,
          latestDiagnosticPercentage: latestDiagnostic ? Math.round((Number(latestDiagnostic.score) / Number(latestDiagnostic.total)) * 100) : null,
          persona: demoMeta?.persona || null,
          category: demoMeta?.category || null,
          identifiedGap: demoMeta?.identifiedGap || null,
          resolvedGap: demoMeta?.resolvedGap || null,
          strongConcepts: demoMeta?.strongConcepts || [],
          conceptsNeedingImprovement: demoMeta?.conceptsNeedingImprovement || [],
          completedLessons: demoMeta?.completedLessons || [],
          pendingTopics: demoMeta?.pendingTopics || [],
          recommendedActivity: demoMeta?.recommendedActivity || null,
          schoolName: isDemoTeacher ? DEMO_SCHOOL_CONFIG.schoolName : undefined,
        };
      });

    return NextResponse.json({ classes: teacherClasses, members });
  }
}

export async function POST(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireTeacher(req);
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    return NextResponse.json(
      { error: err.message || "Teacher authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  try {
    const body = await req.json();
    const { name, grade } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Class name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const numGrade = Number(grade);
    if (!numGrade || numGrade < 6 || numGrade > 10) {
      return NextResponse.json(
        { error: "Grade must be between 6 and 10" },
        { status: 400 }
      );
    }

    const classCode = generateClassCode(numGrade);
    const supabaseActive = isSupabaseConfigured();

    if (supabaseActive) {
      const admin = getSupabaseAdminClient();
      if (!admin) {
        return NextResponse.json(
          { error: "Database administration client unavailable: Missing service credentials." },
          { status: 503 }
        );
      }

      const { data: newClass, error } = await admin
        .from("classes")
        .insert({
          teacher_id: session.id,
          name: name.trim(),
          grade: numGrade,
          class_code: classCode,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, class: newClass });
    } else {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database service unavailable in production: Supabase credentials not configured." },
          { status: 503 }
        );
      }

      const classId = `cls_${Date.now()}`;
      const newClass = {
        id: classId,
        teacherId: session.id,
        name: name.trim(),
        grade: numGrade,
        classCode,
        createdAt: new Date().toISOString(),
      };
      mockDb.classes.set(classId, newClass);
      return NextResponse.json({ success: true, class: newClass });
    }
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Teacher class creation error:", err);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}

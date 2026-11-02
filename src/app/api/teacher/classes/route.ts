import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { generateClassCode, mockDb } from "@/lib/server/auth-helpers";
import { requireTeacher, AuthUserSession } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireTeacher(req);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Teacher authorization required" },
      { status: err.statusCode || 401 }
    );
  }

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
    const { data: classes, error } = await admin
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

    // Enrich member rows with real student progress data
    const enrichedMembers = members.map((m: any) => {
      const mastery = studentMastery[m.student_id] || [];
      const attempts = studentAttempts[m.student_id] || [];
      const masteredCount = mastery.filter((item) => Number(item.mastery) >= 75 || item.status === "mastered").length;
      const latestDiagnostic = attempts.find((a) => a.type === "diagnostic");

      return {
        ...m,
        conceptMastery: mastery,
        attempts,
        masteredCount,
        totalConceptsAttempted: mastery.length,
        latestDiagnosticScore: latestDiagnostic ? `${latestDiagnostic.score}/${latestDiagnostic.total}` : null,
        latestDiagnosticPercentage: latestDiagnostic ? Math.round((Number(latestDiagnostic.score) / Number(latestDiagnostic.total)) * 100) : null,
      };
    });

    return NextResponse.json({ classes: classes || [], members: enrichedMembers });
  } else {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Database service unavailable in production: Supabase credentials not configured." },
        { status: 503 }
      );
    }

    // Mock store fallback (dev/test only)
    const teacherClasses = Array.from(mockDb.classes.values()).filter(
      (c) => c.teacherId === session.id
    );
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
    console.error("Teacher class creation error:", err);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}

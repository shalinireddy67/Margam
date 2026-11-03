/**
 * Margam Demo School Seeder
 * Idempotently seeds Example Public School, Class 10-A (demo), Demo Teacher, and all 25 students
 * into both Supabase PostgreSQL (when credentials are active) and the in-memory mockDb.
 *
 * SAFETY GUARDS:
 * - Operates strictly on domain '@example.demo.invalid' and classCode 'DEMO-10A'.
 * - Never modifies, drops, or overwrites any real student or teacher record.
 * - Idempotent: can be safely executed repeatedly without creating duplicates.
 */

import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { isAdminConfigured, getSupabaseUrl, getSupabaseServiceKey, isSupabaseConfigured } from "@/lib/env";
import { mockDb, StoredUserProfile, StoredClass, StoredClassMember } from "@/lib/server/auth-helpers";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS, getDemoClassMetrics } from "./demo-school-data";

function getSeederAdminClient(): SupabaseClient | null {
  if (!isAdminConfigured()) return null;
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface SeedingResult {
  mode: "supabase" | "mock";
  school: string;
  className: string;
  classCode: string;
  teacherId: string;
  studentsSeeded: number;
  attemptsSeeded: number;
  conceptMasteryRecordsSeeded: number;
  success: boolean;
  message: string;
}

/**
 * Seeds the in-memory mock database store.
 * Always available in development, testing, and offline presentation environments.
 */
export function seedMockDatabase(): SeedingResult {
  const teacherId = DEMO_SCHOOL_CONFIG.teacher.id;
  const classId = `cls_${DEMO_SCHOOL_CONFIG.classCode.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
  const passwordHash = crypto.createHash("sha256").update(DEMO_SCHOOL_CONFIG.demoPassword).digest("hex");

  // 1. Seed Demo Teacher Profile
  const teacherProfile: StoredUserProfile = {
    id: teacherId,
    role: "teacher",
    username: "demo_teacher",
    email: DEMO_SCHOOL_CONFIG.teacher.email,
    passwordHash,
    fullName: DEMO_SCHOOL_CONFIG.teacher.fullName,
    selectedClass: 10,
    recoveryCodeHash: null,
    consentConfirmed: true,
    createdAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockDb.profiles.set(teacherId, teacherProfile);

  // 2. Seed Class 10-A (demo)
  const classRecord: StoredClass = {
    id: classId,
    teacherId,
    name: DEMO_SCHOOL_CONFIG.className,
    grade: DEMO_SCHOOL_CONFIG.grade,
    classCode: DEMO_SCHOOL_CONFIG.classCode,
    createdAt: new Date().toISOString(),
  };
  mockDb.classes.set(classId, classRecord);

  // 3. Seed All 25 Students
  let totalAttempts = 0;
  let totalMastery = 0;

  for (const student of DEMO_STUDENTS) {
    const sId = student.id;

    // Student Profile
    const studentProfile: StoredUserProfile = {
      id: sId,
      role: "student",
      username: student.username,
      email: student.email,
      passwordHash,
      fullName: student.name,
      selectedClass: 10,
      recoveryCodeHash: null,
      consentConfirmed: true,
      classCode: DEMO_SCHOOL_CONFIG.classCode,
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDb.profiles.set(sId, studentProfile);

    // Class Enrollment
    const memberId = `mem_${classId}_${sId}`;
    const memberRecord: StoredClassMember = {
      id: memberId,
      classId,
      studentId: sId,
      joinedAt: new Date().toISOString(),
    };
    mockDb.classMembers.set(memberId, memberRecord);

    // Concept Mastery Records
    for (const cm of student.conceptMastery) {
      const cmKey = `${sId}:${cm.conceptId}`;
      mockDb.conceptMastery.set(cmKey, {
        id: `cm_${cmKey.replace(/[^a-zA-Z0-9]/g, "_")}`,
        studentId: sId,
        conceptId: cm.conceptId,
        mastery: cm.mastery,
        difficulty: cm.difficulty,
        consecutiveCorrect: cm.mastery >= 80 ? 3 : 1,
        consecutiveIncorrect: cm.mastery < 60 ? 2 : 0,
        status: cm.status,
        lessonCompleted: cm.lessonCompleted,
        worksheetCompleted: cm.worksheetCompleted,
        lastAttemptAt: new Date().toISOString(),
      });
      totalMastery++;
    }

    // Assessment Attempts
    // Remove previous attempts for this student to ensure idempotency
    mockDb.attempts = mockDb.attempts.filter((a) => a.studentId !== sId);
    for (const att of student.attempts) {
      mockDb.attempts.push({
        id: `att_${sId}_${att.identifier}_${Date.now()}`,
        studentId: sId,
        type: att.type,
        identifier: att.identifier,
        score: att.score,
        total: att.total,
        createdAt: att.createdAt,
      });
      totalAttempts++;
    }
  }

  return {
    mode: "mock",
    school: DEMO_SCHOOL_CONFIG.schoolName,
    className: DEMO_SCHOOL_CONFIG.className,
    classCode: DEMO_SCHOOL_CONFIG.classCode,
    teacherId,
    studentsSeeded: DEMO_STUDENTS.length,
    attemptsSeeded: totalAttempts,
    conceptMasteryRecordsSeeded: totalMastery,
    success: true,
    message: `Successfully seeded Example Public School (Class 10-A (demo)) with ${DEMO_STUDENTS.length} students into Mock Store.`,
  };
}

/**
 * Seeds the live Supabase PostgreSQL database via service_role admin client.
 * Strictly scoped to Example Public School demo identifiers to protect all real production data.
 */
export async function seedSupabaseDatabase(): Promise<SeedingResult> {
  const admin = getSeederAdminClient();
  if (!admin) {
    throw new Error("Supabase Admin client unavailable. Verify SUPABASE_SERVICE_ROLE_KEY.");
  }

  const teacherEmail = DEMO_SCHOOL_CONFIG.teacher.email;
  const demoPassword = DEMO_SCHOOL_CONFIG.demoPassword;

  // 1. Create or Find Demo Teacher User in auth.users
  let teacherUserId: string;
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const foundTeacher = existingUsers?.users?.find((u) => u.email?.toLowerCase() === teacherEmail.toLowerCase());

  if (foundTeacher) {
    teacherUserId = foundTeacher.id;
  } else {
    const { data: newTeacherUser, error: createTeacherErr } = await admin.auth.admin.createUser({
      email: teacherEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        full_name: DEMO_SCHOOL_CONFIG.teacher.fullName,
        role: "teacher",
        school: DEMO_SCHOOL_CONFIG.schoolName,
      },
    });
    if (createTeacherErr || !newTeacherUser.user) {
      throw new Error(`Failed to provision demo teacher in Supabase Auth: ${createTeacherErr?.message}`);
    }
    teacherUserId = newTeacherUser.user.id;
  }

  // 2. Upsert Demo Teacher Profile in public.profiles
  const { error: teacherProfileErr } = await admin.from("profiles").upsert({
    id: teacherUserId,
    role: "teacher",
    full_name: DEMO_SCHOOL_CONFIG.teacher.fullName,
    consent_confirmed: true,
    selected_class: 10,
    updated_at: new Date().toISOString(),
  });
  if (teacherProfileErr) {
    throw new Error(`Failed to upsert demo teacher profile: ${teacherProfileErr.message}`);
  }

  // 3. Upsert Class 10-A (demo) in public.classes
  let classId: string;
  const { data: existingClass } = await admin
    .from("classes")
    .select("id")
    .eq("class_code", DEMO_SCHOOL_CONFIG.classCode)
    .maybeSingle();

  if (existingClass) {
    classId = existingClass.id;
  } else {
    const { data: newClass, error: classErr } = await admin
      .from("classes")
      .insert({
        teacher_id: teacherUserId,
        name: DEMO_SCHOOL_CONFIG.className,
        grade: DEMO_SCHOOL_CONFIG.grade,
        class_code: DEMO_SCHOOL_CONFIG.classCode,
        leaderboard_enabled: true,
      })
      .select("id")
      .single();

    if (classErr || !newClass) {
      throw new Error(`Failed to create Class 10-A (demo): ${classErr?.message}`);
    }
    classId = newClass.id;
  }

  // 4. Seed All 25 Students in auth.users, public.profiles & class_members
  let totalAttempts = 0;
  let totalMastery = 0;

  for (const student of DEMO_STUDENTS) {
    const foundStudent = existingUsers?.users?.find((u) => u.email?.toLowerCase() === student.email.toLowerCase());
    let studentUserId: string;

    if (foundStudent) {
      studentUserId = foundStudent.id;
    } else {
      const { data: newStudentUser, error: createStudentErr } = await admin.auth.admin.createUser({
        email: student.email,
        password: demoPassword,
        email_confirm: true,
        user_metadata: {
          full_name: student.name,
          username: student.username,
          role: "student",
          school: DEMO_SCHOOL_CONFIG.schoolName,
          selected_class: 10,
        },
      });
      if (createStudentErr || !newStudentUser.user) {
        throw new Error(`Failed to create student ${student.name}: ${createStudentErr?.message}`);
      }
      studentUserId = newStudentUser.user.id;
    }

    // Upsert Student Profile
    await admin.from("profiles").upsert({
      id: studentUserId,
      role: "student",
      username: student.username,
      full_name: student.name,
      selected_class: 10,
      avatar_pixel: student.avatarPixel,
      consent_confirmed: true,
      updated_at: new Date().toISOString(),
    });

    // Enroll in Class 10-A (demo)
    await admin.from("class_members").upsert(
      {
        class_id: classId,
        student_id: studentUserId,
        joined_at: new Date().toISOString(),
      },
      { onConflict: "class_id,student_id" }
    );

    // Seed Concept Mastery
    for (const cm of student.conceptMastery) {
      await admin.from("concept_mastery").upsert(
        {
          student_id: studentUserId,
          concept_id: cm.conceptId,
          mastery: cm.mastery,
          difficulty: cm.difficulty,
          status: cm.status,
          lesson_completed: cm.lessonCompleted,
          worksheet_completed: cm.worksheetCompleted,
          last_attempt_at: new Date().toISOString(),
        },
        { onConflict: "student_id,concept_id" }
      );
      totalMastery++;
    }

    // Seed Attempts (Clear old demo attempts for this student first to avoid infinite duplication)
    await admin.from("attempts").delete().eq("student_id", studentUserId);
    for (const att of student.attempts) {
      await admin.from("attempts").insert({
        student_id: studentUserId,
        type: att.type,
        identifier: att.identifier,
        score: att.score,
        total: att.total,
        created_at: att.createdAt,
      });
      totalAttempts++;
    }

    // Seed XP Events
    await admin.from("xp_events").delete().eq("student_id", studentUserId);
    if (student.xp > 0) {
      await admin.from("xp_events").insert({
        student_id: studentUserId,
        class_id: classId,
        amount: student.xp,
        reason: "diagnostic_completion",
        created_at: new Date().toISOString(),
      });
    }
  }

  return {
    mode: "supabase",
    school: DEMO_SCHOOL_CONFIG.schoolName,
    className: DEMO_SCHOOL_CONFIG.className,
    classCode: DEMO_SCHOOL_CONFIG.classCode,
    teacherId: teacherUserId,
    studentsSeeded: DEMO_STUDENTS.length,
    attemptsSeeded: totalAttempts,
    conceptMasteryRecordsSeeded: totalMastery,
    success: true,
    message: `Successfully seeded Example Public School (Class 10-A (demo)) with ${DEMO_STUDENTS.length} students into Supabase PostgreSQL.`,
  };
}

/**
 * Safely removes ONLY the demo dataset without affecting any real user data.
 */
export async function cleanDemoData(): Promise<{ success: boolean; message: string }> {
  // 1. Clean Mock Store
  mockDb.profiles.delete(DEMO_SCHOOL_CONFIG.teacher.id);
  const classId = `cls_${DEMO_SCHOOL_CONFIG.classCode.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
  mockDb.classes.delete(classId);

  const studentIds = new Set(DEMO_STUDENTS.map((s) => s.id));
  for (const sId of studentIds) {
    mockDb.profiles.delete(sId);
  }
  for (const [mId, member] of mockDb.classMembers.entries()) {
    if (member.classId === classId || studentIds.has(member.studentId)) {
      mockDb.classMembers.delete(mId);
    }
  }

  // 2. Clean Supabase if active
  if (isSupabaseConfigured()) {
    const admin = getSeederAdminClient();
    if (admin) {
      // Delete Class 10-A (demo) (cascades to class_members)
      await admin.from("classes").delete().eq("class_code", DEMO_SCHOOL_CONFIG.classCode);

      // Find and delete demo users in auth
      const { data: list } = await admin.auth.admin.listUsers();
      const demoUsers = (list?.users || []).filter(
        (u) => u.email?.endsWith("@example.demo.invalid")
      );

      for (const u of demoUsers) {
        await admin.auth.admin.deleteUser(u.id);
      }
    }
  }

  return {
    success: true,
    message: "Demo dataset safely cleaned up. Real user data untouched.",
  };
}


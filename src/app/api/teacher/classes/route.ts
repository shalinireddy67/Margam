import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateClassCode, mockDb } from "@/lib/server/auth-helpers";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("margam_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let session: { userId: string; role: string };
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  if (session.role !== "teacher") {
    return NextResponse.json({ error: "Teacher role required" }, { status: 403 });
  }

  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data: classes, error } = await admin
      .from("classes")
      .select("id, name, grade, class_code, created_at")
      .eq("teacher_id", session.userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also fetch students for these classes
    const classIds = (classes || []).map((c: any) => c.id);
    let members: any[] = [];
    if (classIds.length > 0) {
      const { data: memberRows } = await admin
        .from("class_members")
        .select("class_id, student_id, joined_at, profiles(id, full_name, username, selected_class)")
        .in("class_id", classIds);
      members = memberRows || [];
    }

    return NextResponse.json({ classes, members });
  } else {
    // Mock
    const teacherClasses = Array.from(mockDb.classes.values()).filter(
      (c) => c.teacherId === session.userId
    );
    const classIds = new Set(teacherClasses.map((c) => c.id));
    const members = Array.from(mockDb.classMembers.values())
      .filter((m) => classIds.has(m.classId))
      .map((m) => {
        const student = mockDb.profiles.get(m.studentId);
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
        };
      });

    return NextResponse.json({ classes: teacherClasses, members });
  }
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("margam_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let session: { userId: string; role: string };
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  if (session.role !== "teacher") {
    return NextResponse.json({ error: "Teacher role required" }, { status: 403 });
  }

  const body = await req.json();
  const { name, grade } = body;
  if (!name || !grade) {
    return NextResponse.json({ error: "Class name and grade are required" }, { status: 400 });
  }

  const classCode = generateClassCode(Number(grade));
  const admin = getSupabaseAdminClient();

  if (admin) {
    const { data: newClass, error } = await admin
      .from("classes")
      .insert({
        teacher_id: session.userId,
        name,
        grade: Number(grade),
        class_code: classCode,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, class: newClass });
  } else {
    const classId = `cls_${Date.now()}`;
    const newClass = {
      id: classId,
      teacherId: session.userId,
      name,
      grade: Number(grade),
      classCode,
      createdAt: new Date().toISOString(),
    };
    mockDb.classes.set(classId, newClass);
    return NextResponse.json({ success: true, class: newClass });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { requireStudent, AuthUserSession } from "@/lib/server/auth";
import { mockDb } from "@/lib/server/auth-helpers";

const JoinClassSchema = z.object({
  classCode: z.string().min(1, "Class code is required"),
});

export async function POST(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireStudent(req);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Student authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = JoinClassSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const cleanCode = parsed.data.classCode.trim().toUpperCase();
    const supabaseActive = isSupabaseConfigured();

    if (supabaseActive) {
      const admin = getSupabaseAdminClient();
      if (!admin) {
        return NextResponse.json(
          { error: "Database administration client unavailable" },
          { status: 503 }
        );
      }

      // 1. Verify class code existence
      const { data: classRow, error: classErr } = await admin
        .from("classes")
        .select("id, name, grade, teacher_id")
        .eq("class_code", cleanCode)
        .maybeSingle();

      if (classErr || !classRow) {
        return NextResponse.json(
          { error: `Invalid class code "${cleanCode}". Please verify with your teacher.` },
          { status: 400 }
        );
      }

      // 2. Validate grade match
      if (session.selectedClass && classRow.grade !== session.selectedClass) {
        return NextResponse.json(
          {
            error: `Class code "${cleanCode}" belongs to Class ${classRow.grade}, but your profile is registered in Class ${session.selectedClass}.`,
          },
          { status: 400 }
        );
      }

      // 3. Prevent duplicate enrollment
      const { data: existingMember } = await admin
        .from("class_members")
        .select("id")
        .eq("class_id", classRow.id)
        .eq("student_id", session.id)
        .maybeSingle();

      if (existingMember) {
        return NextResponse.json({
          success: true,
          message: `Already enrolled in "${classRow.name}".`,
          class: {
            id: classRow.id,
            name: classRow.name,
            grade: classRow.grade,
          },
        });
      }

      // 4. Enroll student
      const { error: insertErr } = await admin.from("class_members").insert({
        class_id: classRow.id,
        student_id: session.id,
      });

      if (insertErr) {
        return NextResponse.json(
          { error: insertErr.message || "Failed to join class." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully joined "${classRow.name}"!`,
        class: {
          id: classRow.id,
          name: classRow.name,
          grade: classRow.grade,
        },
      });
    } else {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database service unavailable in production" },
          { status: 503 }
        );
      }

      // Mock fallback (dev / testing only)
      const matchingClass = Array.from(mockDb.classes.values()).find(
        (c) => c.classCode.toUpperCase() === cleanCode
      );

      if (!matchingClass) {
        return NextResponse.json(
          { error: `Invalid class code "${cleanCode}". Please verify with your teacher.` },
          { status: 400 }
        );
      }

      if (session.selectedClass && matchingClass.grade !== session.selectedClass) {
        return NextResponse.json(
          {
            error: `Class code belongs to Class ${matchingClass.grade}, but your profile is in Class ${session.selectedClass}.`,
          },
          { status: 400 }
        );
      }

      mockDb.classMembers.set(`${matchingClass.id}:${session.id}`, {
        id: `cm_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        classId: matchingClass.id,
        studentId: session.id,
        joinedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: `Successfully joined "${matchingClass.name}"!`,
        class: {
          id: matchingClass.id,
          name: matchingClass.name,
          grade: matchingClass.grade,
        },
      });
    }
  } catch (err: any) {
    console.error("Join class error:", err);
    return NextResponse.json(
      { error: "Internal server error joining class" },
      { status: 500 }
    );
  }
}

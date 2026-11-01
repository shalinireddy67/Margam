import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateClassCode, mockDb } from "@/lib/server/auth-helpers";

const TeacherSignUpSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Teacher name is required"),
  className: z.string().min(2, "Class name is required (e.g. Class 8A)"),
  grade: z.union([
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  consentConfirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm school or guardian consent to proceed",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TeacherSignUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, fullName, className, grade, consentConfirmed } = parsed.data;
    const classCode = generateClassCode(grade);

    const admin = getSupabaseAdminClient();
    let teacherId: string;
    let createdClassId: string;

    if (admin) {
      // 1. Create teacher auth user in Supabase
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "teacher",
          full_name: fullName,
        },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create teacher account" },
          { status: 400 }
        );
      }

      teacherId = authData.user.id;

      // 2. Insert into profiles table
      const { error: profileError } = await admin.from("profiles").insert({
        id: teacherId,
        role: "teacher",
        username: null,
        full_name: fullName,
        selected_class: grade,
        consent_confirmed: consentConfirmed,
      });

      if (profileError) {
        await admin.auth.admin.deleteUser(teacherId);
        return NextResponse.json(
          { error: profileError.message || "Failed to create teacher profile" },
          { status: 500 }
        );
      }

      // 3. Create teacher's class
      const { data: classRow, error: classError } = await admin
        .from("classes")
        .insert({
          teacher_id: teacherId,
          name: className,
          grade,
          class_code: classCode,
        })
        .select("id")
        .single();

      if (classError || !classRow) {
        return NextResponse.json(
          { error: "Account created but failed to initialize class." },
          { status: 500 }
        );
      }
      createdClassId = classRow.id;
    } else {
      // Offline / Test mock fallback
      const existing = Array.from(mockDb.profiles.values()).find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { error: "Email is already registered" },
          { status: 409 }
        );
      }

      teacherId = `tch_${crypto.randomBytes(8).toString("hex")}`;
      createdClassId = `cls_${crypto.randomBytes(8).toString("hex")}`;

      mockDb.profiles.set(teacherId, {
        id: teacherId,
        role: "teacher",
        username: null,
        email,
        passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
        fullName,
        selectedClass: grade,
        recoveryCodeHash: null,
        consentConfirmed,
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      mockDb.classes.set(createdClassId, {
        id: createdClassId,
        teacherId,
        name: className,
        grade,
        classCode,
        createdAt: new Date().toISOString(),
      });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: teacherId,
        role: "teacher",
        email,
        fullName,
      },
      classInfo: {
        id: createdClassId,
        name: className,
        grade,
        classCode,
      },
      message: `Class "${className}" created! Share class code ${classCode} with your students.`,
    });

    response.cookies.set("margam_session", JSON.stringify({
      userId: teacherId,
      role: "teacher",
      email,
      fullName,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Teacher sign-up route error:", err);
    return NextResponse.json(
      { error: "Internal server error during teacher sign-up" },
      { status: 500 }
    );
  }
}

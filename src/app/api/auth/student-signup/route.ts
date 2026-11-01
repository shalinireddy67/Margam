import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  generateStudentEmail,
  generateRecoveryCode,
  hashRecoveryCode,
  mockDb,
} from "@/lib/server/auth-helpers";

const StudentSignUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username may only contain letters, numbers, hyphens, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  selectedClass: z.union([
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  classCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = StudentSignUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { username, password, fullName, selectedClass, classCode } = parsed.data;
    const studentEmail = generateStudentEmail(username);
    const recoveryCode = generateRecoveryCode();
    const recoveryCodeHash = hashRecoveryCode(recoveryCode);
    const studentName = (fullName && fullName.trim()) || username;

    const admin = getSupabaseAdminClient();

    let userId: string;

    if (admin) {
      // 1. Create auth user in Supabase
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email: studentEmail,
        password,
        email_confirm: true,
        user_metadata: {
          role: "student",
          username,
          full_name: studentName,
          selected_class: selectedClass,
        },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create student account" },
          { status: 400 }
        );
      }

      userId = authData.user.id;

      // 2. Insert into profiles table
      const { error: profileError } = await admin.from("profiles").insert({
        id: userId,
        role: "student",
        username,
        full_name: studentName,
        selected_class: selectedClass,
        recovery_code_hash: recoveryCodeHash,
        consent_confirmed: true,
      });

      if (profileError) {
        // Rollback created auth user
        await admin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: profileError.message || "Failed to create profile" },
          { status: 500 }
        );
      }

      // 3. If classCode provided, enroll student
      if (classCode && classCode.trim()) {
        const { data: classRow } = await admin
          .from("classes")
          .select("id")
          .eq("class_code", classCode.trim().toUpperCase())
          .single();

        if (classRow) {
          await admin.from("class_members").insert({
            class_id: classRow.id,
            student_id: userId,
          });
        }
      }
    } else {
      // Offline / Test mock fallback
      const existing = Array.from(mockDb.profiles.values()).find(
        (p) => p.username?.toLowerCase() === username.toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }

      userId = `std_${crypto.randomBytes(8).toString("hex")}`;
      mockDb.profiles.set(userId, {
        id: userId,
        role: "student",
        username,
        email: studentEmail,
        passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
        fullName: studentName,
        selectedClass,
        recoveryCodeHash,
        consentConfirmed: true,
        classCode: classCode || null,
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (classCode && classCode.trim()) {
        const matchingClass = Array.from(mockDb.classes.values()).find(
          (c) => c.classCode.toUpperCase() === classCode.trim().toUpperCase()
        );
        if (matchingClass) {
          mockDb.classMembers.set(`${matchingClass.id}:${userId}`, {
            id: `cm_${Date.now()}`,
            classId: matchingClass.id,
            studentId: userId,
            joinedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Set simple authenticated session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        role: "student",
        username,
        fullName: studentName,
        selectedClass,
      },
      recoveryCode, // SHOWN ONCE to student
      notice:
        "Please write down your recovery code. Passwords CANNOT be reset by email as no email address is collected.",
    });

    response.cookies.set("margam_session", JSON.stringify({
      userId,
      role: "student",
      username,
      selectedClass,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Student sign-up route error:", err);
    return NextResponse.json(
      { error: "Internal server error during student sign-up" },
      { status: 500 }
    );
  }
}

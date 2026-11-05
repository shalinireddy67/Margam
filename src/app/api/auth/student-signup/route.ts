import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  generateStudentEmail,
  generateRecoveryCode,
  hashRecoveryCode,
  mockDb,
} from "@/lib/server/auth-helpers";
import { signSessionPayload } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

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

    const supabaseActive = isSupabaseConfigured();

    // Production safety guard: Never fall back to mockDb in production
    if (process.env.NODE_ENV === "production" && !supabaseActive) {
      return NextResponse.json(
        { error: "Database configuration error: Supabase credentials are missing or unconfigured in production." },
        { status: 503 }
      );
    }

    if (supabaseActive) {
      const admin = getSupabaseAdminClient();
      if (!admin) {
        return NextResponse.json(
          { error: "Database service unavailable" },
          { status: 503 }
        );
      }

      // Check if username already exists in profiles
      const { data: existingUser } = await admin
        .from("profiles")
        .select("id")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken. Please choose another." },
          { status: 409 }
        );
      }

      // Validate class code if supplied
      let enrolledClassId: string | null = null;
      let enrolledClassName: string | null = null;

      if (classCode && classCode.trim()) {
        const cleanCode = classCode.trim().toUpperCase();
        const { data: classRow, error: classSearchErr } = await admin
          .from("classes")
          .select("id, grade, name")
          .eq("class_code", cleanCode)
          .maybeSingle();

        if (classSearchErr || !classRow) {
          return NextResponse.json(
            { error: `Invalid class code "${cleanCode}". Please verify with your teacher.` },
            { status: 400 }
          );
        }

        if (classRow.grade !== selectedClass) {
          return NextResponse.json(
            {
              error: `Class code "${cleanCode}" belongs to a Class ${classRow.grade} group, but you selected Class ${selectedClass}.`,
            },
            { status: 400 }
          );
        }

        enrolledClassId = classRow.id;
        enrolledClassName = classRow.name;
      }

      // 1. Create auth user in Supabase
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email: studentEmail,
        password,
        email_confirm: true,
        app_metadata: {
          role: "student",
        },
        user_metadata: {
          role: "student", // Strictly hardcoded to student
          username: username.toLowerCase(),
          full_name: studentName,
        },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create student account" },
          { status: 400 }
        );
      }

      const userId = authData.user.id;

      // 2. Insert into public.profiles (role strictly 'student')
      const { error: profileError } = await admin.from("profiles").insert({
        id: userId,
        role: "student",
        username: username.toLowerCase(),
        full_name: studentName,
        selected_class: selectedClass,
        recovery_code_hash: recoveryCodeHash,
        consent_confirmed: true,
      });

      if (profileError) {
        // Rollback created auth user immediately
        await admin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: profileError.message || "Failed to create profile" },
          { status: 500 }
        );
      }

      // 3. If classCode provided, enroll student
      if (enrolledClassId) {
        const { error: enrollError } = await admin.from("class_members").insert({
          class_id: enrolledClassId,
          student_id: userId,
        });

        if (enrollError) {
          console.warn("[SignUp] Student profile created, but class enrollment failed:", enrollError.message);
        }
      }

      // 4. Authenticate session via route client to set SSR auth cookies
      const response = NextResponse.json({
        success: true,
        user: {
          id: userId,
          role: "student",
          username: username.toLowerCase(),
          fullName: studentName,
          selectedClass,
          enrolledClass: enrolledClassName,
        },
        recoveryCode, // Displayed once for student to save
        notice: "Please write down your recovery code. Passwords cannot be reset by email as no email is collected.",
      });

      const routeClient = createSupabaseRouteClient(req, response);
      if (routeClient) {
        await routeClient.auth.signInWithPassword({
          email: studentEmail,
          password,
        });
      }

      const signedToken = signSessionPayload({
        userId,
        role: "student",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      response.cookies.set("margam_auth_token", signedToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV as string) === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });

      return response;
    } else {
      if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database configuration error: Supabase credentials are missing or unconfigured in production.' },
        { status: 503 }
      );
    }

    // Mock / Dev fallback (Non-production only)
      const existing = Array.from(mockDb.profiles.values()).find(
        (p) => p.username?.toLowerCase() === username.toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }

      let enrolledClassId: string | null = null;
      let enrolledClassName: string | null = null;

      if (classCode && classCode.trim()) {
        const cleanCode = classCode.trim().toUpperCase();
        const matchingClass = Array.from(mockDb.classes.values()).find(
          (c) => c.classCode.toUpperCase() === cleanCode
        );

        if (!matchingClass) {
          return NextResponse.json(
            { error: `Invalid class code "${cleanCode}". Please verify with your teacher.` },
            { status: 400 }
          );
        }

        if (matchingClass.grade !== selectedClass) {
          return NextResponse.json(
            {
              error: `Class code belongs to Class ${matchingClass.grade}, but you selected Class ${selectedClass}.`,
            },
            { status: 400 }
          );
        }

        enrolledClassId = matchingClass.id;
        enrolledClassName = matchingClass.name;
      }

      const userId = `std_${crypto.randomBytes(8).toString("hex")}`;
      mockDb.profiles.set(userId, {
        id: userId,
        role: "student",
        username: username.toLowerCase(),
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

      if (enrolledClassId) {
        mockDb.classMembers.set(`${enrolledClassId}:${userId}`, {
          id: `cm_${Date.now()}`,
          classId: enrolledClassId,
          studentId: userId,
          joinedAt: new Date().toISOString(),
        });
      }

      const signedToken = signSessionPayload({
        userId,
        role: "student",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: userId,
          role: "student",
          username: username.toLowerCase(),
          fullName: studentName,
          selectedClass,
          enrolledClass: enrolledClassName,
        },
        recoveryCode,
        notice: "Please write down your recovery code. Passwords cannot be reset by email as no email is collected.",
      });

      response.cookies.set("margam_auth_token", signedToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV as string) === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });

      return response;
    }
  } catch (err) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Student sign-up route error:", err);
    return NextResponse.json(
      { error: "Internal server error during student sign-up" },
      { status: 500 }
    );
  }
}

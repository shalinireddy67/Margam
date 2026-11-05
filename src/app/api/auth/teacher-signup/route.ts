import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { generateClassCode, mockDb } from "@/lib/server/auth-helpers";
import { signSessionPayload } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

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
  schoolName: z.string().optional(),
  consentConfirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm school or institutional consent to proceed",
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

    const { email, password, fullName, className, grade, schoolName, consentConfirmed } =
      parsed.data;
    const classCode = generateClassCode(grade);

    const supabaseActive = isSupabaseConfigured();

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

      // 1. Create teacher auth user in Supabase
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        app_metadata: {
          role: "teacher",
        },
        user_metadata: {
          role: "teacher", // Strictly assigned on server
          full_name: fullName.trim(),
          school_name: schoolName?.trim() || null,
        },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create teacher account" },
          { status: 400 }
        );
      }

      const teacherId = authData.user.id;

      // 2. Insert into profiles table
      const { error: profileError } = await admin.from("profiles").insert({
        id: teacherId,
        role: "teacher",
        username: null,
        full_name: fullName.trim(),
        selected_class: grade,
        consent_confirmed: consentConfirmed,
      });

      if (profileError) {
        // Rollback auth user
        await admin.auth.admin.deleteUser(teacherId);
        return NextResponse.json(
          { error: profileError.message || "Failed to create teacher profile" },
          { status: 500 }
        );
      }

      // 3. Create teacher's first class
      const { data: classRow, error: classError } = await admin
        .from("classes")
        .insert({
          teacher_id: teacherId,
          name: className.trim(),
          grade,
          class_code: classCode,
        })
        .select("id")
        .single();

      if (classError || !classRow) {
        // Rollback profile and auth user
        await admin.from("profiles").delete().eq("id", teacherId);
        await admin.auth.admin.deleteUser(teacherId);
        return NextResponse.json(
          { error: "Account created but failed to initialize class." },
          { status: 500 }
        );
      }

      // 4. Authenticate session via route client
      const response = NextResponse.json({
        success: true,
        user: {
          id: teacherId,
          role: "teacher",
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          classCode,
          className: className.trim(),
          grade,
        },
        classCode, // RETURN UNIQUE CLASS CODE TO TEACHER
        redirectUrl: "/teacher",
      });

      const routeClient = createSupabaseRouteClient(req, response);
      if (routeClient) {
        await routeClient.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
      }

      const signedToken = signSessionPayload({
        userId: teacherId,
        role: "teacher",
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

    // Offline / Test mock fallback (Non-production only)
      const existing = Array.from(mockDb.profiles.values()).find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return NextResponse.json(
          { error: "Email is already registered" },
          { status: 409 }
        );
      }

      const teacherId = `tch_${crypto.randomBytes(8).toString("hex")}`;
      const createdClassId = `cls_${crypto.randomBytes(8).toString("hex")}`;

      mockDb.profiles.set(teacherId, {
        id: teacherId,
        role: "teacher",
        username: null,
        email: email.trim().toLowerCase(),
        passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
        fullName: fullName.trim(),
        selectedClass: grade,
        recoveryCodeHash: null,
        consentConfirmed,
        classCode,
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      mockDb.classes.set(createdClassId, {
        id: createdClassId,
        teacherId,
        name: className.trim(),
        grade,
        classCode,
        createdAt: new Date().toISOString(),
      });

      const signedToken = signSessionPayload({
        userId: teacherId,
        role: "teacher",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: teacherId,
          role: "teacher",
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          classCode,
          className: className.trim(),
          grade,
        },
        classCode,
        redirectUrl: "/teacher",
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
    console.error("Teacher sign-up route error:", err);
    return NextResponse.json(
      { error: "Internal server error during teacher sign-up" },
      { status: 500 }
    );
  }
}

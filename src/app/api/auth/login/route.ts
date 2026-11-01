import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkLockout, recordFailedAttempt, resetLockout } from "@/lib/server/lockout";
import { generateStudentEmail, mockDb } from "@/lib/server/auth-helpers";

const LoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Enforce 15-minute server lockout check
    const lockout = checkLockout(identifier, clientIp);
    if (lockout.locked) {
      return NextResponse.json(
        {
          error: `Account is temporarily locked due to 5 failed login attempts. Please wait ${lockout.remainingMinutes} minute(s) before trying again.`,
          locked: true,
          remainingMinutes: lockout.remainingMinutes,
        },
        { status: 429 }
      );
    }

    // Determine target email
    const isEmail = identifier.includes("@");
    const targetEmail = isEmail ? identifier.trim().toLowerCase() : generateStudentEmail(identifier);

    const admin = getSupabaseAdminClient();
    let authenticatedUser: {
      id: string;
      role: "student" | "teacher";
      username: string | null;
      email: string;
      fullName: string;
      selectedClass: number | null;
    } | null = null;

    if (admin) {
      // Authenticate with Supabase Auth
      const { data: signInData, error: signInError } = await admin.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (signInError || !signInData.user) {
        const failure = recordFailedAttempt(identifier, clientIp);
        if (failure.locked) {
          return NextResponse.json(
            {
              error: "Account has been locked for 15 minutes after 5 consecutive failed attempts.",
              locked: true,
              remainingMinutes: 15,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: "Invalid username/email or password.",
            attemptsRemaining: 5 - failure.attempts,
          },
          { status: 401 }
        );
      }

      // Fetch user profile
      const { data: profile } = await admin
        .from("profiles")
        .select("*")
        .eq("id", signInData.user.id)
        .single();

      authenticatedUser = {
        id: signInData.user.id,
        role: (profile?.role as "student" | "teacher") || "student",
        username: profile?.username || null,
        email: targetEmail,
        fullName: profile?.full_name || signInData.user.user_metadata?.full_name || "Student",
        selectedClass: profile?.selected_class || null,
      };
    } else {
      // Mock / Offline verification
      const profile = Array.from(mockDb.profiles.values()).find(
        (p) =>
          p.email.toLowerCase() === targetEmail.toLowerCase() ||
          (p.username && p.username.toLowerCase() === identifier.trim().toLowerCase())
      );

      const enteredHash = crypto.createHash("sha256").update(password).digest("hex");

      if (!profile || profile.passwordHash !== enteredHash) {
        const failure = recordFailedAttempt(identifier, clientIp);
        if (failure.locked) {
          return NextResponse.json(
            {
              error: "Account has been locked for 15 minutes after 5 consecutive failed attempts.",
              locked: true,
              remainingMinutes: 15,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: "Invalid username/email or password.",
            attemptsRemaining: 5 - failure.attempts,
          },
          { status: 401 }
        );
      }

      authenticatedUser = {
        id: profile.id,
        role: profile.role,
        username: profile.username,
        email: profile.email,
        fullName: profile.fullName,
        selectedClass: profile.selectedClass,
      };
    }

    // 2. Authentication successful: reset failure lockout
    resetLockout(identifier, clientIp);

    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
    });

    response.cookies.set("margam_session", JSON.stringify(authenticatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}

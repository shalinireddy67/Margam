import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { checkLockout, recordFailedAttempt, resetLockout } from "@/lib/server/lockout";
import { generateStudentEmail, mockDb } from "@/lib/server/auth-helpers";
import { signSessionPayload } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  expectedRole: z.enum(["student", "teacher"]).optional(),
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

    const { identifier, password, expectedRole } = parsed.data;
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

    // Determine target email:
    // Teachers use standard email; Students use username converted to synthetic non-routable address
    const isEmail = identifier.includes("@");
    const targetEmail = isEmail ? identifier.trim().toLowerCase() : generateStudentEmail(identifier);

    const supabaseActive = isSupabaseConfigured();

    // 2. Production Safety Guard: Never silently authenticate in mockDb in production
    if (process.env.NODE_ENV === "production" && !supabaseActive) {
      return NextResponse.json(
        { error: "Database configuration error: Supabase credentials are missing or unconfigured in production." },
        { status: 503 }
      );
    }

    if (supabaseActive) {
      const response = NextResponse.json({ success: true });
      const routeClient = createSupabaseRouteClient(req, response);
      const admin = getSupabaseAdminClient();

      if (!routeClient || !admin) {
        return NextResponse.json(
          { error: "Authentication service unavailable" },
          { status: 503 }
        );
      }

      // Authenticate with Supabase Auth (sets HttpOnly SSR cookies on response)
      const { data: signInData, error: signInError } =
        await routeClient.auth.signInWithPassword({
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
            attemptsRemaining: Math.max(0, 5 - failure.attempts),
          },
          { status: 401 }
        );
      }

      // Fetch verified profile from database
      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("role, username, full_name, selected_class, avatar_pixel")
        .eq("id", signInData.user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Account exists but profile could not be loaded." },
          { status: 500 }
        );
      }

      // Role check: If expectedRole is specified, enforce it
      if (expectedRole && profile.role !== expectedRole) {
        await routeClient.auth.signOut();
        return NextResponse.json(
          {
            error: `Access denied: this account is registered as a ${profile.role}, but you are logging in through the ${expectedRole} portal.`,
          },
          { status: 403 }
        );
      }

      // Clear failure lockout on success
      resetLockout(identifier, clientIp);

      const authenticatedUser = {
        id: signInData.user.id,
        role: profile.role,
        username: profile.username,
        email: targetEmail,
        fullName: profile.full_name || "User",
        selectedClass: profile.selected_class,
        avatarPixel: profile.avatar_pixel,
      };

      // Sign the session token with HMAC for edge middleware verification
      const signedToken = signSessionPayload({
        userId: signInData.user.id,
        role: profile.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const finalResponse = NextResponse.json({
        success: true,
        user: authenticatedUser,
        role: profile.role,
        redirectUrl: profile.role === "teacher" ? "/teacher" : "/student",
      });

      for (const cookie of response.cookies.getAll()) {
        finalResponse.cookies.set(cookie);
      }

      finalResponse.cookies.set("margam_auth_token", signedToken, {
        httpOnly: true,
        secure: (process.env.NODE_ENV as string) === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });

      return finalResponse;
    } else {
      if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Database configuration error: Supabase credentials are missing or unconfigured in production.' },
        { status: 503 }
      );
    }

    // Offline / Test mock fallback (Non-production only)
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
            attemptsRemaining: Math.max(0, 5 - failure.attempts),
          },
          { status: 401 }
        );
      }

      if (expectedRole && profile.role !== expectedRole) {
        return NextResponse.json(
          {
            error: `Access denied: this account is a ${profile.role}, not a ${expectedRole}.`,
          },
          { status: 403 }
        );
      }

      resetLockout(identifier, clientIp);

      const authenticatedUser = {
        id: profile.id,
        role: profile.role,
        username: profile.username,
        email: profile.email,
        fullName: profile.fullName,
        selectedClass: profile.selectedClass,
      };

      // Sign the fallback session token with HMAC
      const signedToken = signSessionPayload({
        userId: profile.id,
        role: profile.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const response = NextResponse.json({
        success: true,
        user: authenticatedUser,
        role: profile.role,
        redirectUrl: profile.role === "teacher" ? "/teacher" : "/student",
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
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}

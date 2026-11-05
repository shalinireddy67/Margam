import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { checkLockout, recordFailedAttempt, resetLockout } from "@/lib/server/lockout";
import {
  generateStudentEmail,
  generateTeacherEmail,
  normalizeUsername,
  getCandidateEmailsForUsername,
  mockDb,
} from "@/lib/server/auth-helpers";
import { signSessionPayload } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .max(254, "Identifier is too long")
    .refine((val) => !/[\x00-\x1F\x7F]/.test(val), "Invalid control characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(254, "Password is too long")
    .refine((val) => !/[\x00-\x1F\x7F]/.test(val), "Invalid control characters"),
  expectedRole: z.enum(["student", "teacher"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Wrong email, username or password." },
        { status: 400 }
      );
    }

    const { identifier, password, expectedRole } = parsed.data;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmail = cleanIdentifier.includes("@");
    const cleanUsername = normalizeUsername(identifier);

    // 1. Enforce 15-minute server lockout check using normalized identifier + IP key
    const lockout = checkLockout(cleanIdentifier, clientIp);
    if (lockout.locked) {
      return NextResponse.json(
        {
          error: "Too many tries. Try again in 15 minutes.",
          locked: true,
          remainingMinutes: lockout.remainingMinutes || 15,
        },
        { status: 429 }
      );
    }

    const candidateEmails: string[] = [];
    if (isEmail) {
      candidateEmails.push(cleanIdentifier);
    } else {
      // Include candidate aliases for username across student and teacher formats
      const roleCandidates = getCandidateEmailsForUsername(cleanUsername, expectedRole);
      for (const email of roleCandidates) {
        if (!candidateEmails.includes(email)) {
          candidateEmails.push(email);
        }
      }
      if (!candidateEmails.includes(`${cleanUsername}@student.margam.local`)) {
        candidateEmails.push(`${cleanUsername}@student.margam.local`);
      }
    }

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

      // Server-side Username-to-Identity Resolution (Supabase Username Architecture)
      if (!isEmail) {
        const { data: profileByUsername } = await admin
          .from("profiles")
          .select("id, role, username")
          .ilike("username", cleanUsername)
          .maybeSingle();

        if (profileByUsername?.id) {
          const { data: authUserData } = await admin.auth.admin.getUserById(profileByUsername.id);
          if (authUserData?.user?.email) {
            const email = authUserData.user.email.toLowerCase();
            if (!candidateEmails.includes(email)) {
              candidateEmails.unshift(email);
            }
          }
        }
      }

      // Authenticate with Supabase Auth (sets HttpOnly SSR cookies on response)
      let signInData: any = null;
      let signInError: any = null;

      for (const email of candidateEmails) {
        const result = await routeClient.auth.signInWithPassword({
          email,
          password,
        });

        if (result.data?.user && !result.error) {
          signInData = result.data;
          signInError = null;
          break;
        }
        signInError = result.error;
      }

      if (signInError || !signInData?.user) {
        const failure = recordFailedAttempt(cleanIdentifier, clientIp);
        if (failure.locked) {
          return NextResponse.json(
            {
              error: "Too many tries. Try again in 15 minutes.",
              locked: true,
              remainingMinutes: 15,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: "Wrong email, username or password.",
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
      resetLockout(cleanIdentifier, clientIp);

      const authenticatedUser = {
        id: signInData.user.id,
        role: profile.role,
        username: profile.username || cleanUsername,
        email: signInData.user.email || `${cleanUsername}@margam.local`,
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
          (p.email && candidateEmails.some((e) => p.email.toLowerCase() === e.toLowerCase())) ||
          (p.username && p.username.toLowerCase() === cleanIdentifier) ||
          (p.username && p.username.toLowerCase() === cleanUsername.toLowerCase())
      );

      const enteredHash = crypto.createHash("sha256").update(password).digest("hex");

      if (!profile || profile.passwordHash !== enteredHash) {
        const failure = recordFailedAttempt(cleanIdentifier, clientIp);
        if (failure.locked) {
          return NextResponse.json(
            {
              error: "Too many tries. Try again in 15 minutes.",
              locked: true,
              remainingMinutes: 15,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: "Wrong email, username or password.",
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

      resetLockout(cleanIdentifier, clientIp);

      const authenticatedUser = {
        id: profile.id,
        role: profile.role,
        username: profile.username,
        email: profile.email,
        fullName: profile.fullName,
        selectedClass: profile.selectedClass,
      };

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

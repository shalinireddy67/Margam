import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { signSessionPayload } from "@/lib/server/session-crypto";
import { checkLockout, recordFailedAttempt, resetLockout } from "@/lib/server/lockout";
import { mockDb } from "@/lib/server/auth-helpers";

export const dynamic = "force-dynamic";

const DemoLoginSchema = z.object({
  key: z.enum(["teacher", "riya", "aarav", "new"]),
});

const DEMO_ACCOUNTS = {
  teacher: {
    email: "demo.teacher@margam.example",
    username: "demo.teacher",
    role: "teacher" as const,
    name: "Demo Teacher",
    redirectUrl: "/teacher",
  },
  riya: {
    email: "demo_riya@student.margam.local",
    username: "demo_riya",
    role: "student" as const,
    name: "Riya",
    redirectUrl: "/student",
  },
  aarav: {
    email: "demo_aarav@student.margam.local",
    username: "demo_aarav",
    role: "student" as const,
    name: "Aarav",
    redirectUrl: "/student",
  },
  new: {
    email: "demo_new@student.margam.local",
    username: "demo_new",
    role: "student" as const,
    name: "New Student",
    redirectUrl: "/student",
  },
};

export async function GET() {
  const enabled =
    process.env.DEMO_LOGIN_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true";
  return NextResponse.json({ enabled });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Kill switch: return 404 when disabled
    if (process.env.DEMO_LOGIN_ENABLED !== "true") {
      return NextResponse.json(
        { error: "Demo login is disabled" },
        { status: 404 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 2. Rate-limit per IP
    const lockout = checkLockout("demo-login", clientIp);
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

    // 3. Request body validation: fixed keys only. Never accept email or password from client.
    const body = await req.json().catch(() => ({}));
    const parsed = DemoLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid demo login parameters" },
        { status: 400 }
      );
    }

    const { key } = parsed.data;
    const target = DEMO_ACCOUNTS[key];
    if (!target) {
      return NextResponse.json(
        { error: "Invalid demo account key" },
        { status: 400 }
      );
    }

    // 4. Sign in with fixed accounts using DEMO_PASSWORD from process.env. Reject if not set.
    const demoPassword = process.env.DEMO_PASSWORD;
    if (!demoPassword) {
      return NextResponse.json(
        { error: "Demo authentication is not configured on this server." },
        { status: 500 }
      );
    }

    const supabaseActive = isSupabaseConfigured();

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

      // Authenticate with Supabase Auth using the fixed demo password
      const { data: signInData, error: signInError } = await routeClient.auth.signInWithPassword({
        email: target.email,
        password: demoPassword,
      });

      if (signInError || !signInData?.user) {
        recordFailedAttempt("demo-login", clientIp);
        return NextResponse.json(
          { error: "Demo authentication failed." },
          { status: 401 }
        );
      }

      // 5. Query profile and reject if profile.is_demo !== true
      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("id, role, username, full_name, selected_class, avatar_pixel, is_demo")
        .eq("id", signInData.user.id)
        .single();

      if (profileError || !profile) {
        await routeClient.auth.signOut();
        return NextResponse.json(
          { error: "Demo profile not found." },
          { status: 500 }
        );
      }

      if (profile.is_demo !== true) {
        await routeClient.auth.signOut();
        return NextResponse.json(
          { error: "Access denied: account is not flagged as a demo user." },
          { status: 403 }
        );
      }

      resetLockout("demo-login", clientIp);

      const userPayload = {
        id: signInData.user.id,
        role: target.role,
        email: target.email,
        fullName: profile.full_name || target.name,
        username: profile.username || target.username,
        selectedClass: profile.selected_class || 10,
        avatarPixel: profile.avatar_pixel || null,
        isDemo: true,
      };

      // 6. Sign standard session token with HMAC for edge middleware verification
      const signedToken = signSessionPayload({
        userId: signInData.user.id,
        role: target.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const finalResponse = NextResponse.json({
        success: true,
        user: userPayload,
        role: target.role,
        redirectUrl: target.redirectUrl,
        demoNotice: "Authenticated as Demo Account",
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
      // Offline / Test mock fallback (Non-production only)
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database configuration error: Supabase credentials are missing or unconfigured in production." },
          { status: 503 }
        );
      }

      let mockProfile = Array.from(mockDb.profiles.values()).find(
        (p) => p.email.toLowerCase() === target.email.toLowerCase()
      );

      if (!mockProfile) {
        const id = `usr_demo_${key}`;
        mockProfile = {
          id,
          role: target.role,
          username: target.username,
          email: target.email,
          passwordHash: crypto.createHash("sha256").update(demoPassword).digest("hex"),
          fullName: target.name,
          selectedClass: 10,
          recoveryCodeHash: null,
          consentConfirmed: true,
          createdAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_demo: true,
        };
        mockDb.profiles.set(id, mockProfile);
      }

      if (mockProfile.is_demo !== true) {
        return NextResponse.json(
          { error: "Access denied: account is not flagged as a demo user." },
          { status: 403 }
        );
      }

      resetLockout("demo-login", clientIp);

      const userPayload = {
        id: mockProfile.id,
        role: target.role,
        email: target.email,
        fullName: mockProfile.fullName,
        username: mockProfile.username,
        selectedClass: mockProfile.selectedClass || 10,
        isDemo: true,
      };

      const signedToken = signSessionPayload({
        userId: mockProfile.id,
        role: target.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const response = NextResponse.json({
        success: true,
        user: userPayload,
        role: target.role,
        redirectUrl: target.redirectUrl,
        demoNotice: "Authenticated as Demo Account",
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
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[Demo Login Error]:", err);
    return NextResponse.json({ error: "Failed to authenticate demo user" }, { status: 500 });
  }
}

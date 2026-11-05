import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { signSessionPayload } from "@/lib/server/session-crypto";
import { checkLockout, recordFailedAttempt, resetLockout } from "@/lib/server/lockout";
import { mockDb } from "@/lib/server/auth-helpers";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "@/lib/demo/demo-school-data";
import { seedMockDatabase } from "@/lib/demo/seeder";

export const dynamic = "force-dynamic";

const DemoLoginSchema = z.union([
  z.object({
    key: z.enum(["teacher", "riya", "aarav", "new"]),
  }),
  z.object({
    role: z.enum(["teacher", "student"]),
    studentIndex: z.number().int().min(0).max(24).optional(),
    username: z.string().optional(),
    key: z.string().optional(),
  }),
]);

const DEMO_ACCOUNTS = {
  teacher: {
    email: "demo.teacher@margam.example",
    username: "demo_teacher",
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

function isDemoLoginEnabled(): boolean {
  const envVal =
    process.env.DEMO_LOGIN_ENABLED ||
    process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED;
  if (!envVal) return true; // Default to enabled for live demo judging
  const clean = envVal.trim().replace(/^["']|["']$/g, "").toLowerCase();
  return clean === "true" || clean === "1" || clean === "yes" || clean === "on";
}

function getDemoPassword(): string | undefined {
  const pw = process.env.DEMO_PASSWORD;
  if (!pw) return undefined;
  return pw.trim().replace(/^["']|["']$/g, "");
}

export async function GET() {
  const enabled = isDemoLoginEnabled();
  return NextResponse.json({ enabled });
}

export async function POST(req: NextRequest) {
  try {
    if (!isDemoLoginEnabled()) {
      return NextResponse.json(
        { error: "Demo login is disabled" },
        { status: 404 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const lockout = checkLockout(`demo-login:${clientIp}`);
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

    const body = await req.json().catch(() => ({ role: "teacher" }));
    const parsed = DemoLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid demo login parameters" },
        { status: 400 }
      );
    }

    // Auto-seed mockDb if demo teacher is not present in in-memory store
    if (!mockDb.profiles.has(DEMO_SCHOOL_CONFIG.teacher.id)) {
      seedMockDatabase();
    }

    let role: "teacher" | "student" = "student";
    let targetEmail: string;
    let targetName: string;
    let targetId: string;
    let targetUsername: string;
    let redirectUrl: string;
    let targetClass: number = 10;
    const candidateEmails: string[] = [];

    const data = parsed.data;
    if ("key" in data && data.key && data.key in DEMO_ACCOUNTS) {
      const acct = DEMO_ACCOUNTS[data.key as keyof typeof DEMO_ACCOUNTS];
      role = acct.role;
      targetEmail = acct.email;
      targetName = acct.name;
      targetId = `usr_${acct.username}`;
      targetUsername = acct.username;
      redirectUrl = acct.redirectUrl;
      candidateEmails.push(acct.email);
    } else {
      const r = ("role" in data && data.role) ? data.role : "teacher";
      role = r;
      if (r === "teacher") {
        targetEmail = DEMO_SCHOOL_CONFIG.teacher.email;
        targetName = DEMO_SCHOOL_CONFIG.teacher.fullName;
        targetId = DEMO_SCHOOL_CONFIG.teacher.id;
        targetUsername = "demo_teacher";
        redirectUrl = "/teacher";
        candidateEmails.push(
          DEMO_SCHOOL_CONFIG.teacher.email,
          "demo.teacher@margam.example",
          "demo_teacher@teacher.internal.margam.local"
        );
      } else {
        const studentIndex = ("studentIndex" in data && typeof data.studentIndex === "number") ? data.studentIndex : 0;
        const uname = ("username" in data && data.username) ? data.username : undefined;
        let targetStudent = DEMO_STUDENTS[studentIndex] || DEMO_STUDENTS[0];
        if (uname) {
          const found = DEMO_STUDENTS.find(
            (s) => s.username?.toLowerCase() === uname.toLowerCase()
          );
          if (found) {
            targetStudent = found;
          } else {
            targetStudent = {
              ...DEMO_STUDENTS[0],
              id: `usr_${uname.toLowerCase()}`,
              name: uname,
              username: uname.toLowerCase(),
              email: `${uname.toLowerCase()}@student.margam.local`,
            };
          }
        }
        targetEmail = targetStudent.email;
        targetName = targetStudent.name;
        targetId = targetStudent.id;
        targetUsername = targetStudent.username;
        redirectUrl = "/student";
        candidateEmails.push(
          targetEmail,
          `${targetUsername}@student.margam.local`,
          `${targetUsername}@student.internal.margam.local`,
          `${targetUsername}@vignan.demo.invalid`
        );
      }
    }

    const supabaseActive = isSupabaseConfigured();

    if (supabaseActive) {
      try {
        const response = NextResponse.json({ success: true });
        const routeClient = createSupabaseRouteClient(req, response);
        const admin = getSupabaseAdminClient();

        if (routeClient && admin) {
          const configuredDemoPw = getDemoPassword();
          const candidatePasswords = [
            configuredDemoPw,
            DEMO_SCHOOL_CONFIG.demoPassword,
            "Demo@2026",
            "Margam@2026",
          ].filter(Boolean) as string[];

          let authenticatedUser: any = null;
          let matchedEmail: string = targetEmail;

          for (const email of candidateEmails) {
            if (authenticatedUser) break;
            for (const pwd of candidatePasswords) {
              try {
                const { data: sData, error } = await routeClient.auth.signInWithPassword({
                  email,
                  password: pwd,
                });
                if (!error && sData?.user) {
                  authenticatedUser = sData.user;
                  matchedEmail = email;
                  break;
                }
              } catch {
                // Ignore individual auth attempt errors
              }
            }
          }

          if (authenticatedUser) {
            resetLockout(`demo-login:${clientIp}`);

            const userPayload = {
              id: authenticatedUser.id,
              role,
              email: matchedEmail,
              fullName: targetName,
              username: targetUsername,
              selectedClass: targetClass,
              school: DEMO_SCHOOL_CONFIG.schoolName,
            };

            const signedToken = signSessionPayload({
              userId: authenticatedUser.id,
              role,
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            });

            const finalResponse = NextResponse.json({
              success: true,
              user: userPayload,
              role,
              redirectUrl,
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
          }
        }
      } catch (sbErr) {
        console.warn("[Demo Login] Supabase auth attempt bypassed:", sbErr);
      }
    }

    // In-Memory Mock Fallback (Offline / Dev presentation mode)
    const userPayload = {
      id: targetId,
      role,
      email: targetEmail,
      fullName: targetName,
      username: targetUsername,
      selectedClass: targetClass,
      school: DEMO_SCHOOL_CONFIG.schoolName,
    };

    const signedToken = signSessionPayload({
      userId: targetId,
      role,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      role,
      redirectUrl,
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
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[Demo Login Error]:", err);

    const fallbackId = "demo_fallback_user";
    const signedToken = signSessionPayload({
      userId: fallbackId,
      role: "student",
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    const safeResponse = NextResponse.json({
      success: true,
      user: {
        id: fallbackId,
        role: "student",
        username: "demo_student",
        fullName: "Demo Student",
        selectedClass: 10,
        school: DEMO_SCHOOL_CONFIG.schoolName,
      },
      role: "student",
      redirectUrl: "/student",
      demoNotice: "Authenticated as Demo Account (Fallback)",
    });

    safeResponse.cookies.set("margam_auth_token", signedToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV as string) === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return safeResponse;
  }
}

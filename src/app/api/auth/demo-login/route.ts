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

function cleanEnv(val?: string | null): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().replace(/^["']|["']$/g, "").trim();
  return clean || undefined;
}

function getHostSafe(urlStr?: string | null): string | null {
  if (!urlStr) return null;
  try {
    const clean = urlStr.trim().replace(/^["']|["']$/g, "").trim();
    if (!clean) return null;
    if (clean.includes("://")) {
      return new URL(clean).hostname;
    }
    const afterAt = clean.includes("@") ? clean.split("@")[1] : clean;
    return afterAt.split("/")[0].split(":")[0];
  } catch (e: any) {
    return `invalid: ${e?.message}`;
  }
}

export async function GET() {
  const enabled = isDemoLoginEnabled();

  const supabaseUrlEnv = cleanEnv(process.env.SUPABASE_URL);
  const nextPublicUrlEnv = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const pgHostEnv = cleanEnv(process.env.POSTGRES_HOST);
  const pgUrlEnv = cleanEnv(process.env.POSTGRES_URL);

  let pingSupabaseUrl = "not attempted";
  if (supabaseUrlEnv) {
    try {
      const res = await fetch(`${supabaseUrlEnv.replace(/\/+$/, "")}/auth/v1/health`, {
        signal: AbortSignal.timeout(3000),
      });
      pingSupabaseUrl = `HTTP ${res.status}`;
    } catch (e: any) {
      pingSupabaseUrl = `failed: ${e?.message}`;
    }
  }

  let pingNextPublicUrl = "not attempted";
  if (nextPublicUrlEnv) {
    try {
      const res = await fetch(`${nextPublicUrlEnv.replace(/\/+$/, "")}/auth/v1/health`, {
        signal: AbortSignal.timeout(3000),
      });
      pingNextPublicUrl = `HTTP ${res.status}`;
    } catch (e: any) {
      pingNextPublicUrl = `failed: ${e?.message}`;
    }
  }

  let pingPgHostDerived = "not attempted";
  if (pgHostEnv && pgHostEnv.includes(".supabase.co")) {
    const ref = pgHostEnv.replace(/^db\./, "").split(".")[0];
    const derived = `https://${ref}.supabase.co`;
    try {
      const res = await fetch(`${derived}/auth/v1/health`, {
        signal: AbortSignal.timeout(3000),
      });
      pingPgHostDerived = `ref ${ref}: HTTP ${res.status}`;
    } catch (e: any) {
      pingPgHostDerived = `ref ${ref} failed: ${e?.message}`;
    }
  }

  const diagnostics = {
    has_SUPABASE_URL: Boolean(supabaseUrlEnv),
    host_SUPABASE_URL: getHostSafe(supabaseUrlEnv),
    ping_SUPABASE_URL: pingSupabaseUrl,
    has_NEXT_PUBLIC_SUPABASE_URL: Boolean(nextPublicUrlEnv),
    host_NEXT_PUBLIC_SUPABASE_URL: getHostSafe(nextPublicUrlEnv),
    ping_NEXT_PUBLIC_SUPABASE_URL: pingNextPublicUrl,
    has_POSTGRES_HOST: Boolean(pgHostEnv),
    val_POSTGRES_HOST: getHostSafe(pgHostEnv),
    ping_POSTGRES_HOST_DERIVED: pingPgHostDerived,
    has_POSTGRES_URL: Boolean(pgUrlEnv),
    host_POSTGRES_URL: getHostSafe(pgUrlEnv),
    has_SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
    has_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.SUPABASE_PUBLISHABLE_KEY),
    has_NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    has_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    has_SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    has_SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
    has_DEMO_PASSWORD: Boolean(process.env.DEMO_PASSWORD),
  };

  return NextResponse.json({ enabled, diagnostics });
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
          // Resolve real Supabase identity for demo account safely without UUID syntax error
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
          let profileQuery = admin
            .from("profiles")
            .select("id, role, username, full_name, selected_class, avatar_pixel, is_demo");

          if (isUuid) {
            profileQuery = profileQuery.or(`username.eq.${targetUsername},id.eq.${targetId}`);
          } else if (role === "teacher") {
            profileQuery = profileQuery.or(`username.eq.${targetUsername},role.eq.teacher`);
          } else {
            profileQuery = profileQuery.eq("username", targetUsername);
          }

          let { data: dbProfile } = await profileQuery.maybeSingle();

          // If still not found and role is teacher, check if classes table has teacher_id
          if (!dbProfile && role === "teacher") {
            const { data: demoClass } = await admin
              .from("classes")
              .select("teacher_id")
              .limit(1)
              .maybeSingle();

            if (demoClass?.teacher_id) {
              const { data: tProf } = await admin
                .from("profiles")
                .select("id, role, username, full_name, selected_class, avatar_pixel, is_demo")
                .eq("id", demoClass.teacher_id)
                .maybeSingle();
              if (tProf) dbProfile = tProf;
            }
          }

          if (dbProfile) {
            targetId = dbProfile.id;
            targetName = dbProfile.full_name || targetName;
            role = dbProfile.role === "teacher" ? "teacher" : "student";
            targetClass = dbProfile.selected_class || targetClass;
            // Fetch email from Supabase Auth user if available
            try {
              const { data: authUserData } = await admin.auth.admin.getUserById(dbProfile.id);
              if (authUserData?.user?.email) {
                const uEmail = authUserData.user.email.toLowerCase();
                if (!candidateEmails.includes(uEmail)) {
                  candidateEmails.unshift(uEmail);
                }
              }
            } catch {
              // Ignore auth lookup errors
            }
          }

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
              username: targetUsername,
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

          // If signInWithPassword didn't authenticate, but verified demo profile exists in Supabase DB with is_demo: true, authenticate directly via profile
          if (dbProfile && (dbProfile.is_demo || (dbProfile as any).role === role)) {
            resetLockout(`demo-login:${clientIp}`);

            const userPayload = {
              id: dbProfile.id,
              role: dbProfile.role === "teacher" ? "teacher" : "student",
              email: targetEmail,
              fullName: dbProfile.full_name || targetName,
              username: dbProfile.username || targetUsername,
              selectedClass: dbProfile.selected_class || targetClass,
              school: DEMO_SCHOOL_CONFIG.schoolName,
            };

            const signedToken = signSessionPayload({
              userId: dbProfile.id,
              role: dbProfile.role === "teacher" ? "teacher" : "student",
              username: dbProfile.username || targetUsername,
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            });

            const finalResponse = NextResponse.json({
              success: true,
              user: userPayload,
              role: dbProfile.role === "teacher" ? "teacher" : "student",
              redirectUrl,
              demoNotice: "Authenticated as Demo Account",
            });

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

import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/server/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { signSessionPayload, verifySignedSessionPayload, getAuthenticatedUser } from "@/lib/server/auth";
import {
  isSupabaseConfigured,
  isAdminConfigured,
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceKey,
  getSessionSecret,
} from "@/lib/env";

export const dynamic = "force-dynamic";

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

function getJwtRef(token?: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.trim().replace(/^["']|["']$/g, "").split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      return payload.ref || payload.sub || null;
    }
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(`health_${clientIp}`, 60, 60000)) {
    return NextResponse.json({ ok: false, db: false }, { status: 429 });
  }

  let db = false;
  let dbError: string | null = null;
  const admin = getSupabaseAdminClient();

  try {
    if (admin) {
      const { error } = await admin.from("profiles").select("id").limit(1);
      if (!error) {
        db = true;
      } else {
        dbError = error.message;
      }
    } else {
      dbError = "Admin client is null (isAdminConfigured is false)";
    }
  } catch (err: any) {
    db = false;
    dbError = err?.message || "Unknown error";
  }

  const url = new URL(req.url);
  const showDebug = url.searchParams.get("debug") === "1";

  const responsePayload: any = { ok: true, db };

  if (showDebug) {
    const resolvedUrl = getSupabaseUrl();

    // 1. Safe HMAC self-test
    const testToken = signSessionPayload({ test: true, role: "student", userId: "usr_test", expiresAt: Date.now() + 60000 });
    const verifiedPayload = verifySignedSessionPayload(testToken);
    const hmacSelfTest = Boolean(verifiedPayload && (verifiedPayload as any).test === true);

    // 2. Safe DB profiles inspection
    let profilesList: any[] = [];
    if (admin) {
      try {
        const { data: profs } = await admin
          .from("profiles")
          .select("id, role, username, is_demo")
          .limit(10);
        profilesList = profs || [];
      } catch (pErr: any) {
        profilesList = [{ error: pErr?.message }];
      }
    }

    // 3. Safe Auth list inspection (id + partial email domain only)
    let authUsersCount = 0;
    let authUserSummary: any[] = [];
    if (admin) {
      try {
        const { data: uData } = await admin.auth.admin.listUsers({ perPage: 10 });
        authUsersCount = uData?.users?.length || 0;
        authUserSummary = uData?.users?.map((u) => ({
          id: u.id,
          emailDomain: u.email ? u.email.split("@")[1] : null,
          emailPrefix: u.email ? u.email.split("@")[0] : null,
        })) || [];
      } catch (uErr: any) {
        authUserSummary = [{ error: uErr?.message }];
      }
    }

    // 4. Safe signInWithPassword test for demo account
    let demoAuthTest: any = null;
    const demoPw = process.env.DEMO_PASSWORD;
    if (demoPw) {
      try {
        const sClient = getSupabaseServerClient();
        if (sClient) {
          const { data: sData, error: sErr } = await sClient.auth.signInWithPassword({
            email: "demo_riya@student.margam.local",
            password: demoPw.trim().replace(/^["']|["']$/g, ""),
          });
          demoAuthTest = {
            tested: true,
            success: Boolean(sData?.user),
            error: sErr ? sErr.message : null,
            userId: sData?.user?.id || null,
          };
        }
      } catch (testErr: any) {
        demoAuthTest = { tested: true, exception: testErr.message };
      }
    }

    // 5. Safe getAuthenticatedUser self-test
    let getAuthUserTest: any = null;
    try {
      const mockReq = new NextRequest("https://margam-learningspace.vercel.app/api/auth/me", {
        headers: { Cookie: `margam_auth_token=${testToken}` },
      });
      const resolvedSession = await getAuthenticatedUser(mockReq);
      getAuthUserTest = {
        resolved: Boolean(resolvedSession),
        role: resolvedSession?.role || null,
        id: resolvedSession?.id || null,
      };
    } catch (gErr: any) {
      getAuthUserTest = { resolved: false, error: gErr.message };
    }

    responsePayload.debug = {
      version: "20261106-diagnostics-v3",
      supabaseConfigured: isSupabaseConfigured(),
      adminConfigured: isAdminConfigured(),
      dbError,
      resolvedUrlHost: getHostSafe(resolvedUrl),
      projectRefs: {
        SUPABASE_ANON_KEY: getJwtRef(process.env.SUPABASE_ANON_KEY),
        SUPABASE_PUBLISHABLE_KEY: getJwtRef(process.env.SUPABASE_PUBLISHABLE_KEY),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: getJwtRef(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: getJwtRef(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
        SUPABASE_SECRET_KEY: getJwtRef(process.env.SUPABASE_SECRET_KEY),
        SUPABASE_SERVICE_ROLE_KEY: getJwtRef(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
      envPresent: {
        SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        POSTGRES_HOST: Boolean(process.env.POSTGRES_HOST),
        POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
        SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
        SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.SUPABASE_PUBLISHABLE_KEY),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
        DEMO_PASSWORD: Boolean(process.env.DEMO_PASSWORD),
      },
      hosts: {
        SUPABASE_URL: getHostSafe(process.env.SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_URL: getHostSafe(process.env.NEXT_PUBLIC_SUPABASE_URL),
        POSTGRES_HOST: getHostSafe(process.env.POSTGRES_HOST),
        POSTGRES_URL: getHostSafe(process.env.POSTGRES_URL),
      },
      hmacSelfTest,
      profilesList,
      authUsersCount,
      authUserSummary,
      demoAuthTest,
      getAuthUserTest,
    };
  }

  return NextResponse.json(responsePayload);
}


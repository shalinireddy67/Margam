import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/server/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isSupabaseConfigured,
  isAdminConfigured,
  getSupabaseUrl,
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

export async function GET(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(`health_${clientIp}`, 60, 60000)) {
    return NextResponse.json({ ok: false, db: false }, { status: 429 });
  }

  let db = false;
  let dbError: string | null = null;

  try {
    const admin = getSupabaseAdminClient();
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
    responsePayload.debug = {
      version: "20261105-diagnostics-v1",
      supabaseConfigured: isSupabaseConfigured(),
      adminConfigured: isAdminConfigured(),
      dbError,
      resolvedUrlHost: getHostSafe(resolvedUrl),
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
    };
  }

  return NextResponse.json(responsePayload);
}


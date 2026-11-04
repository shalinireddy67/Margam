import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/server/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(`health_${clientIp}`, 60, 60000)) {
    return NextResponse.json({ ok: false, db: false }, { status: 429 });
  }

  let db = false;
  try {
    const admin = getSupabaseAdminClient();
    if (admin) {
      const { error } = await admin.from("profiles").select("id").limit(1);
      if (!error) {
        db = true;
      }
    }
  } catch {
    db = false;
  }

  return NextResponse.json({ ok: true, db });
}

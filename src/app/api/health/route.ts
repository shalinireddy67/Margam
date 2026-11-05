import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  let isDbConnected = false;

  try {
    const adminClient = getSupabaseAdminClient();
    if (adminClient) {
      const { error } = await adminClient
        .from("classes")
        .select("id")
        .limit(1);

      if (!error) {
        isDbConnected = true;
      }
    }
  } catch {
    isDbConnected = false;
  }

  return NextResponse.json(
    {
      ok: true,
      db: isDbConnected,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}


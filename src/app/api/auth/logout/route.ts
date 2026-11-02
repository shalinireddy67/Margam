import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  const supabase = createSupabaseRouteClient(req, response);
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[Auth] Error signing out of Supabase:", err);
    }
  }

  // Clear legacy unsigned session cookie
  response.cookies.set("margam_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  // Clear signed mock auth cookie
  response.cookies.set("margam_auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

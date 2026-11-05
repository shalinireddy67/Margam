import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        userId: session.id,
        role: session.role,
        username: session.username,
        email: session.email,
        fullName: session.fullName,
        selectedClass: session.selectedClass,
        avatarPixel: session.avatarPixel,
        enrolledClass: session.enrolledClass || null,
        is_demo: session.is_demo ?? session.isDemo ?? false,
      },
    });
  } catch (err) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[Auth] /api/auth/me error:", err);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

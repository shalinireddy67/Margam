import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("margam_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(sessionCookie);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

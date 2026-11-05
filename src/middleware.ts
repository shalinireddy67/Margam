import { NextResponse, type NextRequest } from "next/server";
import { getSessionSecret } from "@/lib/env";

/**
 * Constant-time string comparison for Edge runtime.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    c |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return c === 0;
}

/**
 * Verifies an HMAC-SHA256 signed session token in Edge runtime using Web Crypto.
 * Rejects forged or altered tokens without valid signature.
 * Strictly in-memory and edge-compatible (0 network calls).
 */
async function verifyEdgeToken(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedSigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(dataStr)
    );
    const expectedSig = Buffer.from(expectedSigBuf).toString("base64url");
    if (!timingSafeEqual(signature, expectedSig)) {
      return null;
    }
    const jsonStr = Buffer.from(dataStr, "base64url").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Safely parses Supabase SSR JWT payload without making any network calls.
 */
function parseSupabaseJwtRole(cookieValue: string): { userId?: string; role?: string; exp?: number } | null {
  try {
    let token = cookieValue.trim();
    if (token.startsWith("%")) {
      try {
        token = decodeURIComponent(token);
      } catch {}
    }
    if (token.startsWith("base64-")) {
      try {
        token = Buffer.from(token.slice(7), "base64").toString("utf-8");
      } catch {}
    }
    if (token.startsWith("[")) {
      try {
        const arr = JSON.parse(token);
        token = Array.isArray(arr) ? arr[0] : token;
      } catch {}
    }
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    return {
      userId: payload.sub,
      role: payload.app_metadata?.role || payload.user_metadata?.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Immediately bypass public routes and asset endpoints (0 processing, 0 network)
  const publicRoutes = ["/", "/privacy", "/terms", "/cookies", "/login", "/demo", "/api/health"];
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/og-image.png"
  ) {
    return NextResponse.next();
  }

  // 2. Fast Edge verification with Web Crypto (ZERO network calls, ZERO database queries)
  let isAuthenticated = false;
  let userRole: "student" | "teacher" | null = null;

  // Check signed session cookie margam_auth_token or test header
  const token =
    req.cookies.get("margam_auth_token")?.value ||
    req.cookies.get("margam_session")?.value ||
    req.headers.get("x-test-auth-token");

  if (token) {
    const secret = getSessionSecret();
    const verified = await verifyEdgeToken(token, secret);
    if (verified && (!verified.expiresAt || verified.expiresAt > Date.now())) {
      isAuthenticated = true;
      userRole = verified.role === "teacher" ? "teacher" : "student";
    }
  }

  // Check Supabase SSR auth token cookie without making any remote network calls
  if (!isAuthenticated) {
    const allCookies = req.cookies.getAll();
    const sbCookies = allCookies
      .filter((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (sbCookies.length > 0) {
      const fullValue = sbCookies.map((c) => c.value).join("");
      const parsed = parseSupabaseJwtRole(fullValue);
      if (parsed && (!parsed.exp || parsed.exp * 1000 > Date.now())) {
        isAuthenticated = true;
        userRole = parsed.role === "teacher" ? "teacher" : "student";
      }
    }
  }

  // 3. Route Protection
  // Teacher APIs (/api/teacher/*)
  if (pathname.startsWith("/api/teacher")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "teacher") {
      return NextResponse.json(
        { error: "Forbidden: Teacher access required" },
        { status: 403 }
      );
    }
  }

  // Teacher Pages (/teacher, /teacher/*)
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("role", "teacher");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "teacher") {
      return NextResponse.redirect(new URL("/student", req.url));
    }
  }

  // Student Portal: Keep authenticated teachers in teacher dashboard
  if (pathname === "/student" || pathname.startsWith("/student/")) {
    if (isAuthenticated && userRole === "teacher") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, og-image.png
     * - static media/font assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|og-image\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|ico)$).*)",
  ],
};

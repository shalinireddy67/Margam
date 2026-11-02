import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isSupabaseConfigured,
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSessionSecret,
} from "@/lib/env";

/**
 * Verifies an HMAC-SHA256 signed session token in Edge runtime using Web Crypto.
 * Rejects forged or altered tokens without valid signature.
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
    if (signature !== expectedSig) {
      return null;
    }
    const jsonStr = Buffer.from(dataStr, "base64url").toString("utf-8");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const isConfigured = isSupabaseConfigured();
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  let userRole: "student" | "teacher" | null = null;
  let isAuthenticated = false;

  if (isConfigured && url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({
            request: { headers: req.headers },
          });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: "", ...options });
          res = NextResponse.next({
            request: { headers: req.headers },
          });
          res.cookies.set({ name, value: "", ...options });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;
      // Database profile is the primary source of truth for user role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        userRole = profile.role === "teacher" ? "teacher" : "student";
      } else {
        userRole =
          (user.app_metadata?.role || user.user_metadata?.role) === "teacher"
            ? "teacher"
            : "student";
      }
    }
  } else {
    // Non-production fallback check for signed token or test header
    if (process.env.NODE_ENV !== "production") {
      const mockToken =
        req.cookies.get("margam_auth_token")?.value ||
        req.headers.get("x-test-auth-token");
      if (mockToken) {
        const secret = getSessionSecret();
        const verifiedPayload = await verifyEdgeToken(mockToken, secret);
        if (verifiedPayload && (!verifiedPayload.expiresAt || verifiedPayload.expiresAt > Date.now())) {
          isAuthenticated = true;
          userRole = verifiedPayload.role === "teacher" ? "teacher" : "student";
        }
      }
    } else {
      console.error(
        "[Margam Middleware] Supabase credentials missing in production. Route protection active; protected routes will be rejected."
      );
    }
  }

  const pathname = req.nextUrl.pathname;

  // 1. Protect Teacher Pages (/teacher, /teacher/*)
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("role", "teacher");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "teacher") {
      // Forbidden for students attempting to access teacher portal
      const studentPortalUrl = new URL("/student", req.url);
      return NextResponse.redirect(studentPortalUrl);
    }
  }

  // 2. Protect Teacher APIs (/api/teacher/*)
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

  // 3. Guard Student Portal: Keep Teachers in Teacher Portal
  if (pathname === "/student" || pathname.startsWith("/student/")) {
    if (isAuthenticated && userRole === "teacher") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/teacher/:path*",
    "/api/teacher/:path*",
    // Exclude static assets and api routes that don't need auth checking
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

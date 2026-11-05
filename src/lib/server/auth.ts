import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockDb } from "@/lib/server/auth-helpers";
import {
  signSessionPayload,
  verifySignedSessionPayload,
} from "./session-crypto";

export { signSessionPayload, verifySignedSessionPayload };

export interface AuthUserSession {
  id: string;
  email: string;
  role: "student" | "teacher";
  username: string | null;
  fullName: string;
  selectedClass: number | null;
  avatarPixel?: string;
  enrolledClass?: { id: string; name: string; grade: number } | null;
  source: "supabase" | "mock";
  is_demo?: boolean;
  isDemo?: boolean;
}

/**
 * Retrieves the currently authenticated user from Supabase SSR Auth cookies (or verified mock token in non-prod).
 * Server-side source of truth: queries public.profiles for role verification.
 */
export async function getAuthenticatedUser(
  req?: NextRequest
): Promise<AuthUserSession | null> {
  // 1. Production Mode Check: Must have real Supabase configured
  const supabaseActive = isSupabaseConfigured();

  if (supabaseActive) {
    const serverClient = getSupabaseServerClient();
    if (!serverClient) return null;

    try {
      // Validate session with Supabase Auth server
      const {
        data: { user },
        error: authError,
      } = await serverClient.auth.getUser();

      if (!authError && user) {
        // Query database profile using Admin client (trusted, bypasses RLS)
        const admin = getSupabaseAdminClient();
        let profileRole: "student" | "teacher" = "student";
        let username: string | null = null;
        let fullName = user.user_metadata?.full_name || "Student";
        let selectedClass: number | null = null;
        let avatarPixel: string | undefined = undefined;
        let enrolledClass: { id: string; name: string; grade: number } | null = null;

        if (admin) {
          const { data: profile } = await admin
            .from("profiles")
            .select("role, username, full_name, selected_class, avatar_pixel")
            .eq("id", user.id)
            .single();

          if (profile) {
            profileRole = profile.role === "teacher" ? "teacher" : "student";
            username = profile.username;
            fullName = profile.full_name || fullName;
            selectedClass = profile.selected_class;
            avatarPixel = profile.avatar_pixel;
          }

          // Fetch enrolled class for student
          if (profileRole === "student") {
            const { data: member } = await admin
              .from("class_members")
              .select("classes(id, name, grade)")
              .eq("student_id", user.id)
              .maybeSingle();

            if (member?.classes) {
              enrolledClass = member.classes as any;
            }
          }
        }

        return {
          id: user.id,
          email: user.email || "",
          role: profileRole,
          username,
          fullName,
          selectedClass,
          avatarPixel,
          enrolledClass,
          source: "supabase",
        };
      }
    } catch (err: any) {
      if (err?.digest === "DYNAMIC_SERVER_USAGE" || err?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw err;
      }
      console.error("[Auth] Error verifying Supabase user session:", err);
    }
  }

  // 2. Token-Based Authentication Verification (signed margam_auth_token cookie)
  // Validates HMAC-SHA256 signature with SESSION_SECRET across serverless functions
  let token =
    req?.cookies?.get("margam_auth_token")?.value ||
    req?.cookies?.get("margam_session")?.value ||
    req?.headers?.get("x-test-auth-token");

  if (!token) {
    try {
      const cookieStore = cookies() as any;
      token =
        cookieStore.get("margam_auth_token")?.value ||
        cookieStore.get("margam_session")?.value;
    } catch {
      // In edge or unsupported contexts
    }
  }

  if (!token && req?.headers?.get("cookie")) {
    const rawCookie = req.headers.get("cookie") || "";
    const match = rawCookie.match(/(?:^|;\s*)margam_auth_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (!token) {
    return null;
  }

  const payload = verifySignedSessionPayload<{
    userId: string;
    role: "student" | "teacher";
    expiresAt: number;
    username?: string;
  }>(token);

  if (!payload || (payload.expiresAt && payload.expiresAt < Date.now())) {
    return null;
  }

  // Verify against Supabase DB profile if admin client is available
  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      let profileQuery = admin
        .from("profiles")
        .select("id, role, username, full_name, selected_class, avatar_pixel, is_demo");

      const uname = payload.username || (payload.userId.startsWith("usr_") ? payload.userId.replace(/^usr_/, "") : null);
      if (uname) {
        profileQuery = profileQuery.or(`id.eq.${payload.userId},username.eq.${uname}`);
      } else {
        profileQuery = profileQuery.eq("id", payload.userId);
      }

      const { data: profile } = await profileQuery.maybeSingle();

      if (profile) {
        let enrolledClass: { id: string; name: string; grade: number } | null = null;
        if (profile.role === "student") {
          const { data: member } = await admin
            .from("class_members")
            .select("classes(id, name, grade)")
            .eq("student_id", profile.id)
            .maybeSingle();

          if (member?.classes) {
            enrolledClass = member.classes as any;
          }
        }

        return {
          id: profile.id,
          email: payload.role === "teacher" ? "demo.teacher@margam.example" : `${profile.username || payload.userId}@student.margam.local`,
          role: profile.role === "teacher" ? "teacher" : "student",
          username: profile.username,
          fullName: profile.full_name || "User",
          selectedClass: profile.selected_class,
          avatarPixel: profile.avatar_pixel,
          enrolledClass,
          source: "supabase",
          is_demo: Boolean(profile.is_demo),
          isDemo: Boolean(profile.is_demo),
        };
      }
    } catch {
      // Proceed to mock / demo session resolution if DB is temporarily unreachable
    }
  }

  const mockUser = mockDb.profiles.get(payload.userId);
  if (mockUser) {
    let enrolledClass: { id: string; name: string; grade: number } | null = null;
    if (mockUser.role === "student") {
      const mockMember = Array.from(mockDb.classMembers.values()).find(
        (m) => m.studentId === mockUser.id
      );
      if (mockMember) {
        const cls = mockDb.classes.get(mockMember.classId);
        if (cls) {
          enrolledClass = { id: cls.id, name: cls.name, grade: cls.grade };
        }
      }
    }

    return {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      username: mockUser.username,
      fullName: mockUser.fullName,
      selectedClass: mockUser.selectedClass,
      enrolledClass,
      source: "mock",
    };
  }

  // Fallback for valid signed session payload
  return {
    id: payload.userId,
    email: payload.role === "teacher" ? "demo.teacher@margam.example" : `${payload.userId}@student.margam.local`,
    role: payload.role,
    username: payload.username || payload.userId.replace(/^usr_/, ""),
    fullName: payload.role === "teacher" ? "Demo Teacher" : "Demo Student",
    selectedClass: 10,
    source: "mock",
    is_demo: (payload as any).is_demo ?? true,
    isDemo: (payload as any).is_demo ?? true,
  };
}

/**
 * Requires an authenticated user session.
 * Throws an authorization error if unauthenticated.
 */
export async function requireAuthenticatedUser(
  req?: NextRequest
): Promise<AuthUserSession> {
  const session = await getAuthenticatedUser(req);
  if (!session) {
    const error: any = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }
  return session;
}

/**
 * Requires an authenticated student session.
 * Throws 401 if unauthenticated, 403 if user is not a student.
 */
export async function requireStudent(
  req?: NextRequest
): Promise<AuthUserSession> {
  const session = await requireAuthenticatedUser(req);
  if (session.role !== "student") {
    const error: any = new Error("Student access required");
    error.statusCode = 403;
    throw error;
  }
  return session;
}

/**
 * Requires an authenticated teacher session.
 * Throws 401 if unauthenticated, 403 if user is not a teacher.
 */
export async function requireTeacher(
  req?: NextRequest
): Promise<AuthUserSession> {
  const session = await requireAuthenticatedUser(req);
  if (session.role !== "teacher") {
    const error: any = new Error("Teacher access required");
    error.statusCode = 403;
    throw error;
  }
  return session;
}

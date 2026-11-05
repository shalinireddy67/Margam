import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { signSessionPayload } from "@/lib/server/session-crypto";
import { mockDb } from "@/lib/server/auth-helpers";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "@/lib/demo/demo-school-data";
import { seedMockDatabase, seedSupabaseDatabase } from "@/lib/demo/seeder";

export const dynamic = "force-dynamic";

const DemoLoginSchema = z.object({
  role: z.enum(["teacher", "student"]),
  studentIndex: z.number().int().min(0).max(24).optional(),
  username: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({ role: "teacher" }));
    const parsed = DemoLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid demo login parameters" },
        { status: 400 }
      );
    }

    const { role, studentIndex = 0, username } = parsed.data;
    const isTeacher = role === "teacher";

    // Auto-seed mockDb if demo teacher is not present in in-memory store
    if (!mockDb.profiles.has(DEMO_SCHOOL_CONFIG.teacher.id)) {
      seedMockDatabase();
    }

    let targetEmail: string;
    let targetName: string;
    let targetId: string;
    let targetUsername: string | null = null;
    let targetClass: number = 10;

    if (isTeacher) {
      targetEmail = DEMO_SCHOOL_CONFIG.teacher.email;
      targetName = DEMO_SCHOOL_CONFIG.teacher.fullName;
      targetId = DEMO_SCHOOL_CONFIG.teacher.id;
    } else {
      let targetStudent = DEMO_STUDENTS[studentIndex] || DEMO_STUDENTS[0];
      if (username) {
        const found = DEMO_STUDENTS.find((s) => s.username === username);
        if (found) targetStudent = found;
      }
      targetEmail = targetStudent.email;
      targetName = targetStudent.name;
      targetId = targetStudent.id;
      targetUsername = targetStudent.username;
      targetClass = 10;
    }

    const supabaseActive = isSupabaseConfigured();

    if (supabaseActive) {
      const response = NextResponse.json({ success: true });
      const routeClient = createSupabaseRouteClient(req, response);
      const admin = getSupabaseAdminClient();

      if (routeClient && admin) {
        // Ensure demo accounts exist in Supabase
        const { data: userList } = await admin.auth.admin.listUsers();
        const foundUser = userList?.users?.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
        if (!foundUser) {
          await seedSupabaseDatabase();
        }

        // Sign in with password to set proper SSR Auth cookies
        const { data: signInData, error: signInError } = await routeClient.auth.signInWithPassword({
          email: targetEmail,
          password: DEMO_SCHOOL_CONFIG.demoPassword,
        });

        if (!signInError && signInData.user) {
          const userPayload = {
            id: signInData.user.id,
            role,
            email: targetEmail,
            fullName: targetName,
            username: targetUsername,
            selectedClass: targetClass,
            school: DEMO_SCHOOL_CONFIG.schoolName,
          };

          const signedToken = signSessionPayload({
            userId: signInData.user.id,
            role,
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
          });

          const finalResponse = NextResponse.json({
            success: true,
            user: userPayload,
            role,
            redirectUrl: isTeacher ? "/teacher" : "/student",
            demoNotice: "Authenticated as Demo Account",
          });

          for (const cookie of response.cookies.getAll()) {
            finalResponse.cookies.set(cookie);
          }

          finalResponse.cookies.set("margam_auth_token", signedToken, {
            httpOnly: true,
            secure: (process.env.NODE_ENV as string) === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax",
          });

          return finalResponse;
        }
      }
    }

    // In-Memory Mock Fallback (Offline / Dev presentation mode)
    const userPayload = {
      id: targetId,
      role,
      email: targetEmail,
      fullName: targetName,
      username: targetUsername,
      selectedClass: targetClass,
      school: DEMO_SCHOOL_CONFIG.schoolName,
    };

    const signedToken = signSessionPayload({
      userId: targetId,
      role,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      role,
      redirectUrl: isTeacher ? "/teacher" : "/student",
      demoNotice: "Authenticated as Demo Account",
    });

    response.cookies.set("margam_auth_token", signedToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV as string) === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[Demo Login Error]:", err);
    return NextResponse.json({ error: "Failed to authenticate demo user" }, { status: 500 });
  }
}


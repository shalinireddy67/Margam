import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStudent, AuthUserSession } from "@/lib/server/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mockDb } from "@/lib/server/auth-helpers";

const ProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(1, "Nickname / name cannot be empty").max(60, "Name too long").optional(),
  studyClass: z.union([
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]).optional(),
});

export async function GET(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireStudent(req);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Student authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.id,
      username: session.username,
      fullName: session.fullName,
      selectedClass: session.selectedClass,
      enrolledClass: session.enrolledClass || null,
      role: session.role,
    },
  });
}

export async function PATCH(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireStudent(req);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Student authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid update data" },
        { status: 400 }
      );
    }

    const { fullName, studyClass } = parsed.data;

    if (isSupabaseConfigured()) {
      const admin = getSupabaseAdminClient();
      if (admin) {
        const updatePayload: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        if (fullName) updatePayload.full_name = fullName;
        if (studyClass) updatePayload.selected_class = studyClass;

        const { error: dbErr } = await admin
          .from("profiles")
          .update(updatePayload)
          .eq("id", session.id);

        if (dbErr) {
          console.error("[Profile API] Error updating Supabase profile:", dbErr);
          return NextResponse.json({ error: "Failed to update profile in database." }, { status: 500 });
        }
      }
    } else {
      // Mock db in non-prod / tests
      const mockUser = mockDb.profiles.get(session.id);
      if (mockUser) {
        if (fullName) mockUser.fullName = fullName;
        if (studyClass) mockUser.selectedClass = studyClass;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: session.id,
        username: session.username,
        fullName: fullName || session.fullName,
        selectedClass: studyClass || session.selectedClass,
        enrolledClass: session.enrolledClass || null,
      },
    });
  } catch (err: any) {
    console.error("[Profile API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

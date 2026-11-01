import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { mockDb } from "@/lib/server/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("margam_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let session: { userId: string; role: string };
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const localProfile = body.localProfile;
    if (!localProfile || typeof localProfile !== "object") {
      return NextResponse.json({ success: true, imported: 0 });
    }

    const topicProgress = localProfile.topicProgress || {};
    const conceptEntries = Object.entries(topicProgress);

    const admin = getSupabaseAdminClient();
    if (admin) {
      // 1. Update student profile class if needed
      if (localProfile.selectedClass) {
        await admin
          .from("profiles")
          .update({ selected_class: localProfile.selectedClass })
          .eq("id", session.userId);
      }

      // 2. Insert or update concept_mastery
      for (const [conceptId, progress] of conceptEntries) {
        const p = progress as any;
        await admin.from("concept_mastery").upsert({
          student_id: session.userId,
          concept_id: conceptId,
          mastery: p.mastery ?? 0,
          difficulty: p.difficulty ?? 1,
          consecutive_correct: p.consecutiveCorrect ?? 0,
          consecutive_incorrect: p.consecutiveIncorrect ?? 0,
          status: p.status || "available",
          lesson_completed: Boolean(p.lessonCompleted),
          worksheet_completed: Boolean(p.worksheetCompleted),
          last_attempt_at: p.lastAttemptAt || new Date().toISOString(),
        });
      }
    } else {
      // Mock store
      const profile = mockDb.profiles.get(session.userId);
      if (profile && localProfile.selectedClass) {
        profile.selectedClass = localProfile.selectedClass;
      }
      for (const [conceptId, progress] of conceptEntries) {
        const p = progress as any;
        mockDb.conceptMastery.set(`${session.userId}:${conceptId}`, {
          id: `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: session.userId,
          conceptId,
          mastery: p.mastery ?? 0,
          difficulty: p.difficulty ?? 1,
          consecutiveCorrect: p.consecutiveCorrect ?? 0,
          consecutiveIncorrect: p.consecutiveIncorrect ?? 0,
          status: p.status || "available",
          lessonCompleted: Boolean(p.lessonCompleted),
          worksheetCompleted: Boolean(p.worksheetCompleted),
          lastAttemptAt: p.lastAttemptAt || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      importedConcepts: conceptEntries.length,
    });
  } catch (err) {
    console.error("Error importing local progress:", err);
    return NextResponse.json(
      { error: "Failed to import local progress" },
      { status: 500 }
    );
  }
}

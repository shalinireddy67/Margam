import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mockDb, StoredAttempt } from "@/lib/server/auth-helpers";
import { requireStudent, AuthUserSession } from "@/lib/server/auth";
import { LearnerProfile, TopicProgress } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/sync/import-local
 * Pulls the consolidated cloud progress for the authenticated student.
 */
export async function GET(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireStudent(req);
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    return NextResponse.json(
      { error: err.message || "Student authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  const supabaseActive = isSupabaseConfigured();

  if (supabaseActive) {
    const admin = getSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Database service unavailable" },
        { status: 503 }
      );
    }

    try {
      const { data: profileRow } = await admin
        .from("profiles")
        .select("selected_class, full_name, username, created_at")
        .eq("id", session.id)
        .single();

      const { data: cmRows } = await admin
        .from("concept_mastery")
        .select("*")
        .eq("student_id", session.id);

      const { data: attemptsRows } = await admin
        .from("attempts")
        .select("*")
        .eq("student_id", session.id)
        .order("created_at", { ascending: false });

      const topicProgress: Record<string, TopicProgress> = {};
      if (cmRows) {
        for (const row of cmRows) {
          topicProgress[row.concept_id] = {
            conceptId: row.concept_id,
            status: row.status as any,
            lessonCompleted: Boolean(row.lesson_completed),
            worksheetCompleted: Boolean(row.worksheet_completed),
            mastery: Number(row.mastery || 0),
            difficulty: Number(row.difficulty || 1) as 1 | 2 | 3,
            consecutiveCorrect: Number(row.consecutive_correct || 0),
            consecutiveIncorrect: Number(row.consecutive_incorrect || 0),
            lastAttemptAt: row.last_attempt_at,
          };
        }
      }

      const profile: LearnerProfile = {
        version: 1,
        id: session.id,
        name: profileRow?.full_name || session.fullName || "Student",
        selectedClass: (profileRow?.selected_class || session.selectedClass || 10) as 6 | 7 | 8 | 9 | 10,
        createdAt: profileRow?.created_at || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        topicProgress,
        consecutiveCorrect: 0,
        consecutiveIncorrect: 0,
        currentDifficulty: 1,
        resolvedGaps: [],
      };

      return NextResponse.json({
        success: true,
        profile,
        attempts: attemptsRows || [],
      });
    } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
      console.error("[Sync GET] Failed to fetch cloud progress:", err);
      return NextResponse.json(
        { error: "Failed to retrieve cloud progress" },
        { status: 500 }
      );
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Database service unavailable in production" },
        { status: 503 }
      );
    }

    const mockProfile = mockDb.profiles.get(session.id);
    const mockCms = Array.from(mockDb.conceptMastery.values()).filter(
      (cm) => cm.studentId === session.id
    );
    const mockAttempts = mockDb.attempts.filter((a) => a.studentId === session.id);

    const topicProgress: Record<string, TopicProgress> = {};
    for (const cm of mockCms) {
      topicProgress[cm.conceptId] = {
        conceptId: cm.conceptId,
        status: cm.status as any,
        lessonCompleted: Boolean(cm.lessonCompleted),
        worksheetCompleted: Boolean(cm.worksheetCompleted),
        mastery: cm.mastery,
        difficulty: cm.difficulty as 1 | 2 | 3,
        consecutiveCorrect: cm.consecutiveCorrect,
        consecutiveIncorrect: cm.consecutiveIncorrect,
        lastAttemptAt: cm.lastAttemptAt,
      };
    }

    const profile: LearnerProfile = {
      version: 1,
      id: session.id,
      name: mockProfile?.fullName || session.fullName || "Student",
      selectedClass: (mockProfile?.selectedClass || session.selectedClass || 10) as 6 | 7 | 8 | 9 | 10,
      createdAt: mockProfile?.createdAt || new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      topicProgress,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      currentDifficulty: 1,
      resolvedGaps: [],
    };

    return NextResponse.json({
      success: true,
      profile,
      attempts: mockAttempts,
    });
  }
}

/**
 * POST /api/sync/import-local
 * Performs non-destructive, bidirectional synchronization between local browser
 * progress and authenticated Supabase cloud storage.
 *
 * Rules:
 * 1. Never blindly overwrite higher cloud mastery with lower local scores.
 * 2. Lessons or worksheets completed in either location remain marked complete.
 * 3. Scope updates strictly to session.id (client-sent student IDs cannot overwrite other users).
 * 4. Deduplicate attempts to prevent duplicate assessment records.
 */
export async function POST(req: NextRequest) {
  let session: AuthUserSession;
  try {
    session = await requireStudent(req);
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    return NextResponse.json(
      { error: err.message || "Student authorization required" },
      { status: err.statusCode || 401 }
    );
  }

  try {
    const body = await req.json();
    const localProfile = body.localProfile;
    const additionalAttempts: StoredAttempt[] = Array.isArray(body.attempts) ? body.attempts : [];

    const topicProgress = (localProfile && typeof localProfile === "object" && localProfile.topicProgress)
      ? localProfile.topicProgress
      : {};
    const conceptEntries = Object.entries(topicProgress);
    const supabaseActive = isSupabaseConfigured();

    if (supabaseActive) {
      const admin = getSupabaseAdminClient();
      if (!admin) {
        return NextResponse.json(
          { error: "Database administration client unavailable" },
          { status: 503 }
        );
      }

      // 1. Update selected_class if valid
      if (localProfile?.selectedClass && [6, 7, 8, 9, 10].includes(Number(localProfile.selectedClass))) {
        await admin
          .from("profiles")
          .update({ selected_class: Number(localProfile.selectedClass) })
          .eq("id", session.id);
      }

      // 2. Query existing cloud concept_mastery to enable intelligent non-destructive merging
      const { data: existingRows } = await admin
        .from("concept_mastery")
        .select("*")
        .eq("student_id", session.id);

      const cloudMap = new Map<string, any>();
      if (existingRows) {
        for (const row of existingRows) {
          cloudMap.set(row.concept_id, row);
        }
      }

      // 3. Merge concept progress intelligently
      for (const [conceptId, progress] of conceptEntries) {
        const local = progress as any;
        const cloud = cloudMap.get(conceptId);

        let mergedMastery = local.mastery ?? 0;
        let mergedDifficulty = local.difficulty ?? 1;
        let mergedLessonCompleted = Boolean(local.lessonCompleted);
        let mergedWorksheetCompleted = Boolean(local.worksheetCompleted);
        let mergedConsecutiveCorrect = local.consecutiveCorrect ?? 0;
        let mergedConsecutiveIncorrect = local.consecutiveIncorrect ?? 0;
        let mergedStatus = local.status || "available";
        let mergedLastAttempt = local.lastAttemptAt || new Date().toISOString();

        if (cloud) {
          // Rule: Never downgrade mastery
          mergedMastery = Math.max(Number(cloud.mastery || 0), Number(mergedMastery));
          // Rule: Keep highest difficulty reached
          mergedDifficulty = Math.max(Number(cloud.difficulty || 1), Number(mergedDifficulty));
          // Rule: Union of completed flags
          mergedLessonCompleted = Boolean(cloud.lesson_completed) || mergedLessonCompleted;
          mergedWorksheetCompleted = Boolean(cloud.worksheet_completed) || mergedWorksheetCompleted;
          mergedConsecutiveCorrect = Math.max(Number(cloud.consecutive_correct || 0), mergedConsecutiveCorrect);
          
          if (cloud.status === "completed" || mergedStatus === "completed") {
            mergedStatus = "completed";
          } else if (cloud.status === "in_progress" || mergedStatus === "in_progress") {
            mergedStatus = "in_progress";
          }

          if (cloud.last_attempt_at && (!local.lastAttemptAt || new Date(cloud.last_attempt_at) > new Date(local.lastAttemptAt))) {
            mergedLastAttempt = cloud.last_attempt_at;
          }
        }

        await admin.from("concept_mastery").upsert({
          student_id: session.id,
          concept_id: conceptId,
          mastery: mergedMastery,
          difficulty: mergedDifficulty,
          consecutive_correct: mergedConsecutiveCorrect,
          consecutive_incorrect: mergedConsecutiveIncorrect,
          status: mergedStatus,
          lesson_completed: mergedLessonCompleted,
          worksheet_completed: mergedWorksheetCompleted,
          last_attempt_at: mergedLastAttempt,
        });

        // Update cloudMap with merged value for return payload
        cloudMap.set(conceptId, {
          concept_id: conceptId,
          mastery: mergedMastery,
          difficulty: mergedDifficulty,
          consecutive_correct: mergedConsecutiveCorrect,
          consecutive_incorrect: mergedConsecutiveIncorrect,
          status: mergedStatus,
          lesson_completed: mergedLessonCompleted,
          worksheet_completed: mergedWorksheetCompleted,
          last_attempt_at: mergedLastAttempt,
        });
      }

      // 4. Ingest and deduplicate attempts if passed
      if (additionalAttempts.length > 0) {
        const { data: existingAttempts } = await admin
          .from("attempts")
          .select("type, identifier, score, total")
          .eq("student_id", session.id);

        const attemptKeys = new Set(
          (existingAttempts || []).map((a) => `${a.type}:${a.identifier}:${a.score}:${a.total}`)
        );

        for (const att of additionalAttempts) {
          const key = `${att.type}:${att.identifier}:${att.score}:${att.total}`;
          if (!attemptKeys.has(key)) {
            await admin.from("attempts").insert({
              student_id: session.id,
              type: att.type,
              identifier: att.identifier,
              score: att.score,
              total: att.total,
              created_at: att.createdAt || new Date().toISOString(),
            });
            attemptKeys.add(key);
          }
        }
      }

      // 5. Construct the final merged profile to return to client
      const finalTopicProgress: Record<string, TopicProgress> = {};
      for (const [cId, row] of cloudMap.entries()) {
        finalTopicProgress[cId] = {
          conceptId: cId,
          status: row.status,
          lessonCompleted: Boolean(row.lesson_completed),
          worksheetCompleted: Boolean(row.worksheet_completed),
          mastery: Number(row.mastery || 0),
          difficulty: Number(row.difficulty || 1) as 1 | 2 | 3,
          consecutiveCorrect: Number(row.consecutive_correct || 0),
          consecutiveIncorrect: Number(row.consecutive_incorrect || 0),
          lastAttemptAt: row.last_attempt_at,
        };
      }

      return NextResponse.json({
        success: true,
        importedConcepts: conceptEntries.length,
        profile: {
          version: 1,
          id: session.id,
          name: session.fullName,
          selectedClass: session.selectedClass || 10,
          topicProgress: finalTopicProgress,
          consecutiveCorrect: 0,
          consecutiveIncorrect: 0,
          currentDifficulty: 1,
        },
      });
    } else {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database service unavailable in production" },
          { status: 503 }
        );
      }

      // Mock Mode Store
      const profile = mockDb.profiles.get(session.id);
      if (profile && localProfile?.selectedClass && [6, 7, 8, 9, 10].includes(Number(localProfile.selectedClass))) {
        profile.selectedClass = Number(localProfile.selectedClass);
      }

      for (const [conceptId, progress] of conceptEntries) {
        const local = progress as any;
        const key = `${session.id}:${conceptId}`;
        const existing = mockDb.conceptMastery.get(key);

        let mergedMastery = local.mastery ?? 0;
        let mergedDifficulty = local.difficulty ?? 1;
        let mergedLessonCompleted = Boolean(local.lessonCompleted);
        let mergedWorksheetCompleted = Boolean(local.worksheetCompleted);
        let mergedConsecutiveCorrect = local.consecutiveCorrect ?? 0;
        let mergedConsecutiveIncorrect = local.consecutiveIncorrect ?? 0;
        let mergedStatus = local.status || "available";
        let mergedLastAttempt = local.lastAttemptAt || new Date().toISOString();

        if (existing) {
          mergedMastery = Math.max(existing.mastery, mergedMastery);
          mergedDifficulty = Math.max(existing.difficulty, mergedDifficulty);
          mergedLessonCompleted = existing.lessonCompleted || mergedLessonCompleted;
          mergedWorksheetCompleted = existing.worksheetCompleted || mergedWorksheetCompleted;
          mergedConsecutiveCorrect = Math.max(existing.consecutiveCorrect, mergedConsecutiveCorrect);

          if (existing.status === "completed" || mergedStatus === "completed") {
            mergedStatus = "completed";
          } else if (existing.status === "in_progress" || mergedStatus === "in_progress") {
            mergedStatus = "in_progress";
          }
        }

        mockDb.conceptMastery.set(key, {
          id: existing?.id || `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: session.id,
          conceptId,
          mastery: mergedMastery,
          difficulty: mergedDifficulty,
          consecutiveCorrect: mergedConsecutiveCorrect,
          consecutiveIncorrect: mergedConsecutiveIncorrect,
          status: mergedStatus,
          lessonCompleted: mergedLessonCompleted,
          worksheetCompleted: mergedWorksheetCompleted,
          lastAttemptAt: mergedLastAttempt,
        });
      }

      // Deduplicate attempts
      for (const att of additionalAttempts) {
        const exists = mockDb.attempts.some(
          (a) =>
            a.studentId === session.id &&
            a.type === att.type &&
            a.identifier === att.identifier &&
            a.score === att.score &&
            a.total === att.total
        );
        if (!exists) {
          mockDb.attempts.push({
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            studentId: session.id,
            type: att.type,
            identifier: att.identifier,
            score: att.score,
            total: att.total,
            createdAt: att.createdAt || new Date().toISOString(),
          });
        }
      }

      // Reconstruct merged profile
      const studentCms = Array.from(mockDb.conceptMastery.values()).filter(
        (cm) => cm.studentId === session.id
      );
      const finalTopicProgress: Record<string, TopicProgress> = {};
      for (const cm of studentCms) {
        finalTopicProgress[cm.conceptId] = {
          conceptId: cm.conceptId,
          status: cm.status as any,
          lessonCompleted: cm.lessonCompleted,
          worksheetCompleted: cm.worksheetCompleted,
          mastery: cm.mastery,
          difficulty: cm.difficulty as 1 | 2 | 3,
          consecutiveCorrect: cm.consecutiveCorrect,
          consecutiveIncorrect: cm.consecutiveIncorrect,
          lastAttemptAt: cm.lastAttemptAt,
        };
      }

      return NextResponse.json({
        success: true,
        importedConcepts: conceptEntries.length,
        profile: {
          version: 1,
          id: session.id,
          name: profile?.fullName || session.fullName,
          selectedClass: profile?.selectedClass || session.selectedClass || 10,
          topicProgress: finalTopicProgress,
          consecutiveCorrect: 0,
          consecutiveIncorrect: 0,
          currentDifficulty: 1,
        },
      });
    }
  } catch (err) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error importing local progress:", err);
    return NextResponse.json(
      { error: "Failed to import local progress" },
      { status: 500 }
    );
  }
}

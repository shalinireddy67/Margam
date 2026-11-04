import { NextRequest, NextResponse } from "next/server";
import {
  evaluatePracticeSubmission,
  calculateNextDifficulty,
  updateMastery,
} from "@/lib/adaptive";
import { verifySessionToken } from "@/lib/server/session";
import { getQuestionById } from "@/lib/curriculum";
import { evaluateAwardedXp } from "@/lib/server/xp-evaluator";
import {
  isRateLimited,
  isDuplicateSubmission,
  markSubmissionCompleted,
} from "@/lib/server/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mockDb } from "@/lib/server/auth-helpers";
import { getAuthenticatedUser } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token,
      conceptId,
      studentId,
      answers,
      currentDifficulty = 1,
      consecutiveCorrect = 0,
      consecutiveIncorrect = 0,
      previousMastery,
      profile,
      isPersonalized = false,
    } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid session token" },
        { status: 400 }
      );
    }

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json(
        { error: "Missing studentId" },
        { status: 400 }
      );
    }

    if (!conceptId || typeof conceptId !== "string") {
      return NextResponse.json(
        { error: "Missing conceptId" },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Missing answers payload" },
        { status: 400 }
      );
    }

    const authUser = await getAuthenticatedUser(req);
    if (authUser && studentId && studentId !== authUser.id) {
      return NextResponse.json(
        { error: "Access denied: student identity mismatch" },
        { status: 403 }
      );
    }
    const effectiveStudentId = authUser ? authUser.id : studentId;

    // Verify cryptographic session token
    const verification = verifySessionToken(token, effectiveStudentId, "practice");
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: verification.error || "Unauthorized practice session" },
        { status: 401 }
      );
    }

    const { sessionId, questionIds } = verification.payload;

    if (verification.payload.targetId !== conceptId) {
      return NextResponse.json(
        { error: "Session concept mismatch" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") || studentId;
    if (isRateLimited(`prac_sub_${clientIp}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please wait." },
        { status: 429 }
      );
    }

    // Duplicate check
    if (isDuplicateSubmission(sessionId)) {
      return NextResponse.json(
        { error: "Duplicate submission: practice attempt already graded." },
        { status: 409 }
      );
    }

    // Incomplete submission check - Reject empty or partial submissions
    const answeredKeys = Object.keys(answers).filter(
      (k) => typeof answers[k] === "string" && answers[k].trim() !== ""
    );

    const missingQuestions = questionIds.filter((qid) => !answeredKeys.includes(qid));
    if (missingQuestions.length > 0) {
      return NextResponse.json(
        {
          error: "Incomplete submission: all practice questions must be answered.",
          missingCount: missingQuestions.length,
        },
        { status: 400 }
      );
    }

    markSubmissionCompleted(sessionId);

    // Evaluate practice logic with historical tracking and comparison
    const practiceResult = evaluatePracticeSubmission(conceptId, answers, {
      studentProfile: profile,
      isPersonalized,
    });

    const passed = practiceResult.scorePercentage >= 70;

    // Calculate updated mastery using pure formula if not already calculated
    const computedMastery =
      practiceResult.updatedMastery !== undefined
        ? practiceResult.updatedMastery
        : updateMastery(previousMastery, practiceResult.scorePercentage);

    // Update streak and difficulty stepping
    let newConsecutiveCorrect = consecutiveCorrect;
    let newConsecutiveIncorrect = consecutiveIncorrect;

    if (passed) {
      newConsecutiveCorrect += 1;
      newConsecutiveIncorrect = 0;
    } else {
      newConsecutiveCorrect = 0;
      newConsecutiveIncorrect += 1;
    }

    // Consistency fix: Use practiceResult updated difficulty directly to prevent double promotion
    const nextDiff = (practiceResult.updatedDifficulty || currentDifficulty) as 1 | 2 | 3;

    // Generate readable mistake hint if incorrect
    let mistakeHint: string | undefined;
    const wrongFb = practiceResult.feedback.find((f) => !f.isCorrect);
    if (wrongFb && wrongFb.mistakeTag) {
      mistakeHint = `Error pattern noticed: ${wrongFb.mistakeTag.replace(/_/g, " ")}. Try checking signs and operations carefully.`;
    }

    // Server-derived XP evaluation
    const xpEvaluation = evaluateAwardedXp({
      eventType: "practice",
      evaluatedQuestions: practiceResult.feedback.map((f) => {
        const q = getQuestionById(f.questionId);
        return {
          questionId: f.questionId,
          isCorrect: f.isCorrect,
          difficulty: (q?.difficulty as 1 | 2 | 3) || 1,
        };
      }),
      gapResolved: Boolean(practiceResult.gapResolved),
      previousQuestionHistory: body.studentHistory?.questionHistory || profile?.answeredQuestionsHistory || {},
      todayXpEarned: body.studentHistory?.todayXpEarned || profile?.dailyXp?.xp || 0,
      lastActiveIstDate: body.studentHistory?.lastActiveIstDate || profile?.dailyXp?.date,
    });

    // Trusted server-side attempt & mastery persistence
    try {
      if (isSupabaseConfigured()) {
        const admin = getSupabaseAdminClient();
        if (admin && authUser && authUser.id === effectiveStudentId && effectiveStudentId.length === 36) {
          await admin.from("attempts").insert({
            student_id: effectiveStudentId,
            type: "worksheet",
            identifier: conceptId,
            score: practiceResult.correctCount,
            total: practiceResult.totalQuestions,
            created_at: new Date().toISOString(),
          });
          await admin.from("concept_mastery").upsert({
            student_id: effectiveStudentId,
            concept_id: conceptId,
            mastery: computedMastery,
            difficulty: nextDiff,
            consecutive_correct: newConsecutiveCorrect,
            consecutive_incorrect: newConsecutiveIncorrect,
            status: passed ? "completed" : "in_progress",
            worksheet_completed: true,
            last_attempt_at: new Date().toISOString(),
          });
        }
      } else if (process.env.NODE_ENV !== "production") {
        mockDb.attempts.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: effectiveStudentId,
          type: "worksheet",
          identifier: conceptId,
          score: practiceResult.correctCount,
          total: practiceResult.totalQuestions,
          createdAt: new Date().toISOString(),
        });
        const existingCm = mockDb.conceptMastery.get(`${effectiveStudentId}:${conceptId}`);
        mockDb.conceptMastery.set(`${effectiveStudentId}:${conceptId}`, {
          id: existingCm?.id || `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          studentId: effectiveStudentId,
          conceptId,
          mastery: computedMastery,
          difficulty: nextDiff,
          consecutiveCorrect: newConsecutiveCorrect,
          consecutiveIncorrect: newConsecutiveIncorrect,
          status: passed ? "completed" : (existingCm?.status === "completed" ? "completed" : "in_progress"),
          lessonCompleted: existingCm?.lessonCompleted ?? true,
          worksheetCompleted: true,
          lastAttemptAt: new Date().toISOString(),
        });
      }
    } catch (saveErr) {
      console.warn("[Practice Submit] Could not persist attempt to database:", saveErr);
    }

    return NextResponse.json({
      score: practiceResult.correctCount,
      total: practiceResult.totalQuestions,
      percentage: practiceResult.scorePercentage,
      passed,
      mastery: computedMastery,
      nextDifficulty: nextDiff,
      consecutiveCorrect: newConsecutiveCorrect,
      consecutiveIncorrect: newConsecutiveIncorrect,
      gapResolved: practiceResult.gapResolved,
      xpAwarded: xpEvaluation.awardedXp,
      grossXp: xpEvaluation.grossXp,
      isCapped: xpEvaluation.isCapped,
      newDailyTotal: xpEvaluation.newDailyTotal,
      xpBreakdown: xpEvaluation.breakdown,
      updatedQuestionHistory: xpEvaluation.updatedQuestionHistory,
      comparison: practiceResult.comparison,
      nextRevisionAt: practiceResult.nextRevisionAt,
      revisionLevel: practiceResult.revisionLevel,
      conceptsPracticed: practiceResult.conceptsPracticed,
      conceptsNeedingAttention: practiceResult.conceptsNeedingAttention,
      nextAction: practiceResult.nextAction,
      feedback: practiceResult.feedback.map((f) => ({
        questionId: f.questionId,
        isCorrect: f.isCorrect,
        chosenAnswer: f.selectedOption,
        correctAnswer: f.correctAnswer,
        tag: f.mistakeTag,
        misconceptionCategory: f.misconceptionCategory,
        educationalFeedback: f.educationalFeedback,
        conceptId: f.conceptId,
        mistakeDescription: f.mistakeTag
          ? `Identified error pattern: ${f.mistakeTag.replace(/_/g, " ")}`
          : undefined,
      })),
      mistakeHint,
    });
  } catch (err: any) {
    console.error("Error in /api/practice/submit:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

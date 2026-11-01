import { NextRequest, NextResponse } from "next/server";
import {
  evaluatePracticeSubmission,
  calculateNextDifficulty,
  updateMastery,
} from "@/lib/adaptive";
import { verifySessionToken } from "@/lib/server/session";
import {
  isRateLimited,
  isDuplicateSubmission,
  markSubmissionCompleted,
} from "@/lib/server/rate-limit";

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

    // Verify cryptographic session token
    const verification = verifySessionToken(token, studentId, "practice");
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

    const nextDiff = calculateNextDifficulty(
      (practiceResult.updatedDifficulty || currentDifficulty) as 1 | 2 | 3,
      newConsecutiveCorrect,
      newConsecutiveIncorrect
    );

    // Generate readable mistake hint if incorrect
    let mistakeHint: string | undefined;
    const wrongFb = practiceResult.feedback.find((f) => !f.isCorrect);
    if (wrongFb && wrongFb.mistakeTag) {
      mistakeHint = `Error pattern noticed: ${wrongFb.mistakeTag.replace(/_/g, " ")}. Try checking signs and operations carefully.`;
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

import { NextRequest, NextResponse } from "next/server";
import { evaluateChapterTest } from "@/lib/adaptive";
import { getConceptById, getQuestionById } from "@/lib/curriculum";
import { evaluateAwardedXp } from "@/lib/server/xp-evaluator";
import { verifySessionToken } from "@/lib/server/session";
import {
  isRateLimited,
  isDuplicateSubmission,
  markSubmissionCompleted,
} from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, chapterId, studentId, answers } = body;

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

    if (!chapterId || typeof chapterId !== "string") {
      return NextResponse.json(
        { error: "Missing chapterId" },
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
    const verification = verifySessionToken(token, studentId, "test");
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: verification.error || "Unauthorized test session" },
        { status: 401 }
      );
    }

    const { sessionId, questionIds } = verification.payload;

    if (verification.payload.targetId !== chapterId) {
      return NextResponse.json(
        { error: "Session chapter mismatch" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for") || studentId;
    if (isRateLimited(`test_sub_${clientIp}`, 15, 60000)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please wait." },
        { status: 429 }
      );
    }

    // Duplicate check
    if (isDuplicateSubmission(sessionId)) {
      return NextResponse.json(
        { error: "Duplicate submission: test attempt already graded." },
        { status: 409 }
      );
    }

    // Incomplete submission check
    const answeredKeys = Object.keys(answers).filter(
      (k) => typeof answers[k] === "string" && answers[k].trim() !== ""
    );

    const missingQuestions = questionIds.filter((qid) => !answeredKeys.includes(qid));
    if (missingQuestions.length > 0) {
      return NextResponse.json(
        {
          error: "Incomplete submission: all chapter test questions must be answered.",
          missingCount: missingQuestions.length,
        },
        { status: 400 }
      );
    }

    markSubmissionCompleted(sessionId);

    // Evaluate pure chapter test logic on the server
    const testResult = evaluateChapterTest(chapterId, answers);

    const strongConcepts = testResult.strongConcepts.map((cId) => {
      const c = getConceptById(cId);
      const data = testResult.conceptBreakdown[cId] || { correct: 0, total: 0, scorePercentage: 0 };
      return {
        conceptId: cId,
        conceptName: c ? c.name.en : cId,
        score: data.correct,
        total: data.total,
        percentage: data.scorePercentage,
        category: "mastered" as const,
      };
    });

    const weakConcepts = testResult.weakConcepts.map((cId) => {
      const c = getConceptById(cId);
      const data = testResult.conceptBreakdown[cId] || { correct: 0, total: 0, scorePercentage: 0 };
      return {
        conceptId: cId,
        conceptName: c ? c.name.en : cId,
        score: data.correct,
        total: data.total,
        percentage: data.scorePercentage,
        category: "needs_attention" as const,
      };
    });

    const nextSteps = testResult.passed
      ? ["All concepts passed! You are ready to proceed to the next chapter."]
      : [
          `Review the foundational concepts: ${testResult.weakConcepts.join(", ")} before retesting.`,
        ];

    // Server-derived XP evaluation
    const xpEvaluation = evaluateAwardedXp({
      eventType: "test",
      evaluatedQuestions: Object.entries(answers).map(([qid, optId]) => {
        const q = getQuestionById(qid);
        const isCorrect = q ? q.correctAnswer === optId : false;
        return {
          questionId: qid,
          isCorrect,
          difficulty: (q?.difficulty as 1 | 2 | 3) || 1,
        };
      }),
      gapResolved: false,
      previousQuestionHistory: body.studentHistory?.questionHistory || {},
      todayXpEarned: body.studentHistory?.todayXpEarned || 0,
      lastActiveIstDate: body.studentHistory?.lastActiveIstDate,
    });

    // Return graded output to client
    return NextResponse.json({
      score: testResult.correctCount,
      total: testResult.totalQuestions,
      percentage: testResult.scorePercentage,
      passed: testResult.passed,
      strongConcepts,
      weakConcepts,
      nextSteps,
      xpAwarded: xpEvaluation.awardedXp,
      grossXp: xpEvaluation.grossXp,
      isCapped: xpEvaluation.isCapped,
      newDailyTotal: xpEvaluation.newDailyTotal,
      xpBreakdown: xpEvaluation.breakdown,
      updatedQuestionHistory: xpEvaluation.updatedQuestionHistory,
      feedback: Object.entries(answers).map(([qid, optId]) => ({
        questionId: qid,
        chosenOption: optId,
      })),
    });
  } catch (err: any) {
    console.error("Error in /api/test/submit:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

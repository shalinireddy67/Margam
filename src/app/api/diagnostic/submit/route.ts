import { NextRequest, NextResponse } from "next/server";
import { evaluateChapterDiagnostic, getConfirmationQuestions } from "@/lib/adaptive";
import { sanitizeQuestion } from "@/lib/server/questions";
import { verifySessionToken, createSignedSession } from "@/lib/server/session";
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
    const verification = verifySessionToken(token, studentId, "diagnostic");
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: verification.error || "Unauthorized session" },
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

    // Rate limiting check on submit
    const clientIp = req.headers.get("x-forwarded-for") || studentId;
    if (isRateLimited(`diag_sub_${clientIp}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please wait before submitting again." },
        { status: 429 }
      );
    }

    // Reject duplicate submissions
    if (isDuplicateSubmission(sessionId)) {
      return NextResponse.json(
        { error: "Duplicate submission: this diagnostic attempt has already been submitted." },
        { status: 409 }
      );
    }

    // Reject incomplete submissions: verify every question in session was answered
    const answeredKeys = Object.keys(answers).filter(
      (k) => typeof answers[k] === "string" && answers[k].trim() !== ""
    );

    const missingQuestions = questionIds.filter((qid) => !answeredKeys.includes(qid));
    if (missingQuestions.length > 0) {
      return NextResponse.json(
        {
          error: "Incomplete submission: all diagnostic questions must be answered before submitting.",
          missingCount: missingQuestions.length,
        },
        { status: 400 }
      );
    }

    // Mark session as completed to prevent double-grading
    markSubmissionCompleted(sessionId);

    // Run pure grading and ranking engine on the server
    const diagResult = evaluateChapterDiagnostic(chapterId, answers, 3);

    // Prepare confirmation questions if gap analysis requires verification
    let confirmationQuestions: any[] = [];
    let confirmationToken: string | null = null;

    if (
      diagResult.gapAnalysis &&
      diagResult.gapAnalysis.confirmed &&
      diagResult.gapAnalysis.rootConceptId
    ) {
      const routing =
        diagResult.gapAnalysis.routing ||
        (diagResult.gapAnalysis.confidence === "low"
          ? "confirmation_only"
          : "gap_card");

      if (routing === "confirmation_only") {
        const rawConfirmQs = getConfirmationQuestions(
          diagResult.gapAnalysis.rootConceptId,
          2
        );
        if (rawConfirmQs.length > 0) {
          confirmationQuestions = rawConfirmQs.map(sanitizeQuestion);
          const confirmSession = createSignedSession(
            "confirm",
            diagResult.gapAnalysis.rootConceptId,
            studentId,
            confirmationQuestions.map((q) => q.id),
            15 * 60 * 1000
          );
          confirmationToken = confirmSession.token;
        }
      }
    }

    const passed = diagResult.scorePercentage >= 70;

    // Return graded output to client (no answer keys or distractor tags returned in questions)
    return NextResponse.json({
      score: diagResult.correctCount,
      total: diagResult.totalQuestions,
      percentage: diagResult.scorePercentage,
      passed,
      mistakeTags: diagResult.mistakeTags,
      gapAnalysis: diagResult.gapAnalysis,
      feedback: diagResult.feedback.map((f) => ({
        questionId: f.questionId,
        isCorrect: f.isCorrect,
        chosenAnswer: f.selectedOption,
        tag: f.mistakeTag,
      })),
      confirmationQuestions,
      confirmationToken,
    });
  } catch (err: any) {
    console.error("Error in /api/diagnostic/submit:", err);
    return NextResponse.json(
      { error: "Internal server error during evaluation" },
      { status: 500 }
    );
  }
}

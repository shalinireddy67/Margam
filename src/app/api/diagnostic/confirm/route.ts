import { NextRequest, NextResponse } from "next/server";
import { getConceptQuestions } from "@/lib/server/questions";
import { verifySessionToken } from "@/lib/server/session";
import { getAuthenticatedUser } from "@/lib/server/auth";
import {
  isRateLimited,
  isDuplicateSubmission,
  markSubmissionCompleted,
} from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.confirmationToken || body.token;
    const studentId = body.studentId;
    const answers = body.answers;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid confirmation token" },
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

    // Verify confirmation session token
    const verification = verifySessionToken(token, effectiveStudentId, "confirm");
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: verification.error || "Unauthorized confirmation session" },
        { status: 401 }
      );
    }

    const { sessionId, targetId: rootConceptId, questionIds } = verification.payload;

    // Rate limit check
    const clientIp = req.headers.get("x-forwarded-for") || effectiveStudentId || "client";
    if (isRateLimited(`diag_confirm_${clientIp}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many confirmation attempts. Please wait." },
        { status: 429 }
      );
    }

    // Duplicate check
    if (isDuplicateSubmission(sessionId)) {
      return NextResponse.json(
        { error: "Duplicate submission: confirmation has already been evaluated." },
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
          error: "Incomplete submission: all check questions must be answered.",
          missingCount: missingQuestions.length,
        },
        { status: 400 }
      );
    }

    markSubmissionCompleted(sessionId);

    // Grade on server against actual concept questions
    const conceptQuestions = getConceptQuestions(rootConceptId);
    const questionsMap = new Map(conceptQuestions.map((q) => [q.id, q]));

    let allCorrect = true;
    for (const qid of questionIds) {
      const q = questionsMap.get(qid);
      const studentAns = answers[qid];
      if (!q || studentAns !== q.correctAnswer) {
        allCorrect = false;
        break;
      }
    }

    return NextResponse.json({
      status: allCorrect ? "passed" : "failed",
      allCorrect,
      rootConceptId,
    });
  } catch (err: any) {
    console.error("Error in /api/diagnostic/confirm:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

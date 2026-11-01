import { NextRequest, NextResponse } from "next/server";
import { generateChapterDiagnostic } from "@/lib/adaptive";
import { sanitizeQuestion } from "@/lib/server/questions";
import { createSignedSession } from "@/lib/server/session";
import { isRateLimited } from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chapterId, studentId } = body;

    if (!chapterId || typeof chapterId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing chapterId" },
        { status: 400 }
      );
    }

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing studentId" },
        { status: 400 }
      );
    }

    // Rate-limiting check
    const clientIp = req.headers.get("x-forwarded-for") || studentId;
    if (isRateLimited(`diag_start_${clientIp}`, 30, 60000)) {
      return NextResponse.json(
        { error: "Too many diagnostic requests. Please try again later." },
        { status: 429 }
      );
    }

    // Generate chapter diagnostic questions
    const { questions, shortfall } = generateChapterDiagnostic(chapterId, 6);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No diagnostic questions available for this chapter" },
        { status: 404 }
      );
    }

    // Sanitize questions: strip correctAnswer and all distractor mistake tags
    const sanitizedQuestions = questions.map(sanitizeQuestion);
    const questionIds = sanitizedQuestions.map((q) => q.id);

    // Issue signed, short-lived session token (valid for 30 minutes)
    const session = createSignedSession(
      "diagnostic",
      chapterId,
      studentId,
      questionIds,
      30 * 60 * 1000
    );

    return NextResponse.json({
      sessionId: session.sessionId,
      token: session.token,
      expiresAt: session.expiresAt,
      chapterId,
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length,
      shortfall,
    });
  } catch (err: any) {
    console.error("Error in /api/diagnostic/start:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

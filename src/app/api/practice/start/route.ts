import { NextRequest, NextResponse } from "next/server";
import { selectPracticeQuestions } from "@/lib/adaptive";
import { sanitizeQuestion } from "@/lib/server/questions";
import { createSignedSession } from "@/lib/server/session";
import { isRateLimited } from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conceptId, studentId, count = 3 } = body;

    if (!conceptId || typeof conceptId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing conceptId" },
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
    if (isRateLimited(`prac_start_${clientIp}`, 30, 60000)) {
      return NextResponse.json(
        { error: "Too many practice requests. Please slow down." },
        { status: 429 }
      );
    }

    // Select practice questions
    const { questions, shortfall } = selectPracticeQuestions(conceptId, count);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No practice questions available for this concept" },
        { status: 404 }
      );
    }

    // Strip answers and mistake tags
    const sanitizedQuestions = questions.map(sanitizeQuestion);
    const questionIds = sanitizedQuestions.map((q) => q.id);

    // Issue signed session token
    const session = createSignedSession(
      "practice",
      conceptId,
      studentId,
      questionIds,
      30 * 60 * 1000
    );

    return NextResponse.json({
      sessionId: session.sessionId,
      token: session.token,
      expiresAt: session.expiresAt,
      conceptId,
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length,
      shortfall,
    });
  } catch (err: any) {
    console.error("Error in /api/practice/start:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

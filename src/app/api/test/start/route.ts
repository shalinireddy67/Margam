import { NextRequest, NextResponse } from "next/server";
import { generateChapterTest } from "@/lib/adaptive";
import { sanitizeQuestion } from "@/lib/server/questions";
import { createSignedSession } from "@/lib/server/session";
import { isRateLimited } from "@/lib/server/rate-limit";
import { getAuthenticatedUser } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chapterId, studentId, excludeQuestionIds, offset, seed } = body;

    if (!chapterId || typeof chapterId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing chapterId" },
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

    if (!effectiveStudentId || typeof effectiveStudentId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing studentId" },
        { status: 400 }
      );
    }

    // Rate-limiting check
    const clientIp = req.headers.get("x-forwarded-for") || effectiveStudentId;
    if (isRateLimited(`test_start_${clientIp}`, 30, 60000)) {
      return NextResponse.json(
        { error: "Too many test requests. Please slow down." },
        { status: 429 }
      );
    }

    // Generate chapter test questions using blueprint
    const { questions, conceptAllocation, shortfall } = generateChapterTest(chapterId, 10, { excludeQuestionIds, offset, seed });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No test questions available for this chapter" },
        { status: 404 }
      );
    }

    // Strip answers and mistake tags
    const sanitizedQuestions = questions.map(sanitizeQuestion);
    const questionIds = sanitizedQuestions.map((q) => q.id);

    // Issue signed session token
    const session = createSignedSession(
      "test",
      chapterId,
      effectiveStudentId,
      questionIds,
      45 * 60 * 1000 // 45 minutes for full chapter test
    );

    return NextResponse.json({
      sessionId: session.sessionId,
      token: session.token,
      expiresAt: session.expiresAt,
      chapterId,
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length,
      conceptAllocation,
      shortfall,
    });
  } catch (err: any) {
    console.error("Error in /api/test/start:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

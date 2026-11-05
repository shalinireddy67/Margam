import { NextRequest, NextResponse } from "next/server";
import { generatePersonalizedWorksheet } from "@/lib/adaptive";
import { sanitizeQuestion } from "@/lib/server/questions";
import { createSignedSession } from "@/lib/server/session";
import { isRateLimited } from "@/lib/server/rate-limit";
import { getAuthenticatedUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conceptId, studentId, count = 5, profile } = body;

    if (!conceptId || typeof conceptId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing conceptId" },
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
    if (isRateLimited(`prac_start_${clientIp}`, 30, 60000)) {
      return NextResponse.json(
        { error: "Too many practice requests. Please slow down." },
        { status: 429 }
      );
    }

    // Generate personalized worksheet based on student gaps, mastery, and difficulty
    const targetCount = typeof count === "number" && count >= 3 && count <= 10 ? count : 5;
    const worksheet = generatePersonalizedWorksheet(conceptId, profile, targetCount);

    if (worksheet.questions.length === 0) {
      return NextResponse.json(
        { error: "No practice questions available for this concept" },
        { status: 404 }
      );
    }

    // Strip answers and mistake tags
    const sanitizedQuestions = worksheet.questions.map(sanitizeQuestion);
    const questionIds = sanitizedQuestions.map((q) => q.id);

    // Issue signed session token
    const session = createSignedSession(
      "practice",
      conceptId,
      effectiveStudentId,
      questionIds,
      30 * 60 * 1000
    );

    return NextResponse.json({
      sessionId: session.sessionId,
      token: session.token,
      expiresAt: session.expiresAt,
      conceptId,
      worksheetTitle: worksheet.worksheetTitle,
      targetDifficulty: worksheet.targetDifficulty,
      isPersonalized: worksheet.isPersonalized,
      personalizedReason: worksheet.personalizedReason,
      prerequisiteConceptsIncluded: worksheet.prerequisiteConceptsIncluded,
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length,
      shortfall: worksheet.shortfall,
    });
  } catch (err: any) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE" || (err as any)?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error in /api/practice/start:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

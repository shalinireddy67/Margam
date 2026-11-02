import crypto from "crypto";
import { getSessionSecret } from "@/lib/env";

export interface SessionPayload {
  sessionId: string;
  type: "diagnostic" | "practice" | "test" | "confirm";
  targetId: string; // chapterId or conceptId
  studentId: string;
  questionIds: string[];
  issuedAt: number;
  expiresAt: number;
  metadata?: Record<string, any>;
}

/**
 * Creates a signed, short-lived session token (valid for 30 minutes by default).
 */
export function createSignedSession(
  type: "diagnostic" | "practice" | "test" | "confirm",
  targetId: string,
  studentId: string,
  questionIds: string[],
  ttlMs = 30 * 60 * 1000,
  metadata?: Record<string, any>
): { sessionId: string; token: string; expiresAt: number } {
  const sessionId = `sess_${crypto.randomUUID()}`;
  const now = Date.now();
  const expiresAt = now + ttlMs;

  const payload: SessionPayload = {
    sessionId,
    type,
    targetId,
    studentId,
    questionIds,
    issuedAt: now,
    expiresAt,
    metadata,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return {
    sessionId,
    token: `${payloadB64}.${signature}`,
    expiresAt,
  };
}

/**
 * Verifies a signed session token.
 * Validates cryptographic signature, expiry, and student matching.
 */
export function verifySessionToken(
  token: string,
  expectedStudentId?: string,
  expectedType?: "diagnostic" | "practice" | "test" | "confirm"
): { valid: boolean; payload?: SessionPayload; error?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing or malformed session token" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid token structure" };
  }

  const [payloadB64, signature] = parts;

  // Verify HMAC signature in constant time
  const secret = getSessionSecret();
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  if (
    signature.length !== expectedSig.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
  ) {
    return { valid: false, error: "Invalid session signature" };
  }

  try {
    const jsonStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(jsonStr);

    // Expiry check
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: "Session has expired" };
    }

    // Student identity check
    if (expectedStudentId && payload.studentId !== expectedStudentId) {
      return {
        valid: false,
        error: "Session does not match the active student",
      };
    }

    // Session type check
    if (expectedType && payload.type !== expectedType) {
      return {
        valid: false,
        error: `Invalid session type: expected ${expectedType}, found ${payload.type}`,
      };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Malformed session payload" };
  }
}

import crypto from "crypto";
import { getSessionSecret } from "@/lib/env";

/**
 * Signs a session payload with HMAC-SHA256 for secure, tamper-proof session tokens.
 */
export function signSessionPayload(payload: Record<string, any>): string {
  const secret = getSessionSecret();
  const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataStr)
    .digest("base64url");
  return `${dataStr}.${hmac}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed session token.
 * Returns null if signature is invalid or token is tampered.
 */
export function verifySignedSessionPayload<T = Record<string, any>>(
  token: string
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;
    const secret = getSessionSecret();
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(dataStr)
      .digest("base64url");

    const sigBuf = Buffer.from(signature, "utf-8");
    const expBuf = Buffer.from(expectedHmac, "utf-8");

    if (
      sigBuf.length !== expBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expBuf)
    ) {
      return null;
    }

    const json = Buffer.from(dataStr, "base64url").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

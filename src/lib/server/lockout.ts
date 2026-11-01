/**
 * Margam Server-Enforced Login Lockout
 * Enforces security policy: Lock a login for 15 minutes after 5 failures.
 * Tracks failures by normalized account identifier (username/email) and IP.
 */

interface FailureRecord {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

// In-memory lockout registry on the server
const lockoutStore = new Map<string, FailureRecord>();

function getKeys(identifier: string, ip?: string): string[] {
  const normId = identifier.trim().toLowerCase();
  const keys = [`id:${normId}`];
  if (ip && ip.trim()) {
    keys.push(`ip:${ip.trim()}`);
  }
  return keys;
}

/**
 * Checks if an identifier or IP is currently locked out.
 */
export function checkLockout(
  identifier: string,
  ip?: string
): { locked: boolean; remainingMs: number; remainingMinutes: number; attempts: number } {
  const now = Date.now();
  const keys = getKeys(identifier, ip);

  for (const key of keys) {
    const record = lockoutStore.get(key);
    if (!record) continue;

    if (record.lockedUntil && record.lockedUntil > now) {
      const remainingMs = record.lockedUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return {
        locked: true,
        remainingMs,
        remainingMinutes,
        attempts: record.count,
      };
    }

    // Lockout expired: clean up
    if (record.lockedUntil && record.lockedUntil <= now) {
      lockoutStore.delete(key);
    }
  }

  const primaryRecord = lockoutStore.get(`id:${identifier.trim().toLowerCase()}`);
  return {
    locked: false,
    remainingMs: 0,
    remainingMinutes: 0,
    attempts: primaryRecord ? primaryRecord.count : 0,
  };
}

/**
 * Records a failed login attempt and locks account for 15 minutes upon reaching 5 failures.
 */
export function recordFailedAttempt(
  identifier: string,
  ip?: string
): { locked: boolean; remainingMs: number; attempts: number } {
  const now = Date.now();
  const keys = getKeys(identifier, ip);
  let isNowLocked = false;
  let maxCount = 0;

  for (const key of keys) {
    let record = lockoutStore.get(key);
    if (!record || (record.lockedUntil && record.lockedUntil <= now)) {
      record = { count: 0, lockedUntil: null, lastAttemptAt: now };
    }

    record.count += 1;
    record.lastAttemptAt = now;
    if (record.count > maxCount) {
      maxCount = record.count;
    }

    if (record.count >= MAX_FAILURES) {
      record.lockedUntil = now + LOCKOUT_MS;
      isNowLocked = true;
    }

    lockoutStore.set(key, record);
  }

  return {
    locked: isNowLocked,
    remainingMs: isNowLocked ? LOCKOUT_MS : 0,
    attempts: maxCount,
  };
}

/**
 * Resets failed attempts upon a successful login.
 */
export function resetLockout(identifier: string, ip?: string): void {
  const keys = getKeys(identifier, ip);
  for (const key of keys) {
    lockoutStore.delete(key);
  }
}

/**
 * For testing and diagnostic resets.
 */
export function clearAllLockouts(): void {
  lockoutStore.clear();
}

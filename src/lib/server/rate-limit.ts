/**
 * In-memory sliding window rate-limiter and duplicate submission tracker.
 */

interface RateRecord {
  timestamps: number[];
}

const rateMap = new Map<string, RateRecord>();
const completedSessions = new Set<string>();

/**
 * Checks if a key (e.g. IP or studentId) has exceeded the rate limit.
 * Defaults to 15 requests per 60 seconds per client.
 */
export function isRateLimited(
  key: string,
  limit = 15,
  windowMs = 60 * 1000
): boolean {
  const now = Date.now();
  let record = rateMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateMap.set(key, record);
  }

  // Filter timestamps within the window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return true;
  }

  record.timestamps.push(now);
  return false;
}

/**
 * Checks if a session has already been submitted and graded.
 */
export function isDuplicateSubmission(sessionId: string): boolean {
  return completedSessions.has(sessionId);
}

/**
 * Marks a session as completed to prevent duplicate submissions.
 */
export function markSubmissionCompleted(sessionId: string): void {
  completedSessions.add(sessionId);

  // Avoid memory unbounded growth by periodically truncating if large
  if (completedSessions.size > 10000) {
    const arr = Array.from(completedSessions);
    // Keep the most recent 5000
    for (let i = 0; i < arr.length - 5000; i++) {
      completedSessions.delete(arr[i]);
    }
  }
}

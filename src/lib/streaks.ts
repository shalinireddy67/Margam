/**
 * Margam Daily Streak Engine
 * Timezone-aware streak tracking (Indian Standard Time, UTC+5:30),
 * weekly streak-freeze tokens, and friendly encouragement.
 */

import { LearnerProfile } from "./types";
import { getIstDateString, XP_CONFIG } from "./xp-config";

export interface StreakEvaluationResult {
  updatedStreak: {
    current: number;
    longest: number;
    lastActiveDate: string;
    freezeTokens: number;
    lastFreezeEarnedDate?: string;
  };
  streakIncreased: boolean;
  freezeUsed: boolean;
  message: string;
}

export type StreakUpdateResult = StreakEvaluationResult;

/**
 * Calculates day difference between two YYYY-MM-DD date strings.
 */
function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + "T00:00:00Z");
  const d2 = new Date(dateStr2 + "T00:00:00Z");
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Evaluates and records daily activity on the learner's profile using IST date boundaries.
 */
export function evaluateDailyStreak(
  currentStreakState?: LearnerProfile["streak"],
  referenceDate = new Date()
): StreakEvaluationResult {
  const todayIst = getIstDateString(referenceDate);

  const existing = currentStreakState || {
    current: 0,
    longest: 0,
    lastActiveDate: "",
    freezeTokens: 1, // Start every new learner with 1 friendly freeze token
  };

  let current = existing.current || 0;
  let longest = existing.longest || current;
  let freezeTokens = existing.freezeTokens ?? 1;
  let lastFreezeEarnedDate = existing.lastFreezeEarnedDate;
  let streakIncreased = false;
  let freezeUsed = false;
  let message = "Welcome back to your math quest!";

  if (!existing.lastActiveDate) {
    // Brand new learner first activity
    current = 1;
    longest = 1;
    streakIncreased = true;
    message = "First day of your streak! 🔥 Your companion is cheering for you!";
  } else if (existing.lastActiveDate === todayIst) {
    // Already practiced today; maintain streak
    message = "You have already secured today's streak flame! 🔥";
  } else {
    const diff = getDaysDifference(existing.lastActiveDate, todayIst);

    if (diff === 1) {
      // Consecutive day!
      current += 1;
      streakIncreased = true;
      if (current > longest) longest = current;
      message = `${current}-Day Streak! 🔥 Your companion celebrates your victory!`;

      // Check if weekly freeze token milestone is reached (every 7 streak days)
      if (current % XP_CONFIG.STREAK_FREEZE_REWARD_DAYS === 0 && freezeTokens < XP_CONFIG.MAX_STREAK_FREEZES) {
        freezeTokens += 1;
        lastFreezeEarnedDate = todayIst;
        message += " 🛡️ You earned a Streak Freeze Token!";
      }
    } else if (diff === 2 && freezeTokens > 0) {
      // Missed exactly 1 day, but learner has a streak freeze token!
      freezeTokens -= 1;
      freezeUsed = true;
      current += 1; // Saved!
      if (current > longest) longest = current;
      message = `🛡️ Streak Freeze protected your flame! You're on day ${current}!`;
    } else {
      // Reset streak gently without punishment
      current = 1;
      message = "Welcome back — starting fresh with Day 1! ✨";
    }
  }

  return {
    updatedStreak: {
      current,
      longest,
      lastActiveDate: todayIst,
      freezeTokens,
      lastFreezeEarnedDate,
    },
    streakIncreased,
    freezeUsed,
    message,
  };
}

export const recordDailyActivity = evaluateDailyStreak;

/**
 * Returns a gentle, positive reminder message if the student has not yet practiced today.
 */
export function getStreakReminder(streakState?: LearnerProfile["streak"]): {
  needsPracticeToday: boolean;
  reminderText: string;
} {
  const todayIst = getIstDateString();
  const lastActive = streakState?.lastActiveDate;

  if (!lastActive || lastActive !== todayIst) {
    const currentStreak = streakState?.current || 0;
    if (currentStreak > 0) {
      return {
        needsPracticeToday: true,
        reminderText: `Play 1 lesson today to keep your ${currentStreak}-day flame alive 🔥`,
      };
    }
    return {
      needsPracticeToday: true,
      reminderText: "Ready to learn! Solve today's quest to ignite your streak ✨",
    };
  }

  return {
    needsPracticeToday: false,
    reminderText: "Today's flame is burning bright! Great job practicing today 🔥",
  };
}

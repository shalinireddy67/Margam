/**
 * Margam Gamification Orchestrator
 * Coordinates XP awards, level calculations, streaks, and badge updates on LearnerProfile.
 */

import { LearnerProfile } from "./types";
import { getLevelProgress, getIstDateString } from "./xp-config";
import { evaluateDailyStreak } from "./streaks";
import { evaluateStudentBadges } from "./badges";

export interface ApplyXpResult {
  updatedProfile: LearnerProfile;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  newRank: string;
  newBadgesUnlocked: string[];
  streakResult: {
    current: number;
    streakIncreased: boolean;
    freezeUsed: boolean;
    message: string;
  };
}

export function applyAwardedXpToProfile(
  profile: LearnerProfile,
  awardedXp: number,
  newDailyTotal: number,
  updatedQuestionHistory?: Record<string, string>,
  now = new Date()
): ApplyXpResult {
  const currentTotalXp = Math.max(0, profile.xp || 0);
  const oldLevel = getLevelProgress(currentTotalXp).level;

  const safeAwarded = Math.max(0, awardedXp || 0);
  const newTotalXp = currentTotalXp + safeAwarded;
  const { level: newLevel, rank } = getLevelProgress(newTotalXp);
  const leveledUp = newLevel > oldLevel;

  const todayIst = getIstDateString(now);

  // Evaluate streak based on this activity
  const streakEval = evaluateDailyStreak(profile.streak, now);

  // Merge question cooldown / history
  const mergedHistory: Record<string, string> = {
    ...(profile.answeredQuestionsHistory || {}),
    ...(updatedQuestionHistory || {}),
  };

  const oldUnlockedBadges = new Set(profile.unlockedBadgeIds || []);

  const updatedCandidate: LearnerProfile = {
    ...profile,
    xp: newTotalXp,
    level: newLevel,
    rank: rank.name,
    dailyXp: {
      date: todayIst,
      xp: newDailyTotal,
    },
    streak: streakEval.updatedStreak,
    answeredQuestionsHistory: mergedHistory,
    lastActiveAt: now.toISOString(),
  };

  // Evaluate badges on the updated profile state
  const evaluatedBadges = evaluateStudentBadges(updatedCandidate);
  const newlyUnlocked: string[] = [];
  const allUnlockedIds: string[] = [];

  for (const b of evaluatedBadges) {
    if (b.unlocked) {
      allUnlockedIds.push(b.id);
      if (!oldUnlockedBadges.has(b.id)) {
        newlyUnlocked.push(b.id);
      }
    }
  }

  updatedCandidate.unlockedBadgeIds = allUnlockedIds;

  return {
    updatedProfile: updatedCandidate,
    leveledUp,
    oldLevel,
    newLevel,
    newRank: rank.name,
    newBadgesUnlocked: newlyUnlocked,
    streakResult: {
      current: streakEval.updatedStreak.current,
      streakIncreased: streakEval.streakIncreased,
      freezeUsed: streakEval.freezeUsed,
      message: streakEval.message,
    },
  };
}


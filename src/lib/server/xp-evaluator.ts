/**
 * Server-Side XP Evaluation Engine
 * Pure mathematical derivation of XP from cryptographically validated submission payloads.
 *
 * Enforces:
 * - 10 * difficulty per correct answer
 * - 24-hour question cooldown (anti-grind protection)
 * - Completion bonuses (Diagnostic +30, Test +40, Root Gap Fixed +50)
 * - Strict Daily XP Cap of 300 XP
 * - NEVER trusts any client-provided XP values
 */

import { XP_CONFIG, getIstDateString } from "../xp-config";

export interface EvaluatedQuestionItem {
  questionId: string;
  isCorrect: boolean;
  difficulty?: number;
}

export interface XpEvaluationInput {
  eventType: "diagnostic" | "practice" | "test";
  evaluatedQuestions: EvaluatedQuestionItem[];
  gapResolved?: boolean;
  previousQuestionHistory?: Record<string, string>; // questionId -> timestamp
  todayXpEarned?: number;
  lastActiveIstDate?: string;
}

export interface XpEvaluationOutput {
  awardedXp: number;
  grossXp: number;
  isCapped: boolean;
  cappedDeduction: number;
  newDailyTotal: number;
  updatedQuestionHistory: Record<string, string>;
  breakdown: {
    correctXp: number;
    firstTryXp: number;
    completionBonus: number;
    gapBonus: number;
  };
}

export function evaluateAwardedXp(input: XpEvaluationInput, now = new Date()): XpEvaluationOutput {
  const todayIst = getIstDateString(now);
  const nowMs = now.getTime();
  const cooldownMs = XP_CONFIG.QUESTION_COOLDOWN_HOURS * 3600 * 1000;

  // Reset daily XP count if new day in IST
  const baseTodayXp =
    input.lastActiveIstDate === todayIst ? Math.max(0, input.todayXpEarned || 0) : 0;

  let correctXp = 0;
  let firstTryXp = 0;
  const history = { ...(input.previousQuestionHistory || {}) };

  for (const q of input.evaluatedQuestions) {
    if (!q.isCorrect) continue;

    const lastAnswered = history[q.questionId];
    const isUnderCooldown =
      lastAnswered && nowMs - new Date(lastAnswered).getTime() < cooldownMs;

    if (!isUnderCooldown) {
      const diff = q.difficulty === 2 ? 2 : q.difficulty === 3 ? 3 : 1;
      correctXp += XP_CONFIG.PER_CORRECT_ANSWER_BASE * diff;

      if (!lastAnswered) {
        firstTryXp += XP_CONFIG.FIRST_TRY_BONUS;
      }

      // Record timestamp for 24h anti-farm cooldown
      history[q.questionId] = now.toISOString();
    }
  }

  // Completion bonuses
  let completionBonus = 0;
  if (input.eventType === "diagnostic") {
    completionBonus = XP_CONFIG.DIAGNOSTIC_COMPLETION;
  } else if (input.eventType === "test") {
    completionBonus = XP_CONFIG.CHAPTER_TEST_COMPLETION;
  }

  // Root gap resolution bonus
  let gapBonus = 0;
  if (input.gapResolved) {
    gapBonus = XP_CONFIG.ROOT_GAP_RESOLVED;
  }

  const grossXp = correctXp + firstTryXp + completionBonus + gapBonus;

  // Apply strict Daily Cap (300 XP)
  const remainingDailyAllowance = Math.max(0, XP_CONFIG.DAILY_XP_CAP - baseTodayXp);
  const awardedXp = Math.min(grossXp, remainingDailyAllowance);
  const isCapped = grossXp > remainingDailyAllowance;
  const cappedDeduction = grossXp - awardedXp;
  const newDailyTotal = baseTodayXp + awardedXp;

  return {
    awardedXp,
    grossXp,
    isCapped,
    cappedDeduction,
    newDailyTotal,
    updatedQuestionHistory: history,
    breakdown: {
      correctXp,
      firstTryXp,
      completionBonus,
      gapBonus,
    },
  };
}


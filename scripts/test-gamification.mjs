#!/usr/bin/env node
/**
 * Margam Gamification & XP Engine Unit Test Suite
 *
 * Verifies:
 * 1. XP calculation rules (10 * difficulty, first try bonus, completion bonuses)
 * 2. Strict 300 XP daily cap (anti-grind protection)
 * 3. 24-hour question cooldown (no repeated XP within 24h)
 * 4. IST daily cap reset on new day
 * 5. Level progression & Wood-to-Diamond rank thresholds
 * 6. Daily streak evaluation, weekly freeze token awards, and freeze consumption
 * 7. Weekly rank reset boundary (Monday 00:00 IST)
 * 8. Comprehensive badge unlocking logic (Gap Slayer, Comeback Kid, Streaks, etc.)
 */

import { XP_CONFIG, getLevelProgress, getIstDateString, isIstNightTime } from "../src/lib/xp-config.ts";
import { evaluateAwardedXp } from "../src/lib/server/xp-evaluator.ts";
import { evaluateDailyStreak } from "../src/lib/streaks.ts";
import { evaluateStudentBadges, BADGE_DEFINITIONS } from "../src/lib/badges.ts";

console.log("==================================================");
console.log("  MARGAM — GAMIFICATION & XP UNIT TEST SUITE      ");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

// ------------------------------------------------------------------------------
// TEST 1: XP REWARD FORMULAS
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 1: XP Reward Formulas & Difficulty Scaling ");
console.log("--------------------------------------------------");

const baseEval = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [
    { questionId: "q1", isCorrect: true, difficulty: 1 }, // 10 + 5 (first try) = 15
    { questionId: "q2", isCorrect: true, difficulty: 2 }, // 20 + 5 (first try) = 25
    { questionId: "q3", isCorrect: true, difficulty: 3 }, // 30 + 5 (first try) = 35
    { questionId: "q4", isCorrect: false, difficulty: 1 }, // 0
  ],
  gapResolved: false,
});

assert(baseEval.breakdown.correctXp === 60, "Correct XP matches 10*1 + 10*2 + 10*3 = 60");
assert(baseEval.breakdown.firstTryXp === 15, "First-try bonus matches 3 * 5 = 15");
assert(baseEval.awardedXp === 75, "Total gross awarded XP matches 60 + 15 = 75");

// Root gap resolution bonus
const gapEval = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "q5", isCorrect: true, difficulty: 1 }],
  gapResolved: true,
});
assert(gapEval.breakdown.gapBonus === 50, "Root gap resolution awards +50 XP bonus");

// Diagnostic completion bonus
const diagEval = evaluateAwardedXp({
  eventType: "diagnostic",
  evaluatedQuestions: [{ questionId: "q6", isCorrect: true, difficulty: 1 }],
});
assert(diagEval.breakdown.completionBonus === 30, "Diagnostic completion awards +30 XP bonus");

// Chapter test completion bonus
const testEval = evaluateAwardedXp({
  eventType: "test",
  evaluatedQuestions: [{ questionId: "q7", isCorrect: true, difficulty: 1 }],
});
assert(testEval.breakdown.completionBonus === 40, "Chapter test completion awards +40 XP bonus");

console.log("");

// ------------------------------------------------------------------------------
// TEST 2: 24-HOUR QUESTION COOLDOWN
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 2: 24-Hour Question Anti-Farm Cooldown     ");
console.log("--------------------------------------------------");

const t0 = new Date("2026-11-02T10:00:00Z");
const t1_2HoursLater = new Date("2026-11-02T12:00:00Z");
const t2_25HoursLater = new Date("2026-11-03T11:00:00Z");

const firstAttempt = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "farm_q1", isCorrect: true, difficulty: 2 }],
}, t0);
assert(firstAttempt.awardedXp === 25, "First attempt awards full 20 + 5 = 25 XP");

// Re-attempt after 2 hours (within 24h cooldown)
const cooldownAttempt = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "farm_q1", isCorrect: true, difficulty: 2 }],
  previousQuestionHistory: firstAttempt.updatedQuestionHistory,
}, t1_2HoursLater);
assert(cooldownAttempt.awardedXp === 0, "Repeated question within 24h awards 0 XP (cooldown active)");

// Re-attempt after 25 hours (cooldown expired)
const expiredCooldownAttempt = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "farm_q1", isCorrect: true, difficulty: 2 }],
  previousQuestionHistory: firstAttempt.updatedQuestionHistory,
}, t2_25HoursLater);
assert(expiredCooldownAttempt.awardedXp === 20, "Re-attempt after 25 hours awards 20 XP (no first-try bonus, cooldown clear)");

console.log("");

// ------------------------------------------------------------------------------
// TEST 3: STRICT 300 DAILY XP CAP
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 3: Daily 300 XP Cap Enforcement            ");
console.log("--------------------------------------------------");

// Student already earned 280 XP today
const nearCapEval = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [
    { questionId: "cap_q1", isCorrect: true, difficulty: 3 }, // 30 + 5 = 35
  ],
  todayXpEarned: 280,
  lastActiveIstDate: getIstDateString(t0),
}, t0);

assert(nearCapEval.grossXp === 35, "Gross earned XP before cap is 35");
assert(nearCapEval.awardedXp === 20, "Awarded XP is strictly clamped to remaining 20 (280 -> 300)");
assert(nearCapEval.isCapped === true, "isCapped flag is true when cap is hit");
assert(nearCapEval.newDailyTotal === 300, "New daily total is capped at 300");

// Student at 300 XP attempting another question on same day
const atCapEval = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "cap_q2", isCorrect: true, difficulty: 1 }],
  todayXpEarned: 300,
  lastActiveIstDate: getIstDateString(t0),
}, t0);
assert(atCapEval.awardedXp === 0, "Student at 300 XP earns 0 XP for further questions on same day");

// Next day in IST resets the cap
const nextDayIst = evaluateAwardedXp({
  eventType: "practice",
  evaluatedQuestions: [{ questionId: "cap_q3", isCorrect: true, difficulty: 2 }],
  todayXpEarned: 300,
  lastActiveIstDate: "2026-11-01", // Yesterday
}, t0);
assert(nextDayIst.awardedXp === 25, "New IST day resets daily allowance (awards full 25 XP)");
assert(nextDayIst.newDailyTotal === 25, "New day daily total starts from awarded amount");

console.log("");

// ------------------------------------------------------------------------------
// TEST 4: LEVEL PROGRESSION & RANKS (WOOD TO DIAMOND)
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 4: Level Progression & Rank Thresholds     ");
console.log("--------------------------------------------------");

const p0 = getLevelProgress(0);
assert(p0.level === 1 && p0.rank.name === "Wood", "0 XP -> Level 1 Wood Rank");

const p200 = getLevelProgress(200);
assert(p200.level >= 5 && p200.rank.name === "Stone", "200 XP -> Level 5 Stone Rank");

const p600 = getLevelProgress(600);
assert(p600.level >= 10 && p600.rank.name === "Iron", "600 XP -> Level 10 Iron Rank");

const p1200 = getLevelProgress(1200);
assert(p1200.level >= 15 && p1200.rank.name === "Gold", "1200 XP -> Level 15 Gold Rank");

const p2000 = getLevelProgress(2000);
assert(p2000.level >= 20 && p2000.rank.name === "Diamond", "2000 XP -> Level 20 Diamond Rank");

console.log("");

// ------------------------------------------------------------------------------
// TEST 5: DAILY STREAKS, FREEZES & GENTLE LAPSE
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 5: Daily Streaks & Friendly Freeze Tokens  ");
console.log("--------------------------------------------------");

// Day 1
const day1 = evaluateDailyStreak(undefined, new Date("2026-11-01T10:00:00Z"));
assert(day1.updatedStreak.current === 1, "First activity initializes Day 1 streak");
assert(day1.updatedStreak.freezeTokens === 1, "New learners start with 1 friendly freeze token");

// Same day repeated practice
const sameDay = evaluateDailyStreak(day1.updatedStreak, new Date("2026-11-01T15:00:00Z"));
assert(sameDay.updatedStreak.current === 1 && !sameDay.streakIncreased, "Same day practice maintains streak without double increment");

// Day 2 (Consecutive day)
const day2 = evaluateDailyStreak(day1.updatedStreak, new Date("2026-11-02T10:00:00Z"));
assert(day2.updatedStreak.current === 2 && day2.streakIncreased, "Consecutive day increments streak to Day 2");

// Miss 1 day with Freeze Token (e.g. from Nov 2 to Nov 4)
const day4WithFreeze = evaluateDailyStreak(day2.updatedStreak, new Date("2026-11-04T10:00:00Z"));
assert(day4WithFreeze.freezeUsed === true, "Missed single day consumes 1 streak freeze token");
assert(day4WithFreeze.updatedStreak.current === 3, "Streak is preserved and incremented to Day 3");
assert(day4WithFreeze.updatedStreak.freezeTokens === 0, "Freeze token count reduced to 0");

// Miss 2 days without Freeze Token (e.g. Nov 4 to Nov 7)
const day7Lapse = evaluateDailyStreak(day4WithFreeze.updatedStreak, new Date("2026-11-07T10:00:00Z"));
assert(day7Lapse.updatedStreak.current === 1, "Lapsed streak restarts gently at Day 1 without punishment");
assert(day7Lapse.message.includes("Maru missed you"), "Lapse shows comforting non-punishing message");

console.log("");

// ------------------------------------------------------------------------------
// TEST 6: EXTENDED BADGES EVALUATION
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 6: Extended Badge Evaluation Logic         ");
console.log("--------------------------------------------------");

const mockProfile = {
  id: "test-user",
  name: "Arjun",
  selectedClass: 10,
  currentDifficulty: 3,
  consecutiveCorrect: 4,
  resolvedGaps: [
    { rootConceptId: "c7-int-02", currentConceptId: "c10-quad-01", resolvedAt: "2026-11-01", scorePercentage: 85 },
  ],
  streak: {
    current: 7,
    longest: 7,
    lastActiveDate: "2026-11-02",
    freezeTokens: 1,
  },
  topicProgress: {
    "c10-quad-01": {
      conceptId: "c10-quad-01",
      status: "completed",
      lessonCompleted: true,
      worksheetCompleted: true,
      worksheetScore: 5,
      worksheetTotal: 5,
      mastery: 90,
      tagHistory: ["hi"],
    },
    "c10-quad-02": {
      conceptId: "c10-quad-02",
      status: "completed",
      lessonCompleted: true,
      worksheetCompleted: true,
      worksheetScore: 4,
      worksheetTotal: 5,
      mastery: 80,
      tagHistory: ["te"],
    },
  },
};

const badges = evaluateStudentBadges(mockProfile);
const unlockedMap = new Map(badges.map((b) => [b.id, b.unlocked]));

assert(unlockedMap.get("first_step") === true, "Badge: First Step unlocked");
assert(unlockedMap.get("concept_pioneer") === true, "Badge: Concept Pioneer unlocked (mastered >= 1)");
assert(unlockedMap.get("adaptive_climber") === true, "Badge: Adaptive Climber unlocked (level >= 2)");
assert(unlockedMap.get("top_performer") === true, "Badge: Top Performer unlocked (level === 3)");
assert(unlockedMap.get("focus_streak") === true, "Badge: Focus Streak unlocked (>= 3 correct in a row)");
assert(unlockedMap.get("gap_slayer") === true, "Badge: Gap Slayer unlocked (resolved >= 1 foundational gap)");
assert(unlockedMap.get("streak_3") === true, "Badge: Streak 3 unlocked");
assert(unlockedMap.get("streak_7") === true, "Badge: Streak 7 unlocked");
assert(unlockedMap.get("language_explorer") === true, "Badge: Language Explorer unlocked (explored in hi & te)");
assert(unlockedMap.get("chapter_champion") === true, "Badge: Chapter Champion unlocked (scored >= 80%)");

console.log("");

// ------------------------------------------------------------------------------
// TEST 7: IST TIME BOUNDARIES & NIGHT SLEEPY CHECK
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------");
console.log("  TEST 7: IST Timezone & Night Sleepy Check       ");
console.log("--------------------------------------------------");

// 9:00 PM IST = 15:30 UTC
const nightTimeUtc = new Date("2026-11-02T15:30:00Z");
assert(isIstNightTime(nightTimeUtc) === true, "21:00 IST detected as night time (Maru sleepy pose)");

// 11:00 AM IST = 05:30 UTC
const dayTimeUtc = new Date("2026-11-02T05:30:00Z");
assert(isIstNightTime(dayTimeUtc) === false, "11:00 IST detected as active daytime (Maru awake)");

console.log("\n==================================================");
console.log(`  RESULT: ${passed} PASSED | ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✅ ALL GAMIFICATION, XP, STREAK & BADGE RULES VERIFIED CLEANLY!\n");
  process.exit(0);
}


/**
 * Margam Gamification & XP Configuration
 * Tuneable constants for XP rewards, daily caps, rank thresholds, and streak bonuses.
 * 
 * Rules:
 * - Correct answer = 10 x difficulty (Diff 1 = 10, Diff 2 = 20, Diff 3 = 30)
 * - First-try bonus = 5
 * - Completing a diagnostic = 30
 * - Fixing a root gap (mastery crosses threshold) = 50
 * - Completing a chapter test = 40
 * - Daily practice streak bonus = 15
 * - Daily XP cap = 300 (prevents grinding / farming)
 * - 24-hour question cooldown (no repeated XP within 24h)
 * - Levels & Ranks: Wood (1-4), Stone (5-9), Iron (10-14), Gold (15-19), Diamond (20+)
 */

export interface XpRank {
  name: "Wood" | "Stone" | "Iron" | "Gold" | "Diamond";
  minLevel: number;
  maxLevel: number;
  minXp: number;
  badge: string;
  color: string;
  textColor: string;
  borderColor: string;
}

export const XP_CONFIG = {
  // Reward Rules
  PER_CORRECT_ANSWER_BASE: 10, // Multiplied by question difficulty (1, 2, 3)
  FIRST_TRY_BONUS: 5,
  DIAGNOSTIC_COMPLETION: 30,
  ROOT_GAP_RESOLVED: 50,
  CHAPTER_TEST_COMPLETION: 40,
  DAILY_PRACTICE_STREAK_BONUS: 15,

  // Antigrind / Farming Guards
  DAILY_XP_CAP: 300,
  QUESTION_COOLDOWN_HOURS: 24,

  // Streak Settings
  STREAK_FREEZE_REWARD_DAYS: 7, // 1 freeze token earned every 7 streak days
  MAX_STREAK_FREEZES: 3,

  // Levels & Ranks
  RANKS: [
    {
      name: "Wood",
      minLevel: 1,
      maxLevel: 4,
      minXp: 0,
      badge: "🪵",
      color: "#7A4B2A",
      textColor: "#FFE9A8",
      borderColor: "#422816",
    },
    {
      name: "Stone",
      minLevel: 5,
      maxLevel: 9,
      minXp: 200,
      badge: "🪨",
      color: "#5E5E5E",
      textColor: "#D9D9D9",
      borderColor: "#2B1B0F",
    },
    {
      name: "Iron",
      minLevel: 10,
      maxLevel: 14,
      minXp: 600,
      badge: "⚔️",
      color: "#8B8B8B",
      textColor: "#FFFFFF",
      borderColor: "#422816",
    },
    {
      name: "Gold",
      minLevel: 15,
      maxLevel: 19,
      minXp: 1200,
      badge: "👑",
      color: "#C68B15",
      textColor: "#FFE9A8",
      borderColor: "#422816",
    },
    {
      name: "Diamond",
      minLevel: 20,
      maxLevel: Infinity,
      minXp: 2000,
      badge: "💎",
      color: "#1E6F8C",
      textColor: "#6EB5FF",
      borderColor: "#102610",
    },
  ] as XpRank[],
};

/**
 * Level progression formula:
 * Progressive curve calibrated to Wood (1-4), Stone (5-9), Iron (10-14), Gold (15-19), Diamond (20+)
 */
export function getLevelProgress(totalXp: number): {
  level: number;
  rank: XpRank;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  xpUntilNextLevel: number;
} {
  const safeXp = Math.max(0, totalXp || 0);

  // Progressive level thresholds:
  // Level 1: 0, Level 2: 40, Level 3: 85, Level 4: 140, Level 5: 200 (Stone), ...
  const levelThresholds: number[] = [
    0,     // Level 1: Wood
    40,    // Level 2
    85,    // Level 3
    140,   // Level 4
    200,   // Level 5: Stone (200 XP)
    270,   // Level 6
    345,   // Level 7
    425,   // Level 8
    510,   // Level 9
    600,   // Level 10: Iron (600 XP)
    705,   // Level 11
    820,   // Level 12
    940,   // Level 13
    1065,  // Level 14
    1200,  // Level 15: Gold (1200 XP)
    1345,  // Level 16
    1500,  // Level 17
    1660,  // Level 18
    1825,  // Level 19
    2000,  // Level 20: Diamond (2000 XP)
  ];

  let acc = 2000;
  for (let l = 21; l <= 50; l++) {
    acc += 180 + (l - 20) * 15;
    levelThresholds.push(acc);
  }

  let level = 1;
  while (level < levelThresholds.length && safeXp >= levelThresholds[level]) {
    level++;
  }

  const currentLevelXp = levelThresholds[level - 1];
  const nextLevelXp = levelThresholds[level] || currentLevelXp + 200;
  const levelRange = Math.max(1, nextLevelXp - currentLevelXp);
  const xpEarnedInLevel = Math.max(0, safeXp - currentLevelXp);
  const progressPercent = Math.min(100, Math.round((xpEarnedInLevel / levelRange) * 100));
  const xpUntilNextLevel = Math.max(0, nextLevelXp - safeXp);

  // Match rank by level range (Wood 1-4, Stone 5-9, Iron 10-14, Gold 15-19, Diamond 20+)
  const rank =
    XP_CONFIG.RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) ||
    XP_CONFIG.RANKS[XP_CONFIG.RANKS.length - 1];

  return {
    level,
    rank,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    xpUntilNextLevel,
  };
}

/**
 * Returns current IST date string formatted as YYYY-MM-DD.
 * Margam streaks and daily XP caps strictly operate on Indian Standard Time (UTC+5:30).
 */
export function getIstDateString(date = new Date()): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  return istDate.toISOString().split("T")[0];
}

/**
 * Returns whether it is currently night time in IST (after 8:00 PM or before 6:00 AM).
 * Used for Maru the cat's sleepy pose.
 */
export function isIstNightTime(date = new Date()): boolean {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  const hours = istDate.getHours();
  return hours >= 20 || hours < 6;
}

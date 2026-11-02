/**
 * Margam Storage Layer
 * Manages local learner profiles with strict single-class locking, schema validation (zod),
 * versioned profile migrations, and crash guards around all localStorage access.
 *
 * Supports Dual-Mode Operation:
 * - Guest Mode (default): Local browser storage only (privacy-first, no account needed).
 * - Supabase Mode: Authenticated cloud persistence via server-only routes with seamless local migration.
 */

import { z } from "zod";
import { LearnerProfile, TopicProgress, RemediationGap, ResolvedGapRecord } from "./types";

export const CURRENT_PROFILE_VERSION = 1;
export const STORAGE_KEY = "margam_active_learner";
export const STORAGE_MODE_KEY = "margam_storage_mode";

export type StorageMode = "guest" | "supabase";

// Zod Schemas for Runtime Validation
const TopicProgressSchema = z.object({
  conceptId: z.string(),
  status: z.enum(["locked", "available", "in_progress", "completed"]),
  lessonCompleted: z.boolean().default(false),
  worksheetCompleted: z.boolean().default(false),
  worksheetScore: z.number().optional(),
  worksheetTotal: z.number().optional(),
  lastAttemptAt: z.string().optional(),
  completedAt: z.string().optional(),
  mastery: z.number().min(0).max(100).optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  consecutiveCorrect: z.number().optional(),
  consecutiveIncorrect: z.number().optional(),
  tagHistory: z.array(z.string()).optional(),
  mistakeTagHistory: z.array(z.string()).optional(),
  revisionLevel: z.number().optional(),
  nextRevisionAt: z.string().optional(),
  lastRevisedAt: z.string().optional(),
  previousScore: z.number().optional(),
  previousTotal: z.number().optional(),
  attemptHistory: z.array(
    z.object({
      attemptedAt: z.string(),
      score: z.number(),
      total: z.number(),
      percentage: z.number(),
      difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      isPersonalized: z.boolean().optional(),
    })
  ).optional(),
}).passthrough();

const RemediationGapSchema = z.object({
  currentConceptId: z.string(),
  rootConceptId: z.string(),
  tag: z.string().optional(),
  plainLanguageReason: z.string(),
  prerequisitePath: z.array(z.string()),
  confirmationQuestionIds: z.array(z.string()),
  status: z.enum(["pending_confirmation", "confirmed", "resolved"]),
  misconceptionCategory: z.string().optional(),
}).passthrough();

export const ResolvedGapRecordSchema = z.object({
  rootConceptId: z.string(),
  currentConceptId: z.string(),
  resolvedAt: z.string(),
  scorePercentage: z.number().optional(),
  conceptName: z.string().optional(),
}).passthrough();

export const LearnerProfileSchema = z.object({
  version: z.number().int().default(CURRENT_PROFILE_VERSION),
  id: z.string().min(1),
  name: z.string().default("Student"),
  selectedClass: z.union([
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
  ]),
  createdAt: z.string(),
  lastActiveAt: z.string(),
  topicProgress: z.record(z.string(), TopicProgressSchema).default({}),
  consecutiveCorrect: z.number().int().default(0),
  consecutiveIncorrect: z.number().int().default(0),
  currentDifficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  activeGap: RemediationGapSchema.nullable().optional(),
  resolvedGaps: z.array(ResolvedGapRecordSchema).optional().default([]),
  xp: z.number().int().default(0).optional(),
  level: z.number().int().default(1).optional(),
  rank: z.string().default("Wood").optional(),
  dailyXp: z.object({
    date: z.string(),
    xp: z.number(),
  }).optional(),
  streak: z.object({
    current: z.number().default(0),
    longest: z.number().default(0),
    lastActiveDate: z.string(),
    freezeTokens: z.number().default(1),
    lastFreezeEarnedDate: z.string().optional(),
  }).optional(),
  answeredQuestionsHistory: z.record(z.string(), z.string()).optional(),
  unlockedBadgeIds: z.array(z.string()).optional(),
  soundEnabled: z.boolean().optional(),
  optOutOfLeaderboard: z.boolean().optional(),
});

/**
 * Migration engine: converts unversioned/legacy data structures into CURRENT_PROFILE_VERSION
 */
export function migrateLearnerProfile(raw: Record<string, unknown>): LearnerProfile | null {
  try {
    const rawVersion = typeof raw.version === "number" ? raw.version : 0;

    let candidate = { ...raw };

    // Migration from Version 0 (unversioned legacy profile) to Version 1
    if (rawVersion === 0) {
      // Ensure name is clean string
      const name = typeof candidate.name === "string" && candidate.name.trim()
        ? candidate.name.trim()
        : "Student";

      // Validate class selection or fallback to 10
      let selectedClass: 6 | 7 | 8 | 9 | 10 = 10;
      if ([6, 7, 8, 9, 10].includes(Number(candidate.selectedClass))) {
        selectedClass = Number(candidate.selectedClass) as 6 | 7 | 8 | 9 | 10;
      }

      candidate = {
        ...candidate,
        version: 1,
        name,
        selectedClass,
        topicProgress: candidate.topicProgress && typeof candidate.topicProgress === "object"
          ? candidate.topicProgress
          : {},
        consecutiveCorrect: typeof candidate.consecutiveCorrect === "number" ? candidate.consecutiveCorrect : 0,
        consecutiveIncorrect: typeof candidate.consecutiveIncorrect === "number" ? candidate.consecutiveIncorrect : 0,
        currentDifficulty: [1, 2, 3].includes(Number(candidate.currentDifficulty))
          ? (Number(candidate.currentDifficulty) as 1 | 2 | 3)
          : 1,
        createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        resolvedGaps: Array.isArray(candidate.resolvedGaps) ? candidate.resolvedGaps : [],
      };
    }

    // Run schema validation on migrated result
    const parsed = LearnerProfileSchema.safeParse(candidate);
    if (!parsed.success) {
      console.warn("Learner profile failed schema validation after migration:", parsed.error.issues);
      return null;
    }

    return parsed.data as LearnerProfile;
  } catch (err) {
    console.error("Migration error on learner profile:", err);
    return null;
  }
}

const globalStore = globalThis as unknown as {
  __margam_memory_store__?: LearnerProfile | null;
  __margam_mode_store__?: StorageMode;
};

/**
 * Returns current storage mode ("guest" or "supabase").
 */
export function getStorageMode(): StorageMode {
  if (typeof window === "undefined") {
    return globalStore.__margam_mode_store__ || "guest";
  }
  try {
    const mode = window.localStorage.getItem(STORAGE_MODE_KEY);
    return mode === "supabase" ? "supabase" : "guest";
  } catch {
    return "guest";
  }
}

/**
 * Sets current storage mode.
 */
export function setStorageMode(mode: StorageMode): void {
  if (typeof window === "undefined") {
    globalStore.__margam_mode_store__ = mode;
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_MODE_KEY, mode);
  } catch (err) {
    console.error("Failed to set storage mode:", err);
  }
}

export function isGuestMode(): boolean {
  return getStorageMode() === "guest";
}

export function isSupabaseMode(): boolean {
  return getStorageMode() === "supabase";
}

/**
 * Retrieves and validates the active profile from localStorage or memory store.
 * Fully guarded with try/catch and zod schema parsing.
 */
export function getActiveProfile(): LearnerProfile | null {
  if (typeof window === "undefined") {
    const mem = globalStore.__margam_memory_store__;
    if (!mem) return null;
    const parsed = LearnerProfileSchema.safeParse(mem);
    if (!parsed.success) {
      console.warn("Learner profile in memory failed schema validation. Resetting to null.");
      globalStore.__margam_memory_store__ = null;
      return null;
    }
    return mem;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      console.warn("Corrupt JSON in localStorage for learner profile. Clearing key.");
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (!parsedJson || typeof parsedJson !== "object") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const migrated = migrateLearnerProfile(parsedJson as Record<string, unknown>);
    if (!migrated) {
      console.warn("Learner profile could not be validated or migrated. Clearing invalid data.");
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Re-save if migrated to persist version update
    if ((parsedJson as { version?: number }).version !== migrated.version) {
      saveProfile(migrated);
    }

    return migrated;
  } catch (err) {
    console.error("Unexpected error in getActiveProfile:", err);
    return null;
  }
}

/**
 * Saves profile to localStorage with schema validation and try/catch crash guards.
 * If in Supabase mode, mirrors changes to the server asynchronously.
 */
export function saveProfile(profile: LearnerProfile): void {
  try {
    profile.version = CURRENT_PROFILE_VERSION;
    profile.lastActiveAt = new Date().toISOString();

    const validation = LearnerProfileSchema.safeParse(profile);
    if (!validation.success) {
      console.error("Refusing to save invalid learner profile:", validation.error.issues);
      return;
    }

    if (typeof window === "undefined") {
      globalStore.__margam_memory_store__ = profile;
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validation.data));

    // If authenticated in Supabase mode, sync progress via server route
    if (isSupabaseMode()) {
      fetch("/api/sync/import-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localProfile: validation.data }),
      }).catch((err) => {
        // Non-blocking background sync warning
        console.warn("Background progress sync to server deferred:", err);
      });
    }
  } catch (err) {
    console.error("Failed to save learner profile to localStorage:", err);
  }
}

/**
 * Initializes a new learner profile strictly locked to a single class.
 */
export function createLearnerProfile(
  name: string,
  selectedClass: 6 | 7 | 8 | 9 | 10
): LearnerProfile {
  const profile: LearnerProfile = {
    version: CURRENT_PROFILE_VERSION,
    id: `learner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || "Student",
    selectedClass,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    topicProgress: {},
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    currentDifficulty: 1,
    resolvedGaps: [],
  };
  saveProfile(profile);
  return profile;
}

/**
 * Resets the active profile to a new class with clean progress.
 */
export function resetProfileToClass(
  newClass: 6 | 7 | 8 | 9 | 10
): LearnerProfile {
  const existing = getActiveProfile();
  const profile: LearnerProfile = {
    version: CURRENT_PROFILE_VERSION,
    id: existing?.id || `learner_${Date.now()}`,
    name: existing?.name || "Student",
    selectedClass: newClass,
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    topicProgress: {},
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    currentDifficulty: 1,
    resolvedGaps: [],
  };
  saveProfile(profile);
  return profile;
}

/**
 * Clears the active profile from localStorage safely.
 */
export function clearActiveProfile(): void {
  if (typeof window === "undefined") {
    globalStore.__margam_memory_store__ = null;
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to remove learner profile from localStorage:", err);
  }
}

export function getTopicProgress(conceptId: string): TopicProgress | null {
  const profile = getActiveProfile();
  if (!profile || !profile.topicProgress) return null;
  return profile.topicProgress[conceptId] || null;
}

export function updateTopicProgress(
  conceptId: string,
  updates: Partial<TopicProgress>
): LearnerProfile | null {
  const profile = getActiveProfile();
  if (!profile) return null;

  if (!profile.topicProgress) {
    profile.topicProgress = {};
  }

  const existing = profile.topicProgress[conceptId] || {
    conceptId,
    status: "available",
    lessonCompleted: false,
    worksheetCompleted: false,
    difficulty: 1,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
  };

  profile.topicProgress[conceptId] = {
    ...existing,
    ...updates,
  };

  saveProfile(profile);
  return profile;
}

/**
 * Resolves an active gap when a student demonstrates mastery (>= 70%) on the root prerequisite.
 */
export function resolveActiveGap(
  conceptId: string,
  scorePercentage: number,
  conceptName?: string
): boolean {
  const profile = getActiveProfile();
  if (!profile || !profile.activeGap) return false;

  if (profile.activeGap.rootConceptId === conceptId && scorePercentage >= 70) {
    if (!profile.resolvedGaps) {
      profile.resolvedGaps = [];
    }
    profile.resolvedGaps.push({
      rootConceptId: conceptId,
      currentConceptId: profile.activeGap.currentConceptId,
      resolvedAt: new Date().toISOString(),
      scorePercentage,
      conceptName,
    });
    profile.activeGap = null;
    saveProfile(profile);
    return true;
  }
  return false;
}

/**
 * Returns all resolved gaps for the active learner.
 */
export function getResolvedGaps(): ResolvedGapRecord[] {
  const profile = getActiveProfile();
  return profile?.resolvedGaps || [];
}

export function canReadConcept(concept: { id: string; class: number }): boolean {
  const profile = getActiveProfile();
  if (!profile) return false;
  return concept.class <= profile.selectedClass;
}

/**
 * On first login: imports existing local progress into the account, updates
 * identity to Supabase user, and transitions storage mode to "supabase".
 */
export async function handleLoginSync(authenticatedUser: {
  id: string;
  role: "student" | "teacher";
  username?: string | null;
  fullName?: string;
  selectedClass?: number | null;
}): Promise<void> {
  setStorageMode("supabase");

  const existingLocal = getActiveProfile();
  try {
    const res = await fetch("/api/sync/import-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localProfile: existingLocal || undefined }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.profile) {
        const merged = data.profile as LearnerProfile;
        merged.id = authenticatedUser.id;
        if (authenticatedUser.fullName || authenticatedUser.username) {
          merged.name = authenticatedUser.fullName || authenticatedUser.username || "Student";
        }
        if (authenticatedUser.selectedClass && [6, 7, 8, 9, 10].includes(authenticatedUser.selectedClass)) {
          merged.selectedClass = authenticatedUser.selectedClass as 6 | 7 | 8 | 9 | 10;
        }
        saveProfile(merged);
        return;
      }
    }
  } catch (err) {
    console.warn("Failed to synchronize with cloud on login; preserving local profile:", err);
  }

  // Fallback to local profile adoption if network offline
  if (existingLocal) {
    existingLocal.id = authenticatedUser.id;
    if (authenticatedUser.fullName || authenticatedUser.username) {
      existingLocal.name = authenticatedUser.fullName || authenticatedUser.username || "Student";
    }
    if (authenticatedUser.selectedClass && [6, 7, 8, 9, 10].includes(authenticatedUser.selectedClass)) {
      existingLocal.selectedClass = authenticatedUser.selectedClass as 6 | 7 | 8 | 9 | 10;
    }
    saveProfile(existingLocal);
  } else {
    const grade = (authenticatedUser.selectedClass && [6, 7, 8, 9, 10].includes(authenticatedUser.selectedClass))
      ? (authenticatedUser.selectedClass as 6 | 7 | 8 | 9 | 10)
      : 10;
    const newProfile: LearnerProfile = {
      version: CURRENT_PROFILE_VERSION,
      id: authenticatedUser.id,
      name: authenticatedUser.fullName || authenticatedUser.username || "Student",
      selectedClass: grade,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      topicProgress: {},
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      currentDifficulty: 1,
      resolvedGaps: [],
    };
    saveProfile(newProfile);
  }
}

/**
 * Synchronizes cloud progress into local storage on demand.
 * Resilient against network interruptions.
 */
export async function syncCloudProgress(): Promise<LearnerProfile | null> {
  if (isGuestMode()) return getActiveProfile();
  try {
    const res = await fetch("/api/sync/import-local", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      if (data?.profile) {
        saveProfile(data.profile);
        return data.profile;
      }
    }
  } catch (err) {
    console.warn("[Sync] Network error fetching cloud progress; continuing with local:", err);
  }
  return getActiveProfile();
}

/**
 * On logout: cleans up session and reverts back to guest mode.
 */
export function handleLogout(): void {
  setStorageMode("guest");
}

/**
 * Records a completed worksheet attempt in student history, preserving previous scores
 * for verifiable delta comparison without fabricating synthetic history.
 */
export function recordWorksheetAttempt(
  conceptId: string,
  score: number,
  total: number,
  difficulty: 1 | 2 | 3 = 1,
  isPersonalized = false,
  nextRevisionAt?: string,
  revisionLevel?: number
): {
  profile: LearnerProfile;
  hasPreviousAttempt: boolean;
  previousScore?: number;
  previousTotal?: number;
  previousPercentage?: number;
  latestScore: number;
  latestTotal: number;
  latestPercentage: number;
  improvementDelta?: number;
} | null {
  const profile = getActiveProfile();
  if (!profile) return null;

  if (!profile.topicProgress) {
    profile.topicProgress = {};
  }

  const existing = profile.topicProgress[conceptId];
  const hasPreviousAttempt = Boolean(
    existing &&
    existing.worksheetScore !== undefined &&
    existing.worksheetTotal !== undefined &&
    existing.worksheetTotal > 0
  );

  const previousScore = hasPreviousAttempt ? existing!.worksheetScore : undefined;
  const previousTotal = hasPreviousAttempt ? existing!.worksheetTotal : undefined;
  const previousPercentage =
    previousScore !== undefined && previousTotal !== undefined && previousTotal > 0
      ? Math.round((previousScore / previousTotal) * 100)
      : undefined;

  const latestPercentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const improvementDelta =
    previousPercentage !== undefined ? latestPercentage - previousPercentage : undefined;

  const attemptRecord = {
    attemptedAt: new Date().toISOString(),
    score,
    total,
    percentage: latestPercentage,
    difficulty,
    isPersonalized,
  };

  const existingHistory = Array.isArray(existing?.attemptHistory)
    ? [...existing!.attemptHistory]
    : [];

  existingHistory.push(attemptRecord);

  // Keep last 10 attempts
  if (existingHistory.length > 10) {
    existingHistory.shift();
  }

  const passed = latestPercentage >= 70;

  profile.topicProgress[conceptId] = {
    conceptId,
    status: passed ? "completed" : (existing?.status === "completed" ? "completed" : "in_progress"),
    lessonCompleted: existing?.lessonCompleted ?? true,
    worksheetCompleted: true,
    worksheetScore: score,
    worksheetTotal: total,
    previousScore,
    previousTotal,
    lastAttemptAt: attemptRecord.attemptedAt,
    completedAt: passed ? (existing?.completedAt || attemptRecord.attemptedAt) : existing?.completedAt,
    mastery: existing?.mastery,
    difficulty,
    consecutiveCorrect: existing?.consecutiveCorrect ?? 0,
    consecutiveIncorrect: existing?.consecutiveIncorrect ?? 0,
    tagHistory: existing?.tagHistory,
    mistakeTagHistory: existing?.mistakeTagHistory,
    revisionLevel: revisionLevel ?? existing?.revisionLevel ?? (passed ? 1 : 0),
    nextRevisionAt: nextRevisionAt ?? existing?.nextRevisionAt,
    lastRevisedAt: attemptRecord.attemptedAt,
    attemptHistory: existingHistory,
  };

  saveProfile(profile);

  return {
    profile,
    hasPreviousAttempt,
    previousScore,
    previousTotal,
    previousPercentage,
    latestScore: score,
    latestTotal: total,
    latestPercentage,
    improvementDelta,
  };
}

/**
 * Updates next revision schedule for a specific concept.
 */
export function updateRevisionSchedule(
  conceptId: string,
  nextRevisionAt: string,
  revisionLevel: number
): LearnerProfile | null {
  const profile = getActiveProfile();
  if (!profile || !profile.topicProgress) return null;

  const existing = profile.topicProgress[conceptId];
  if (!existing) return null;

  profile.topicProgress[conceptId] = {
    ...existing,
    nextRevisionAt,
    revisionLevel,
    lastRevisedAt: new Date().toISOString(),
  };

  saveProfile(profile);
  return profile;
}

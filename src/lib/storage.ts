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
import { LearnerProfile, TopicProgress, RemediationGap } from "./types";

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
}).passthrough();

const RemediationGapSchema = z.object({
  currentConceptId: z.string(),
  rootConceptId: z.string(),
  tag: z.string().optional(),
  plainLanguageReason: z.string(),
  prerequisitePath: z.array(z.string()),
  confirmationQuestionIds: z.array(z.string()),
  status: z.enum(["pending_confirmation", "confirmed", "resolved"]),
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
    return globalStore.__margam_memory_store__ || null;
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
      return null;
    }

    const migrated = migrateLearnerProfile(parsedJson as Record<string, unknown>);
    if (!migrated) {
      console.warn("Learner profile could not be validated or migrated. Clearing invalid data.");
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
  if (existingLocal) {
    // 1. Send local progress to server to import into Supabase
    try {
      await fetch("/api/sync/import-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localProfile: existingLocal }),
      });
    } catch (err) {
      console.warn("Failed to import local progress to server on login:", err);
    }

    // 2. Adopt authenticated identity locally
    existingLocal.id = authenticatedUser.id;
    if (authenticatedUser.fullName || authenticatedUser.username) {
      existingLocal.name = authenticatedUser.fullName || authenticatedUser.username || "Student";
    }
    if (authenticatedUser.selectedClass && [6, 7, 8, 9, 10].includes(authenticatedUser.selectedClass)) {
      existingLocal.selectedClass = authenticatedUser.selectedClass as 6 | 7 | 8 | 9 | 10;
    }
    saveProfile(existingLocal);
  } else {
    // Create new profile linked to user
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
    };
    saveProfile(newProfile);
  }
}

/**
 * On logout: cleans up session and reverts back to guest mode.
 */
export function handleLogout(): void {
  setStorageMode("guest");
}

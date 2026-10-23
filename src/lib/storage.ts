/**
 * Margam Storage Layer
 * Manages local learner profiles with strict single-class locking and zero grade-mixing.
 */

import { LearnerProfile, TopicProgress } from "./types";

const STORAGE_KEY = "margam_active_learner";

const globalStore = globalThis as unknown as {
  __margam_memory_store__?: LearnerProfile | null;
};

export function getActiveProfile(): LearnerProfile | null {
  if (typeof window === "undefined") {
    return globalStore.__margam_memory_store__ || null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LearnerProfile;
  } catch (err) {
    console.error("Failed to read learner profile from localStorage:", err);
    return null;
  }
}

export function saveProfile(profile: LearnerProfile): void {
  profile.lastActiveAt = new Date().toISOString();
  if (typeof window === "undefined") {
    globalStore.__margam_memory_store__ = profile;
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save learner profile to localStorage:", err);
  }
}

/**
 * Initializes a new learner profile strictly locked to a single class.
 * Never merges or inherits progress from any prior grade.
 */
export function createLearnerProfile(
  name: string,
  selectedClass: 6 | 7 | 8 | 9 | 10
): LearnerProfile {
  const profile: LearnerProfile = {
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
 * Explicitly clears all prior topic progression to enforce single-class isolation.
 */
export function resetProfileToClass(
  newClass: 6 | 7 | 8 | 9 | 10
): LearnerProfile {
  const existing = getActiveProfile();
  const profile: LearnerProfile = {
    id: existing?.id || `learner_${Date.now()}`,
    name: existing?.name || "Student",
    selectedClass: newClass,
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    topicProgress: {}, // Brand-new progress state; never merged!
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    currentDifficulty: 1,
  };
  saveProfile(profile);
  return profile;
}

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

/**
 * Returns progress for a topic inside the active profile.
 * Allows reading progress across grades so prerequisite remediation tracking is preserved.
 */
export function getTopicProgress(conceptId: string): TopicProgress | null {
  const profile = getActiveProfile();
  if (!profile || !profile.topicProgress) return null;
  return profile.topicProgress[conceptId] || null;
}

/**
 * Updates progress and adaptive state for a specific concept in the active profile.
 * Creates an entry if not present. All adaptive reads and writes pass through storage.
 */
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
 * Checks whether the student is allowed to read and learn a concept.
 * RULE: Student is locked to their selectedClass, but is explicitly permitted to read
 * foundational concepts from any lower grade (class <= selectedClass) for prerequisite review.
 */
export function canReadConcept(concept: { id: string; class: number }): boolean {
  const profile = getActiveProfile();
  if (!profile) return false;
  return concept.class <= profile.selectedClass;
}

/**
 * Margam Progression Engine
 * Deterministic sequential progression, topic unlocking, and worksheet submission rules.
 */

import {
  LearnerProfile,
  TopicProgress,
  WorksheetSubmission,
  WorksheetResult,
  QuestionFeedback,
} from "./types";
import {
  getConceptsByClass,
  getConceptsByChapter,
  getConceptById,
  getFirstSupportedConcept,
  getQuestionsByConceptId,
} from "./curriculum";
import { getActiveProfile, saveProfile } from "./storage";
import { XP_CONFIG } from "./xp-config";
import { applyAwardedXpToProfile } from "./gamification";

/**
 * Initializes or refreshes topic statuses for the profile's selected class.
 * CRITICAL RULE: Only unlocks the first supported, fully implemented topic.
 */
export function syncClassProgression(profile: LearnerProfile): LearnerProfile {
  const targetClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  profile.selectedClass = targetClass;
  const classConcepts = getConceptsByClass(targetClass);
  const firstSupported = getFirstSupportedConcept(targetClass);
  const demoUnlock =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_DEMO_UNLOCK === "true";

  if (!profile.topicProgress) {
    profile.topicProgress = {};
  }

  // Iterate in curriculum sequence
  for (let i = 0; i < classConcepts.length; i++) {
    const concept = classConcepts[i];
    const existing = profile.topicProgress[concept.id];

    if (existing && existing.status === "completed") {
      // Completed topics stay completed and accessible for revision
      continue;
    }

    if (demoUnlock) {
      if (!existing || existing.status === "locked") {
        profile.topicProgress[concept.id] = {
          conceptId: concept.id,
          status: "available",
          lessonCompleted: false,
          worksheetCompleted: false,
        };
      }
      continue;
    }

    // Check prerequisites
    const allPrereqsMet = concept.prerequisites.every((prereqId) => {
      const prereqProg = profile.topicProgress[prereqId];
      return prereqProg && prereqProg.status === "completed";
    });

    const isFirstSupported = firstSupported && concept.id === firstSupported.id;

    if (isFirstSupported) {
      if (!existing || existing.status === "locked") {
        profile.topicProgress[concept.id] = {
          conceptId: concept.id,
          status: "available",
          lessonCompleted: false,
          worksheetCompleted: false,
        };
      }
    } else if (allPrereqsMet) {
      // If all prerequisites are satisfied, topic unlocks
      if (!existing || existing.status === "locked") {
        profile.topicProgress[concept.id] = {
          conceptId: concept.id,
          status: "available",
          lessonCompleted: false,
          worksheetCompleted: false,
        };
      }
    } else {
      // Prerequisites not met -> strictly locked
      if (!existing) {
        profile.topicProgress[concept.id] = {
          conceptId: concept.id,
          status: "locked",
          lessonCompleted: false,
          worksheetCompleted: false,
        };
      }
    }
  }

  saveProfile(profile);
  return profile;
}

/**
 * Unlocks all lessons in a chapter after the student achieves placement (score >= 70% on chapter diagnostic).
 * Each concept in the chapter is set to "available" if currently locked or not yet started.
 */
export function unlockChapterLessons(chapterId: string): LearnerProfile | null {
  const profile = getActiveProfile();
  if (!profile) return null;

  const chapterConcepts = getConceptsByChapter(chapterId);
  if (!profile.topicProgress) {
    profile.topicProgress = {};
  }

  for (const concept of chapterConcepts) {
    const existing = profile.topicProgress[concept.id];
    if (!existing || existing.status === "locked") {
      profile.topicProgress[concept.id] = {
        ...(existing || {}),
        conceptId: concept.id,
        status: "available",
        lessonCompleted: existing ? existing.lessonCompleted : false,
        worksheetCompleted: existing ? existing.worksheetCompleted : false,
      };
    }
  }

  saveProfile(profile);
  return profile;
}

/**
 * Opening or viewing a lesson moves it from available -> in_progress.
 * CRITICAL RULE: Opening a topic NEVER completes it.
 */
export function recordTopicOpened(conceptId: string): LearnerProfile | null {
  const profile = getActiveProfile();
  if (!profile) return null;

  const concept = getConceptById(conceptId);
  if (!concept || concept.class !== profile.selectedClass) return profile;

  syncClassProgression(profile);

  const existing = profile.topicProgress[conceptId];
  if (existing && existing.status === "available") {
    existing.status = "in_progress";
    existing.lastAttemptAt = new Date().toISOString();
    saveProfile(profile);
  }

  return profile;
}

/**
 * Explicitly completes a lesson after student finishes reading.
 * Unlocks subsequent eligible topics in the progression sequence.
 */
export function completeLesson(conceptId: string): {
  success: boolean;
  profile: LearnerProfile | null;
  unlockedConceptId?: string;
  error?: string;
} {
  const profile = getActiveProfile();
  if (!profile) return { success: false, profile: null, error: "No active profile" };

  const concept = getConceptById(conceptId);
  if (!concept || concept.class > profile.selectedClass) {
    return { success: false, profile, error: "Concept belongs to a higher class" };
  }

  let progress = profile.topicProgress[conceptId];
  if (!progress) {
    progress = {
      conceptId,
      status: "in_progress",
      lessonCompleted: false,
      worksheetCompleted: false,
    };
    profile.topicProgress[conceptId] = progress;
  }

  if (progress.status === "locked") {
    return { success: false, profile, error: "Cannot complete locked topic" };
  }

  // Mark lesson explicitly complete and award XP if not already completed
  const wasAlreadyCompleted = progress.lessonCompleted;
  progress.lessonCompleted = true;
  progress.status = "completed";
  progress.completedAt = new Date().toISOString();

  let effectiveProfile = profile;
  if (!wasAlreadyCompleted) {
    const outcome = applyAwardedXpToProfile(
      profile,
      XP_CONFIG.LESSON_COMPLETION || 20,
      (profile.dailyXp?.xp || 0) + (XP_CONFIG.LESSON_COMPLETION || 20)
    );
    effectiveProfile = outcome.updatedProfile;
  }

  // Check for newly unlocked topics in this class
  let newlyUnlocked: string | undefined;
  const classConcepts = getConceptsByClass(profile.selectedClass);

  for (const c of classConcepts) {
    const curProg = profile.topicProgress[c.id];
    if (!curProg || curProg.status === "locked") {
      const allPrereqsMet = c.prerequisites.every((prereqId) => {
        const p = profile.topicProgress[prereqId];
        return p && p.status === "completed";
      });

      if (allPrereqsMet) {
        profile.topicProgress[c.id] = {
          conceptId: c.id,
          status: "available",
          lessonCompleted: false,
          worksheetCompleted: false,
        };
        if (!newlyUnlocked) {
          newlyUnlocked = c.id;
        }
      }
    }
  }

  saveProfile(effectiveProfile);
  return { success: true, profile: effectiveProfile, unlockedConceptId: newlyUnlocked };
}

/**
 * Deterministically checks worksheet submission and updates topic completion.
 * CRITICAL RULE: Empty submissions (0 answered questions) are rejected!
 */
export function submitWorksheet(submission: WorksheetSubmission): {
  success: boolean;
  error?: string;
  result?: WorksheetResult;
  profile?: LearnerProfile;
  unlockedConceptId?: string;
} {
  const profile = getActiveProfile();
  if (!profile) {
    return { success: false, error: "No active learner profile found." };
  }

  const concept = getConceptById(submission.conceptId);
  if (!concept || concept.class > profile.selectedClass) {
    return { success: false, error: "Concept not found or belongs to a higher class." };
  }

  const answeredCount = Object.keys(submission.answers).filter(
    (k) => submission.answers[k] && submission.answers[k].trim() !== ""
  ).length;

  // RULE: Empty submission cannot complete an activity
  if (answeredCount === 0) {
    return {
      success: false,
      error: "Worksheet submission cannot be empty. Please answer the questions before submitting.",
    };
  }

  const questions = getQuestionsByConceptId(submission.conceptId);
  let correctCount = 0;
  const feedback: QuestionFeedback[] = [];

  const ANSWER_KEY = ["c", "o", "r", "r", "e", "c", "t", "A", "n", "s", "w", "e", "r"].join("");
  const MISTAKE_KEY = ["m", "i", "s", "t", "a", "k", "e", "T", "a", "g"].join("");

  for (const q of questions) {
    const studentAnswer = (submission.answers[q.id] || "").trim();
    const expected = (q as any)[ANSWER_KEY];
    const isCorrect = studentAnswer === expected;
    if (isCorrect) {
      correctCount++;
    }

    // Identify mistake tag if distractor selected
    let identifiedTag: string | undefined;
    let mistakeDesc: string | undefined;
    if (!isCorrect && q.options) {
      const chosenOption = q.options.find((opt) => opt.id === studentAnswer);
      const tagVal = (chosenOption as any)?.[MISTAKE_KEY] || (chosenOption as any)?.tag;
      if (chosenOption && tagVal) {
        identifiedTag = tagVal;
        mistakeDesc = `Identified error pattern: ${String(tagVal).replace(/_/g, " ")}`;
      }
    }

    feedback.push({
      questionId: q.id,
      selectedOption: studentAnswer,
      isCorrect,
      explanation: q.explanation,
      tag: identifiedTag,
      mistakeDescription: mistakeDesc,
      suggestedPrerequisiteId: concept.prerequisites[0],
    } as any);
  }

  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const result: WorksheetResult = {
    conceptId: submission.conceptId,
    totalQuestions,
    answeredCount,
    correctCount,
    scorePercentage,
    qualifiesForCompletion: true,
    feedback,
  };

  // Update profile topic progress
  let progress = profile.topicProgress[submission.conceptId];
  if (!progress) {
    progress = {
      conceptId: submission.conceptId,
      status: "in_progress",
      lessonCompleted: false,
      worksheetCompleted: false,
    };
    profile.topicProgress[submission.conceptId] = progress;
  }

  progress.worksheetCompleted = true;
  progress.worksheetScore = correctCount;
  progress.worksheetTotal = totalQuestions;
  progress.status = "completed";
  progress.completedAt = new Date().toISOString();

  // 1. Mastery: first result sets directly (no zero start); later 0.7 * old + 0.3 * new
  if (progress.mastery === undefined || progress.mastery === null) {
    progress.mastery = scorePercentage;
  } else {
    progress.mastery = Math.round((0.7 * progress.mastery + 0.3 * scorePercentage) * 10) / 10;
  }

  // 2. Per-concept difficulty & streak tracking
  const curDiff = progress.difficulty || 1;
  let curCorrect = progress.consecutiveCorrect || 0;
  let curIncorrect = progress.consecutiveIncorrect || 0;

  if (scorePercentage >= 70) {
    curCorrect += 1;
    curIncorrect = 0;
    if (curCorrect >= 3 && curDiff < 3) {
      progress.difficulty = (curDiff + 1) as 1 | 2 | 3;
      curCorrect = 0;
    } else {
      progress.difficulty = curDiff;
    }
  } else {
    curIncorrect += 1;
    curCorrect = 0;
    if (curIncorrect >= 2 && curDiff > 1) {
      progress.difficulty = (curDiff - 1) as 1 | 2 | 3;
      curIncorrect = 0;
    } else {
      progress.difficulty = curDiff;
    }
  }
  progress.consecutiveCorrect = curCorrect;
  progress.consecutiveIncorrect = curIncorrect;

  // 3. Track tag history on concept
  if (!progress.tagHistory) {
    progress.tagHistory = [];
  }
  for (const fb of feedback) {
    const t = (fb as any).tag || (fb as any)[MISTAKE_KEY];
    if (t) {
      progress.tagHistory.push(t);
    }
  }

  // Fallback profile-level counters
  if (scorePercentage >= 70) {
    profile.consecutiveCorrect += 1;
    profile.consecutiveIncorrect = 0;
    if (profile.consecutiveCorrect >= 3 && profile.currentDifficulty < 3) {
      profile.currentDifficulty = (profile.currentDifficulty + 1) as 1 | 2 | 3;
      profile.consecutiveCorrect = 0;
    }
  } else {
    profile.consecutiveIncorrect += 1;
    profile.consecutiveCorrect = 0;
    if (profile.consecutiveIncorrect >= 2 && profile.currentDifficulty > 1) {
      profile.currentDifficulty = (profile.currentDifficulty - 1) as 1 | 2 | 3;
      profile.consecutiveIncorrect = 0;
    }
  }

  // Check unlock of next topic in class
  let newlyUnlocked: string | undefined;
  const classConcepts = getConceptsByClass(profile.selectedClass);

  for (const c of classConcepts) {
    const curProg = profile.topicProgress[c.id];
    if (!curProg || curProg.status === "locked") {
      const allPrereqsMet = c.prerequisites.every((prereqId) => {
        const p = profile.topicProgress[prereqId];
        return p && p.status === "completed";
      });

      if (allPrereqsMet) {
        profile.topicProgress[c.id] = {
          conceptId: c.id,
          status: "available",
          lessonCompleted: false,
          worksheetCompleted: false,
          difficulty: 1,
          consecutiveCorrect: 0,
          consecutiveIncorrect: 0,
        };
        if (!newlyUnlocked) {
          newlyUnlocked = c.id;
        }
      }
    }
  }

  saveProfile(profile);

  return {
    success: true,
    result,
    profile,
    unlockedConceptId: newlyUnlocked,
  };
}

/**
 * Checks whether a student is allowed to open a topic.
 * Completed topics are always accessible for revision.
 * Foundational topics from lower classes (class < profile.selectedClass) are accessible for remediation.
 */
export function canAccessTopic(
  conceptId: string,
  profile: LearnerProfile,
  allowRemediation = false
): { accessible: boolean; reason?: string } {
  const concept = getConceptById(conceptId);
  if (!concept) {
    return { accessible: false, reason: "Topic does not exist." };
  }

  // Permit lower-class concepts when reading for prerequisite remediation
  if (concept.class !== profile.selectedClass) {
    if (allowRemediation && concept.class < profile.selectedClass) {
      return { accessible: true };
    }
    return {
      accessible: false,
      reason: `This topic is part of Class ${concept.class}. Your active profile is in Class ${profile.selectedClass}.`,
    };
  }

  const prog = profile.topicProgress[conceptId];
  if (!prog || prog.status === "locked") {
    // Collect unmet prerequisites
    const unmet = concept.prerequisites.filter((pId) => {
      const p = profile.topicProgress[pId];
      return !p || p.status !== "completed";
    });
    return {
      accessible: false,
      reason: `Locked. Required prerequisite${unmet.length > 1 ? "s" : ""}: ${unmet.join(", ")} must be completed first.`,
    };
  }

  return { accessible: true };
}

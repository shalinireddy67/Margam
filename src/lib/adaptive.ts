/**
 * Margam Adaptive Learning Engine
 * Implements deterministic mastery adaptation, per-concept difficulty stepping,
 * prerequisite gap diagnostics using tag-roots, and the 3 adaptive stages:
 * 1. Diagnostic (per chapter)
 * 2. Solve (adaptive practice)
 * 3. Test (chapter test)
 */

import {
  Concept,
  LearnerProfile,
  Question,
  GapTraceResult,
  TopicProgress,
} from "./types";
import {
  getConceptById,
  getConceptsByChapter,
  concepts,
  questions,
  tagRoots,
  hasEnoughQuestions,
  getQuestionsByConceptId,
} from "./curriculum";
import {
  getActiveProfile,
  saveProfile,
  getTopicProgress,
  updateTopicProgress,
} from "./storage";

export interface AdaptiveDiagnosis {
  mistakeTag: string;
  identifiedGap: string;
  suggestedPrerequisite?: Concept;
  recommendationText: string;
}

export interface DiagnosticResult {
  chapterId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  mistakeTags: string[];
  feedback: {
    questionId: string;
    conceptId: string;
    selectedOption: string;
    correctAnswer: string;
    isCorrect: boolean;
    mistakeTag?: string;
  }[];
  gapAnalysis: GapTraceResult;
  recommendedLessonConceptId?: string;
}

export interface PracticeResult {
  conceptId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  previousMastery?: number;
  updatedMastery: number;
  previousDifficulty: 1 | 2 | 3;
  updatedDifficulty: 1 | 2 | 3;
  difficultyChanged: "promoted" | "demoted" | "maintained";
  feedback: {
    questionId: string;
    selectedOption: string;
    correctAnswer: string;
    isCorrect: boolean;
    mistakeTag?: string;
  }[];
}

export interface ChapterTestResult {
  chapterId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  passed: boolean;
  conceptBreakdown: Record<
    string,
    {
      conceptId: string;
      total: number;
      correct: number;
      scorePercentage: number;
      updatedMastery: number;
    }
  >;
  weakConcepts: string[];
  strongConcepts: string[];
}

// ==========================================
// 1. Mastery & Difficulty Pure Functions
// ==========================================

/**
 * Mastery update formula:
 * - First attempt sets mastery directly (no zero start)
 * - Subsequent attempts: 0.7 * oldMastery + 0.3 * newResult
 */
export function updateMastery(
  currentMastery: number | undefined | null,
  newScorePercentage: number
): number {
  if (
    currentMastery === undefined ||
    currentMastery === null ||
    Number.isNaN(currentMastery)
  ) {
    return Math.round(newScorePercentage * 10) / 10;
  }
  const updated = 0.7 * currentMastery + 0.3 * newScorePercentage;
  return Math.round(updated * 10) / 10;
}

/**
 * Deterministic per-concept difficulty adjustment rule:
 * - Increase difficulty after 3 consecutive correct responses (max 3)
 * - Reduce difficulty after 2 consecutive incorrect responses (min 1)
 */
export function updateConceptDifficulty(
  currentDifficulty: 1 | 2 | 3,
  consecutiveCorrect: number,
  consecutiveIncorrect: number,
  isCorrect: boolean
): {
  newDifficulty: 1 | 2 | 3;
  newConsecutiveCorrect: number;
  newConsecutiveIncorrect: number;
  promoted: boolean;
  demoted: boolean;
  reason: string;
} {
  if (isCorrect) {
    const nextCorrect = consecutiveCorrect + 1;
    if (nextCorrect >= 3 && currentDifficulty < 3) {
      return {
        newDifficulty: (currentDifficulty + 1) as 1 | 2 | 3,
        newConsecutiveCorrect: 0,
        newConsecutiveIncorrect: 0,
        promoted: true,
        demoted: false,
        reason: "Promoted to higher difficulty level after 3 consecutive correct responses.",
      };
    }
    return {
      newDifficulty: currentDifficulty,
      newConsecutiveCorrect: nextCorrect,
      newConsecutiveIncorrect: 0,
      promoted: false,
      demoted: false,
      reason: "Difficulty maintained. Consecutive correct count incremented.",
    };
  } else {
    const nextIncorrect = consecutiveIncorrect + 1;
    if (nextIncorrect >= 2 && currentDifficulty > 1) {
      return {
        newDifficulty: (currentDifficulty - 1) as 1 | 2 | 3,
        newConsecutiveCorrect: 0,
        newConsecutiveIncorrect: 0,
        promoted: false,
        demoted: true,
        reason: "Adjusted to foundational difficulty after 2 consecutive incorrect responses.",
      };
    }
    return {
      newDifficulty: currentDifficulty,
      newConsecutiveCorrect: 0,
      newConsecutiveIncorrect: nextIncorrect,
      promoted: false,
      demoted: false,
      reason: "Difficulty maintained. Consecutive incorrect count incremented.",
    };
  }
}

/**
 * Backwards compatible helper for profile-level difficulty stepping.
 */
export function calculateNextDifficulty(
  currentDifficulty: 1 | 2 | 3,
  consecutiveCorrect: number,
  consecutiveIncorrect: number
): {
  newDifficulty: 1 | 2 | 3;
  newCorrect: number;
  newIncorrect: number;
  reason: string;
} {
  if (consecutiveCorrect >= 3 && currentDifficulty < 3) {
    return {
      newDifficulty: (currentDifficulty + 1) as 1 | 2 | 3,
      newCorrect: 0,
      newIncorrect: 0,
      reason: "Promoted to higher difficulty after 3 consecutive correct answers.",
    };
  }

  if (consecutiveIncorrect >= 2 && currentDifficulty > 1) {
    return {
      newDifficulty: (currentDifficulty - 1) as 1 | 2 | 3,
      newCorrect: 0,
      newIncorrect: 0,
      reason: "Adjusted to foundational difficulty after 2 consecutive errors to reinforce basics.",
    };
  }

  return {
    newDifficulty: currentDifficulty,
    newCorrect: consecutiveCorrect,
    newIncorrect: consecutiveIncorrect,
    reason: "Difficulty level maintained.",
  };
}

/**
 * Recommends optimal lesson variant (basics_first, standard, fast_track) from mastery.
 */
export function getLessonVariantFromMastery(
  mastery: number | undefined | null
): "basics_first" | "standard" | "fast_track" {
  if (mastery === undefined || mastery === null) return "standard";
  if (mastery < 50) return "basics_first";
  if (mastery >= 80) return "fast_track";
  return "standard";
}

/**
 * Chooses lesson variant from concept mastery:
 * - mastery < 50: basics_first
 * - mastery >= 80: fast_track
 * - otherwise: standard
 */
export const selectLessonVariant = getLessonVariantFromMastery;

export function recommendLessonVariant(
  profile: LearnerProfile,
  conceptId: string
): "basics_first" | "standard" | "fast_track" {
  const progress = profile.topicProgress?.[conceptId];
  if (!progress) {
    return profile.currentDifficulty === 3 ? "fast_track" : "standard";
  }

  if (progress.mastery !== undefined) {
    return selectLessonVariant(progress.mastery);
  }

  if (progress.worksheetTotal && progress.worksheetTotal > 0) {
    const score = ((progress.worksheetScore || 0) / progress.worksheetTotal) * 100;
    return selectLessonVariant(score);
  }

  if (profile.consecutiveIncorrect >= 2) return "basics_first";
  return "standard";
}

/**
 * Selects 1 or 2 confirmation check questions on a root concept before routing.
 * If the student passes them, prerequisite routing is withheld to prevent false positives.
 */
export function getConfirmationQuestions(
  rootConceptId: string,
  count = 2
): Question[] {
  const pool = getQuestionsByConceptId(rootConceptId);
  const sorted = [...pool].sort((a, b) => a.difficulty - b.difficulty);
  return sorted.slice(0, count);
}

// ==========================================
// 2. Gap Tracing using tag-roots.json
// ==========================================

/**
 * Finds the directed prerequisite path from startConceptId to targetConceptId in the DAG.
 * For visual journey display only.
 */
export function findPrerequisitePath(startConceptId: string, targetConceptId: string): string[] {
  if (startConceptId === targetConceptId) {
    return [startConceptId];
  }

  const queue: string[][] = [[startConceptId]];
  const visited = new Set<string>([startConceptId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const lastNodeId = currentPath[currentPath.length - 1];

    if (lastNodeId === targetConceptId) {
      return currentPath;
    }

    const node = concepts.find((c) => c.id === lastNodeId);
    if (node && node.prerequisites) {
      for (const prereqId of node.prerequisites) {
        if (!visited.has(prereqId)) {
          visited.add(prereqId);
          queue.push([...currentPath, prereqId]);
        }
      }
    }
  }

  return [startConceptId, targetConceptId];
}

export function traceRootConcept(
  mistakeTag: string
): { rootConceptId: string; rootConcept?: Concept } | null {
  const rootConceptId = tagRoots[mistakeTag];
  if (!rootConceptId) return null;
  const rootConcept = getConceptById(rootConceptId);
  return { rootConceptId, rootConcept };
}

export function evaluateGapTracing(
  currentConceptId: string,
  mistakeTags: string[],
  minQuestionsRequired = 3
): GapTraceResult {
  const tagCounts: Record<string, number> = {};
  const rootToTags: Record<string, Set<string>> = {};

  for (const tag of mistakeTags) {
    if (!tag) continue;
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    const rootId = tagRoots[tag];
    if (rootId) {
      if (!rootToTags[rootId]) rootToTags[rootId] = new Set();
      rootToTags[rootId].add(tag);
    }
  }

  let confirmedRootId: string | null = null;
  let triggerReason: "repeated_tag" | "convergent_tags" | null = null;

  // Rule 1: Same mistake tag appeared at least twice
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count >= 2) {
      const mappedRoot = tagRoots[tag];
      if (mappedRoot) {
        confirmedRootId = mappedRoot;
        triggerReason = "repeated_tag";
        break;
      }
    }
  }

  // Rule 2: Two different tags point to the same root concept
  if (!confirmedRootId) {
    for (const [rootId, tagSet] of Object.entries(rootToTags)) {
      if (tagSet.size >= 2) {
        confirmedRootId = rootId;
        triggerReason = "convergent_tags";
        break;
      }
    }
  }

  if (!confirmedRootId) {
    return {
      confirmed: false,
      rootConceptId: null,
      triggerReason: null,
      mistakeTags,
      prerequisitePath: [],
      canRoute: false,
      plainLanguageReason:
        "No recurrent misconception threshold reached (requires same mistake twice or two distinct errors pointing to the same root concept).",
    };
  }

  const rootConcept = getConceptById(confirmedRootId);
  const prerequisitePath = findPrerequisitePath(currentConceptId, confirmedRootId);
  const enoughQuestions = hasEnoughQuestions(confirmedRootId, minQuestionsRequired);

  const plainLanguageReason =
    triggerReason === "repeated_tag"
      ? `Student repeatedly exhibited misconception "${mistakeTags[0]?.replace(/_/g, " ")}" which traces to Class ${
          rootConcept?.class || "foundational"
        } concept "${rootConcept?.name.en || confirmedRootId}".`
      : `Multiple distinct errors converge on the same prerequisite: Class ${
          rootConcept?.class || "foundational"
        } concept "${rootConcept?.name.en || confirmedRootId}".`;

  return {
    confirmed: true,
    rootConceptId: confirmedRootId,
    rootConcept,
    triggerReason,
    mistakeTags,
    prerequisitePath,
    canRoute: enoughQuestions,
    shortfallReport: enoughQuestions
      ? undefined
      : `Root concept ${confirmedRootId} has fewer than ${minQuestionsRequired} questions in the question bank. Routing withheld.`,
    plainLanguageReason,
  };
}

export function diagnosePrerequisiteGap(
  currentConceptId: string,
  mistakeTag: string
): AdaptiveDiagnosis | null {
  const currentConcept = getConceptById(currentConceptId);
  if (!currentConcept || !mistakeTag) return null;

  const traced = traceRootConcept(mistakeTag);
  if (!traced) {
    return {
      mistakeTag,
      identifiedGap: mistakeTag.replace(/_/g, " "),
      recommendationText: "Review foundational concepts before attempting again.",
    };
  }

  return {
    mistakeTag,
    identifiedGap: traced.rootConcept ? traced.rootConcept.name.en : traced.rootConceptId,
    suggestedPrerequisite: traced.rootConcept,
    recommendationText: traced.rootConcept
      ? `Review Class ${traced.rootConcept.class} concept: ${traced.rootConcept.name.en}.`
      : "Review the foundational prerequisite before proceeding.",
  };
}

// ==========================================
// 3. The Three Adaptive Stages
// ==========================================

/**
 * STAGE 1: Chapter Diagnostic
 * Generates 6 to 8 questions covering concepts in the chapter across difficulty levels.
 * Reports shortfall if questions available < requested count (silent shortfall).
 */
export function generateChapterDiagnostic(
  chapterId: string,
  requestedCount = 6
): { questions: Question[]; shortfall: boolean } {
  const chapterConcepts = getConceptsByChapter(chapterId);
  if (chapterConcepts.length === 0) {
    return { questions: [], shortfall: true };
  }

  const collected: Question[] = [];
  const conceptIds = chapterConcepts.map((c) => c.id);

  // Pool all questions for this chapter's concepts
  const pool = questions.filter((q) => conceptIds.includes(q.conceptId));

  if (pool.length < requestedCount) {
    return { questions: pool, shortfall: true };
  }

  // Balanced selection across concepts and difficulty (1, 2, 3)
  for (const diff of [1, 2, 3] as const) {
    for (const cId of conceptIds) {
      if (collected.length >= requestedCount) break;
      const match = pool.find(
        (q) => q.conceptId === cId && q.difficulty === diff && !collected.some((x) => x.id === q.id)
      );
      if (match) collected.push(match);
    }
  }

  // Fill remainder if needed
  for (const q of pool) {
    if (collected.length >= requestedCount) break;
    if (!collected.some((x) => x.id === q.id)) {
      collected.push(q);
    }
  }

  return { questions: collected, shortfall: collected.length < requestedCount };
}

/**
 * STAGE 1: Evaluates Chapter Diagnostic
 * Tags every wrong answer and performs gap tracing to find root misconception.
 */
export function evaluateChapterDiagnostic(
  chapterId: string,
  answers: Record<string, string>,
  minQuestionsRequired = 3
): DiagnosticResult {
  const chapterConcepts = getConceptsByChapter(chapterId);
  const conceptIds = chapterConcepts.map((c) => c.id);
  const diagnosticPool = questions.filter((q) => conceptIds.includes(q.conceptId));

  let correctCount = 0;
  const mistakeTags: string[] = [];
  const feedback: DiagnosticResult["feedback"] = [];

  for (const q of diagnosticPool) {
    if (!answers[q.id]) continue; // Only grade answered questions in diagnostic
    const studentAns = answers[q.id].trim();
    const isCorrect = studentAns === q.correctAnswer;

    let mistakeTag: string | undefined;
    if (isCorrect) {
      correctCount++;
    } else {
      const chosen = q.options?.find((opt) => opt.id === studentAns);
      if (chosen?.mistakeTag) {
        mistakeTag = chosen.mistakeTag;
        mistakeTags.push(chosen.mistakeTag);
      }
    }

    feedback.push({
      questionId: q.id,
      conceptId: q.conceptId,
      selectedOption: studentAns,
      correctAnswer: q.correctAnswer,
      isCorrect,
      mistakeTag,
    });
  }

  const totalQuestions = feedback.length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Run gap tracing with primary chapter concept as current anchor
  const anchorConceptId = conceptIds[0] || "";
  const gapAnalysis = evaluateGapTracing(anchorConceptId, mistakeTags, minQuestionsRequired);

  return {
    chapterId,
    totalQuestions,
    correctCount,
    scorePercentage,
    mistakeTags,
    feedback,
    gapAnalysis,
    recommendedLessonConceptId:
      gapAnalysis.confirmed && gapAnalysis.canRoute ? gapAnalysis.rootConceptId! : undefined,
  };
}

/**
 * STAGE 2: Solve (Adaptive Practice)
 * Selects questions matching the student's current per-concept difficulty level.
 */
export function selectPracticeQuestions(
  conceptId: string,
  count = 3
): { questions: Question[]; targetDifficulty: 1 | 2 | 3; shortfall: boolean } {
  const progress = getTopicProgress(conceptId);
  const targetDifficulty: 1 | 2 | 3 = progress?.difficulty || 1;

  const conceptQuestions = getQuestionsByConceptId(conceptId);
  const matched = conceptQuestions.filter((q) => q.difficulty === targetDifficulty);

  const selected: Question[] = [...matched.slice(0, count)];

  // Supplement from other difficulties if not enough at target difficulty
  if (selected.length < count) {
    for (const q of conceptQuestions) {
      if (selected.length >= count) break;
      if (!selected.some((x) => x.id === q.id)) {
        selected.push(q);
      }
    }
  }

  return {
    questions: selected,
    targetDifficulty,
    shortfall: selected.length < count,
  };
}

/**
 * STAGE 2: Evaluates Practice Attempt
 * Updates per-concept mastery and per-concept difficulty/streaks via storage.ts.
 */
export function evaluatePracticeSubmission(
  conceptId: string,
  answers: Record<string, string>
): PracticeResult {
  const conceptQuestions = getQuestionsByConceptId(conceptId);
  let correctCount = 0;
  const feedback: PracticeResult["feedback"] = [];

  for (const q of conceptQuestions) {
    if (!answers[q.id]) continue;
    const studentAns = answers[q.id].trim();
    const isCorrect = studentAns === q.correctAnswer;

    let mistakeTag: string | undefined;
    if (isCorrect) {
      correctCount++;
    } else {
      const chosen = q.options?.find((opt) => opt.id === studentAns);
      if (chosen?.mistakeTag) mistakeTag = chosen.mistakeTag;
    }

    feedback.push({
      questionId: q.id,
      selectedOption: studentAns,
      correctAnswer: q.correctAnswer,
      isCorrect,
      mistakeTag,
    });
  }

  const totalQuestions = feedback.length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Retrieve current concept progress from storage
  const curProg = getTopicProgress(conceptId);
  const prevMastery = curProg?.mastery;
  const prevDifficulty = curProg?.difficulty || 1;

  // Update mastery: first attempt sets directly, later 0.7 * old + 0.3 * new
  const updatedMastery = updateMastery(prevMastery, scorePercentage);

  // Update difficulty and streaks
  let consecCorrect = curProg?.consecutiveCorrect || 0;
  let consecIncorrect = curProg?.consecutiveIncorrect || 0;
  let updatedDifficulty = prevDifficulty;
  let diffChange: "promoted" | "demoted" | "maintained" = "maintained";

  if (scorePercentage >= 70) {
    consecCorrect += 1;
    consecIncorrect = 0;
    if (consecCorrect >= 3 && prevDifficulty < 3) {
      updatedDifficulty = (prevDifficulty + 1) as 1 | 2 | 3;
      consecCorrect = 0;
      diffChange = "promoted";
    }
  } else {
    consecIncorrect += 1;
    consecCorrect = 0;
    if (consecIncorrect >= 2 && prevDifficulty > 1) {
      updatedDifficulty = (prevDifficulty - 1) as 1 | 2 | 3;
      consecIncorrect = 0;
      diffChange = "demoted";
    }
  }

  // Save updates via storage.ts
  updateTopicProgress(conceptId, {
    mastery: updatedMastery,
    difficulty: updatedDifficulty,
    consecutiveCorrect: consecCorrect,
    consecutiveIncorrect: consecIncorrect,
    worksheetCompleted: true,
    worksheetScore: correctCount,
    worksheetTotal: totalQuestions,
  });

  return {
    conceptId,
    totalQuestions,
    correctCount,
    scorePercentage,
    previousMastery: prevMastery,
    updatedMastery,
    previousDifficulty: prevDifficulty,
    updatedDifficulty,
    difficultyChanged: diffChange,
    feedback,
  };
}

// ==========================================
// 4. STAGE 3: Test (Chapter Test)
// ==========================================

/**
 * STAGE 3: Chapter Test Generation
 * Assembles a comprehensive chapter test based on the student's weak and strong concepts.
 * Weak concepts (mastery < 60%) receive more questions at lower difficulty.
 * Strong concepts (mastery >= 80%) receive fewer questions at higher difficulty.
 */
export function generateChapterTest(
  chapterId: string,
  totalQuestions = 10
): {
  questions: Question[];
  conceptAllocation: Record<string, number>;
  shortfall: boolean;
} {
  const chapterConcepts = getConceptsByChapter(chapterId);
  if (chapterConcepts.length === 0) {
    return { questions: [], conceptAllocation: {}, shortfall: true };
  }

  const conceptAllocation: Record<string, number> = {};
  const selected: Question[] = [];

  // Determine weight for each concept based on current mastery
  const conceptWeights: { concept: Concept; weight: number; targetDiff: 1 | 2 | 3 }[] = [];

  for (const c of chapterConcepts) {
    const prog = getTopicProgress(c.id);
    const mastery = prog?.mastery !== undefined ? prog.mastery : 50;

    if (mastery < 60) {
      // Weak concept: more questions, foundational difficulty
      conceptWeights.push({ concept: c, weight: 3, targetDiff: 1 });
    } else if (mastery >= 80) {
      // Strong concept: fewer questions, advanced difficulty
      conceptWeights.push({ concept: c, weight: 1, targetDiff: 3 });
    } else {
      // Moderate concept
      conceptWeights.push({ concept: c, weight: 2, targetDiff: 2 });
    }
  }

  const totalWeight = conceptWeights.reduce((sum, cw) => sum + cw.weight, 0);

  // Allocate questions proportionally
  for (const cw of conceptWeights) {
    const share = Math.max(1, Math.round((cw.weight / totalWeight) * totalQuestions));
    conceptAllocation[cw.concept.id] = share;

    const available = getQuestionsByConceptId(cw.concept.id);
    const matched = available.filter((q) => q.difficulty === cw.targetDiff);

    for (const q of matched) {
      if (selected.filter((x) => x.conceptId === cw.concept.id).length >= share) break;
      if (!selected.some((x) => x.id === q.id)) selected.push(q);
    }

    // Supplement if matched difficulty ran out
    for (const q of available) {
      if (selected.filter((x) => x.conceptId === cw.concept.id).length >= share) break;
      if (!selected.some((x) => x.id === q.id)) selected.push(q);
    }
  }

  // Fill any remaining slots up to totalQuestions from the chapter's available question pool
  if (selected.length < totalQuestions) {
    for (const c of chapterConcepts) {
      const available = getQuestionsByConceptId(c.id);
      for (const q of available) {
        if (selected.length >= totalQuestions) break;
        if (!selected.some((x) => x.id === q.id)) {
          selected.push(q);
        }
      }
    }
  }

  return {
    questions: selected.slice(0, totalQuestions),
    conceptAllocation,
    shortfall: selected.length < totalQuestions,
  };
}

/**
 * STAGE 3: Evaluates Chapter Test
 * Computes overall chapter performance and updates per-concept mastery across all tested concepts.
 */
export function evaluateChapterTest(
  chapterId: string,
  answers: Record<string, string>
): ChapterTestResult {
  const chapterConcepts = getConceptsByChapter(chapterId);
  const conceptIds = chapterConcepts.map((c) => c.id);
  const chapterQuestions = questions.filter((q) => conceptIds.includes(q.conceptId));

  const conceptBreakdown: ChapterTestResult["conceptBreakdown"] = {};
  let totalCorrect = 0;
  let totalAnswered = 0;

  for (const c of chapterConcepts) {
    conceptBreakdown[c.id] = {
      conceptId: c.id,
      total: 0,
      correct: 0,
      scorePercentage: 0,
      updatedMastery: 0,
    };
  }

  for (const q of chapterQuestions) {
    if (!answers[q.id]) continue;
    totalAnswered++;
    const isCorrect = answers[q.id].trim() === q.correctAnswer;
    if (isCorrect) totalCorrect++;

    if (conceptBreakdown[q.conceptId]) {
      conceptBreakdown[q.conceptId].total += 1;
      if (isCorrect) conceptBreakdown[q.conceptId].correct += 1;
    }
  }

  const weakConcepts: string[] = [];
  const strongConcepts: string[] = [];

  // Update per-concept mastery in storage
  for (const c of chapterConcepts) {
    const data = conceptBreakdown[c.id];
    if (data && data.total > 0) {
      data.scorePercentage = Math.round((data.correct / data.total) * 100);
      const curProg = getTopicProgress(c.id);
      const newMastery = updateMastery(curProg?.mastery, data.scorePercentage);
      data.updatedMastery = newMastery;

      updateTopicProgress(c.id, { mastery: newMastery });

      if (newMastery < 60) weakConcepts.push(c.id);
      else if (newMastery >= 80) strongConcepts.push(c.id);
    }
  }

  const overallPercentage =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return {
    chapterId,
    totalQuestions: totalAnswered,
    correctCount: totalCorrect,
    scorePercentage: overallPercentage,
    passed: overallPercentage >= 70,
    conceptBreakdown,
    weakConcepts,
    strongConcepts,
  };
}

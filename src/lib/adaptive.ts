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
  ConfidenceLevel,
  RoutingAction,
  CandidateRootCause,
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

/**
 * Pure function: Computes recency weight for a question at questionIndex out of totalQuestions.
 * Uses exponential recency decay lambda^(totalQuestions - 1 - questionIndex).
 * Default lambda = 0.9.
 */
export function computeRecencyWeight(
  questionIndex: number,
  totalQuestions: number,
  lambda = 0.9
): number {
  if (totalQuestions <= 1) return 1.0;
  const stepsFromEnd = Math.max(0, totalQuestions - 1 - questionIndex);
  return Math.pow(lambda, stepsFromEnd);
}

/**
 * Pure function: Returns all directed prerequisite ancestors up to maxDepth (default 3).
 * Cycle-protected via visited set.
 */
export function getPrerequisitesGraph(
  conceptId: string,
  maxDepth = 3
): Array<{ conceptId: string; depth: number }> {
  const results: Array<{ conceptId: string; depth: number }> = [];
  const visited = new Set<string>([conceptId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: conceptId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= maxDepth) continue;

    const node = getConceptById(current.id);
    if (!node || !node.prerequisites) continue;

    for (const prereqId of node.prerequisites) {
      if (!visited.has(prereqId)) {
        visited.add(prereqId);
        const nextDepth = current.depth + 1;
        results.push({ conceptId: prereqId, depth: nextDepth });
        queue.push({ id: prereqId, depth: nextDepth });
      }
    }
  }

  return results;
}

/**
 * Pure function: Distance decay factor per level.
 * Distance decay applies ONLY to evidence propagated up from a tag at a higher level.
 * Evidence from a tag whose mapped root is concept C counts at full weight for C (depth 0 = 1.0).
 * Prerequisite ancestors receive 0.7^depth (max depth 3).
 */
export function computeDistanceWeight(depth: number): number {
  if (depth === 0) return 1.0;
  if (depth > 0 && depth <= 3) return Math.pow(0.7, depth);
  return 0.0;
}

export interface ErrorEvent {
  tag: string;
  questionIndex?: number;
  totalQuestions?: number;
  conceptId?: string;
}

/**
 * Pure function: Ranks candidate root causes from error events with recency decay,
 * distance decay propagation to prerequisites, tie-breaking toward deeper prerequisites,
 * and calibrated confidence thresholds.
 */
export function rankCandidateRootCauses(
  errorEvents: ErrorEvent[],
  anchorConceptId: string,
  minQuestionsRequired = 3
): CandidateRootCause[] {
  if (errorEvents.length === 0) return [];

  const candidateMap: Record<
    string,
    {
      conceptId: string;
      score: number;
      directEvidenceCount: number;
      propagatedEvidenceScore: number;
      isDirectRoot: boolean;
      tags: Set<string>;
    }
  > = {};

  const ensureCandidate = (id: string) => {
    if (!candidateMap[id]) {
      candidateMap[id] = {
        conceptId: id,
        score: 0,
        directEvidenceCount: 0,
        propagatedEvidenceScore: 0,
        isDirectRoot: false,
        tags: new Set<string>(),
      };
    }
    return candidateMap[id];
  };

  const defaultTotalQ = errorEvents.length > 0 ? (errorEvents[0].totalQuestions || Math.max(6, errorEvents.length)) : 6;

  for (let idx = 0; idx < errorEvents.length; idx++) {
    const ev = errorEvents[idx];
    const tag = ev.tag;
    if (!tag) continue;

    const mappedRoot = tagRoots[tag] || ev.conceptId;
    if (!mappedRoot) continue;

    const qIdx = typeof ev.questionIndex === "number" ? ev.questionIndex : idx;
    const totalQ = ev.totalQuestions || defaultTotalQ;
    const recency = computeRecencyWeight(qIdx, totalQ, 0.9);

    // 1. Direct Root Concept C receives full weight (distance weight = 1.0)
    const directCandidate = ensureCandidate(mappedRoot);
    directCandidate.score += recency * 1.0;
    directCandidate.directEvidenceCount += 1;
    directCandidate.isDirectRoot = true;
    directCandidate.tags.add(tag);

    // 2. Propagate to prerequisites of C up to depth 3 with distance decay (0.7^d)
    const prereqs = getPrerequisitesGraph(mappedRoot, 3);
    for (const p of prereqs) {
      const distWeight = computeDistanceWeight(p.depth);
      const contrib = recency * distWeight;
      const prereqCandidate = ensureCandidate(p.conceptId);
      prereqCandidate.score += contrib;
      prereqCandidate.propagatedEvidenceScore += contrib;
      prereqCandidate.tags.add(tag);
    }
  }

  // Anchor concept depth helper for tie-breaking
  const getConceptDepth = (id: string): number => {
    const c = getConceptById(id);
    const gradeLevel = c ? c.class : 10;
    return 10 - gradeLevel;
  };

  const candidates: CandidateRootCause[] = Object.values(candidateMap).map((cand) => {
    const concept = getConceptById(cand.conceptId);
    const score = Number(cand.score.toFixed(4));
    const depth = getConceptDepth(cand.conceptId);

    // Calibrated Confidence Thresholds:
    // < 1.10: insufficient (isolated slip / low evidence)
    // 1.10 <= score < 2.00: low (recurrent evidence -> confirmation check only)
    // 2.00 <= score < 2.75: medium (convergent errors -> gap card)
    // >= 2.75: high (strong repeated evidence -> gap card)
    let confidence: ConfidenceLevel = "insufficient";
    let routing: RoutingAction = "none";

    if (score < 1.10) {
      confidence = "insufficient";
      routing = "none";
    } else if (score < 2.00) {
      confidence = "low";
      routing = "confirmation_only";
    } else if (score < 2.75) {
      confidence = "medium";
      routing = "gap_card";
    } else {
      confidence = "high";
      routing = "gap_card";
    }

    const conceptName = concept ? concept.name.en : cand.conceptId;
    const gradeText = concept ? `Class ${concept.class}` : "foundational";
    let reason = "";

    if (confidence === "insufficient") {
      reason = `Single isolated slip or insufficient evidence for ${gradeText} concept "${conceptName}" (score: ${score.toFixed(2)}). Classified as possible careless slip; no routing.`;
    } else if (confidence === "low") {
      reason = `Recurrent misconception evidence points to ${gradeText} concept "${conceptName}" (score: ${score.toFixed(2)}). Low confidence routes to confirmation check.`;
    } else if (confidence === "medium") {
      reason = `Multiple convergent error patterns establish foundational prerequisite gap in ${gradeText} concept "${conceptName}" (score: ${score.toFixed(2)}). Routes to remedial gap card.`;
    } else {
      reason = `Strong persistent error evidence identifies critical prerequisite gap in ${gradeText} concept "${conceptName}" (score: ${score.toFixed(2)}). Routes directly to remedial gap card.`;
    }

    const prerequisitePath = findPrerequisitePath(anchorConceptId, cand.conceptId);

    return {
      conceptId: cand.conceptId,
      concept,
      score,
      confidence,
      routing,
      depth,
      directEvidenceCount: cand.directEvidenceCount,
      propagatedEvidenceScore: Number(cand.propagatedEvidenceScore.toFixed(4)),
      reason,
      isDirectRoot: cand.isDirectRoot,
      prerequisitePath,
    };
  });

  // Ranking & Tie-breaking:
  // 1. Score descending
  // 2. Tie-break toward deeper prerequisite (higher depth / earlier grade)
  // 3. Deterministic alphabetical sort on conceptId
  candidates.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.0001) {
      return b.score - a.score;
    }
    if (b.depth !== a.depth) {
      return b.depth - a.depth;
    }
    return a.conceptId.localeCompare(b.conceptId);
  });

  return candidates;
}

export function evaluateGapTracing(
  currentConceptId: string,
  mistakeTags: string[] | ErrorEvent[],
  minQuestionsRequired = 3,
  assessmentTotalQuestions?: number
): GapTraceResult {
  const errorEvents: ErrorEvent[] = [];
  const defaultTotal = assessmentTotalQuestions || (Array.isArray(mistakeTags) ? Math.max(6, mistakeTags.length) : 6);

  if (Array.isArray(mistakeTags)) {
    for (let i = 0; i < mistakeTags.length; i++) {
      const item = mistakeTags[i];
      if (typeof item === "string") {
        if (item.trim()) {
          errorEvents.push({
            tag: item.trim(),
            questionIndex: i,
            totalQuestions: defaultTotal,
          });
        }
      } else if (item && typeof item === "object" && item.tag) {
        errorEvents.push({
          tag: item.tag,
          questionIndex: typeof item.questionIndex === "number" ? item.questionIndex : i,
          totalQuestions: item.totalQuestions || defaultTotal,
          conceptId: item.conceptId,
        });
      }
    }
  }

  const rawTags = errorEvents.map((e) => e.tag);
  const candidates = rankCandidateRootCauses(errorEvents, currentConceptId, minQuestionsRequired);

  if (candidates.length === 0) {
    return {
      confirmed: false,
      rootConceptId: null,
      triggerReason: null,
      mistakeTags: rawTags,
      prerequisitePath: [],
      canRoute: false,
      confidence: "insufficient",
      routing: "none",
      score: 0,
      candidates: [],
      plainLanguageReason:
        "No recurrent misconception threshold reached (isolated slips classified as careless).",
    };
  }

  const topCandidate = candidates[0];

  // If top candidate has insufficient confidence, no routing
  if (topCandidate.confidence === "insufficient") {
    return {
      confirmed: false,
      rootConceptId: null,
      rootConcept: topCandidate.concept,
      triggerReason: null,
      mistakeTags: rawTags,
      prerequisitePath: topCandidate.prerequisitePath,
      canRoute: false,
      confidence: "insufficient",
      routing: "none",
      score: topCandidate.score,
      candidates,
      plainLanguageReason: topCandidate.reason,
    };
  }

  // Determine trigger reason for backward-compatibility with tests:
  const tagCounts: Record<string, number> = {};
  for (const t of rawTags) {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  }
  let triggerReason: "repeated_tag" | "convergent_tags" | "ranked_root" = "ranked_root";
  for (const count of Object.values(tagCounts)) {
    if (count >= 2) {
      triggerReason = "repeated_tag";
      break;
    }
  }
  if (triggerReason === "ranked_root" && rawTags.length >= 2) {
    triggerReason = "convergent_tags";
  }

  const enoughQuestions = hasEnoughQuestions(topCandidate.conceptId, minQuestionsRequired);

  return {
    confirmed: true,
    rootConceptId: topCandidate.conceptId,
    rootConcept: topCandidate.concept,
    triggerReason,
    mistakeTags: rawTags,
    prerequisitePath: topCandidate.prerequisitePath,
    canRoute: enoughQuestions,
    confidence: topCandidate.confidence,
    routing: topCandidate.routing,
    score: topCandidate.score,
    candidates,
    shortfallReport: enoughQuestions
      ? undefined
      : `Root concept ${topCandidate.conceptId} has fewer than ${minQuestionsRequired} questions in the question bank. Routing withheld.`,
    plainLanguageReason: topCandidate.reason,
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

  // Build structured error events with question indices and recency context
  const errorEvents: ErrorEvent[] = [];
  feedback.forEach((f, idx) => {
    if (!f.isCorrect && f.mistakeTag) {
      errorEvents.push({
        tag: f.mistakeTag,
        questionIndex: idx,
        totalQuestions: feedback.length,
        conceptId: f.conceptId,
      });
    }
  });

  // Run gap tracing with primary chapter concept as current anchor
  const anchorConceptId = conceptIds[0] || "";
  const gapAnalysis = evaluateGapTracing(anchorConceptId, errorEvents, minQuestionsRequired, feedback.length);

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

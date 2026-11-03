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
  AttemptComparison,
  PersonalizedWorksheetMeta,
} from "./types";
import {
  getConceptById,
  getConceptsByChapter,
  concepts,
  tagRoots,
  hasEnoughQuestions,
  getQuestionsByConceptId,
  getQuestionsByChapterId,
  getQuestionById,
} from "./curriculum";
import {
  getActiveProfile,
  saveProfile,
  getTopicProgress,
  updateTopicProgress,
  recordWorksheetAttempt,
  resolveActiveGap,
} from "./storage";
import {
  computeNextRevisionSchedule,
  compareAttempts,
} from "./revision";

export interface AdaptiveDiagnosis {
  mistakeTag: string;
  identifiedGap: string;
  suggestedPrerequisite?: Concept;
  recommendationText: string;
}


export type MisconceptionCategory =
  | "sign_error"
  | "operation_confusion"
  | "algebraic_rule"
  | "spatial_ordering"
  | "fraction_or_ratio"
  | "calculation_slip"
  | "unclassified_slip";

export interface MisconceptionInsight {
  category: MisconceptionCategory;
  title: string;
  educationalFeedback: string;
  foundationalConceptId?: string;
}

/**
 * Classifies distractor mistake tags into pedagogically actionable misconception categories.
 * Provides clear, age-appropriate educational guidance for students aged 11–16.
 */
export function classifyMisconception(tag?: string): MisconceptionInsight {
  if (!tag || tag.trim() === "") {
    return {
      category: "unclassified_slip",
      title: "Review Question",
      educationalFeedback: "Check the step-by-step solution to understand the correct mathematical method.",
    };
  }

  const t = tag.toLowerCase();

  // 1. Sign & Negative Integer Errors
  if (
    t.includes("sign") ||
    t.includes("negative") ||
    t.includes("below_zero") ||
    t.includes("minus") ||
    t.includes("invert_sign") ||
    t.includes("sign_flip") ||
    t.includes("root_sign")
  ) {
    if (t.includes("times") || t.includes("product") || t.includes("multipl") || t.includes("squared_negative")) {
      return {
        category: "sign_error",
        title: "Sign Rule in Multiplication",
        educationalFeedback: "Remember: multiplying two negative numbers yields a POSITIVE result: (−) × (−) = (+). Multiplying opposite signs yields a negative: (−) × (+) = (−).",
        foundationalConceptId: "c7-int-02",
      };
    }
    if (t.includes("root") || t.includes("factor")) {
      return {
        category: "sign_error",
        title: "Sign Inversion in Equation Roots",
        educationalFeedback: "When solving (x − a)(x − b) = 0, setting each factor to zero flips the sign: x − a = 0 gives x = +a, and x − b = 0 gives x = +b.",
        foundationalConceptId: "c10-quad-01",
      };
    }
    return {
      category: "sign_error",
      title: "Integer Sign Operations",
      educationalFeedback: "When adding or subtracting integers with opposite signs, subtract the smaller magnitude from the larger and keep the sign of the larger absolute value.",
      foundationalConceptId: "c7-int-01",
    };
  }

  // 2. Operation Confusion
  if (
    t.includes("added_instead_of_multiplied") ||
    t.includes("multiplied_instead_of_added") ||
    t.includes("multiplied_by_two_instead_of_squaring") ||
    t.includes("added_constants_instead_of_multiplied") ||
    t.includes("swapped_sum_and_product")
  ) {
    return {
      category: "operation_confusion",
      title: "Operation Mix-up",
      educationalFeedback: "Be careful with operations! Squaring a number (x²) means multiplying by itself (x × x), not multiplying by 2.",
      foundationalConceptId: "c8-exp-01",
    };
  }

  // 3. Algebraic Rules: Distribution, Expansion, Identities, Factorization
  if (
    t.includes("distribut") ||
    t.includes("bracket") ||
    t.includes("second_term") ||
    t.includes("middle_term") ||
    t.includes("difference_of_squares") ||
    t.includes("linear_term") ||
    t.includes("discriminant") ||
    t.includes("factor_pair") ||
    t.includes("nature_of_roots")
  ) {
    if (t.includes("distribut") || t.includes("second_term")) {
      return {
        category: "algebraic_rule",
        title: "Distributive Property",
        educationalFeedback: "Apply the distributive property: a(b + c) = ab + ac. Make sure to multiply the outside factor by EVERY term inside the bracket.",
        foundationalConceptId: "c8-dist-01",
      };
    }
    if (t.includes("difference_of_squares")) {
      return {
        category: "algebraic_rule",
        title: "Difference of Squares Identity",
        educationalFeedback: "Remember the identity: (a + b)(a − b) = a² − b². Notice there is NO middle linear term in a difference of squares!",
        foundationalConceptId: "c9-id-01",
      };
    }
    if (t.includes("middle_term") || t.includes("factor_of_two")) {
      return {
        category: "algebraic_rule",
        title: "Binomial Expansion Identity",
        educationalFeedback: "When squaring a binomial (a + b)², remember the middle term: a² + 2ab + b². Don't drop the 2ab term!",
        foundationalConceptId: "c9-id-01",
      };
    }
    if (t.includes("factor_pair")) {
      return {
        category: "algebraic_rule",
        title: "Quadratic Factor Splitting",
        educationalFeedback: "When factorising x² + bx + c, find two numbers that MULTIPLY to c and ADD up to b.",
        foundationalConceptId: "c9-id-02",
      };
    }
    return {
      category: "algebraic_rule",
      title: "Algebraic Rule Application",
      educationalFeedback: "Carefully follow algebraic rules for expanding, simplifying, and grouping like terms.",
      foundationalConceptId: "c9-id-01",
    };
  }

  // 4. Number Line & Spatial Ordering
  if (
    t.includes("number_line") ||
    t.includes("ordering") ||
    t.includes("descending") ||
    t.includes("ascending") ||
    t.includes("absolute_value") ||
    t.includes("zero_as_smallest") ||
    t.includes("greater_than_zero")
  ) {
    return {
      category: "spatial_ordering",
      title: "Number Line Positioning",
      educationalFeedback: "On the number line, numbers become smaller as you move further left. For example, −7 is smaller than −2 because it lies further to the left.",
      foundationalConceptId: "c6-neg-01",
    };
  }

  // 5. Fraction & Rational Operations
  if (t.includes("fraction") || t.includes("denominator") || t.includes("numerator") || t.includes("ratio")) {
    return {
      category: "fraction_or_ratio",
      title: "Fraction Operations",
      educationalFeedback: "When adding or subtracting fractions, find a common denominator first. You cannot simply add across numerators and denominators.",
      foundationalConceptId: "c7-num-01",
    };
  }

  // 6. Calculation Slips
  return {
    category: "calculation_slip",
    title: "Arithmetic Check",
    educationalFeedback: "Your reasoning was close, but a small arithmetic slip occurred. Review your step-by-step calculations carefully.",
  };
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
    misconceptionCategory?: string;
    educationalFeedback?: string;
    conceptId?: string;
  }[];
  gapResolved?: boolean;
  comparison?: AttemptComparison;
  nextRevisionAt?: string;
  revisionLevel?: number;
  conceptsPracticed?: string[];
  conceptsNeedingAttention?: string[];
  nextAction?: {
    title: string;
    description: string;
    href: string;
  };
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
      accuracyCategory?: "mastered" | "in_progress" | "needs_attention";
    }
  >;
  diagnosticAnalysis?: {
    probableGaps: string[];
    carelessSlips: string[];
    insufficientEvidence: string[];
  };
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
  count = 2,
  options?: {
    excludeQuestionIds?: string[];
    offset?: number;
  }
): Question[] {
  const pool = getQuestionsByConceptId(rootConceptId);
  const excluded = new Set(options?.excludeQuestionIds || []);
  const available = pool.filter((q) => !excluded.has(q.id));
  const poolToUse = available.length >= count ? available : pool;
  const sorted = [...poolToUse].sort((a, b) => a.difficulty - b.difficulty);
  const offset = options?.offset || 0;
  const start = sorted.length > 0 ? (offset % sorted.length) : 0;
  const rotated = [...sorted.slice(start), ...sorted.slice(0, start)];
  return rotated.slice(0, count);
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
  requestedCount = 6,
  options?: {
    excludeQuestionIds?: string[];
    offset?: number;
    seed?: number;
  }
): { questions: Question[]; shortfall: boolean } {
  const chapterConcepts = getConceptsByChapter(chapterId);
  if (chapterConcepts.length === 0) {
    return { questions: [], shortfall: true };
  }

  const collected: Question[] = [];
  const conceptIds = chapterConcepts.map((c) => c.id);

  // Pool all questions for this chapter's concepts
  const pool = getQuestionsByChapterId(chapterId);

  if (pool.length < requestedCount) {
    return { questions: pool, shortfall: true };
  }

  const excluded = new Set(options?.excludeQuestionIds || []);
  const offset = options?.offset || 0;

  // Balanced selection across concepts and difficulty (1, 2, 3)
  // Pass 1: Prioritize fresh unattempted questions across concepts and difficulties
  for (const diff of [1, 2, 3] as const) {
    for (const cId of conceptIds) {
      if (collected.length >= requestedCount) break;
      const candidates = pool.filter(
        (q) => q.conceptId === cId && q.difficulty === diff && !collected.some((x) => x.id === q.id)
      );
      if (candidates.length === 0) continue;
      const freshCandidates = candidates.filter((q) => !excluded.has(q.id));
      if (freshCandidates.length > 0) {
        const chosen = freshCandidates[offset % freshCandidates.length];
        if (chosen) collected.push(chosen);
      }
    }
  }

  // Pass 2: Fill remaining slots from any fresh questions in the chapter pool
  if (collected.length < requestedCount) {
    const freshRemainder = pool.filter(
      (q) => !collected.some((x) => x.id === q.id) && !excluded.has(q.id)
    );
    const startIdx = freshRemainder.length > 0 ? (offset % freshRemainder.length) : 0;
    const rotatedFresh = [...freshRemainder.slice(startIdx), ...freshRemainder.slice(0, startIdx)];

    for (const q of rotatedFresh) {
      if (collected.length >= requestedCount) break;
      collected.push(q);
    }
  }

  // Pass 3: Only if all fresh questions are exhausted, recycle from remaining chapter questions
  if (collected.length < requestedCount) {
    const recycledPool = pool.filter((q) => !collected.some((x) => x.id === q.id));
    const startIdx = recycledPool.length > 0 ? (offset % recycledPool.length) : 0;
    const rotatedRecycled = [...recycledPool.slice(startIdx), ...recycledPool.slice(0, startIdx)];

    for (const q of rotatedRecycled) {
      if (collected.length >= requestedCount) break;
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
  const diagnosticPool = getQuestionsByChapterId(chapterId);

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

export interface PersonalizedWorksheet {
  worksheetTitle: string;
  concept: Concept;
  targetDifficulty: 1 | 2 | 3;
  isPersonalized: boolean;
  personalizedReason: string;
  questions: Question[];
  prerequisiteConceptsIncluded: Array<{
    conceptId: string;
    name: string;
    count: number;
  }>;
  shortfall: boolean;
}

/**
 * Phase 3: Personalized Worksheet Generator
 * Creates tailored practice sessions based on each student's actual learning gaps,
 * weak concepts, missing prerequisites, previous errors, and difficulty progression.
 * Strictly uses verified questions from the question bank.
 */
export function generatePersonalizedWorksheet(
  conceptId: string,
  profile: LearnerProfile | null = null,
  targetCount = 5,
  options?: {
    excludeQuestionIds?: string[];
    offset?: number;
    seed?: number;
  }
): PersonalizedWorksheet {
  const concept = getConceptById(conceptId);
  if (!concept) {
    throw new Error(`Concept ${conceptId} not found in curriculum`);
  }

  const effectiveProfile = profile || getActiveProfile();
  const progress = effectiveProfile?.topicProgress?.[conceptId] || getTopicProgress(conceptId);
  const mastery = progress?.mastery ?? 50;
  const currentDiff = (progress?.difficulty || 1) as 1 | 2 | 3;

  const conceptQuestions = getQuestionsByConceptId(conceptId);
  const selectedQuestions: Question[] = [];
  const selectedIds = new Set<string>();
  const prereqsIncluded: Array<{ conceptId: string; name: string; count: number }> = [];

  const excluded = new Set(options?.excludeQuestionIds || []);
  const attemptCount = progress?.attemptHistory?.length ?? 0;
  const offset = options?.offset !== undefined ? options.offset : attemptCount;

  let isPersonalized = false;
  let personalizedReason = "Standard adaptive practice session.";
  let targetDifficulty: 1 | 2 | 3 = currentDiff;

  // 1. Condition A: Student has an Active Foundational Gap
  if (effectiveProfile?.activeGap && effectiveProfile.activeGap.status !== "resolved") {
    const rootId = effectiveProfile.activeGap.rootConceptId;
    const rootConcept = getConceptById(rootId);
    if (rootConcept && rootId !== conceptId) {
      const rootQuestions = getQuestionsByConceptId(rootId);
      // Pick 1-2 foundational questions from root gap
      const foundational = rootQuestions.filter((q) => q.difficulty === 1);
      const rootPool = foundational.length > 0 ? foundational : rootQuestions;
      const unattemptedRoot = rootPool.filter((q) => !excluded.has(q.id));
      const poolToUse = unattemptedRoot.length > 0 ? unattemptedRoot : rootPool;
      const rootStart = poolToUse.length > 0 ? (offset % poolToUse.length) : 0;
      const rotatedRoot = [...poolToUse.slice(rootStart), ...poolToUse.slice(0, rootStart)];
      const countToTake = Math.min(2, rotatedRoot.length);
      const chosen = rotatedRoot.slice(0, countToTake);

      for (const q of chosen) {
        if (!selectedIds.has(q.id)) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
        }
      }

      if (chosen.length > 0) {
        prereqsIncluded.push({
          conceptId: rootId,
          name: rootConcept.name.en,
          count: chosen.length,
        });
        isPersonalized = true;
        personalizedReason = `Personalized practice: Includes foundational questions from ${rootConcept.name.en} to repair identified learning gaps.`;
      }
    }
  }

  // 2. Condition B: Struggling student (assessed mastery < 60% or repeated errors)
  if (
    !isPersonalized &&
    ((progress?.mastery !== undefined && progress.mastery < 60) ||
      (progress?.consecutiveIncorrect && progress.consecutiveIncorrect >= 2))
  ) {
    targetDifficulty = 1;
    // Check if concept has immediate prerequisite
    if (concept.prerequisites && concept.prerequisites.length > 0) {
      const prereqId = concept.prerequisites[0];
      const prereqConcept = getConceptById(prereqId);
      if (prereqConcept) {
        const prereqQuestions = getQuestionsByConceptId(prereqId).filter((q) => q.difficulty === 1);
        const unattemptedPrereq = prereqQuestions.filter((q) => !excluded.has(q.id));
        const prereqPool = unattemptedPrereq.length > 0 ? unattemptedPrereq : prereqQuestions;
        if (prereqPool.length > 0) {
          const q = prereqPool[offset % prereqPool.length];
          selectedQuestions.push(q);
          selectedIds.add(q.id);
          prereqsIncluded.push({
            conceptId: prereqId,
            name: prereqConcept.name.en,
            count: 1,
          });
        }
      }
    }
    isPersonalized = true;
    personalizedReason = `Foundational reinforcement: Tailored to core problem-solving steps and mistake recovery.`;
  }
  // 3. Condition C: Advancing / High Mastery (mastery >= 80% or streak >= 3)
  else if (!isPersonalized && (mastery >= 80 || (progress?.consecutiveCorrect && progress.consecutiveCorrect >= 3))) {
    targetDifficulty = Math.min(3, currentDiff + 1) as 1 | 2 | 3;
    isPersonalized = true;
    personalizedReason = `Mastery challenge: High-order multi-step questions to advance to the next level.`;
  }
  // 4. Condition D: Intermediate / Standard Progress (mastery 60-79%)
  else if (!isPersonalized) {
    targetDifficulty = currentDiff;
    isPersonalized = true;
    personalizedReason = `Adaptive balanced practice tailored to your current performance level.`;
  }

  // Fill remaining questions using hierarchical anti-repetition:
  // 1. Fresh questions of targetDifficulty
  const unattemptedTarget = conceptQuestions.filter(
    (q) => q.difficulty === targetDifficulty && !selectedIds.has(q.id) && !excluded.has(q.id)
  );
  const tStart = unattemptedTarget.length > 0 ? (offset % unattemptedTarget.length) : 0;
  const rotatedTarget = [...unattemptedTarget.slice(tStart), ...unattemptedTarget.slice(0, tStart)];

  for (const q of rotatedTarget) {
    if (selectedQuestions.length >= targetCount) break;
    selectedQuestions.push(q);
    selectedIds.add(q.id);
  }

  // 2. If still needed, fresh questions from other difficulties
  if (selectedQuestions.length < targetCount) {
    const unattemptedOther = conceptQuestions
      .filter((q) => !selectedIds.has(q.id) && !excluded.has(q.id))
      .sort((a, b) =>
        targetDifficulty === 3 ? b.difficulty - a.difficulty : a.difficulty - b.difficulty
      );
    const oStart = unattemptedOther.length > 0 ? (offset % unattemptedOther.length) : 0;
    const rotatedOther = [...unattemptedOther.slice(oStart), ...unattemptedOther.slice(0, oStart)];

    for (const q of rotatedOther) {
      if (selectedQuestions.length >= targetCount) break;
      selectedQuestions.push(q);
      selectedIds.add(q.id);
    }
  }

  // 3. If no excluded were specified, or if fresh pool was smaller than targetCount, use rotated target/other
  if (selectedQuestions.length < targetCount) {
    const fallbackPool = conceptQuestions
      .filter((q) => !selectedIds.has(q.id))
      .sort((a, b) =>
        Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
      );
    const fStart = fallbackPool.length > 0 ? (offset % fallbackPool.length) : 0;
    const rotatedFallback = [...fallbackPool.slice(fStart), ...fallbackPool.slice(0, fStart)];

    for (const q of rotatedFallback) {
      if (selectedQuestions.length >= targetCount) break;
      selectedQuestions.push(q);
      selectedIds.add(q.id);
    }
  }

  return {
    worksheetTitle: `${concept.name.en} • Practice Worksheet`,
    concept,
    targetDifficulty,
    isPersonalized,
    personalizedReason,
    questions: selectedQuestions,
    prerequisiteConceptsIncluded: prereqsIncluded,
    shortfall: selectedQuestions.length < targetCount,
  };
}

/**
 * STAGE 2: Solve (Adaptive Practice)
 * Selects questions matching student's current adaptive profile and learning gaps.
 */
export function selectPracticeQuestions(
  conceptId: string,
  count = 5,
  profile?: LearnerProfile | null
): {
  questions: Question[];
  targetDifficulty: 1 | 2 | 3;
  shortfall: boolean;
  isPersonalized?: boolean;
  personalizedReason?: string;
  prerequisiteConceptsIncluded?: Array<{
    conceptId: string;
    name: string;
    count: number;
  }>;
} {
  const personalized = generatePersonalizedWorksheet(conceptId, profile, count);
  return {
    questions: personalized.questions,
    targetDifficulty: personalized.targetDifficulty,
    shortfall: personalized.shortfall,
    isPersonalized: personalized.isPersonalized,
    personalizedReason: personalized.personalizedReason,
    prerequisiteConceptsIncluded: personalized.prerequisiteConceptsIncluded,
  };
}

/**
 * STAGE 2: Evaluates Practice Attempt
 * Updates per-concept mastery, difficulty, spaced revision schedule,
 * and computes measurable improvement comparison vs previous attempt.
 */
export function evaluatePracticeSubmission(
  conceptId: string,
  answers: Record<string, string>,
  options?: {
    studentProfile?: LearnerProfile | null;
    isPersonalized?: boolean;
  }
): PracticeResult {
  const conceptQuestions = getQuestionsByConceptId(conceptId);
  let correctCount = 0;
  const feedback: PracticeResult["feedback"] = [];
  const conceptsPracticedSet = new Set<string>([conceptId]);
  const conceptsNeedingAttentionSet = new Set<string>();

  for (const [qid, rawAns] of Object.entries(answers)) {
    if (!rawAns || typeof rawAns !== "string") continue;
    const studentAns = rawAns.trim();

    // Look up question in conceptQuestions or fallback to getQuestionById
    const q =
      conceptQuestions.find((item) => item.id === qid) || getQuestionById(qid);

    if (!q) continue;

    conceptsPracticedSet.add(q.conceptId);

    const isCorrect = studentAns === q.correctAnswer;
    let mistakeTag: string | undefined;
    let misconceptionCategory: string | undefined;
    let educationalFeedback: string | undefined;

    if (isCorrect) {
      correctCount++;
    } else {
      conceptsNeedingAttentionSet.add(q.conceptId);
      const chosen = q.options?.find((opt) => opt.id === studentAns);
      if (chosen?.mistakeTag) {
        mistakeTag = chosen.mistakeTag;
        const insight = classifyMisconception(mistakeTag);
        misconceptionCategory = insight.category;
        educationalFeedback = insight.educationalFeedback;
      } else {
        const insight = classifyMisconception();
        misconceptionCategory = insight.category;
        educationalFeedback = insight.educationalFeedback;
      }
    }

    feedback.push({
      questionId: q.id,
      selectedOption: studentAns,
      correctAnswer: q.correctAnswer,
      isCorrect,
      mistakeTag,
      misconceptionCategory,
      educationalFeedback,
      conceptId: q.conceptId,
    });
  }

  const totalQuestions = feedback.length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Retrieve current concept progress from storage
  const curProg = getTopicProgress(conceptId);
  const prevMastery = curProg?.mastery;
  const prevDifficulty = (curProg?.difficulty || 1) as 1 | 2 | 3;

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

  // Spaced repetition schedule calculation
  const revSchedule = computeNextRevisionSchedule(
    scorePercentage,
    curProg?.revisionLevel || 0
  );

  // Compare performance against previous attempt (if one exists)
  const comparison = compareAttempts(correctCount, totalQuestions, curProg || undefined);

  // Check if this attempt resolves an active gap
  const targetConcept = getConceptById(conceptId);
  const gapResolved = resolveActiveGap(
    conceptId,
    scorePercentage,
    targetConcept?.name.en
  );

  // Record completed attempt in storage with attemptHistory
  recordWorksheetAttempt(
    conceptId,
    correctCount,
    totalQuestions,
    updatedDifficulty,
    options?.isPersonalized || false,
    revSchedule.nextRevisionAt,
    revSchedule.revisionLevel
  );

  // Update mastery & streaks on topic progress
  updateTopicProgress(conceptId, {
    mastery: updatedMastery,
    difficulty: updatedDifficulty,
    consecutiveCorrect: consecCorrect,
    consecutiveIncorrect: consecIncorrect,
    worksheetCompleted: true,
    worksheetScore: correctCount,
    worksheetTotal: totalQuestions,
  });

  // Next recommended action
  let nextAction: PracticeResult["nextAction"];
  if (scorePercentage < 70) {
    nextAction = {
      title: `Review ${targetConcept?.name.en || "Lesson"}`,
      description: "Review the step-by-step worked examples to strengthen this topic.",
      href: `/lesson/${conceptId}`,
    };
  } else if (gapResolved) {
    nextAction = {
      title: "Return to Main Learning Path",
      description: "Foundational prerequisite repaired! Continue your chapter journey.",
      href: "/",
    };
  } else {
    nextAction = {
      title: `Practice Level ${updatedDifficulty}`,
      description: "Keep your streak going with more advanced exercises.",
      href: `/student/worksheet/${conceptId}`,
    };
  }

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
    gapResolved,
    comparison,
    nextRevisionAt: revSchedule.nextRevisionAt,
    revisionLevel: revSchedule.revisionLevel,
    conceptsPracticed: Array.from(conceptsPracticedSet),
    conceptsNeedingAttention: Array.from(conceptsNeedingAttentionSet),
    nextAction,
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
  totalQuestions = 10,
  options?: {
    excludeQuestionIds?: string[];
    seed?: number;
    offset?: number;
  }
): {
  questions: Question[];
  conceptAllocation: Record<string, number>;
  shortfall: boolean;
} {
  const chapterConcepts = getConceptsByChapter(chapterId);
  if (chapterConcepts.length === 0) {
    return { questions: [], conceptAllocation: {}, shortfall: true };
  }

  const excluded = new Set(options?.excludeQuestionIds || []);
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

    const available = getQuestionsByConceptId(cw.concept.id).filter((q) => !excluded.has(q.id));
    const matched = available.filter((q) => q.difficulty === cw.targetDiff);
    const poolToUse = matched.length > 0 ? matched : available;
    const offset = options?.offset || 0;
    const startIdx = poolToUse.length > 0 ? (offset % poolToUse.length) : 0;
    const rotated = [...poolToUse.slice(startIdx), ...poolToUse.slice(0, startIdx)];

    for (const q of rotated) {
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
      const available = getQuestionsByConceptId(c.id).filter((q) => !excluded.has(q.id));
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
 * Also evaluates accuracy categories (mastered, in_progress, needs_attention) and diagnostic root-cause indicators.
 */
export function evaluateChapterTest(
  chapterId: string,
  answers: Record<string, string>
): ChapterTestResult {
  const chapterConcepts = getConceptsByChapter(chapterId);
  const conceptIds = chapterConcepts.map((c) => c.id);
  const chapterQuestions = getQuestionsByChapterId(chapterId);

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
      accuracyCategory: "needs_attention",
    };
  }

  const incorrectEvents: ErrorEvent[] = [];
  let answerIndex = 0;

  for (const q of chapterQuestions) {
    if (!answers[q.id]) continue;
    totalAnswered++;
    const isCorrect = answers[q.id].trim() === q.correctAnswer;
    if (isCorrect) {
      totalCorrect++;
    } else {
      const selectedOpt = q.options?.find((o) => o.id === answers[q.id].trim());
      if (selectedOpt?.mistakeTag) {
        incorrectEvents.push({
          conceptId: q.conceptId,
          tag: selectedOpt.mistakeTag,
          questionIndex: answerIndex,
          totalQuestions: chapterQuestions.length,
        });
      }
    }
    answerIndex++;

    if (conceptBreakdown[q.conceptId]) {
      conceptBreakdown[q.conceptId].total += 1;
      if (isCorrect) conceptBreakdown[q.conceptId].correct += 1;
    }
  }

  const weakConcepts: string[] = [];
  const strongConcepts: string[] = [];

  // Update per-concept mastery in storage and compute blueprint categories
  for (const c of chapterConcepts) {
    const data = conceptBreakdown[c.id];
    if (data && data.total > 0) {
      data.scorePercentage = Math.round((data.correct / data.total) * 100);
      const curProg = getTopicProgress(c.id);
      const newMastery = updateMastery(curProg?.mastery, data.scorePercentage);
      data.updatedMastery = newMastery;

      updateTopicProgress(c.id, { mastery: newMastery });

      // Blueprint accuracy categorization
      if (data.scorePercentage >= 80) {
        data.accuracyCategory = "mastered";
      } else if (data.scorePercentage >= 60) {
        data.accuracyCategory = "in_progress";
      } else {
        data.accuracyCategory = "needs_attention";
      }

      if (newMastery < 60) weakConcepts.push(c.id);
      else if (newMastery >= 80) strongConcepts.push(c.id);
    }
  }

  const overallPercentage =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Diagnostic analysis from test answers
  const probableGaps: string[] = [];
  const carelessSlips: string[] = [];
  const insufficientEvidence: string[] = [];

  if (incorrectEvents.length > 0) {
    const anchor = chapterConcepts[0]?.id || "";
    const ranked = rankCandidateRootCauses(incorrectEvents, anchor, 2);
    for (const cand of ranked) {
      if (cand.confidence === "medium" || cand.confidence === "high") {
        probableGaps.push(cand.conceptId);
      } else if (cand.confidence === "low") {
        carelessSlips.push(cand.conceptId);
      } else {
        insufficientEvidence.push(cand.conceptId);
      }
    }
  }

  for (const c of chapterConcepts) {
    if (!conceptBreakdown[c.id] || conceptBreakdown[c.id].total < 2) {
      if (!insufficientEvidence.includes(c.id)) {
        insufficientEvidence.push(c.id);
      }
    }
  }

  return {
    chapterId,
    totalQuestions: totalAnswered,
    correctCount: totalCorrect,
    scorePercentage: overallPercentage,
    passed: overallPercentage >= 70,
    conceptBreakdown,
    diagnosticAnalysis: {
      probableGaps,
      carelessSlips,
      insufficientEvidence,
    },
    weakConcepts,
    strongConcepts,
  };
}

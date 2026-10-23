/**
 * Margam Adaptive Learning Engine
 * Implements deterministic mastery adaptation, difficulty stepping, and prerequisite gap diagnostics.
 */

import { Concept, LearnerProfile, GapTraceResult } from "./types";
import { getConceptById, concepts, tagRoots, hasEnoughQuestions } from "./curriculum";

export interface AdaptiveDiagnosis {
  mistakeTag: string;
  identifiedGap: string;
  suggestedPrerequisite?: Concept;
  recommendationText: string;
}

/**
 * Finds the directed prerequisite path from startConceptId to targetConceptId in the DAG.
 * Used for visual journey display only.
 */
export function findPrerequisitePath(startConceptId: string, targetConceptId: string): string[] {
  if (startConceptId === targetConceptId) {
    return [startConceptId];
  }

  // BFS traversal along prerequisite DAG edges
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

  // Fallback if no directed path exists
  return [startConceptId, targetConceptId];
}

/**
 * Traces a mistake tag directly to its root concept ID using data/tag-roots.json.
 */
export function traceRootConcept(
  mistakeTag: string
): { rootConceptId: string; rootConcept?: Concept } | null {
  const rootConceptId = tagRoots[mistakeTag];
  if (!rootConceptId) return null;
  const rootConcept = getConceptById(rootConceptId);
  return { rootConceptId, rootConcept };
}

/**
 * Evaluates a sequence of mistake tags to diagnose a foundational misconception.
 * Routing Rule: Route only after the same tag appears twice OR two different tags point to the same root concept.
 * Routing Guard: Route only to concepts with enough questions in the active question bank.
 * The prerequisite path is for display only.
 */
export function evaluateGapTracing(
  currentConceptId: string,
  mistakeTags: string[],
  minQuestionsRequired = 3
): GapTraceResult {
  const currentConcept = getConceptById(currentConceptId);
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

  // Check 1: Same mistake tag appeared at least twice
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

  // Check 2: Two different tags point to the same root concept
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
      ? `Student repeatedly exhibited the misconception "${mistakeTags[0]?.replace(/_/g, " ")}" which traces to Class ${
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

/**
 * Deterministic difficulty adjustment rule:
 * - Increase difficulty after 3 consecutive correct responses
 * - Reduce difficulty after 2 consecutive incorrect responses
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
 * Diagnoses root concept gap from a mistake tag and maps to an earlier prerequisite.
 */
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

/**
 * Recommends optimal lesson variant (basics_first, standard, fast_track)
 * based on learner profile's recent attempt history.
 */
export function recommendLessonVariant(
  profile: LearnerProfile,
  conceptId: string
): "basics_first" | "standard" | "fast_track" {
  const progress = profile.topicProgress[conceptId];
  if (!progress) {
    return profile.currentDifficulty === 3 ? "fast_track" : "standard";
  }

  if (progress.mastery !== undefined) {
    if (progress.mastery >= 80) return "fast_track";
    if (progress.mastery < 50) return "basics_first";
    return "standard";
  }

  if (progress.worksheetTotal && progress.worksheetTotal > 0) {
    const score = (progress.worksheetScore || 0) / progress.worksheetTotal;
    if (score >= 0.85) return "fast_track";
    if (score < 0.5) return "basics_first";
  }

  if (profile.consecutiveIncorrect >= 2) return "basics_first";
  return "standard";
}

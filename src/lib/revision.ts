/**
 * Margam Smart Revision System
 * Spaced repetition engine for Class 6-10 mathematics.
 *
 * Implements interval-based memory reinforcement:
 * - 1st Revision: 1 day after mastery/practice
 * - 2nd Revision: 3 days after successful practice
 * - 3rd Revision: 7 days after successful practice
 * - Subsequent Revisions: 14-day maintenance intervals
 *
 * Prioritizes weak concepts and foundational gaps over mastered concepts.
 */

import {
  LearnerProfile,
  TopicProgress,
  RevisionQueueItem,
  RevisionPriority,
  AttemptComparison,
} from "./types";
import { getConceptById, getConceptsByClass } from "./curriculum";

export interface RevisionScheduleCalculation {
  nextRevisionAt: string;
  revisionLevel: number;
  intervalDays: number;
}

/**
 * Computes next revision timestamp and progressive interval level.
 * Struggling attempts (< 70%) reset to 1-day urgency.
 * Successful attempts (>= 70%) advance along spaced repetition ladder.
 */
export function computeNextRevisionSchedule(
  scorePercentage: number,
  currentLevel = 0,
  baseDate: Date = new Date()
): RevisionScheduleCalculation {
  let intervalDays = 1;
  let nextLevel = 1;

  if (scorePercentage < 70) {
    // Struggling concept: review urgently in 1 day
    intervalDays = 1;
    nextLevel = Math.max(0, currentLevel - 1);
  } else {
    // Passed: advance spaced repetition intervals (1d -> 3d -> 7d -> 14d)
    switch (currentLevel) {
      case 0:
        intervalDays = 1;
        nextLevel = 1;
        break;
      case 1:
        intervalDays = 3;
        nextLevel = 2;
        break;
      case 2:
        intervalDays = 7;
        nextLevel = 3;
        break;
      default:
        intervalDays = 14;
        nextLevel = currentLevel + 1;
        break;
    }
  }

  const dueDate = new Date(baseDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    nextRevisionAt: dueDate.toISOString(),
    revisionLevel: nextLevel,
    intervalDays,
  };
}

/**
 * Pure comparison between latest attempt and previous attempt.
 * Does NOT invent or fabricate fake previous scores.
 */
export function compareAttempts(
  latestScore: number,
  latestTotal: number,
  previousProgress?: {
    worksheetScore?: number;
    worksheetTotal?: number;
    previousScore?: number;
    previousTotal?: number;
  }
): AttemptComparison {
  const latestPercentage =
    latestTotal > 0 ? Math.round((latestScore / latestTotal) * 100) : 0;

  // Determine prior score: check previousScore first, then worksheetScore if not current attempt
  const prevScore =
    previousProgress?.previousScore !== undefined
      ? previousProgress.previousScore
      : previousProgress?.worksheetScore !== undefined
      ? previousProgress.worksheetScore
      : undefined;

  const prevTotal =
    previousProgress?.previousTotal !== undefined
      ? previousProgress.previousTotal
      : previousProgress?.worksheetTotal !== undefined
      ? previousProgress.worksheetTotal
      : undefined;

  const hasPreviousAttempt =
    prevScore !== undefined && prevTotal !== undefined && prevTotal > 0;

  if (!hasPreviousAttempt) {
    return {
      hasPreviousAttempt: false,
      latestScore,
      latestTotal,
      latestPercentage,
      message: "First attempt recorded! Keep practicing to track your score improvement.",
    };
  }

  const previousPercentage = Math.round((prevScore! / prevTotal!) * 100);
  const delta = latestPercentage - previousPercentage;
  const improved = delta > 0;

  let message = "";
  if (delta > 0) {
    message = `Great improvement! You gained +${delta}% over your previous attempt (${prevScore}/${prevTotal} → ${latestScore}/${latestTotal}).`;
  } else if (delta === 0) {
    message = `Consistent performance at ${latestPercentage}%. Keep practicing to reach the next difficulty level!`;
  } else {
    message = `Score: ${latestScore}/${latestTotal} (${latestPercentage}% vs previous ${previousPercentage}%). Review the step-by-step solutions below to spot any mistakes!`;
  }

  return {
    hasPreviousAttempt: true,
    previousScore: prevScore!,
    previousTotal: prevTotal!,
    previousPercentage,
    latestScore,
    latestTotal,
    latestPercentage,
    improvementDelta: delta,
    improved,
    message,
  };
}

/**
 * Builds the prioritized Revision Queue for the student dashboard ("Your Revision Zone").
 * Strictly respects class boundary and prioritizes:
 * 1. Critical foundational gaps
 * 2. Weak concepts (< 60% mastery or recent failed score)
 * 3. Overdue and due spaced revisions
 * 4. Pending worksheets where lessons were completed
 * 5. Mastered concepts not reviewed in 7+ days
 */
export function getRevisionQueue(
  profile: LearnerProfile | null,
  limit = 4,
  now: Date = new Date()
): RevisionQueueItem[] {
  if (!profile || !profile.selectedClass) return [];

  const items: RevisionQueueItem[] = [];
  const processedConceptIds = new Set<string>();

  // 1. Critical Priority: Active Prerequisite Gap (from diagnostic or practice)
  if (profile.activeGap && profile.activeGap.status !== "resolved") {
    const rootId = profile.activeGap.rootConceptId;
    const rootConcept = getConceptById(rootId);
    if (rootConcept) {
      const rootProg = profile.topicProgress?.[rootId];
      const mastery = rootProg?.mastery ?? 40;
      items.push({
        conceptId: rootId,
        conceptName: rootConcept.name.en,
        class: rootConcept.class,
        priority: "critical_gap",
        priorityScore: 100,
        reason: `Foundational prerequisite gap for Class ${profile.activeGap.currentConceptId.split("-")[0].replace("c", "")}. Repair this foundation first!`,
        mastery,
        currentDifficulty: rootProg?.difficulty || 1,
        revisionLevel: rootProg?.revisionLevel || 0,
        nextRevisionAt: rootProg?.nextRevisionAt,
        daysOverdue: 0,
        lastScore:
          rootProg?.worksheetScore !== undefined && rootProg?.worksheetTotal
            ? {
                score: rootProg.worksheetScore,
                total: rootProg.worksheetTotal,
                percentage: Math.round(
                  (rootProg.worksheetScore / rootProg.worksheetTotal) * 100
                ),
              }
            : undefined,
        href: `/student/worksheet/${rootId}`,
      });
      processedConceptIds.add(rootId);
    }
  }

  // 2. Class concepts evaluation
  const classConcepts = getConceptsByClass(profile.selectedClass);

  for (const concept of classConcepts) {
    if (processedConceptIds.has(concept.id)) continue;

    const prog: TopicProgress | undefined = profile.topicProgress?.[concept.id];
    if (!prog) continue; // Not started yet

    const mastery = prog.mastery ?? 50;
    const difficulty = prog.difficulty || 1;
    const revLevel = prog.revisionLevel || 0;

    let priority: RevisionPriority | null = null;
    let priorityScore = 0;
    let reason = "";
    let daysOverdue = 0;

    // Check if next revision date has arrived
    if (prog.nextRevisionAt) {
      const dueDate = new Date(prog.nextRevisionAt);
      const diffMs = now.getTime() - dueDate.getTime();
      if (diffMs >= 0) {
        daysOverdue = Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
      }
    }

    // Category A: Low mastery or failed attempt (< 60% or consecIncorrect >= 2)
    if (
      (prog.worksheetCompleted && (prog.worksheetScore ?? 0) / (prog.worksheetTotal || 1) < 0.6) ||
      mastery < 60 ||
      (prog.consecutiveIncorrect && prog.consecutiveIncorrect >= 2)
    ) {
      priority = "needs_practice";
      priorityScore = 80 + (60 - mastery);
      reason = "Scored below 60% or repeated mistakes detected. Recommended for immediate practice.";
    }
    // Category B: Spaced Revision Due
    else if (prog.nextRevisionAt && new Date(prog.nextRevisionAt) <= now) {
      priority = "due_revision";
      priorityScore = 70 + daysOverdue * 2;
      reason =
        daysOverdue > 0
          ? `Spaced revision overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}. Refresh to retain mastery!`
          : "Spaced revision due today! Complete a quick 5-question worksheet.";
    }
    // Category C: Lesson finished, worksheet pending
    else if (prog.lessonCompleted && !prog.worksheetCompleted) {
      priority = "pending_worksheet";
      priorityScore = 55;
      reason = "Lesson completed! Complete your practice worksheet to solidify concepts.";
    }
    // Category D: Mastered but not practiced in over 7 days
    else if (prog.worksheetCompleted && mastery >= 80) {
      if (prog.lastAttemptAt) {
        const lastDate = new Date(prog.lastAttemptAt);
        const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSince >= 7) {
          priority = "mastery_refresh";
          priorityScore = 30 + daysSince;
          reason = `Mastered topic not reviewed in ${daysSince} days. Quick refresher recommended.`;
        }
      }
    }

    if (priority) {
      let previousImprovement: RevisionQueueItem["previousImprovement"] = undefined;
      if (
        prog.previousScore !== undefined &&
        prog.previousTotal !== undefined &&
        prog.worksheetScore !== undefined &&
        prog.worksheetTotal !== undefined &&
        prog.previousTotal > 0 &&
        prog.worksheetTotal > 0
      ) {
        const prevPct = Math.round((prog.previousScore / prog.previousTotal) * 100);
        const latPct = Math.round((prog.worksheetScore / prog.worksheetTotal) * 100);
        previousImprovement = {
          previousPercentage: prevPct,
          latestPercentage: latPct,
          delta: latPct - prevPct,
        };
      }

      items.push({
        conceptId: concept.id,
        conceptName: concept.name.en,
        class: concept.class,
        priority,
        priorityScore,
        reason,
        mastery,
        currentDifficulty: difficulty,
        revisionLevel: revLevel,
        nextRevisionAt: prog.nextRevisionAt,
        daysOverdue,
        lastScore:
          prog.worksheetScore !== undefined && prog.worksheetTotal
            ? {
                score: prog.worksheetScore,
                total: prog.worksheetTotal,
                percentage: Math.round(
                  (prog.worksheetScore / prog.worksheetTotal) * 100
                ),
              }
            : undefined,
        previousImprovement,
        href: `/student/worksheet/${concept.id}`,
      });
      processedConceptIds.add(concept.id);
    }
  }

  // Sort by priorityScore descending
  items.sort((a, b) => b.priorityScore - a.priorityScore);

  return items.slice(0, limit);
}

/**
 * Generates encouraging dialogue from the Minecraft Zombie & Chicken Jockey companion
 * matching the student's actual revision priorities.
 */
export function getCompanionRevisionGreeting(
  queue: RevisionQueueItem[],
  profile: LearnerProfile | null
): { title: string; message: string; pose: "greet" | "read" | "think" | "cheer" | "oops" } {
  if (!queue || queue.length === 0) {
    return {
      title: "All Blocks Solid!",
      message: "All your math topics are up to date. Explore new lessons to continue learning.",
      pose: "cheer",
    };
  }

  const top = queue[0];

  if (top.priority === "critical_gap") {
    return {
      title: "Foundational Repair Needed",
      message: `Your foundations in ${top.conceptName} need a little attention. Let's conquer that block first!`,
      pose: "think",
    };
  }

  if (top.priority === "needs_practice") {
    return {
      title: "Practice Makes Perfect!",
      message: `${top.conceptName} needs a little more practice. Let's work through a quick worksheet together!`,
      pose: "oops",
    };
  }

  if (top.priority === "due_revision") {
    return {
      title: "Time for spaced revision",
      message: `Keep your memory sharp! A quick 5-question revision on ${top.conceptName} is waiting.`,
      pose: "read",
    };
  }

  if (top.priority === "pending_worksheet") {
    return {
      title: "Finish Your Lesson!",
      message: `You completed the lesson for ${top.conceptName}! Complete the practice worksheet to lock in your mastery.`,
      pose: "greet",
    };
  }

  return {
    title: "Keep Building Your Streak!",
    message: `Ready for another challenge? Let's revise ${top.conceptName} and earn extra XP.`,
    pose: "greet",
  };
}


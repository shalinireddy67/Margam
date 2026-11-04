/**
 * MARGAM — Adaptive Learning Engine Verification Suite
 * Tests learning-gap detection, explainability, multi-attempt mastery,
 * single-error protection, and the 5 realistic student personas across Classes 6–10.
 */

import assert from "node:assert/strict";
import {
  evaluateMasteryStatus,
  updateMastery,
  updateConceptDifficulty,
  evaluateGapTracing,
  evaluateChapterDiagnostic,
  evaluatePracticeSubmission,
  evaluateChapterTest,
  classifyMisconception,
} from "../src/lib/adaptive";
import { ConceptGraph } from "../src/lib/graph";
import { compareAttempts, computeNextRevisionSchedule } from "../src/lib/revision";
import {
  createLearnerProfile,
  clearActiveProfile,
  getTopicProgress,
  updateTopicProgress,
  canReadConcept,
} from "../src/lib/storage";
import { getConceptById, concepts } from "../src/lib/curriculum";

console.log("================================================================================");
console.log("  MARGAM — ADAPTIVE LEARNING ENGINE & GAP TRACING AUDIT SUITE");
console.log("================================================================================\n");

// ============================================================================
// PART 1: Concept Graph Audit (Requirements 1, 2, 3, 4)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PART 1: Concept Graph & Prerequisite Integrity Audit");
console.log("--------------------------------------------------------------------------------");

const graph = new ConceptGraph(concepts);
const audit = graph.auditGraph();

console.log(`  Audited Concepts: ${audit.totalConcepts}`);
console.log(`  Audited Prerequisite Edges: ${audit.totalEdges}`);
console.log(`  Acyclicity Status: ${audit.hasCycle ? "CYCLE DETECTED" : "ACYCLIC (VALID DAG)"}`);
console.log(`  Tentative Edges Requiring Teacher Review: ${audit.tentativeCount}/${audit.totalEdges}`);
console.log(`  Educator Validated Edges: ${audit.educatorReviewedCount}`);

assert.equal(audit.hasCycle, false, "Concept graph must be strictly acyclic (no circular dependencies)");
assert.equal(audit.missingPrerequisites.length, 0, "No concept may reference a non-existent prerequisite");
assert.equal(audit.duplicatePrerequisites.length, 0, "No duplicate prerequisites in concept definitions");
assert.equal(audit.gradeInversions.length, 0, "Prerequisites must never belong to a higher grade than the concept");
assert.ok(audit.questionableLinks.length > 0, "Questionable cross-domain links (e.g. c6-neg-01 -> c6-geo-01) must be flagged for review");
assert.equal(audit.educatorReviewedCount, 0, "Engine must NOT claim educator validation unless actual review has occurred");
assert.equal(audit.tentativeCount, audit.totalEdges, "All unreviewed edges must be honestly marked as tentative, pending teacher review");
assert.equal(audit.isValid, true, "Graph structural validation passed");
console.log("  [PASS] Concept graph integrity, acyclicity, and honest teacher-review status verified.\n");

// ============================================================================
// PART 2: Single-Error Protection & Multi-Attempt Mastery (Requirements 7 & 8)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PART 2: Single-Error Protection & Multi-Attempt Mastery");
console.log("--------------------------------------------------------------------------------");

// Test 2.1: Single error on a 1-question preliminary attempt
const singleErrorEval = evaluateMasteryStatus(undefined, 1, 0, 1, 0, 1);
assert.equal(singleErrorEval.status, "insufficient_evidence", "1 question with 0% must be insufficient_evidence");
assert.equal(singleErrorEval.isWeak, false, "Single incorrect answer must NOT automatically label a student as weak");
assert.equal(singleErrorEval.hasSufficientEvidence, false, "1 attempt is insufficient evidence");
console.log("  [PASS] Single incorrect answer does NOT label a student as weak in a concept.");

// Test 2.2: Sustained errors (2 consecutive errors or 3 questions with low score)
const sustainedErrorEval = evaluateMasteryStatus(40, 4, 25, 2, 0, 1);
assert.equal(sustainedErrorEval.status, "needs_practice", "2 consecutive errors with multiple questions labels as needs_practice");
assert.equal(sustainedErrorEval.isWeak, true, "Multiple errors justify weak concept status");
assert.equal(sustainedErrorEval.hasSufficientEvidence, true);
console.log("  [PASS] Sustained errors with evidence correctly trigger needs_practice status.");

// Test 2.3: Single isolated slip during an otherwise strong session (4/5 = 80%)
const isolatedSlipEval = evaluateMasteryStatus(80, 5, 80, 1, 4, 1);
assert.equal(isolatedSlipEval.status, "mastered", "80% with 4/5 correct maintains mastered status despite 1 slip");
assert.equal(isolatedSlipEval.isWeak, false);
assert.equal(isolatedSlipEval.isMastered, true);
console.log("  [PASS] Isolated slip during strong session does NOT downgrade mastery.\n");

// ============================================================================
// PERSONA 1: A Student Who Understands a Topic (Class 8: c8-dist-01)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PERSONA 1: Student Who Understands a Topic (High Mastery & Promotion)");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();
const student1 = createLearnerProfile("Priya Sharma", 8);

// Student completes practice on Distributive Law with 5/5 (100%)
const answersPriya = {
  "q-c8-dist-01": "B",
  "q-c8-dist-02": "B",
  "q-c8-dist-03": "A",
  "q-c8-dist-04": "B",
  "q-c8-dist-05": "A",
};

const resultPriya = evaluatePracticeSubmission("c8-dist-01", answersPriya);
assert.equal(resultPriya.scorePercentage, 100, "Perfect score 100%");
assert.equal(resultPriya.updatedMastery, 100, "Initial mastery set directly to 100%");
assert.equal(resultPriya.feedback.every((f) => f.isCorrect), true, "All feedback correct");

const priyaMastery = evaluateMasteryStatus(resultPriya.updatedMastery, 5, 100, 0, 5, 1);
assert.equal(priyaMastery.status, "mastered");
assert.equal(priyaMastery.isMastered, true);
assert.equal(priyaMastery.isWeak, false);

// Check difficulty stepping: 3 consecutive correct promotes difficulty
let priyaDiff = updateConceptDifficulty(1, 0, 0, true);
priyaDiff = updateConceptDifficulty(priyaDiff.newDifficulty, priyaDiff.newConsecutiveCorrect, 0, true);
priyaDiff = updateConceptDifficulty(priyaDiff.newDifficulty, priyaDiff.newConsecutiveCorrect, 0, true);
assert.equal(priyaDiff.newDifficulty, 2, "Promoted to Difficulty 2 after 3 consecutive correct");
assert.equal(priyaDiff.promoted, true);

console.log(`  Mastery Status: ${priyaMastery.status} (${priyaMastery.masteryPercentage}%)`);
console.log(`  Difficulty Stepping: Level 1 -> Level ${priyaDiff.newDifficulty} (${priyaDiff.reason})`);
console.log(`  Next Action: ${resultPriya.nextAction?.title} - ${resultPriya.nextAction?.description}`);
console.log("  [PASS] Persona 1 (Topic Understanding) verified with high mastery and adaptive promotion.\n");

// ============================================================================
// PERSONA 2: A Student Who Repeatedly Makes the Same Mistake (Class 9: c9-id-02)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PERSONA 2: Student Who Repeatedly Makes the Same Mistake");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();
const student2 = createLearnerProfile("Arjun Mehta", 9);

// Student makes the same sign error twice in Class 9 Middle-Term Splitting
const arjunErrors = [
  "sign_error_positive_times_negative",
  "sign_error_positive_times_negative",
];

const arjunGap = evaluateGapTracing("c9-id-02", arjunErrors, 3);
assert.equal(arjunGap.confirmed, true, "Repeated mistake must confirm prerequisite gap");
assert.equal(arjunGap.triggerReason, "repeated_tag", "Must be triggered by repeated_tag");
assert.equal(arjunGap.rootConceptId, "c7-int-02", "Must trace to Class 7 Integer Multiplication");
assert.equal(arjunGap.canRoute, true, "c7-int-02 has sufficient questions to route");

// Verify explainability (Requirement 11)
assert.ok(arjunGap.recommendationExplanation, "Must generate explainable recommendation details");
assert.equal(arjunGap.recommendationExplanation.requiresTeacherReview, true, "Must flag tentative links for teacher review");
assert.ok(arjunGap.recommendationExplanation.summary.includes("c7-int-02") || arjunGap.recommendationExplanation.summary.includes("Multiplication"));
assert.ok(arjunGap.recommendationExplanation.triggerDescription.includes("sign_error_positive_times_negative"));
assert.ok(arjunGap.recommendationExplanation.observedMistakes.length >= 1);

console.log(`  Detected Root Gap: ${arjunGap.rootConceptId} (${arjunGap.rootConcept?.name.en})`);
console.log(`  Trigger Reason: ${arjunGap.triggerReason} (repeated tag: ${arjunErrors[0]})`);
console.log(`  Explanation Summary: ${arjunGap.recommendationExplanation.summary}`);
console.log(`  Trigger Description: ${arjunGap.recommendationExplanation.triggerDescription}`);
console.log(`  Prerequisite Path: [${arjunGap.prerequisitePath.join(" -> ")}]`);
console.log(`  Actionable Next Step: ${arjunGap.recommendationExplanation.actionableNextStep}`);
console.log("  [PASS] Persona 2 (Repeated Mistake) verified with explainable root-cause diagnosis.\n");

// ============================================================================
// PERSONA 3: A Student With a Gap in an Earlier Prerequisite (Class 10 -> Class 7)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PERSONA 3: Student With Prerequisite Gap in Earlier Grade");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();
const student3 = createLearnerProfile("Rohan Gupta", 10);

// Class 10 student makes convergent errors in Quadratic Equations
// 1. squared_negative_b_as_negative -> maps to c7-int-02
// 2. sign_error_negative_times_negative_became_negative -> maps to c7-int-02
const rohanErrors = [
  "squared_negative_b_as_negative",
  "sign_error_negative_times_negative_became_negative",
];

const rohanGap = evaluateGapTracing("c10-quad-01", rohanErrors, 3);
assert.equal(rohanGap.confirmed, true, "Convergent errors must confirm gap");
assert.equal(rohanGap.triggerReason, "convergent_tags", "Triggered by convergent tags");
assert.equal(rohanGap.rootConceptId, "c7-int-02", "Traces back to Class 7 concept");

const rootConcept = getConceptById("c7-int-02");
assert.ok(rootConcept, "Root concept exists");
assert.equal(rootConcept.class, 7, "Root concept is from Class 7 (earlier grade)");
assert.ok(rootConcept.class < 10, "Remedial concept is strictly from an earlier class (Requirement 10)");

// Verify student can access earlier-grade remedial concept
assert.equal(canReadConcept({ id: "c7-int-02", class: 7 }), true, "Class 10 student permitted cross-grade remedial access");

// Verify explainable path
assert.ok(rohanGap.recommendationExplanation, "Must provide explainable recommendation");
assert.ok(rohanGap.recommendationExplanation.summary.includes("earlier grade (Class 7)"));
assert.ok(rohanGap.recommendationExplanation.prerequisiteReasoning.includes("Class 10") && rohanGap.recommendationExplanation.prerequisiteReasoning.includes("Class 7"));
assert.equal(rohanGap.recommendationExplanation.requiresTeacherReview, true, "Must flag tentative pedagogical relationships");

console.log(`  Current Class Concept: Class 10 Quadratic Equations (c10-quad-01)`);
console.log(`  Identified Remedial Concept: Class ${rootConcept.class} ${rootConcept.name.en} (${rootConcept.id})`);
console.log(`  Prerequisite Chain: [${rohanGap.prerequisitePath.join(" -> ")}]`);
console.log(`  Explainability: ${rohanGap.recommendationExplanation.summary}`);
console.log(`  Reasoning: ${rohanGap.recommendationExplanation.prerequisiteReasoning}`);
console.log(`  Teacher Review Pending: ${rohanGap.recommendationExplanation.requiresTeacherReview}`);
console.log("  [PASS] Persona 3 (Earlier Prerequisite Gap) verified with cross-grade recommendation.\n");

// ============================================================================
// PERSONA 4: A Student Whose Performance Improves After Revision (Growth Delta)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PERSONA 4: Student Improving After Spaced Revision");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();
const student4 = createLearnerProfile("Kavita Rao", 7);

// Attempt 1: Struggling attempt on c7-int-02 with 2/5 (40%)
updateTopicProgress("c7-int-02", {
  mastery: 40,
  difficulty: 1,
  worksheetCompleted: true,
  worksheetScore: 2,
  worksheetTotal: 5,
  revisionLevel: 0,
});

const progBefore = getTopicProgress("c7-int-02");
const scheduleBefore = computeNextRevisionSchedule(40, 0);
assert.equal(scheduleBefore.intervalDays, 1, "Failed attempt sets urgent 1-day revision schedule");

// Student studies lesson and takes revision attempt: scores 5/5 (100%)
const answersKavita = {
  "q-c7-mul-01": "B",
  "q-c7-mul-02": "B",
  "q-c7-int-d1-01": "B",
  "q-c7-int-d1-02": "A",
  "q-c7-int-d1-03": "D",
};

const resultKavita = evaluatePracticeSubmission("c7-int-02", answersKavita);
assert.equal(resultKavita.scorePercentage, 100);

// Mastery update formula: 0.7 * 40 + 0.3 * 100 = 28 + 30 = 58.0
assert.equal(resultKavita.updatedMastery, 58, "Mastery moves from 40 to 58.0");

// Measurable comparison vs prior attempt
const comparison = compareAttempts(5, 5, progBefore || undefined);
assert.equal(comparison.hasPreviousAttempt, true);
assert.equal(comparison.improved, true, "Comparison detects improvement");
assert.equal(comparison.improvementDelta, 60, "Improvement delta is +60%");

// Spaced repetition advances from 1-day to 3-day on success
const scheduleAfter = computeNextRevisionSchedule(100, 1);
assert.equal(scheduleAfter.intervalDays, 3, "Spaced repetition advances to 3-day interval after success");
assert.equal(scheduleAfter.revisionLevel, 2);

console.log(`  Initial Attempt: 2/5 (40%) -> Mastery: 40% (1-day revision)`);
console.log(`  Post-Revision Attempt: 5/5 (100%) -> Mastery: ${resultKavita.updatedMastery}%`);
console.log(`  Growth Delta: +${comparison.improvementDelta}% (${comparison.message})`);
console.log(`  Next Spaced Revision Interval: ${scheduleAfter.intervalDays} days (Level ${scheduleAfter.revisionLevel})`);
console.log("  [PASS] Persona 4 (Improving Student) verified with measurable growth and spaced repetition advancement.\n");

// ============================================================================
// PERSONA 5: A Student With Insufficient Attempts to Determine Mastery
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PERSONA 5: Student With Insufficient Attempts (< 3 Questions)");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();
const student5 = createLearnerProfile("Vikram Joshi", 6);

// Vikram only answers 1 question on Class 6 Opposite Quantities (c6-neg-01) and gets it wrong
const singleMistakeEval = evaluateMasteryStatus(undefined, 1, 0, 1, 0, 1);

assert.equal(singleMistakeEval.hasSufficientEvidence, false, "1 question must be flagged as insufficient evidence");
assert.equal(singleMistakeEval.status, "insufficient_evidence", "Must return status 'insufficient_evidence'");
assert.equal(singleMistakeEval.isWeak, false, "Must NOT label the student as weak in the concept");
assert.equal(singleMistakeEval.isMastered, false, "Must NOT label the student as mastered");
assert.ok(singleMistakeEval.reason.includes("Preliminary evidence only"));
assert.ok(singleMistakeEval.recommendation.includes("Complete additional practice"));

// Vikram answers a 2nd question correctly (1/2 = 50%)
const twoQuestionEval = evaluateMasteryStatus(50, 2, 50, 0, 1, 1);
assert.equal(twoQuestionEval.hasSufficientEvidence, false, "2 questions is still preliminary");
assert.equal(twoQuestionEval.status, "insufficient_evidence");
assert.equal(twoQuestionEval.isWeak, false);

// Vikram completes full 4-question session with 3/4 (75%)
const fourQuestionEval = evaluateMasteryStatus(75, 4, 75, 0, 3, 1);
assert.equal(fourQuestionEval.hasSufficientEvidence, true, "4 questions provides sufficient evidence");
assert.equal(fourQuestionEval.status, "in_progress", "75% establishes verified in_progress status");
assert.equal(fourQuestionEval.isWeak, false);

console.log(`  Attempt 1 (1 question, 0%): Status = ${singleMistakeEval.status} | isWeak = ${singleMistakeEval.isWeak} (${singleMistakeEval.reason})`);
console.log(`  Attempt 2 (2 questions, 50%): Status = ${twoQuestionEval.status} | isWeak = ${twoQuestionEval.isWeak}`);
console.log(`  Attempt 3 (4 questions, 75%): Status = ${fourQuestionEval.status} | isWeak = ${fourQuestionEval.isWeak} (${fourQuestionEval.reason})`);
console.log("  [PASS] Persona 5 (Insufficient Attempts) verified: no premature weak labeling or false mastery.\n");

// ============================================================================
// PART 3: Defensive Incomplete & Corrupt Data Guards (Requirement 12)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  PART 3: Defensive Data Guards & Robustness Verification");
console.log("--------------------------------------------------------------------------------");

// Test 3.1: Empty answers payload
const emptyDiag = evaluateChapterDiagnostic("c10-ch04", {});
assert.equal(emptyDiag.totalQuestions, 0);
assert.equal(emptyDiag.scorePercentage, 0);
assert.equal(emptyDiag.gapAnalysis.confirmed, false);
console.log("  [PASS] Empty diagnostic payload handled gracefully without uncaught exceptions.");

// Test 3.2: Unclassified / unknown mistake tags
const unknownInsight = classifyMisconception("some_random_unrecognized_mistake_tag");
assert.equal(unknownInsight.category, "calculation_slip", "Unknown tag falls back safely to calculation_slip");
assert.ok(unknownInsight.educationalFeedback.length > 0);

const emptyInsight = classifyMisconception("");
assert.equal(emptyInsight.category, "unclassified_slip", "Empty tag falls back safely to unclassified_slip");
console.log("  [PASS] Unknown and empty mistake tags classified safely.");

// Test 3.3: Incomplete chapter test answers
const partialChapterTest = evaluateChapterTest("c10-ch04", { "q-c10-sol-01": "B" });
assert.ok(partialChapterTest.totalQuestions >= 1);
assert.ok((partialChapterTest.diagnosticAnalysis?.insufficientEvidence?.length || 0) > 0, "Flags unassessed concepts as insufficient evidence");
console.log("  [PASS] Incomplete chapter test handles missing answers without crashing.");

console.log("\n================================================================================");
console.log("  ALL 5 PERSONAS AND AUDIT CHECKS PASSED CLEANLY (100% OK)");
console.log("================================================================================\n");

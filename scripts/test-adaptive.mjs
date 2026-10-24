/**
 * Comprehensive Unit Test Suite for Step 5: Adaptive Engine
 * Tests mastery updates, per-concept difficulty, storage changes, and the 3 stages:
 * Stage 1: Diagnostic
 * Stage 2: Solve
 * Stage 3: Test
 */

import assert from "node:assert/strict";
import {
  updateMastery,
  updateConceptDifficulty,
  getLessonVariantFromMastery,
  selectLessonVariant,
  getConfirmationQuestions,
  generateChapterDiagnostic,
  evaluateChapterDiagnostic,
  selectPracticeQuestions,
  evaluatePracticeSubmission,
  generateChapterTest,
  evaluateChapterTest,
} from "../src/lib/adaptive";
import {
  createLearnerProfile,
  getActiveProfile,
  clearActiveProfile,
  getTopicProgress,
  canReadConcept,
} from "../src/lib/storage";
import { canAccessTopic } from "../src/lib/progression";
import { getConceptById, getQuestionsByConceptId } from "../src/lib/curriculum";

console.log("--------------------------------------------------");
console.log("  MARGAM — Step 5: Adaptive Engine Test Suite     ");
console.log("--------------------------------------------------");

// 1. Pure Mastery Formula Tests
console.log("\n1. Testing Mastery Formula (First result direct; later 0.7 old + 0.3 new)...");
// First attempt sets directly
const m1 = updateMastery(undefined, 80);
assert.equal(m1, 80, "First result sets mastery directly to 80");

const m1Null = updateMastery(null, 75.5);
assert.equal(m1Null, 75.5, "Null current mastery sets directly to 75.5");

// Second attempt: 0.7 * 80 + 0.3 * 100 = 56 + 30 = 86.0
const m2 = updateMastery(m1, 100);
assert.equal(m2, 86, "80 followed by 100 becomes 86.0");

// Third attempt: 0.7 * 86 + 0.3 * 50 = 60.2 + 15 = 75.2
const m3 = updateMastery(m2, 50);
assert.equal(m3, 75.2, "86 followed by 50 becomes 75.2");

// Fourth attempt: 0.7 * 75.2 + 0.3 * 90 = 52.64 + 27 = 79.64 -> 79.6
const m4 = updateMastery(m3, 90);
assert.equal(m4, 79.6, "75.2 followed by 90 becomes 79.6");

console.log("  [PASS] Pure mastery calculation matches exact specifications.");

// 2. Per-concept Difficulty Stepping
console.log("\n2. Testing Per-Concept Difficulty & Streak Stepping...");
// Start at D1, 0 correct, 0 incorrect
let diffState = updateConceptDifficulty(1, 0, 0, true);
assert.equal(diffState.newDifficulty, 1);
assert.equal(diffState.newConsecutiveCorrect, 1);

diffState = updateConceptDifficulty(diffState.newDifficulty, diffState.newConsecutiveCorrect, 0, true);
assert.equal(diffState.newDifficulty, 1);
assert.equal(diffState.newConsecutiveCorrect, 2);

// 3rd consecutive correct promotes to D2 and resets streak
diffState = updateConceptDifficulty(diffState.newDifficulty, diffState.newConsecutiveCorrect, 0, true);
assert.equal(diffState.newDifficulty, 2, "3 consecutive correct promotes D1 -> D2");
assert.equal(diffState.newConsecutiveCorrect, 0, "Streak resets upon promotion");
assert.equal(diffState.promoted, true);

// 3 more correct in D2 promotes to D3
diffState = updateConceptDifficulty(2, 2, 0, true);
assert.equal(diffState.newDifficulty, 3, "Promotes D2 -> D3");
assert.equal(diffState.newConsecutiveCorrect, 0);

// Cap at D3: further correct answers do not exceed D3
diffState = updateConceptDifficulty(3, 2, 0, true);
assert.equal(diffState.newDifficulty, 3, "Difficulty caps at 3");

// Demotion: 2 consecutive incorrect demotes D3 -> D2
let demoteState = updateConceptDifficulty(3, 0, 0, false);
assert.equal(demoteState.newDifficulty, 3);
assert.equal(demoteState.newConsecutiveIncorrect, 1);

demoteState = updateConceptDifficulty(3, 0, 1, false);
assert.equal(demoteState.newDifficulty, 2, "2 consecutive errors demote D3 -> D2");
assert.equal(demoteState.newConsecutiveIncorrect, 0, "Streak resets upon demotion");
assert.equal(demoteState.demoted, true);

// 2 more errors demote D2 -> D1
demoteState = updateConceptDifficulty(2, 0, 1, false);
assert.equal(demoteState.newDifficulty, 1, "Demotes D2 -> D1");

// Cap at D1: further errors do not go below 1
demoteState = updateConceptDifficulty(1, 0, 1, false);
assert.equal(demoteState.newDifficulty, 1, "Floor is difficulty 1");

console.log("  [PASS] Per-concept difficulty stepping and streak resets verified.");

// 3. Lesson Variant from Mastery
console.log("\n3. Testing Lesson Variant from Mastery & Confirmation Questions...");
assert.equal(getLessonVariantFromMastery(undefined), "standard");
assert.equal(selectLessonVariant(45), "basics_first", "< 50 should be basics_first");
assert.equal(selectLessonVariant(65), "standard", "50 to 79 should be standard");
assert.equal(selectLessonVariant(85), "fast_track", ">= 80 should be fast_track");

// Confirmation questions selection
const confirmQ = getConfirmationQuestions("c7-int-02", 2);
assert.equal(confirmQ.length, 2, "Returned 2 confirmation questions for root concept c7-int-02");
assert.equal(confirmQ.every((q) => q.conceptId === "c7-int-02"), true);
console.log("  [PASS] Lesson variant mapping (selectLessonVariant) and confirmation questions verified.");

// 4. Storage & Cross-Grade Remediation Access
console.log("\n4. Testing Storage & Lower-Grade Concept Remediation Access...");
clearActiveProfile();
const student10 = createLearnerProfile("Class 10 Student", 10);

// Class 10 student can read lower-class concepts (Classes 6, 7, 8, 9)
assert.equal(canReadConcept({ id: "c7-int-02", class: 7 }), true, "Class 10 student must be allowed to read Class 7 concept");
assert.equal(canReadConcept({ id: "c6-neg-01", class: 6 }), true, "Class 10 student must be allowed to read Class 6 concept");

const accessC7 = canAccessTopic("c7-int-02", student10, true);
assert.equal(accessC7.accessible, true, "Lower class topic must be accessible for remediation");

const accessC6 = canAccessTopic("c6-neg-01", student10, true);
assert.equal(accessC6.accessible, true, "Lower class topic must be accessible for remediation");

console.log("  [PASS] Cross-grade prerequisite reading permitted while locked to class.");

// 5. STAGE 1: Diagnostic (Per Chapter)
console.log("\n5. Testing Stage 1: Chapter Diagnostic...");
const diag = generateChapterDiagnostic("c10-ch04", 6);
assert.ok(diag.questions.length > 0, "Diagnostic must assemble questions");
assert.equal(diag.questions.length, 6, "Assembled requested 6 questions");
assert.equal(diag.shortfall, false, "c10-ch04 has 14 questions, no shortfall for 6");

// Student answers with deliberate errors that trigger c7-int-02 (sign multiplication error)
const qMap = {};
// Answer first 2 questions with distractors tagged with sign errors
const dQuestions = diag.questions;
const q1 = dQuestions[0];
const optWithTag = q1.options?.find((o) => o.mistakeTag === "sign_error_positive_times_negative" || o.mistakeTag === "negative_times_negative_equals_negative_error");

const answers = {};
if (optWithTag) {
  answers[q1.id] = optWithTag.id;
} else {
  answers[q1.id] = q1.options?.[0]?.id || "A";
}

// Answer second question with distractor pointing to c7-int-02
const q2 = dQuestions[1];
const opt2 = q2.options?.find((o) => o.mistakeTag && o.id !== q2.correctAnswer);
answers[q2.id] = opt2 ? opt2.id : (q2.correctAnswer === "A" ? "B" : "A");

// Answer remaining questions correctly
for (let i = 2; i < dQuestions.length; i++) {
  answers[dQuestions[i].id] = dQuestions[i].correctAnswer;
}

const diagReport = evaluateChapterDiagnostic("c10-ch04", answers);
assert.ok(diagReport.totalQuestions >= 2);
assert.ok(diagReport.scorePercentage < 100);
assert.equal(diagReport.gapAnalysis.confirmed, false, "Disparate error tags across different concepts must not confirm a gap");
console.log(`  Scenario A (Divergent Tags -> No Gap):`);
console.log(`    Score: ${diagReport.correctCount}/${diagReport.totalQuestions} (${diagReport.scorePercentage}%)`);
console.log(`    Mistake Tags: [${diagReport.mistakeTags.join(", ")}]`);
console.log(`    Gap Confirmed: ${diagReport.gapAnalysis.confirmed} (No gap card triggered)`);

// Verify Reachable Class 10 to Class 7 Trace in Chapter 4 Diagnostic
const c10ToC7Answers = {};
for (const q of dQuestions) {
  if (q.id === "q-c10-form-01") {
    c10ToC7Answers[q.id] = "A"; // squared_negative_b_as_negative -> c7-int-02
  } else if (q.id === "q-c10-form-02") {
    c10ToC7Answers[q.id] = "D"; // sign_error_negative_times_negative_became_negative -> c7-int-02
  } else {
    c10ToC7Answers[q.id] = q.correctAnswer;
  }
}
const c10ToC7Report = evaluateChapterDiagnostic("c10-ch04", c10ToC7Answers);
assert.equal(c10ToC7Report.gapAnalysis.confirmed, true, "Class 10 to 7 gap must be confirmed");
assert.equal(c10ToC7Report.gapAnalysis.rootConceptId, "c7-int-02", "Must trace to c7-int-02");
assert.equal(c10ToC7Report.gapAnalysis.canRoute, true, "c7-int-02 must be routable");
assert.equal(c10ToC7Report.gapAnalysis.triggerReason, "convergent_tags", "Must trigger via convergent_tags");
console.log(`  Scenario B (Convergent Tags -> Class 10 to Class 7 Gap):`);
console.log(`    Mistake Tags: [${c10ToC7Report.mistakeTags.join(", ")}]`);
console.log(`    Both map to: c7-int-02`);
console.log(`    Class 10 -> Class 7 Trace Verified: root = ${c10ToC7Report.gapAnalysis.rootConceptId}, trigger = ${c10ToC7Report.gapAnalysis.triggerReason}`);
console.log("  [PASS] Stage 1 Chapter Diagnostic evaluated with mistake tagging & Class 10 -> Class 7 trace.");

// 6. STAGE 2: Solve (Adaptive Practice)
console.log("\n6. Testing Stage 2: Solve (Adaptive Practice)...");
const practiceSet = selectPracticeQuestions("c10-quad-01", 3);
assert.equal(practiceSet.questions.length, 3, "Selected 3 practice questions");
assert.equal(practiceSet.targetDifficulty, 1, "Initial difficulty is 1");
assert.equal(practiceSet.shortfall, false);

// Submit perfect answers for practice
const perfectAnswers = {};
for (const q of practiceSet.questions) {
  perfectAnswers[q.id] = q.correctAnswer;
}
const practiceRes1 = evaluatePracticeSubmission("c10-quad-01", perfectAnswers);
assert.equal(practiceRes1.scorePercentage, 100);
assert.equal(practiceRes1.updatedMastery, 100, "First attempt mastery set directly to 100");

// Check storage persistence of per-concept mastery
const storedProg1 = getTopicProgress("c10-quad-01");
assert.equal(storedProg1?.mastery, 100, "Stored mastery is 100");
assert.equal(storedProg1?.consecutiveCorrect, 1, "1 consecutive worksheet correct");

// Submit second practice with 0%
const wrongAnswers = {};
for (const q of practiceSet.questions) {
  const wrongOpt = q.options?.find((o) => o.id !== q.correctAnswer);
  wrongAnswers[q.id] = wrongOpt ? wrongOpt.id : "Z";
}
const practiceRes2 = evaluatePracticeSubmission("c10-quad-01", wrongAnswers);
assert.equal(practiceRes2.scorePercentage, 0);
// Mastery update: 0.7 * 100 + 0.3 * 0 = 70.0
assert.equal(practiceRes2.updatedMastery, 70, "Mastery updated to 0.7*100 + 0.3*0 = 70.0");

const storedProg2 = getTopicProgress("c10-quad-01");
assert.equal(storedProg2?.mastery, 70);
assert.equal(storedProg2?.consecutiveIncorrect, 1);

console.log("  [PASS] Stage 2 Solve adaptive practice updates per-concept mastery and difficulty.");

// 7. STAGE 3: Test (Chapter Test)
console.log("\n7. Testing Stage 3: Chapter Test...");
const chapterTest = generateChapterTest("c10-ch04", 10);
assert.ok(chapterTest.questions.length > 0, "Chapter test questions generated");
assert.equal(chapterTest.shortfall, false, "No shortfall for chapter test with 14 available");

// Grade chapter test
const testAnswers = {};
for (const q of chapterTest.questions) {
  testAnswers[q.id] = q.correctAnswer;
}
const testResult = evaluateChapterTest("c10-ch04", testAnswers);
assert.equal(testResult.scorePercentage, 100);
assert.equal(testResult.passed, true);
assert.ok(testResult.conceptBreakdown["c10-quad-01"]);
console.log(`  Chapter Test Score: ${testResult.correctCount}/${testResult.totalQuestions} (${testResult.scorePercentage}%)`);
console.log(`  Concepts Tested: ${Object.keys(testResult.conceptBreakdown).join(", ")}`);
console.log("  [PASS] Stage 3 Chapter Test generation and evaluation verified.");

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL STEP 5 ADAPTIVE TESTS PASSED        ");
console.log("--------------------------------------------------");

/**
 * MARGAM — Phase 3: Personalized Worksheets & Smart Revision Test Suite
 *
 * Validates all 8 scenarios:
 * 1. Students with no learning gaps (Classes 6-10)
 * 2. Students with active learning gaps (scaffolding with prerequisite questions)
 * 3. Misconception categorization & difficulty adaptation on repeated errors
 * 4. Worksheet completion & mastery progression
 * 5. Empty/incomplete submission rejection & progression integrity
 * 6. Measurable improvement delta comparison between attempts
 * 7. Spaced revision scheduling (1d, 3d, 7d) & queue prioritization
 * 8. Topic unlocking after passing worksheet & single-grade isolation
 */

import assert from "node:assert";
import {
  generatePersonalizedWorksheet,
  selectPracticeQuestions,
  evaluatePracticeSubmission,
  classifyMisconception,
} from "../src/lib/adaptive";
import {
  computeNextRevisionSchedule,
  compareAttempts,
  getRevisionQueue,
  getCompanionRevisionGreeting,
} from "../src/lib/revision";
import {
  createLearnerProfile,
  getActiveProfile,
  updateTopicProgress,
  recordWorksheetAttempt,
  saveProfile,
} from "../src/lib/storage";
import { canAccessTopic, syncClassProgression } from "../src/lib/progression";
import { getConceptById, getConceptsByClass, getFirstSupportedConcept } from "../src/lib/curriculum";

console.log("==================================================");
console.log("  MARGAM — Phase 3: Personalized Worksheets & Revision Test Suite");
console.log("==================================================\n");

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------
// SCENARIO 1: Students with no learning gaps
// ----------------------------------------------------
console.log("1. Testing Students With No Learning Gaps (Classes 6 to 10)...");

it("Generates clean grade-appropriate practice without prerequisite contamination", () => {
  const pilotConceptsByGrade = {
    6: "c6-pat-01",
    7: "c7-alg-01",
    8: "c8-exp-01",
    9: "c9-poly-01",
    10: "c10-quad-01",
  };

  for (const [gradeStr, conceptId] of Object.entries(pilotConceptsByGrade)) {
    const grade = Number(gradeStr);
    const profile = createLearnerProfile(`Student_G${grade}`, grade);
    const targetConcept = getConceptById(conceptId);
    assert(targetConcept !== undefined, `Concept ${conceptId} not found`);

    const worksheet = generatePersonalizedWorksheet(targetConcept.id, profile, 5);

    assert.strictEqual(worksheet.concept.id, targetConcept.id);
    assert(worksheet.questions.length >= 5, `Expected at least 5 questions, got ${worksheet.questions.length}`);
    assert.strictEqual(worksheet.prerequisiteConceptsIncluded.length, 0, "No prereqs should be included for clean student");

    // Verify all questions belong to the target concept
    for (const q of worksheet.questions) {
      assert.strictEqual(q.conceptId, targetConcept.id);
    }
  }
});

// ----------------------------------------------------
// SCENARIO 2: Students with active learning gaps
// ----------------------------------------------------
console.log("\n2. Testing Students With Active Learning Gaps (Scaffolding)...");

it("Scaffolds Class 10 worksheet with Class 7 Integer questions when active gap is present", () => {
  const profile = createLearnerProfile("Struggling_Student", 10);

  // Set an active gap on c7-int-02 (Integer Multiplication)
  profile.activeGap = {
    currentConceptId: "c10-quad-01",
    rootConceptId: "c7-int-02",
    plainLanguageReason: "Repeated sign errors when multiplying negative integers.",
    prerequisitePath: ["c10-quad-01", "c9-id-02", "c7-int-02"],
    confirmationQuestionIds: ["c7-int-02-q01"],
    status: "confirmed",
  };
  saveProfile(profile);

  const worksheet = generatePersonalizedWorksheet("c10-quad-01", profile, 5);

  assert.strictEqual(worksheet.isPersonalized, true, "Worksheet should be marked as personalized");
  assert(worksheet.personalizedReason.includes("Multiplication of Integers"), "Reason should mention the prerequisite");
  assert.strictEqual(worksheet.prerequisiteConceptsIncluded.length, 1);
  assert.strictEqual(worksheet.prerequisiteConceptsIncluded[0].conceptId, "c7-int-02");

  // Verify that questions include both c7-int-02 questions and c10-quad-01 questions
  const hasRootQuestions = worksheet.questions.some((q) => q.conceptId === "c7-int-02");
  const hasTargetQuestions = worksheet.questions.some((q) => q.conceptId === "c10-quad-01");

  assert(hasRootQuestions, "Should include foundational questions from c7-int-02");
  assert(hasTargetQuestions, "Should include target questions from c10-quad-01");
});

// ----------------------------------------------------
// SCENARIO 3: Repeated incorrect answers & Misconception detection
// ----------------------------------------------------
console.log("\n3. Testing Misconception Classification & Adaptive Demotion...");

it("Classifies sign errors and demotes difficulty on consecutive failures", () => {
  const profile = createLearnerProfile("Sign_Error_Student", 10);
  updateTopicProgress("c10-quad-01", {
    difficulty: 2,
    consecutiveIncorrect: 1,
    mastery: 40,
  });

  // Submit attempt with deliberate negative sign mistake
  const answers = {
    "q-c10-sol-01": "A", // wrong answer with mistakeTag 'forgot_to_invert_signs_from_factors_to_roots'
    "q-c10-sol-02": "A", // wrong answer
    "q-c10-quad-d1-01": "B", // wrong answer
  };

  const result = evaluatePracticeSubmission("c10-quad-01", answers, {
    studentProfile: profile,
  });

  assert.strictEqual(result.scorePercentage, 0);
  assert.strictEqual(result.difficultyChanged, "demoted");
  assert.strictEqual(result.updatedDifficulty, 1);

  // Check misconception feedback
  const wrongFeedback = result.feedback.find((f) => !f.isCorrect && f.misconceptionCategory);
  assert(wrongFeedback !== undefined, "Should have classified misconception feedback");
  assert(wrongFeedback.misconceptionCategory.length > 0);
  assert(wrongFeedback.educationalFeedback.length > 0);
});

// ----------------------------------------------------
// SCENARIO 4: Worksheet completion & mastery update
// ----------------------------------------------------
console.log("\n4. Testing Worksheet Completion & Spaced Repetition Progression...");

it("Advances spaced revision schedule (1d -> 3d -> 7d) on passing scores", () => {
  // Test Level 0 -> Level 1 (1 day)
  const sched1 = computeNextRevisionSchedule(80, 0, new Date("2026-11-01T12:00:00Z"));
  assert.strictEqual(sched1.intervalDays, 1);
  assert.strictEqual(sched1.revisionLevel, 1);
  assert.strictEqual(new Date(sched1.nextRevisionAt).toISOString(), "2026-11-02T12:00:00.000Z");

  // Test Level 1 -> Level 2 (3 days)
  const sched2 = computeNextRevisionSchedule(85, 1, new Date("2026-11-02T12:00:00Z"));
  assert.strictEqual(sched2.intervalDays, 3);
  assert.strictEqual(sched2.revisionLevel, 2);
  assert.strictEqual(new Date(sched2.nextRevisionAt).toISOString(), "2026-11-05T12:00:00.000Z");

  // Test Level 2 -> Level 3 (7 days)
  const sched3 = computeNextRevisionSchedule(90, 2, new Date("2026-11-05T12:00:00Z"));
  assert.strictEqual(sched3.intervalDays, 7);
  assert.strictEqual(sched3.revisionLevel, 3);
  assert.strictEqual(new Date(sched3.nextRevisionAt).toISOString(), "2026-11-12T12:00:00.000Z");

  // Test failing score (< 70%) resets to 1 day urgency
  const failSched = computeNextRevisionSchedule(40, 3, new Date("2026-11-12T12:00:00Z"));
  assert.strictEqual(failSched.intervalDays, 1);
  assert.strictEqual(failSched.revisionLevel, 2);
});

// ----------------------------------------------------
// SCENARIO 5: Empty/incomplete submissions & progression integrity
// ----------------------------------------------------
console.log("\n5. Testing Progression Integrity & Incomplete Submissions...");

it("Opening a worksheet does not mark completion; zero answers gives 0 total", () => {
  const profile = createLearnerProfile("Integrity_Student", 10);

  // Initial state: not started
  const initialProg = profile.topicProgress["c10-quad-01"];
  assert.strictEqual(initialProg, undefined);

  // Empty submission evaluation
  const emptyResult = evaluatePracticeSubmission("c10-quad-01", {});
  assert.strictEqual(emptyResult.totalQuestions, 0);
  assert.strictEqual(emptyResult.scorePercentage, 0);

  // Storage should not mark topic as completed when score is 0
  const curProfile = getActiveProfile();
  assert(curProfile.topicProgress["c10-quad-01"].status !== "completed");
});

// ----------------------------------------------------
// SCENARIO 6: Attempt comparison & measurable improvement deltas
// ----------------------------------------------------
console.log("\n6. Testing Attempt Comparison & Measurable Growth...");

it("Accurately compares latest attempt against previous attempt with delta", () => {
  // First attempt: no previous data exists -> must NOT fabricate fake data
  const firstComp = compareAttempts(2, 5, undefined);
  assert.strictEqual(firstComp.hasPreviousAttempt, false);
  assert.strictEqual(firstComp.latestScore, 2);
  assert.strictEqual(firstComp.latestTotal, 5);
  assert.strictEqual(firstComp.latestPercentage, 40);
  assert(firstComp.message.includes("First attempt recorded"));

  // Record first attempt in storage
  recordWorksheetAttempt("c10-quad-01", 2, 5, 1, false);

  // Retrieve stored progress
  const prof = getActiveProfile();
  const storedProg = prof.topicProgress["c10-quad-01"];
  assert.strictEqual(storedProg.worksheetScore, 2);
  assert.strictEqual(storedProg.worksheetTotal, 5);

  // Second attempt: 4/5 (80%)
  const secondComp = compareAttempts(4, 5, storedProg);
  assert.strictEqual(secondComp.hasPreviousAttempt, true);
  assert.strictEqual(secondComp.previousScore, 2);
  assert.strictEqual(secondComp.previousTotal, 5);
  assert.strictEqual(secondComp.previousPercentage, 40);
  assert.strictEqual(secondComp.latestScore, 4);
  assert.strictEqual(secondComp.latestTotal, 5);
  assert.strictEqual(secondComp.latestPercentage, 80);
  assert.strictEqual(secondComp.improvementDelta, 40);
  assert.strictEqual(secondComp.improved, true);
  assert(secondComp.message.includes("+40%"));
});

// ----------------------------------------------------
// SCENARIO 7: Spaced revision queue & priority ranking
// ----------------------------------------------------
console.log("\n7. Testing Revision Queue Prioritization & Mascot Encouragement...");

it("Prioritizes active gap #1, weak concepts #2, and due spaced revisions #3", () => {
  const profile = createLearnerProfile("Revision_Student", 10);

  // 1. Critical Gap on c7-int-02
  profile.activeGap = {
    currentConceptId: "c10-quad-01",
    rootConceptId: "c7-int-02",
    plainLanguageReason: "Foundational integer multiplication gap",
    prerequisitePath: ["c10-quad-01", "c7-int-02"],
    confirmationQuestionIds: ["c7-int-02-q01"],
    status: "confirmed",
  };

  // 2. Weak concept on c10-quad-01 (mastery 45%)
  profile.topicProgress["c10-quad-01"] = {
    conceptId: "c10-quad-01",
    status: "in_progress",
    lessonCompleted: true,
    worksheetCompleted: true,
    worksheetScore: 1,
    worksheetTotal: 5,
    mastery: 45,
    consecutiveIncorrect: 2,
    difficulty: 1,
    revisionLevel: 0,
  };

  // 3. Due spaced revision on c10-poly-01 (due yesterday)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  profile.topicProgress["c10-poly-01"] = {
    conceptId: "c10-poly-01",
    status: "completed",
    lessonCompleted: true,
    worksheetCompleted: true,
    worksheetScore: 5,
    worksheetTotal: 5,
    mastery: 85,
    difficulty: 2,
    revisionLevel: 1,
    nextRevisionAt: yesterday,
  };

  const queue = getRevisionQueue(profile, 5);

  assert(queue.length >= 3, `Expected at least 3 queue items, got ${queue.length}`);
  assert.strictEqual(queue[0].priority, "critical_gap", "Active gap must be highest priority #1");
  assert.strictEqual(queue[0].conceptId, "c7-int-02");

  assert.strictEqual(queue[1].priority, "needs_practice", "Weak concept must be priority #2");
  assert.strictEqual(queue[1].conceptId, "c10-quad-01");

  assert.strictEqual(queue[2].priority, "due_revision", "Overdue spaced revision must be priority #3");
  assert.strictEqual(queue[2].conceptId, "c10-poly-01");

  // Check companion dialogue
  const greeting = getCompanionRevisionGreeting(queue, profile);
  assert(greeting.title.includes("Foundational") || greeting.message.includes("Integer Multiplication"));
  assert.strictEqual(greeting.pose, "think");
});

// ----------------------------------------------------
// SCENARIO 8: Topic unlocking after completion & Single-class locks
// ----------------------------------------------------
console.log("\n8. Testing Topic Unlocking & Single-Grade Boundary Integrity...");

it("Enforces prerequisite completion before practice unlock and locks foreign grade access", () => {
  const profile = createLearnerProfile("Boundary_Student", 8);

  // Class 8 student trying to access Class 9 topic directly -> MUST BE LOCKED
  const foreignAccess = canAccessTopic("c9-id-01", profile, true);
  assert.strictEqual(foreignAccess.accessible, false);
  assert(foreignAccess.reason.includes("Class 8"));

  // Within Class 8: topic with uncompleted prerequisite -> MUST BE LOCKED
  // c8-dist-01 has prerequisite c7-int-02 which is uncompleted
  const lockedAccess = canAccessTopic("c8-dist-01", profile, true);
  assert.strictEqual(lockedAccess.accessible, false);
  assert(lockedAccess.reason.includes("c7-int-02"));

  // Mark both prerequisites (c7-int-02 and c8-exp-01) completed
  profile.topicProgress["c7-int-02"] = {
    conceptId: "c7-int-02",
    status: "completed",
    lessonCompleted: true,
    worksheetCompleted: true,
    mastery: 80,
  };
  profile.topicProgress["c8-exp-01"] = {
    conceptId: "c8-exp-01",
    status: "completed",
    lessonCompleted: true,
    worksheetCompleted: true,
    mastery: 85,
  };
  saveProfile(profile);
  const synced = syncClassProgression(profile);

  // Now c8-dist-01 should be accessible!
  const unlockedAccess = canAccessTopic("c8-dist-01", synced, true);
  assert.strictEqual(unlockedAccess.accessible, true);
});

console.log("\n==================================================");
console.log(`  RESULT: ${passedTests} / ${totalTests} TESTS PASSED CLEANLY!`);
console.log("==================================================\n");

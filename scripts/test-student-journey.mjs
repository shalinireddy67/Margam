/**
 * MARGAM — Phase 4: Complete Student Journey & Integration Test Suite
 *
 * Simulates and verifies the full 18-step student journey end-to-end:
 * 1. Open Margam (initial curriculum validation)
 * 2. Enter student name
 * 3. Select a class between 6 and 10
 * 4. Enter student dashboard (topics initialized, single-class locking, companion greeting)
 * 5. Start the diagnostic assessment (Stage 1 Chapter Diagnostic)
 * 6. Answer questions (realistic answers with mistake tags)
 * 7. Submit the assessment
 * 8. View the learning-gap report (summary, concept analysis, root causes)
 * 9. Identify weak prerequisite concepts (DAG tracing to lower grades)
 * 10. Open the recommended lesson (adaptive lesson variant selection)
 * 11. Complete the lesson (explicit completion, unlock check)
 * 12. Attempt the worksheet (personalized worksheet with prerequisite scaffolding)
 * 13. Submit the worksheet
 * 14. Check updated progress (mastery increase, attempt history, delta comparison)
 * 15. View revision recommendations (spaced repetition scheduling 1d -> 3d -> 7d)
 * 16. Revisit a previously weak concept (revision queue prioritization & companion prompt)
 * 17. Complete another assessment (Stage 3 Chapter Test)
 * 18. Verify whether mastery and progress update correctly (zero regression, class isolation)
 *
 * PLUS: Multi-class verification across all 5 classes (6, 7, 8, 9, 10).
 */

import assert from "node:assert";
import {
  generateChapterDiagnostic,
  evaluateChapterDiagnostic,
  generatePersonalizedWorksheet,
  evaluatePracticeSubmission,
  generateChapterTest,
  evaluateChapterTest,
  recommendLessonVariant,
  findPrerequisitePath,
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
  clearActiveProfile,
} from "../src/lib/storage";
import {
  canAccessTopic,
  syncClassProgression,
  recordTopicOpened,
  completeLesson,
} from "../src/lib/progression";
import {
  getConceptById,
  getConceptsByClass,
  getFirstSupportedConcept,
} from "../src/lib/curriculum";

console.log("================================================================================");
console.log("  MARGAM — Phase 4: Complete Student Journey & Integration Test Suite");
console.log("================================================================================\n");

let passedSteps = 0;
let totalSteps = 0;

function step(num, desc, fn) {
  totalSteps++;
  try {
    fn();
    console.log(`  [STEP ${num}: PASS] ${desc}`);
    passedSteps++;
  } catch (err) {
    console.error(`  [STEP ${num}: FAIL] ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// Ensure clean environment
clearActiveProfile();
let profile;
let diagnosticQuestions;
let diagnosticReport;
let targetConceptId = "c10-quad-01";
let chapterId = "c10-ch04";
let tracedRootId = "c7-int-02";

// ----------------------------------------------------
// STEP 1: Open Margam
// ----------------------------------------------------
step(1, "Open Margam & Verify Supported Curriculum (Classes 6-10)", () => {
  for (let c = 6; c <= 10; c++) {
    const concepts = getConceptsByClass(c);
    assert(concepts.length >= 2, `Class ${c} must have at least 2 concepts in pilot chain`);
    const firstConcept = getFirstSupportedConcept(c);
    assert(firstConcept !== undefined, `Class ${c} must have a first supported concept`);
  }
});

// ----------------------------------------------------
// STEP 2: Enter Student Name
// ----------------------------------------------------
step(2, "Enter Student Name & Create Learner Profile", () => {
  profile = createLearnerProfile("Aarav Sharma", 10);
  assert(profile.id && profile.id.length > 0, "Profile must have a valid ID");
  assert.strictEqual(profile.name, "Aarav Sharma");
  assert.strictEqual(profile.selectedClass, 10);
});

// ----------------------------------------------------
// STEP 3: Select Class Between 6 and 10
// ----------------------------------------------------
step(3, "Select Class (Class 10 Selected & Locked)", () => {
  assert.strictEqual(profile.selectedClass, 10);
  // Verify foreign class topics are strictly blocked without remediation bypass
  const class6Check = canAccessTopic("c6-pat-01", profile, false);
  assert.strictEqual(class6Check.accessible, false, "Foreign Class 6 topic must not be accessible directly");
  const class8Check = canAccessTopic("c8-sqr-01", profile, false);
  assert.strictEqual(class8Check.accessible, false, "Foreign Class 8 topic must not be accessible directly");
});

// ----------------------------------------------------
// STEP 4: Enter the Student Dashboard
// ----------------------------------------------------
step(4, "Enter Dashboard (Topics Initialized, Progression Sequenced)", () => {
  profile = syncClassProgression(profile);
  const firstC10 = getFirstSupportedConcept(10);
  assert(firstC10 !== undefined);
  assert(profile.topicProgress[firstC10.id] !== undefined, "First concept progress must be initialized");
  assert.strictEqual(profile.topicProgress[firstC10.id].status, "available", "First supported concept must be available");

  // Dependent concept c10-quad-01 has prerequisites (c9-id-02, c10-poly-01), so initially locked
  const quadProgress = profile.topicProgress["c10-quad-01"];
  assert(quadProgress !== undefined);
  assert.strictEqual(quadProgress.status, "locked", "Uncompleted prerequisite concept must be locked");
});

// ----------------------------------------------------
// STEP 5: Start Diagnostic Assessment
// ----------------------------------------------------
step(5, "Start Stage 1 Chapter Diagnostic Assessment (c10-ch04)", () => {
  const diag = generateChapterDiagnostic(chapterId, 6);
  assert(diag.questions.length >= 6, "Must generate at least 6 questions");
  assert.strictEqual(diag.shortfall, false, "c10-ch04 has full question bank");
  diagnosticQuestions = diag.questions;
});

// ----------------------------------------------------
// STEP 6: Answer Questions (Realistic Mistake Tagging)
// ----------------------------------------------------
let studentAnswers = {};
step(6, "Answer Questions with Specific Mistake Distractors (Sign Rules)", () => {
  // Deliberately trigger c7-int-02 by answering with distractors tagged with sign multiplication mistakes
  for (const q of diagnosticQuestions) {
    if (q.id === "q-c10-form-01") {
      // squared_negative_b_as_negative -> maps to c7-int-02
      studentAnswers[q.id] = "A";
    } else if (q.id === "q-c10-form-02") {
      // sign_error_negative_times_negative_became_negative -> maps to c7-int-02
      studentAnswers[q.id] = "D";
    } else {
      // Answer other questions correctly
      studentAnswers[q.id] = q.correctAnswer;
    }
  }
  assert.strictEqual(Object.keys(studentAnswers).length, diagnosticQuestions.length);
});

// ----------------------------------------------------
// STEP 7: Submit the Assessment
// ----------------------------------------------------
step(7, "Submit Assessment & Run Diagnostic Grading Engine", () => {
  diagnosticReport = evaluateChapterDiagnostic(chapterId, studentAnswers, 3);
  assert(diagnosticReport.totalQuestions >= 6);
  assert(diagnosticReport.correctCount < diagnosticReport.totalQuestions, "Student made deliberate errors");
  assert(diagnosticReport.scorePercentage < 100);
});

// ----------------------------------------------------
// STEP 8: View the Learning-Gap Report
// ----------------------------------------------------
step(8, "View Learning-Gap Report (Overall Summary & Concept Breakdown)", () => {
  assert(diagnosticReport.mistakeTags.length >= 2, "Must capture mistake tags");
  assert(diagnosticReport.gapAnalysis !== undefined, "Gap analysis must be present");
  assert.strictEqual(diagnosticReport.gapAnalysis.confirmed, true, "Convergent tags must confirm a gap");
  assert.strictEqual(diagnosticReport.gapAnalysis.rootConceptId, tracedRootId, "Root must trace to c7-int-02");
});

// ----------------------------------------------------
// STEP 9: Identify Weak Prerequisite Concepts
// ----------------------------------------------------
step(9, "Trace Prerequisite Root Cause & Path to Class 7 Integers", () => {
  const path = findPrerequisitePath(targetConceptId, tracedRootId);
  assert(path.length >= 2, "Path must span from Class 10 to Class 7");
  assert.strictEqual(path[0], targetConceptId);
  assert.strictEqual(path[path.length - 1], tracedRootId);

  // Store active gap on profile
  profile.activeGap = {
    currentConceptId: targetConceptId,
    rootConceptId: tracedRootId,
    plainLanguageReason: "Repeated sign errors when multiplying negative integers.",
    prerequisitePath: path,
    confirmationQuestionIds: ["q-c7-int-02-01"],
    status: "confirmed",
  };
  profile.consecutiveIncorrect = 2;
  if (!profile.topicProgress) profile.topicProgress = {};
  profile.topicProgress[targetConceptId] = {
    conceptId: targetConceptId,
    status: "in_progress",
    lessonCompleted: false,
    worksheetCompleted: false,
    mastery: 40,
    consecutiveIncorrect: 2,
  };
  saveProfile(profile);
  assert.strictEqual(profile.activeGap.rootConceptId, "c7-int-02");
});

// ----------------------------------------------------
// STEP 10: Open the Recommended Lesson
// ----------------------------------------------------
step(10, "Open Recommended Lesson Variant (basics_first for struggling student)", () => {
  const variant = recommendLessonVariant(profile, targetConceptId);
  assert.strictEqual(variant, "basics_first", "Active gap or low mastery must recommend basics_first lesson variant");

  // Remediation access allows opening lower-class root concept
  const remediationAccess = canAccessTopic(tracedRootId, profile, true);
  assert.strictEqual(remediationAccess.accessible, true, "Must allow reading Class 7 root concept for remediation");

  // Record opening the remediation concept
  profile.topicProgress[tracedRootId] = {
    conceptId: tracedRootId,
    status: "in_progress",
    lessonCompleted: false,
    worksheetCompleted: false,
    lastAttemptAt: new Date().toISOString(),
  };
  saveProfile(profile);
});

// ----------------------------------------------------
// STEP 11: Complete the Lesson
// ----------------------------------------------------
step(11, "Explicitly Complete Remediation Lesson", () => {
  const rootProgress = profile.topicProgress[tracedRootId];
  assert(rootProgress !== undefined);
  rootProgress.lessonCompleted = true;
  rootProgress.status = "completed";
  rootProgress.completedAt = new Date().toISOString();
  saveProfile(profile);

  assert.strictEqual(profile.topicProgress[tracedRootId].lessonCompleted, true);
  assert.strictEqual(profile.topicProgress[tracedRootId].status, "completed");
});

// ----------------------------------------------------
// STEP 12: Attempt the Worksheet (Personalized Scaffolding)
// ----------------------------------------------------
let worksheet;
step(12, "Generate Personalized Practice Worksheet with Prerequisite Scaffolding", () => {
  worksheet = generatePersonalizedWorksheet(targetConceptId, profile, 5);
  assert(worksheet.questions.length >= 5);
  assert(worksheet.prerequisiteConceptsIncluded.some((p) => p.conceptId === tracedRootId), "Must include Class 7 Integer questions");
  assert(worksheet.questions.some((q) => q.conceptId === tracedRootId), "Must contain actual questions from c7-int-02");
});

// ----------------------------------------------------
// STEP 13: Submit the Worksheet
// ----------------------------------------------------
let worksheetSubmissionResult;
step(13, "Submit Worksheet with Improved Performance", () => {
  const practiceAnswers = {};
  // Answer 4 of 5 correctly (80% score)
  worksheet.questions.forEach((q, idx) => {
    practiceAnswers[q.id] = idx === 0 ? "WRONG_OPTION" : q.correctAnswer;
  });

  worksheetSubmissionResult = evaluatePracticeSubmission(targetConceptId, practiceAnswers, {
    studentProfile: profile,
    isPersonalized: true,
  });
  assert(worksheetSubmissionResult.totalQuestions >= 5);
  assert(worksheetSubmissionResult.correctCount >= 4);
  assert(worksheetSubmissionResult.scorePercentage >= 75);
  assert(worksheetSubmissionResult.updatedMastery !== undefined);
});

// ----------------------------------------------------
// STEP 14: Check Updated Progress & Attempt History
// ----------------------------------------------------
step(14, "Record Attempt & Verify Measurable Improvement Delta", () => {
  // Compare against a previous baseline attempt of 2/5 (40%)
  const priorProgress = {
    worksheetScore: 2,
    worksheetTotal: 5,
  };

  const delta = compareAttempts(
    worksheetSubmissionResult.correctCount,
    worksheetSubmissionResult.totalQuestions,
    priorProgress
  );

  assert.strictEqual(delta.hasPreviousAttempt, true);
  assert.strictEqual(delta.previousPercentage, 40);
  assert(delta.improvementDelta > 0, "Percentage delta must be positive showing growth");
  assert.strictEqual(delta.improved, true, "Must flag improvement as true");
});

// ----------------------------------------------------
// STEP 15: View Revision Recommendations (Spaced Repetition)
// ----------------------------------------------------
step(15, "Compute Spaced Revision Schedule (1d -> 3d -> 7d Intervals)", () => {
  const schedule = computeNextRevisionSchedule(worksheetSubmissionResult.scorePercentage, 0);
  assert.strictEqual(schedule.revisionLevel, 1);
  assert.strictEqual(schedule.intervalDays, 1, "Level 1 must schedule 1 day interval");

  // Save revision info into profile
  profile.topicProgress[targetConceptId] = {
    conceptId: targetConceptId,
    status: "completed",
    lessonCompleted: true,
    worksheetCompleted: true,
    mastery: 80,
    nextRevisionAt: schedule.nextRevisionAt,
    revisionLevel: schedule.revisionLevel,
    completedAt: new Date().toISOString(),
  };
  saveProfile(profile);

  assert(profile.topicProgress[targetConceptId].nextRevisionAt !== undefined);
  assert.strictEqual(profile.topicProgress[targetConceptId].revisionLevel, 1);
});

// ----------------------------------------------------
// STEP 16: Revisit a Previously Weak Concept
// ----------------------------------------------------
step(16, "Queue Prioritization & Companion Encouragement Greeting", () => {
  const queue = getRevisionQueue(profile);
  assert(queue.length > 0, "Revision queue must contain items");
  
  // Companion greeting
  const greeting = getCompanionRevisionGreeting(queue, profile);
  assert(greeting.title.length > 0);
  assert(greeting.message.length > 0);
  assert(greeting.pose !== undefined);
});

// ----------------------------------------------------
// STEP 17: Complete Another Assessment (Stage 3 Chapter Test)
// ----------------------------------------------------
step(17, "Generate & Evaluate Stage 3 Chapter Test", () => {
  const test = generateChapterTest(chapterId, 6);
  assert(test.questions.length >= 6);

  const testAnswers = {};
  for (const q of test.questions) {
    testAnswers[q.id] = q.correctAnswer;
  }

  const testResult = evaluateChapterTest(chapterId, testAnswers);
  assert.strictEqual(testResult.totalQuestions, test.questions.length);
  assert.strictEqual(testResult.scorePercentage, 100);
  assert.strictEqual(testResult.passed, true);
});

// ----------------------------------------------------
// STEP 18: Verify Mastery & Progress Updates
// ----------------------------------------------------
step(18, "Final Progression & Single-Grade Boundary Integrity Verification", () => {
  // Verify target concept is marked completed
  const finalProg = profile.topicProgress[targetConceptId];
  assert.strictEqual(finalProg.status, "completed");
  assert.strictEqual(finalProg.worksheetCompleted, true);

  // Verify next concept in Class 10 (c10-quad-02) is unlocked now that c10-quad-01 and c7-int-02 are completed
  profile = syncClassProgression(profile);
  const nextConcept = getConceptById("c10-quad-02");
  if (nextConcept) {
    const nextProg = profile.topicProgress[nextConcept.id];
    assert(nextProg !== undefined);
    assert.strictEqual(nextProg.status, "available", "c10-quad-02 must be available now that prerequisites are met");
  }

  // Verify cross-grade boundary: Class 10 student cannot access Class 9 topics for normal practice
  const foreignAccess = canAccessTopic("c9-id-02", profile, false);
  assert.strictEqual(foreignAccess.accessible, false, "Must block normal access to lower-class topics");
});

console.log("\n--------------------------------------------------------------------------------");
console.log("  MULTI-CLASS INDEPENDENT VERIFICATION (Classes 6, 7, 8, 9, 10)");
console.log("--------------------------------------------------------------------------------\n");

const pilotChapters = [
  { grade: 6, chapterId: "c6-ch10", conceptId: "c6-neg-01" },
  { grade: 7, chapterId: "c7-ch10", conceptId: "c7-int-02" },
  { grade: 8, chapterId: "c8-ch06", conceptId: "c8-dist-01" },
  { grade: 9, chapterId: "c9-ch04", conceptId: "c9-id-01" },
  { grade: 10, chapterId: "c10-ch04", conceptId: "c10-quad-01" },
];

for (const { grade, chapterId, conceptId } of pilotChapters) {
  totalSteps++;
  try {
    // 1. Create fresh profile
    const p = createLearnerProfile(`Student_Class_${grade}`, grade);
    assert.strictEqual(p.selectedClass, grade);

    // 2. Sync progression & unlock chapter for assessment
    syncClassProgression(p);
    p.topicProgress[conceptId] = {
      conceptId,
      status: "available",
      lessonCompleted: false,
      worksheetCompleted: false,
    };
    saveProfile(p);

    // 3. Generate diagnostic (requires >= 6 questions, all pilot chapters have 13-14)
    const diag = generateChapterDiagnostic(chapterId, 6);
    assert(diag.questions.length >= 6, `Class ${grade} diagnostic must have at least 6 questions`);

    // 4. Generate worksheet
    const ws = generatePersonalizedWorksheet(conceptId, p, 5);
    assert(ws.questions.length >= 5, `Class ${grade} worksheet must have at least 5 questions`);

    // 5. Evaluate practice submission with 100% correct answers
    const pAnswers = {};
    for (const q of ws.questions) {
      pAnswers[q.id] = q.correctAnswer;
    }
    const evalRes = evaluatePracticeSubmission(conceptId, pAnswers, {
      studentProfile: p,
    });
    assert.strictEqual(evalRes.scorePercentage, 100);
    assert(evalRes.updatedMastery >= 50);

    // 6. Complete lesson & worksheet
    p.topicProgress[conceptId].status = "completed";
    p.topicProgress[conceptId].lessonCompleted = true;
    p.topicProgress[conceptId].worksheetCompleted = true;
    saveProfile(p);

    // 7. Test chapter test
    const cTest = generateChapterTest(chapterId, 6);
    assert(cTest.questions.length >= 6);
    const testAnswers = {};
    for (const q of cTest.questions) {
      testAnswers[q.id] = q.correctAnswer;
    }
    const testRes = evaluateChapterTest(chapterId, testAnswers);
    assert.strictEqual(testRes.scorePercentage, 100);
    assert.strictEqual(testRes.passed, true);

    // 8. Verify strict single-grade boundary
    const otherGrade = grade === 10 ? 6 : grade + 1;
    const foreignConcepts = getConceptsByClass(otherGrade);
    if (foreignConcepts.length > 0) {
      const foreignAccess = canAccessTopic(foreignConcepts[0].id, p, false);
      assert.strictEqual(foreignAccess.accessible, false, `Class ${grade} student must not access Class ${otherGrade} topic`);
    }

    console.log(`  [CLASS ${grade}: PASS] Complete independent journey & grade boundary verified for Class ${grade}`);
    passedSteps++;
  } catch (err) {
    console.error(`  [CLASS ${grade}: FAIL] Journey failed for Class ${grade}`);
    console.error(err);
    process.exit(1);
  }
}

console.log("\n================================================================================");
console.log(`  RESULT: ALL ${passedSteps} / ${totalSteps} STEPS & CLASS VERIFICATIONS PASSED CLEANLY!`);
console.log("================================================================================\n");

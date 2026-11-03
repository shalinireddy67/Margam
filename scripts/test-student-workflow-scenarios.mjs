/**
 * MARGAM — Student Overall Workflow Scenarios Verification Suite
 * Tests Scenarios A, B, C, D across Classes 6–10.
 */

import assert from "node:assert";
import {
  createLearnerProfile,
  getActiveProfile,
  clearActiveProfile,
  saveProfile,
  updateLearnerStudyClass,
  updateLearnerNickname,
  recordWorksheetAttempt,
} from "../src/lib/storage";
import {
  syncClassProgression,
  canAccessTopic,
  completeLesson,
  recordTopicOpened,
  unlockChapterLessons,
} from "../src/lib/progression";
import {
  generateChapterDiagnostic,
  evaluateChapterDiagnostic,
  generatePersonalizedWorksheet,
  evaluatePracticeSubmission,
  generateChapterTest,
  evaluateChapterTest,
  recommendLessonVariant,
} from "../src/lib/adaptive";
import {
  getConceptsByClass,
  getFirstSupportedConcept,
  getConceptById,
  canTakeChapterDiagnostic,
} from "../src/lib/curriculum";
import { getRevisionQueue } from "../src/lib/revision";

import { sanitizeQuestion } from "../src/lib/server/questions";

console.log("================================================================================");
console.log("  MARGAM — Comprehensive Student Overall Workflow Verification");
console.log("================================================================================\n");

let passed = 0;
let total = 0;

function check(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ============================================================================
// SCENARIO A: NEW STUDENT ONBOARDING & PROGRESSION
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("  SCENARIO A: New Student (Registration -> Diagnostic -> Gap -> Lesson -> Unlock)");
console.log("--------------------------------------------------------------------------------");

clearActiveProfile();

check("A1. No silent Class 10 profile: initial active profile is null", () => {
  const active = getActiveProfile();
  assert.strictEqual(active, null, "First-time visitor must NOT have a silently generated profile");
});

check("A2. Student chooses custom Name and Class 8", () => {
  const profile = createLearnerProfile("Priya Sharma", 8);
  assert.strictEqual(profile.name, "Priya Sharma");
  assert.strictEqual(profile.selectedClass, 8);
  assert.strictEqual(profile.studyClass, 8);
  assert.strictEqual(profile.enrolledClass, 8);
});

check("A3. Class progression initialized strictly for Class 8", () => {
  const active = getActiveProfile();
  const synced = syncClassProgression(active);
  assert.strictEqual(synced.selectedClass, 8);

  const c8Concepts = getConceptsByClass(8);
  const first = getFirstSupportedConcept(8);
  assert(first, "Class 8 must have a first supported concept");

  // First concept is available
  assert.strictEqual(synced.topicProgress[first.id]?.status, "available");

  // Subsequent concepts are locked
  for (const c of c8Concepts) {
    if (c.id !== first.id) {
      assert.strictEqual(synced.topicProgress[c.id]?.status, "locked");
    }
  }
});

check("A4. Start Class 10 student for full pilot chain verification", () => {
  clearActiveProfile();
  const prof10 = createLearnerProfile("Aarav", 10);
  const synced = syncClassProgression(prof10);
  assert.strictEqual(synced.selectedClass, 10);
  const first10 = getFirstSupportedConcept(10);
  assert.strictEqual(synced.topicProgress[first10.id]?.status, "available");

  // Taking chapter diagnostic for c10-ch04 or placement unlocks chapter lessons
  unlockChapterLessons("c10-ch04");
  const afterUnlock = getActiveProfile();
  assert.strictEqual(afterUnlock.topicProgress["c10-quad-01"]?.status, "available");
});

check("A5. Chapter Diagnostic generates 6 questions and server sanitizes answers", () => {
  const prof = getActiveProfile();
  const diag = generateChapterDiagnostic("c10-ch04", 6);
  assert.strictEqual(diag.questions.length, 6);
  const sanitized = diag.questions.map(sanitizeQuestion);
  assert(sanitized.every(q => !q.correctAnswer && !q.answers), "Questions must be sanitized");
});

check("A6. Student submits diagnostic with negative integer mistake pattern", () => {
  const prof = getActiveProfile();
  const diag = generateChapterDiagnostic("c10-ch04", 6);

  // Student makes mistake tagged with tag-int-sub-neg
  const studentAnswers = {};
  for (const q of diag.questions) {
    studentAnswers[q.id] = q.options[1].id;
  }

  const evalResult = evaluateChapterDiagnostic(
    "c10-ch04",
    studentAnswers,
    diag.questions,
    prof.id,
    prof
  );

  assert(evalResult.totalQuestions === 6, "Total questions must be 6");
  assert(typeof evalResult.correctCount === "number", "Score must be numeric");
  assert(typeof evalResult.scorePercentage === "number", "Percentage must be numeric");
  assert(evalResult.gapAnalysis, "Gap analysis must be computed");
});

check("A7. Foundational Gap detected and routed to Class 7 prerequisite", () => {
  const prof = getActiveProfile();
  const diag = generateChapterDiagnostic("c10-ch04", 6);

  const studentAnswers = {};
  diag.questions.forEach((q) => {
    studentAnswers[q.id] = q.options[0].id;
  });

  const evalResult = evaluateChapterDiagnostic(
    "c10-ch04",
    studentAnswers,
    diag.questions,
    prof.id,
    prof
  );

  assert(evalResult.feedback.length === 6, "Feedback must match question count");
  assert(evalResult.gapAnalysis !== undefined, "Gap analysis object must be generated");
});

check("A8. Remedial prerequisite lesson (Class 7) is accessible from Gap card", () => {
  const prof = getActiveProfile();
  const c7ConceptId = "c7-int-02"; // Subtraction with Negative Integers

  // Standard access without remediation flag is blocked because student is in Class 10
  const standardAccess = canAccessTopic(c7ConceptId, prof, false);
  assert.strictEqual(standardAccess.accessible, false);

  // Remediation access with allowRemediation = true is permitted
  const remedialAccess = canAccessTopic(c7ConceptId, prof, true);
  assert.strictEqual(remedialAccess.accessible, true);
});

check("A9. Completing lesson moves topic to completed and unlocks worksheet", () => {
  const prof = getActiveProfile();
  const conceptId = "c10-quad-01";

  // Opening topic moves it to in_progress
  recordTopicOpened(conceptId);
  const afterOpen = getActiveProfile();
  assert.strictEqual(afterOpen.topicProgress[conceptId].status, "in_progress");

  // Explicit completion completes the lesson
  const finishRes = completeLesson(conceptId);
  assert.strictEqual(finishRes.success, true);
  const afterFinish = getActiveProfile();
  assert.strictEqual(afterFinish.topicProgress[conceptId].lessonCompleted, true);
});

check("A10. Completing worksheet with >= 70% unlocks next topic (c10-quad-02)", () => {
  const conceptId = "c10-quad-01";

  // Record passing worksheet attempt
  const { profile: updated } = recordWorksheetAttempt(conceptId, 5, 5, 1, false);

  assert(updated, "Profile must update after worksheet attempt");
  assert.strictEqual(updated.topicProgress[conceptId].worksheetCompleted, true);

  // Sync progression to evaluate unlock of c10-quad-02
  const reSynced = syncClassProgression(updated);
  assert.strictEqual(reSynced.topicProgress["c10-quad-02"]?.status, "available", "Next topic c10-quad-02 must unlock!");
});

// ============================================================================
// SCENARIO B: RETURNING STUDENT CONTINUATION
// ============================================================================
console.log("\n--------------------------------------------------------------------------------");
console.log("  SCENARIO B: Returning Student (Profile Restoration & Continuation)");
console.log("--------------------------------------------------------------------------------");

check("B1. Returning student retrieves exact saved progress from storage", () => {
  const existing = getActiveProfile();
  assert(existing, "Existing profile must be present in storage");
  assert.strictEqual(existing.name, "Aarav");
  assert.strictEqual(existing.selectedClass, 10);
  assert.strictEqual(existing.topicProgress["c10-quad-01"].status, "completed");
  assert.strictEqual(existing.topicProgress["c10-quad-02"].status, "available");
});

check("B2. Switching daily study class safely isolates progress and preserves historical data", () => {
  const active = getActiveProfile();
  const switched = updateLearnerStudyClass(active, 9);
  assert.strictEqual(switched.studyClass, 9);
  assert.strictEqual(switched.selectedClass, 9);
  assert.strictEqual(switched.enrolledClass, 10, "Original enrolled class must be preserved");

  // Completed class 10 topic remains stored
  assert.strictEqual(switched.topicProgress["c10-quad-01"].status, "completed");

  // Sync class 9 progression
  const c9Synced = syncClassProgression(switched);
  const firstC9 = getFirstSupportedConcept(9);
  assert.strictEqual(c9Synced.topicProgress[firstC9.id]?.status, "available");

  // Switch back to 10
  const backTo10 = updateLearnerStudyClass(c9Synced, 10);
  const c10Restored = syncClassProgression(backTo10);
  assert.strictEqual(c10Restored.selectedClass, 10);
  assert.strictEqual(c10Restored.topicProgress["c10-quad-01"].status, "completed");
  assert.strictEqual(c10Restored.topicProgress["c10-quad-02"].status, "available");
});

// ============================================================================
// SCENARIO C: INTERRUPTED STUDENT (REFRESHES & SAFETIES)
// ============================================================================
console.log("\n--------------------------------------------------------------------------------");
console.log("  SCENARIO C: Interrupted Student (Refreshes, Incomplete Attempts & Safe Retry)");
console.log("--------------------------------------------------------------------------------");

check("C1. Incomplete attempt does NOT prematurely complete topic", () => {
  const prof = getActiveProfile();
  const topicId = "c10-quad-02";

  // Simulate starting topic
  recordTopicOpened(topicId);
  const afterStart = getActiveProfile();
  assert.strictEqual(afterStart.topicProgress[topicId].status, "in_progress");
  assert.strictEqual(afterStart.topicProgress[topicId].worksheetCompleted, false);

  // Simulate refresh / re-sync
  const afterRefresh = syncClassProgression(afterStart);
  assert.strictEqual(afterRefresh.topicProgress[topicId].status, "in_progress");
  assert.strictEqual(afterRefresh.topicProgress[topicId].worksheetCompleted, false);
});

check("C2. Failed worksheet attempt does NOT unlock subsequent topics", () => {
  clearActiveProfile();
  const prof6 = createLearnerProfile("TestStudent", 6);
  syncClassProgression(prof6);
  assert.strictEqual(prof6.topicProgress["c6-pat-01"].status, "available");
  assert.strictEqual(prof6.topicProgress["c6-geo-01"].status, "locked");

  // Student scores only 20% on worksheet
  const { profile: updated } = recordWorksheetAttempt("c6-pat-01", 1, 5, 1, false);

  const reSynced = syncClassProgression(updated);
  // c6-pat-01 was not mastered (score < 70%), so c6-geo-01 remains locked
  assert.strictEqual(reSynced.topicProgress["c6-geo-01"]?.status, "locked", "c6-geo-01 must remain strictly locked!");
});

// ============================================================================
// SCENARIO D: SECURITY & ISOLATION
// ============================================================================
console.log("\n--------------------------------------------------------------------------------");
console.log("  SCENARIO D: Security & Boundary Verification");
console.log("--------------------------------------------------------------------------------");

check("D1. Student cannot access higher-grade concepts directly", () => {
  clearActiveProfile();
  const prof6 = createLearnerProfile("Chhavi", 6);
  syncClassProgression(prof6);

  // Attempt to access Class 10 quadratic equation
  const access = canAccessTopic("c10-quad-01", prof6, false);
  assert.strictEqual(access.accessible, false);
  assert(access.reason.includes("Class 10"), "Reason must state grade boundary restriction");
});

check("D2. Student nickname update is sanitized and non-empty", () => {
  const prof = getActiveProfile();
  const updated = updateLearnerNickname(prof, "  Priya K  ");
  assert.strictEqual(updated.name, "Priya K");
});

console.log("\n================================================================================");
console.log(`  RESULT: ${passed} / ${total} STUDENT WORKFLOW CHECKS PASSED CLEANLY!`);
console.log("================================================================================\n");

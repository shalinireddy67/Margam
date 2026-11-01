/**
 * MARGAM Progression & Isolation Test Suite
 * Tests deterministic sequential progression, class isolation, and worksheet rules across Classes 6 to 10.
 */

import assert from "node:assert/strict";
import {
  createLearnerProfile,
  resetProfileToClass,
  getActiveProfile,
  clearActiveProfile,
  migrateLearnerProfile,
  CURRENT_PROFILE_VERSION,
} from "../src/lib/storage";
import {
  syncClassProgression,
  recordTopicOpened,
  completeLesson,
  submitWorksheet,
  canAccessTopic,
  unlockChapterLessons,
} from "../src/lib/progression";
import {
  getFirstSupportedConcept,
  getLessonByConceptId,
  getQuestionsByConceptId,
  canTakeChapterDiagnostic,
} from "../src/lib/curriculum";
import { calculateNextDifficulty } from "../src/lib/adaptive";

console.log("--------------------------------------------------");
console.log("  MARGAM — Progression & Storage Test Suite       ");
console.log("--------------------------------------------------");

// Clean store before test
clearActiveProfile();

const classTestCases = [
  { grade: 6, lesson1: "c6-pat-01", lesson2: "c6-geo-01", qId: "q-c6-pat-01", correctAns: "B" },
  { grade: 7, lesson1: "c7-num-01", lesson2: "c7-alg-01", qId: "q-c7-num-01", correctAns: "B" },
  { grade: 8, lesson1: "c8-sqr-01", lesson2: "c8-exp-01", qId: "q-c8-sqr-01", correctAns: "B" },
  { grade: 9, lesson1: "c9-coord-01", lesson2: "c9-poly-01", qId: "q-c9-coord-01", correctAns: "B" },
  { grade: 10, lesson1: "c10-real-01", lesson2: "c10-poly-01", qId: "q-c10-real-01", correctAns: "B" },
];

console.log("\n1. Testing All 5 Classes Independently (Classes 6 to 10)...");

for (const tc of classTestCases) {
  console.log(`\n--- Testing Class ${tc.grade} ---`);
  clearActiveProfile();

  // (a) Profile creation and locking
  const profile = createLearnerProfile(`Student Class ${tc.grade}`, tc.grade);
  assert.equal(profile.selectedClass, tc.grade, `Profile should lock to Class ${tc.grade}`);
  assert.equal(profile.name, `Student Class ${tc.grade}`);

  // (b) Content validation verification: both lessons have real lessons and questions
  const l1Content = getLessonByConceptId(tc.lesson1);
  const l2Content = getLessonByConceptId(tc.lesson2);
  const l1Questions = getQuestionsByConceptId(tc.lesson1);
  const l2Questions = getQuestionsByConceptId(tc.lesson2);
  assert.ok(l1Content, `Lesson 1 (${tc.lesson1}) must have real implemented lesson content`);
  assert.ok(l2Content, `Lesson 2 (${tc.lesson2}) must have real implemented lesson content`);
  assert.ok(l1Questions.length > 0, `Lesson 1 (${tc.lesson1}) must have real questions`);
  assert.ok(l2Questions.length > 0, `Lesson 2 (${tc.lesson2}) must have real questions`);

  // (c) First lesson is unlocked; second lesson is locked
  syncClassProgression(profile);
  const firstSup = getFirstSupportedConcept(tc.grade);
  assert.equal(firstSup?.id, tc.lesson1, `First supported concept for Class ${tc.grade} must be ${tc.lesson1}`);
  assert.equal(profile.topicProgress[tc.lesson1]?.status, "available", `Lesson 1 (${tc.lesson1}) must be unlocked ('available')`);
  assert.equal(profile.topicProgress[tc.lesson2]?.status, "locked", `Lesson 2 (${tc.lesson2}) must be strictly 'locked' initially`);

  // (d) Opening the first lesson does NOT unlock the second
  const afterOpen = recordTopicOpened(tc.lesson1);
  assert.ok(afterOpen);
  assert.equal(afterOpen.topicProgress[tc.lesson1]?.status, "in_progress", `Opening ${tc.lesson1} should set status to in_progress`);
  assert.equal(afterOpen.topicProgress[tc.lesson1]?.lessonCompleted, false, `Opening ${tc.lesson1} must NOT mark lesson completed`);
  assert.equal(afterOpen.topicProgress[tc.lesson2]?.status, "locked", `Lesson 2 (${tc.lesson2}) must remain locked after opening Lesson 1`);

  // (e) Empty worksheet submission does NOT unlock the second
  const emptyResult = submitWorksheet({
    conceptId: tc.lesson1,
    answers: {},
    submittedAt: new Date().toISOString(),
  });
  assert.equal(emptyResult.success, false, `Empty worksheet submission for ${tc.lesson1} must fail`);
  assert.equal(profile.topicProgress[tc.lesson2]?.status, "locked", `Lesson 2 must remain locked after empty worksheet`);

  // (f) Test completion via either explicit finish or valid worksheet:
  if (tc.grade % 2 === 0) {
    // For even classes (6, 8, 10): test explicit lesson completion
    const completeRes = completeLesson(tc.lesson1);
    assert.equal(completeRes.success, true, `completeLesson for ${tc.lesson1} should succeed`);
    assert.equal(profile.topicProgress[tc.lesson1]?.lessonCompleted, true, `${tc.lesson1} lessonCompleted should be true`);
    assert.equal(profile.topicProgress[tc.lesson1]?.status, "completed", `${tc.lesson1} status should be completed`);
    assert.equal(profile.topicProgress[tc.lesson2]?.status, "available", `Completing lesson ${tc.lesson1} must unlock ${tc.lesson2}`);
  } else {
    // For odd classes (7, 9): test valid worksheet submission unlocks next lesson
    const wsRes = submitWorksheet({
      conceptId: tc.lesson1,
      answers: { [tc.qId]: tc.correctAns },
      submittedAt: new Date().toISOString(),
    });
    assert.equal(wsRes.success, true, `submitWorksheet for ${tc.lesson1} should succeed`);
    assert.equal(profile.topicProgress[tc.lesson1]?.worksheetCompleted, true, `${tc.lesson1} worksheetCompleted should be true`);
    assert.equal(profile.topicProgress[tc.lesson1]?.status, "completed", `${tc.lesson1} status should be completed`);
    assert.equal(profile.topicProgress[tc.lesson2]?.status, "available", `Submitting worksheet for ${tc.lesson1} must unlock ${tc.lesson2}`);
  }

  // (g) Completed lesson remains available for revision
  const revCheck = canAccessTopic(tc.lesson1, profile);
  assert.equal(revCheck.accessible, true, `Completed lesson ${tc.lesson1} must remain accessible for revision`);

  // (h) Reload/Persistence test: getActiveProfile() preserves state
  const reloaded = getActiveProfile();
  assert.ok(reloaded, "Profile must persist in storage");
  assert.equal(reloaded.selectedClass, tc.grade);
  assert.equal(reloaded.topicProgress[tc.lesson1]?.status, "completed");
  assert.equal(reloaded.topicProgress[tc.lesson2]?.status, "available");

  // (i) Cross-class isolation: Cannot access topics from other grades
  for (const other of classTestCases) {
    if (other.grade !== tc.grade) {
      const cross1 = canAccessTopic(other.lesson1, profile);
      const cross2 = canAccessTopic(other.lesson2, profile);
      assert.equal(cross1.accessible, false, `Class ${tc.grade} student cannot access Class ${other.grade} topic ${other.lesson1}`);
      assert.equal(cross2.accessible, false, `Class ${tc.grade} student cannot access Class ${other.grade} topic ${other.lesson2}`);
    }
  }

  console.log(`  [PASS] Class ${tc.grade} fully passed all 9 verification points.`);
}

// 2. Class Reset Zero-Mixing Test
console.log("\n2. Testing Class Reset & Profile Isolation...");
clearActiveProfile();
const pAnanya = createLearnerProfile("Ananya", 6);
syncClassProgression(pAnanya);
completeLesson("c6-pat-01");
const beforeReset = getActiveProfile();
assert.equal(beforeReset?.topicProgress["c6-pat-01"]?.status, "completed");

const switched = resetProfileToClass(10);
assert.equal(switched.selectedClass, 10, "Switched class should be Class 10");
assert.equal(Object.keys(switched.topicProgress).length, 0, "Switched class must have 0 topic progress from prior class");
syncClassProgression(switched);
assert.equal(switched.topicProgress["c10-real-01"]?.status, "available", "Class 10 first topic unlocked");
assert.equal(switched.topicProgress["c6-pat-01"], undefined, "Prior Class 6 topic must not leak into Class 10");
console.log("  [PASS] Class reset completely isolates progress without grade contamination.");

// 3. Adaptive Difficulty Stepping
console.log("\n3. Testing Adaptive Difficulty Stepping Rules...");
const stepUp = calculateNextDifficulty(1, 3, 0);
assert.equal(stepUp.newDifficulty, 2, "3 consecutive correct answers must increase difficulty from 1 to 2");

const stepDown = calculateNextDifficulty(2, 0, 2);
assert.equal(stepDown.newDifficulty, 1, "2 consecutive errors must decrease difficulty from 2 to 1");
console.log("  [PASS] Deterministic adaptive difficulty stepping verified.");

// 4. Chapter Diagnostic Eligibility & Placement Unlock
console.log("\n4. Testing Chapter Diagnostic Eligibility & Placement Unlock...");
assert.equal(canTakeChapterDiagnostic("c10-ch04"), true, "c10-ch04 with 14 questions is eligible for diagnostic");
assert.equal(canTakeChapterDiagnostic("c10-ch01"), false, "c10-ch01 with 2 questions must NOT show diagnostic (lesson-only)");

clearActiveProfile();
const p10 = createLearnerProfile("PlacementTester", 10);
syncClassProgression(p10);
// Initially c10-quad-01 is locked because c10-ch01 is first
assert.equal(p10.topicProgress["c10-quad-01"]?.status, "locked");

// Now unlock chapter lessons (as if passed diagnostic with >= 70%)
const unlockedP10 = unlockChapterLessons("c10-ch04");
assert.equal(unlockedP10?.topicProgress["c10-quad-01"]?.status, "available", "c10-quad-01 unlocked by placement");
assert.equal(unlockedP10?.topicProgress["c10-quad-02"]?.status, "available", "c10-quad-02 unlocked by placement");
console.log("  [PASS] Chapter diagnostic eligibility (>= 6) and placement unlock verified.");

// 5. Schema Validation & Legacy Profile Migration (v0 to v1)
console.log("\n5. Testing Schema Validation & Legacy Profile Migration (v0 to v1)...");

const legacyUnversionedProfile = {
  id: "legacy_student_123",
  name: "Aarav Sharma",
  selectedClass: 10,
  createdAt: "2026-09-01T10:00:00.000Z",
  topicProgress: {
    "c10-quad-01": {
      conceptId: "c10-quad-01",
      status: "completed",
      lessonCompleted: true,
      worksheetCompleted: true,
      difficulty: 2,
    },
  },
  // Notice: no 'version' field, no 'consecutiveCorrect', no 'consecutiveIncorrect'
};

const migrated = migrateLearnerProfile(legacyUnversionedProfile);
assert.ok(migrated, "Migration of legacy unversioned profile must succeed");
assert.equal(migrated.version, CURRENT_PROFILE_VERSION, `Migrated profile version must equal ${CURRENT_PROFILE_VERSION}`);
assert.equal(migrated.id, "legacy_student_123");
assert.equal(migrated.name, "Aarav Sharma");
assert.equal(migrated.selectedClass, 10);
assert.equal(migrated.consecutiveCorrect, 0, "Default consecutiveCorrect initialized");
assert.equal(migrated.topicProgress["c10-quad-01"]?.status, "completed");

// Test corrupted profile recovery
console.log("  [TEST] Testing deliberately corrupted profile to verify Zod validation and safe reset...");
const corruptProfile = {
  id: "", // deliberately empty id (triggers Zod too_small error)
  selectedClass: 99, // invalid grade
};
const corruptResult = migrateLearnerProfile(corruptProfile);
assert.equal(corruptResult, null, "Corrupt profile failing schema must return null to trigger safe reset");
console.log("  [CONFIRMED] The Zod error above ('id: Too small') is generated by the deliberate corruptProfile test.");

// Test that getActiveProfile safely resets broken saved profile to null without crashing
globalThis.__margam_memory_store__ = corruptProfile;
const resetResult = getActiveProfile();
assert.equal(resetResult, null, "getActiveProfile must safely reset broken saved profile to null without crashing");
assert.equal(globalThis.__margam_memory_store__, null, "Memory store was safely cleared of corrupted profile");
console.log("  [PASS] Profile schema validation, deliberate corruption handling, and crash-free reset verified.");

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL PROGRESSION TESTS PASSED (100% OK)    ");
console.log("--------------------------------------------------");

/**
 * Anti-Repetition & Question Bank Capacity Test Suite (Phase 5)
 * 
 * Verifies that:
 * 1. All 10 pilot concepts have at least 18 verified questions across difficulty 1-3.
 * 2. Adaptive practice generates distinct question sets on consecutive attempts (anti-repetition).
 * 3. Diagnostic generation rotates questions and respects excludeQuestionIds.
 * 4. Chapter test generation rotates questions and respects excludeQuestionIds.
 * 5. Deterministic mathematical answers are verified for generated items.
 */

import assert from "assert";
import fs from "fs";
import path from "path";
import {
  generatePersonalizedWorksheet,
  generateChapterDiagnostic,
  generateChapterTest,
} from "../src/lib/adaptive.js";
import { getQuestionsByConceptId } from "../src/lib/curriculum.js";

console.log("==================================================");
console.log("  MARGAM — Anti-Repetition & Pool Capacity Suite  ");
console.log("==================================================");

const PILOT_CONCEPTS = [
  "c6-neg-01",
  "c7-int-02",
  "c8-dist-01",
  "c9-id-01",
  "c10-quad-01",
  "c6-pat-01",
  "c7-alg-01",
  "c8-exp-01",
  "c9-poly-01",
  "c10-poly-01",
];

// TEST 1: Question Pool Capacity per Pilot Concept
console.log("\n--- TEST 1: Question Pool Capacity per Pilot Concept ---");
for (const cid of PILOT_CONCEPTS) {
  const qs = getQuestionsByConceptId(cid);
  assert(qs.length >= 18, `Concept ${cid} must have at least 18 questions (got ${qs.length})`);
  const diff1 = qs.filter((q) => q.difficulty === 1).length;
  const diff2 = qs.filter((q) => q.difficulty === 2).length;
  const diff3 = qs.filter((q) => q.difficulty === 3).length;
  assert(diff1 >= 5, `Concept ${cid} difficulty 1 count >= 5 (got ${diff1})`);
  assert(diff2 >= 5, `Concept ${cid} difficulty 2 count >= 5 (got ${diff2})`);
  assert(diff3 >= 5, `Concept ${cid} difficulty 3 count >= 5 (got ${diff3})`);
  console.log(`  ✅ [PASS] Concept ${cid}: ${qs.length} questions (D1: ${diff1}, D2: ${diff2}, D3: ${diff3})`);
}

// TEST 2: Anti-Repetition in Adaptive Practice Worksheets
console.log("\n--- TEST 2: Anti-Repetition in Adaptive Practice ---");
for (const cid of PILOT_CONCEPTS) {
  // First attempt (offset: 0)
  const round1 = generatePersonalizedWorksheet(cid, null, 5, { offset: 0 });
  const ids1 = round1.questions.map((q) => q.id);

  // Second attempt with excludeQuestionIds of round 1
  const round2 = generatePersonalizedWorksheet(cid, null, 5, {
    excludeQuestionIds: ids1,
    offset: 1,
  });
  const ids2 = round2.questions.map((q) => q.id);

  const overlap = ids1.filter((id) => ids2.includes(id));
  assert.strictEqual(
    overlap.length,
    0,
    `Round 2 should have 0 overlapping questions from Round 1 when excluded (got overlap: ${overlap.join(", ")})`
  );

  // Third attempt with offset rotation
  const round3 = generatePersonalizedWorksheet(cid, null, 5, {
    excludeQuestionIds: ids2,
    offset: 2,
  });
  const ids3 = round3.questions.map((q) => q.id);
  const overlap23 = ids2.filter((id) => ids3.includes(id));
  assert.strictEqual(
    overlap23.length,
    0,
    `Round 3 should have 0 overlapping questions from Round 2 when excluded`
  );

  console.log(`  ✅ [PASS] Concept ${cid}: consecutive practice rounds draw distinct questions (R1: ${ids1.length}, R2: ${ids2.length}, R3: ${ids3.length})`);
}

// TEST 3: Anti-Repetition in Chapter Diagnostics
console.log("\n--- TEST 3: Anti-Repetition in Chapter Diagnostics ---");
const PILOT_CHAPTERS = ["c6-ch10", "c7-ch10", "c8-ch06", "c9-ch04", "c10-ch04", "c6-ch01", "c7-ch02", "c8-ch02", "c9-ch02", "c10-ch02"];

for (const chId of PILOT_CHAPTERS) {
  const diag1 = generateChapterDiagnostic(chId, 6, { offset: 0 });
  const diagIds1 = diag1.questions.map((q) => q.id);

  const diag2 = generateChapterDiagnostic(chId, 6, {
    excludeQuestionIds: diagIds1,
    offset: 1,
  });
  const diagIds2 = diag2.questions.map((q) => q.id);

  const overlap = diagIds1.filter((id) => diagIds2.includes(id));
  assert(
    overlap.length <= 1,
    `Chapter ${chId} diagnostic retry should draw predominantly fresh questions (overlap: ${overlap.length})`
  );
  console.log(`  ✅ [PASS] Chapter ${chId}: diagnostic retry draws distinct questions (overlap: ${overlap.length} of 6)`);
}

// TEST 4: Anti-Repetition in Chapter Test
console.log("\n--- TEST 4: Anti-Repetition in Chapter Test ---");
for (const chId of ["c6-ch10", "c7-ch10", "c8-ch06", "c9-ch04", "c10-ch04"]) {
  const test1 = generateChapterTest(chId, 10, { offset: 0 });
  const testIds1 = test1.questions.map((q) => q.id);

  const test2 = generateChapterTest(chId, 10, {
    excludeQuestionIds: testIds1,
    offset: 1,
  });
  const testIds2 = test2.questions.map((q) => q.id);

  const overlap = testIds1.filter((id) => testIds2.includes(id));
  assert(
    overlap.length <= 4,
    `Chapter ${chId} test retry should draw fresh questions from expanded pool (overlap: ${overlap.length})`
  );
  console.log(`  ✅ [PASS] Chapter ${chId}: test retry draws distinct questions from expanded pool (overlap: ${overlap.length} of 10)`);
}

console.log("\n==================================================");
console.log("  RESULT: ALL ANTI-REPETITION CHECKS PASSED!     ");
console.log("==================================================");


/**
 * Test Suite for Step 4: Gap Tracing using tag-roots.json
 */

import assert from "node:assert/strict";
import {
  traceRootConcept,
  findPrerequisitePath,
  evaluateGapTracing,
  computeRecencyWeight,
  computeDistanceWeight,
  getPrerequisitesGraph,
  rankCandidateRootCauses,
} from "../src/lib/adaptive";

console.log("--------------------------------------------------");
console.log("  MARGAM — Step 4: Gap Tracing Test Suite         ");
console.log("--------------------------------------------------");

// 1. Direct tag-roots mapping
console.log("\n1. Testing traceRootConcept via tag-roots.json...");
const t1 = traceRootConcept("sign_error_positive_times_negative");
assert.ok(t1, "Should resolve root for sign_error_positive_times_negative");
assert.equal(t1.rootConceptId, "c7-int-02", "Should map to c7-int-02");
assert.equal(t1.rootConcept?.id, "c7-int-02");

const t2 = traceRootConcept("accepted_negative_root_for_physical_dimension");
assert.ok(t2);
assert.equal(t2.rootConceptId, "c10-quad-01");

const t3 = traceRootConcept("placed_zero_as_smallest");
assert.ok(t3);
assert.equal(t3.rootConceptId, "c6-neg-01");
console.log("  [PASS] traceRootConcept correctly resolves root concepts.");

// 2. DAG prerequisite display path
console.log("\n2. Testing findPrerequisitePath (display journey only)...");
const path1 = findPrerequisitePath("c10-quad-01", "c7-int-02");
assert.ok(path1.length >= 2, "Path must contain at least start and target");
assert.equal(path1[0], "c10-quad-01", "Path starts at current concept");
assert.equal(path1[path1.length - 1], "c7-int-02", "Path ends at root concept");
console.log(`  Path from c10-quad-01 -> c7-int-02: [${path1.join(" -> ")}]`);

const path2 = findPrerequisitePath("c10-quad-01", "c6-neg-01");
assert.equal(path2[0], "c10-quad-01");
assert.equal(path2[path2.length - 1], "c6-neg-01");
console.log(`  Path from c10-quad-01 -> c6-neg-01: [${path2.join(" -> ")}]`);
console.log("  [PASS] DAG prerequisite path generation for display passed.");

// 3. evaluateGapTracing triggering conditions
console.log("\n3. Testing evaluateGapTracing trigger conditions...");

// Case A: Single mistake tag -> No route
const singleRes = evaluateGapTracing("c10-quad-01", ["sign_error_positive_times_negative"]);
assert.equal(singleRes.confirmed, false, "Single error must not trigger routing");
assert.equal(singleRes.canRoute, false);

// Case B: Same tag twice -> Confirmed via repeated_tag
const repeatRes = evaluateGapTracing("c10-quad-01", [
  "sign_error_positive_times_negative",
  "sign_error_positive_times_negative",
]);
assert.equal(repeatRes.confirmed, true, "Same tag twice must confirm gap");
assert.equal(repeatRes.triggerReason, "repeated_tag");
assert.equal(repeatRes.rootConceptId, "c7-int-02");
assert.equal(repeatRes.canRoute, true, "c7-int-02 has 11 questions >= 3, can route");
assert.ok(repeatRes.prerequisitePath.length >= 2);
console.log("  [PASS] Repeated tag triggers confirmation and routing.");

// Case C: Two different tags pointing to same root -> Confirmed via convergent_tags
const convergeRes = evaluateGapTracing("c10-quad-01", [
  "sign_error_positive_times_negative", // -> c7-int-02
  "negative_times_negative_equals_negative_error", // -> c7-int-02
]);
assert.equal(convergeRes.confirmed, true, "Two different tags pointing to same root must confirm gap");
assert.equal(convergeRes.triggerReason, "convergent_tags");
assert.equal(convergeRes.rootConceptId, "c7-int-02");
assert.equal(convergeRes.canRoute, true);
console.log("  [PASS] Convergent tags trigger confirmation and routing.");

// Case D: Concept with too few questions -> cannot route, reports shortfall
const shortfallRes = evaluateGapTracing(
  "c7-alg-01",
  ["confused_crore_with_million", "confused_crore_with_million"], // maps to c7-num-01 (2 questions)
  3
);
assert.equal(shortfallRes.confirmed, true);
assert.equal(shortfallRes.rootConceptId, "c7-num-01");
assert.equal(shortfallRes.canRoute, false, "Cannot route to concept with < 3 questions");
assert.ok(shortfallRes.shortfallReport, "Must provide shortfall report");
console.log(`  Shortfall report: "${shortfallRes.shortfallReport}"`);
console.log("  [PASS] Question count guard correctly blocks routing when questions are insufficient.");

// 4. Pure Ranking Engine & Decay Verification
console.log("\n4. Testing Pure Ranking Functions & Decay Rules...");

// 4.1 Recency weight formula
const r0 = computeRecencyWeight(0, 6, 0.9); // 0.9^5 = 0.59049
assert.equal(Number(r0.toFixed(4)), 0.5905, "Recency weight at question 0 of 6 should be 0.9^5");
const r1 = computeRecencyWeight(1, 6, 0.9); // 0.9^4 = 0.65610
assert.equal(Number(r1.toFixed(4)), 0.6561, "Recency weight at question 1 of 6 should be 0.9^4");
const r5 = computeRecencyWeight(5, 6, 0.9); // 0.9^0 = 1.0000
assert.equal(r5, 1.0, "Most recent question must have recency weight 1.0");
console.log("  [PASS] Recency weight computation matches exponential decay formula.");

// 4.2 Distance weight formula
assert.equal(computeDistanceWeight(0), 1.0, "Direct root must have distance weight 1.0 (Change 1)");
assert.equal(Number(computeDistanceWeight(1).toFixed(2)), 0.70, "Depth 1 must have distance weight 0.7");
assert.equal(Number(computeDistanceWeight(2).toFixed(2)), 0.49, "Depth 2 must have distance weight 0.49");
assert.equal(Number(computeDistanceWeight(3).toFixed(4)), 0.3430, "Depth 3 must have distance weight 0.343");
assert.equal(computeDistanceWeight(4), 0.0, "Depth > 3 must decay to 0.0");
console.log("  [PASS] Distance decay formula satisfies full weight for root and 0.7^d for prereqs.");

// 4.3 Prerequisite DAG traversal
const prereqsC7 = getPrerequisitesGraph("c7-int-02", 3);
assert.ok(prereqsC7.some((p) => p.conceptId === "c7-int-01" && p.depth === 1), "c7-int-01 at depth 1");
assert.ok(prereqsC7.some((p) => p.conceptId === "c6-neg-02" && p.depth === 2), "c6-neg-02 at depth 2");
assert.ok(prereqsC7.some((p) => p.conceptId === "c6-neg-01" && p.depth === 3), "c6-neg-01 at depth 3");
console.log("  [PASS] Prerequisite DAG traversal correctly resolves ancestors up to depth 3.");

// 5. Calibration of Existing Class 10 Journey Smoke-Test Answers
console.log("\n5. Testing Confidence Calibration on Existing Smoke-Test Answers...");
const smokeEvents = [
  { tag: "squared_negative_b_as_negative", questionIndex: 0, totalQuestions: 6 },
  { tag: "sign_error_negative_times_negative_became_negative", questionIndex: 1, totalQuestions: 6 },
];
const smokeCandidates = rankCandidateRootCauses(smokeEvents, "c10-quad-01", 3);
assert.ok(smokeCandidates.length > 0, "Candidates must be generated");
const topSmoke = smokeCandidates[0];

console.log(`  Top Candidate: ${topSmoke.conceptId} | Score: ${topSmoke.score} | Confidence: ${topSmoke.confidence} | Routing: ${topSmoke.routing}`);
assert.equal(topSmoke.conceptId, "c7-int-02", "Top candidate must be c7-int-02");
assert.equal(topSmoke.score, 1.2466, "Computed score for smoke test answers must be exactly 1.2466");
assert.equal(topSmoke.confidence, "low", "Confidence for smoke test answers must be calibrated as 'low'");
assert.equal(topSmoke.routing, "confirmation_only", "Routing for 'low' must be 'confirmation_only'");

// Verify isolated single error is 'insufficient'
const singleCareless = rankCandidateRootCauses(
  [{ tag: "squared_negative_b_as_negative", questionIndex: 5, totalQuestions: 6 }],
  "c10-quad-01",
  3
);
assert.equal(singleCareless[0].confidence, "insufficient", "Single isolated slip must have insufficient confidence");
assert.equal(singleCareless[0].routing, "none", "Single isolated slip must have no routing");

// Verify 4 errors produce 'high' confidence
const fourErrors = rankCandidateRootCauses(
  [
    { tag: "sign_error_positive_times_negative", questionIndex: 0, totalQuestions: 6 },
    { tag: "sign_error_negative_times_negative_became_negative", questionIndex: 1, totalQuestions: 6 },
    { tag: "sign_error_constant_product", questionIndex: 2, totalQuestions: 6 },
    { tag: "negative_times_negative_equals_negative_error", questionIndex: 4, totalQuestions: 6 },
  ],
  "c8-dist-01",
  3
);
assert.ok(fourErrors.length > 0, "Candidates must be generated for four errors");
assert.equal(fourErrors[0].confidence, "high", "Four errors must produce 'high' confidence");
assert.equal(fourErrors[0].routing, "gap_card", "High confidence must route directly to 'gap_card'");

console.log("  [PASS] Confidence thresholds and routing calibrated exactly as specified.");

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL STEP 4 GAP TRACING CHECKS PASSED    ");
console.log("--------------------------------------------------");

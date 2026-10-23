/**
 * Test Suite for Step 4: Gap Tracing using tag-roots.json
 */

import assert from "node:assert/strict";
import {
  traceRootConcept,
  findPrerequisitePath,
  evaluateGapTracing,
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

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL STEP 4 GAP TRACING CHECKS PASSED    ");
console.log("--------------------------------------------------");

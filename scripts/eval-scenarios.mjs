/**
 * Margam — Prerequisite Recommendation Accuracy Evaluation Harness
 * 
 * Evaluates the ranking and gap tracing engine against 14 pre-labeled scenarios:
 * - 10 Tuning Scenarios
 * - 4 Held-Out Scenarios (never used for tuning)
 *
 * Reports:
 * - Confusion Matrix: TP, FP, FN, TN
 * - Precision, Recall, Overall Accuracy
 * - Top-1 Root Cause Accuracy
 * - Held-out results computed and displayed separately
 * - Explicit Label: "synthetic scenarios authored by the team"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { evaluateChapterDiagnostic } from "../src/lib/adaptive.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scenariosPath = path.resolve(__dirname, "..", "data", "eval-scenarios.json");

const scenarios = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));

console.log("================================================================================");
console.log("  MARGAM — RECOMMENDATION ACCURACY BENCHMARK HARNESS                             ");
console.log("  Dataset Notice: All test cases are synthetic scenarios authored by the team   ");
console.log("================================================================================\n");

function runEvaluation(subset, label) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  let top1Matches = 0;
  let gapExpectedCount = 0;
  const failures = [];

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`  EVALUATION SUBSET: ${label.toUpperCase()} (${subset.length} Scenarios)`);
  console.log(`--------------------------------------------------------------------------------`);

  for (const sc of subset) {
    const answers = {};
    for (const r of sc.responses) {
      answers[r.questionId] = r.selectedOption;
    }

    const diag = evaluateChapterDiagnostic(sc.chapterId, answers, 3);
    const gap = diag.gapAnalysis;

    const actualHasGap = gap.confirmed;
    const actualRoot = gap.rootConceptId;
    const actualConfidence = gap.confidence || "insufficient";
    const actualRouting = gap.routing || "none";

    const expectedHasGap = sc.expected.hasGap;
    const expectedRoot = sc.expected.expectedRootConceptId;
    const expectedConfidence = sc.expected.expectedConfidence;
    const expectedRouting = sc.expected.expectedRouting;

    // Confusion Matrix
    if (expectedHasGap && actualHasGap) {
      tp++;
    } else if (!expectedHasGap && actualHasGap) {
      fp++;
    } else if (expectedHasGap && !actualHasGap) {
      fn++;
    } else {
      tn++;
    }

    if (expectedHasGap) {
      gapExpectedCount++;
      if (actualRoot === expectedRoot) {
        top1Matches++;
      }
    }

    const isMatch =
      actualHasGap === expectedHasGap &&
      actualRoot === expectedRoot &&
      actualConfidence === expectedConfidence &&
      actualRouting === expectedRouting;

    const statusBadge = isMatch ? "[PASS]" : "[FAIL]";
    console.log(
      `  ${statusBadge} ${sc.id}: ${sc.name.padEnd(52)} | ` +
      `Gap: ${actualHasGap === expectedHasGap ? "OK" : "MISMATCH"} | ` +
      `Root: ${actualRoot === expectedRoot ? (actualRoot || "null") : `ACT:${actualRoot}!=EXP:${expectedRoot}`} | ` +
      `Conf: ${actualConfidence} | Route: ${actualRouting}`
    );

    if (!isMatch) {
      failures.push({
        id: sc.id,
        name: sc.name,
        expected: sc.expected,
        actual: {
          hasGap: actualHasGap,
          rootConceptId: actualRoot,
          confidence: actualConfidence,
          routing: actualRouting,
          score: gap.score,
        },
      });
    }
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 1.0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1.0;
  const accuracy = (tp + tn) / subset.length;
  const top1Accuracy = gapExpectedCount > 0 ? top1Matches / gapExpectedCount : 1.0;

  console.log(`\n  --- Summary Metrics: ${label} ---`);
  console.log(`  Total Scenarios:     ${subset.length}`);
  console.log(`  True Positives (TP): ${tp}`);
  console.log(`  False Positives (FP):${fp}`);
  console.log(`  False Negatives (FN):${fn}`);
  console.log(`  True Negatives (TN): ${tn}`);
  console.log(`  Precision:           ${(precision * 100).toFixed(1)}%`);
  console.log(`  Recall:              ${(recall * 100).toFixed(1)}%`);
  console.log(`  Overall Accuracy:    ${(accuracy * 100).toFixed(1)}%`);
  console.log(`  Top-1 Root Accuracy: ${(top1Accuracy * 100).toFixed(1)}% (${top1Matches}/${gapExpectedCount})`);

  return {
    label,
    count: subset.length,
    tp,
    fp,
    fn,
    tn,
    precision,
    recall,
    accuracy,
    top1Accuracy,
    failures,
  };
}

const tuningScenarios = scenarios.filter((s) => !s.heldOut);
const heldOutScenarios = scenarios.filter((s) => s.heldOut);

const tuningResults = runEvaluation(tuningScenarios, "Tuning Set (10 Scenarios)");
const heldOutResults = runEvaluation(heldOutScenarios, "Held-Out Set (4 Scenarios - Blind Evaluation)");
const overallResults = runEvaluation(scenarios, "Combined Complete Suite (14 Scenarios)");

console.log("\n================================================================================");
console.log("  FINAL REPORT MATRIX                                                           ");
console.log("  All data: synthetic scenarios authored by the team                            ");
console.log("================================================================================");
console.log("| Metric               | Tuning Set (N=10)   | Held-Out Set (N=4)  | Combined (N=14)     |");
console.log("|----------------------|---------------------|---------------------|---------------------|");
console.log(`| True Positives (TP)  | ${String(tuningResults.tp).padEnd(19)} | ${String(heldOutResults.tp).padEnd(19)} | ${String(overallResults.tp).padEnd(19)} |`);
console.log(`| False Positives (FP) | ${String(tuningResults.fp).padEnd(19)} | ${String(heldOutResults.fp).padEnd(19)} | ${String(overallResults.fp).padEnd(19)} |`);
console.log(`| False Negatives (FN) | ${String(tuningResults.fn).padEnd(19)} | ${String(heldOutResults.fn).padEnd(19)} | ${String(overallResults.fn).padEnd(19)} |`);
console.log(`| True Negatives (TN)  | ${String(tuningResults.tn).padEnd(19)} | ${String(heldOutResults.tn).padEnd(19)} | ${String(overallResults.tn).padEnd(19)} |`);
console.log(`| Precision            | ${(tuningResults.precision * 100).toFixed(1)}%               | ${(heldOutResults.precision * 100).toFixed(1)}%               | ${(overallResults.precision * 100).toFixed(1)}%               |`);
console.log(`| Recall               | ${(tuningResults.recall * 100).toFixed(1)}%               | ${(heldOutResults.recall * 100).toFixed(1)}%               | ${(overallResults.recall * 100).toFixed(1)}%               |`);
console.log(`| Overall Accuracy     | ${(tuningResults.accuracy * 100).toFixed(1)}%               | ${(heldOutResults.accuracy * 100).toFixed(1)}%               | ${(overallResults.accuracy * 100).toFixed(1)}%               |`);
console.log(`| Top-1 Accuracy       | ${(tuningResults.top1Accuracy * 100).toFixed(1)}%               | ${(heldOutResults.top1Accuracy * 100).toFixed(1)}%               | ${(overallResults.top1Accuracy * 100).toFixed(1)}%               |`);

const totalFailures = overallResults.failures.length;
if (totalFailures > 0) {
  console.error(`\n❌ EVALUATION FAILED: Found ${totalFailures} mismatching scenario(s):`);
  for (const f of overallResults.failures) {
    console.error(`  - [${f.id}] ${f.name}`);
    console.error(`    Expected:`, JSON.stringify(f.expected));
    console.error(`    Actual:  `, JSON.stringify(f.actual));
  }
  process.exit(1);
} else {
  console.log("\n✅ ALL 14 SCENARIOS PASSED WITH 100% PRECISION, RECALL, AND TOP-1 ACCURACY!");
  console.log("   Tuning and Held-Out metrics independently verified.");
  console.log("   Notice: synthetic scenarios authored by the team.");
  process.exit(0);
}

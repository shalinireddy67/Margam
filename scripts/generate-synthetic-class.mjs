/**
 * Margam — Synthetic Classroom Dataset Generator
 * 
 * Runs the real Margam engine:
 * - Chapter diagnostic evaluation (evaluateChapterDiagnostic)
 * - Candidate root cause ranking & gap tracing (evaluateGapTracing / rankCandidateRootCauses)
 * - Prerequisite DAG path traversal (findPrerequisitePath)
 * - Pure adaptive mastery formula updates (updateMastery)
 * 
 * Generates data/synthetic-class.json for 25 scripted student answer profiles.
 * NO HAND-TYPED SCORES. All scores and metrics are calculated dynamically.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "data", "synthetic-class.json");

// If executed directly by raw node without tsx, delegate to npx tsx
if (!process.env.__TSX_INVOKED__ && !process.execArgv.some(a => a.includes("tsx"))) {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "npx.cmd" : "npx";
  const res = spawnSync(cmd, ["tsx", __filename, ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, __TSX_INVOKED__: "1" },
  });
  process.exit(res.status ?? 0);
}

const { evaluateChapterDiagnostic, updateMastery, findPrerequisitePath } = await import("../src/lib/adaptive.ts");
const { getConceptById } = await import("../src/lib/curriculum.ts");

// 1. Scripted 25 Student Profiles across varied learning personas
// All answers map to real questions in c10-ch04:
// - q-c10-sol-01 (c10-quad-01): correct = B, A = forgot_to_invert_signs_from_factors_to_roots, C = incorrect_factor_pair_sum, D = inconsistent_sign_inversion
// - q-c10-sol-02 (c10-quad-01): correct = B, A = forgot_to_invert_signs_from_factors_to_roots, C = assumed_both_roots_negative, D = incorrect_factor_pair_sum
// - q-c10-form-01 (c10-quad-02): correct = B, A = squared_negative_b_as_negative, C = added_four_ac_instead_of_subtracting, D = sign_error_in_subtraction
// - q-c10-form-02 (c10-quad-02): correct = B, A = forgot_negative_b_sign_flip, C = dropped_negative_root_sign, D = sign_error_negative_times_negative_became_negative
// - q-c10-form-03 (c10-quad-02): correct = C, A = assumed_discriminant_positive_without_evaluating, B = confused_zero_discriminant, D = misunderstood_nature_of_roots_rules
// - q-c10-quad-d1-01 (c10-quad-01): correct = A, B = forgot_to_invert_signs_from_factors_to_roots, C = inconsistent_sign_inversion, D = assumed_both_roots_negative

const studentSeeds = [
  {
    rollNumber: 1,
    name: "Aarav Sharma",
    gender: "M",
    persona: "Convergent Sign-Rule Gap (Class 7 Prerequisite)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [70],
      "c7-int-02": [40], // struggles with sign rules
      "c8-dist-01": [60],
      "c8-dist-02": [65],
      "c9-id-01": [70],
      "c9-id-02": [65],
    },
  },
  {
    rollNumber: 2,
    name: "Diya Patel",
    gender: "F",
    persona: "High Performer (Clean Full Mastery)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [95],
      "c6-neg-02": [90],
      "c7-int-01": [95],
      "c7-int-02": [90],
      "c8-dist-01": [95],
      "c8-dist-02": [90],
      "c9-id-01": [95],
      "c9-id-02": [90],
    },
  },
  {
    rollNumber: 3,
    name: "Vihaan Verma",
    gender: "M",
    persona: "Single Careless Factor Slip (High Confidence In Progress)",
    diagnosticAnswers: {
      "q-c10-sol-01": "C", // incorrect_factor_pair_sum (isolated slip)
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [90],
      "c6-neg-02": [85],
      "c7-int-01": [85],
      "c7-int-02": [80],
      "c8-dist-01": [85],
      "c8-dist-02": [80],
      "c9-id-01": [85],
      "c9-id-02": [75],
    },
  },
  {
    rollNumber: 4,
    name: "Ananya Iyer",
    gender: "F",
    persona: "Factor Inversion Misconception (Class 10 Concept)",
    diagnosticAnswers: {
      "q-c10-sol-01": "A", // forgot_to_invert_signs_from_factors_to_roots
      "q-c10-sol-02": "A", // forgot_to_invert_signs_from_factors_to_roots
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "B", // forgot_to_invert_signs_from_factors_to_roots
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [85],
      "c7-int-01": [80],
      "c7-int-02": [80],
      "c8-dist-01": [80],
      "c8-dist-02": [75],
      "c9-id-01": [80],
      "c9-id-02": [75],
    },
  },
  {
    rollNumber: 5,
    name: "Arjun Nair",
    gender: "M",
    persona: "Integer Addition & Subtraction Reversal (Class 7 Prerequisite)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "D", // sign_error_in_subtraction -> c7-int-01
      "q-c10-form-02": "C", // dropped_negative_root_sign -> c10-quad-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [80],
      "c6-neg-02": [75],
      "c7-int-01": [45], // gap
      "c7-int-02": [60],
      "c8-dist-01": [60],
      "c8-dist-02": [65],
      "c9-id-01": [70],
      "c9-id-02": [65],
    },
  },
  {
    rollNumber: 6,
    name: "Sai Reddy",
    gender: "M",
    persona: "High Scorer (Minor Discriminant Rule Slip)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "D", // misunderstood_nature_of_roots_rules (isolated slip)
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [90],
      "c6-neg-02": [90],
      "c7-int-01": [85],
      "c7-int-02": [85],
      "c8-dist-01": [85],
      "c8-dist-02": [80],
      "c9-id-01": [85],
      "c9-id-02": [80],
    },
  },
  {
    rollNumber: 7,
    name: "Ishaan Gupta",
    gender: "M",
    persona: "Repeated Factoring Trinomial Pair Slips (Class 9 Prerequisite)",
    diagnosticAnswers: {
      "q-c10-sol-01": "C", // incorrect_factor_pair_sum -> c9-id-02
      "q-c10-sol-02": "D", // incorrect_factor_pair_sum -> c9-id-02
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [75],
      "c8-dist-01": [70],
      "c8-dist-02": [70],
      "c9-id-01": [65],
      "c9-id-02": [40], // gap
    },
  },
  {
    rollNumber: 8,
    name: "Kavya Krishnan",
    gender: "F",
    persona: "Convergent Sign Multiplication Gap (Class 7 Prerequisite)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [35], // gap
      "c8-dist-01": [60],
      "c8-dist-02": [65],
      "c9-id-01": [70],
      "c9-id-02": [60],
    },
  },
  {
    rollNumber: 9,
    name: "Rohan Joshi",
    gender: "M",
    persona: "Clean Mastery (Flawless Execution)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [95],
      "c6-neg-02": [95],
      "c7-int-01": [90],
      "c7-int-02": [95],
      "c8-dist-01": [90],
      "c8-dist-02": [95],
      "c9-id-01": [90],
      "c9-id-02": [95],
    },
  },
  {
    rollNumber: 10,
    name: "Meera Rao",
    gender: "F",
    persona: "Discriminant Formula Sign & Calculation Slips",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "C", // added_four_ac_instead_of_subtracting
      "q-c10-form-02": "A", // forgot_negative_b_sign_flip
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [80],
      "c7-int-02": [75],
      "c8-dist-01": [75],
      "c8-dist-02": [75],
      "c9-id-01": [70],
      "c9-id-02": [70],
    },
  },
  {
    rollNumber: 11,
    name: "Aditya Menon",
    gender: "M",
    persona: "Root Assumption Misconceptions (Assumed Negative)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "C", // assumed_both_roots_negative
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "D", // assumed_both_roots_negative
    },
    prereqHistoryScores: {
      "c6-neg-01": [80],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [75],
      "c8-dist-01": [70],
      "c8-dist-02": [70],
      "c9-id-01": [70],
      "c9-id-02": [70],
    },
  },
  {
    rollNumber: 12,
    name: "Pooja Kulkarni",
    gender: "F",
    persona: "Discriminant Formula Misunderstanding",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "C", // added_four_ac_instead_of_subtracting
      "q-c10-form-02": "B",
      "q-c10-form-03": "B", // confused_zero_discriminant
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [70],
      "c8-dist-01": [70],
      "c8-dist-02": [70],
      "c9-id-01": [70],
      "c9-id-02": [65],
    },
  },
  {
    rollNumber: 13,
    name: "Karthik Sundaram",
    gender: "M",
    persona: "Sign Multiplication Rules Prerequisite Gap",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [80],
      "c6-neg-02": [75],
      "c7-int-01": [70],
      "c7-int-02": [40], // gap
      "c8-dist-01": [60],
      "c8-dist-02": [60],
      "c9-id-01": [65],
      "c9-id-02": [60],
    },
  },
  {
    rollNumber: 14,
    name: "Riya Sen",
    gender: "F",
    persona: "Clean Mastery (Flawless Performance)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [95],
      "c6-neg-02": [90],
      "c7-int-01": [95],
      "c7-int-02": [90],
      "c8-dist-01": [95],
      "c8-dist-02": [90],
      "c9-id-01": [90],
      "c9-id-02": [95],
    },
  },
  {
    rollNumber: 15,
    name: "Pranav Bhat",
    gender: "M",
    persona: "Integer Subtraction Sign Loss Gap",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "D", // sign_error_in_subtraction -> c7-int-01
      "q-c10-form-02": "C", // dropped_negative_root_sign
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [80],
      "c6-neg-02": [75],
      "c7-int-01": [40], // gap
      "c7-int-02": [65],
      "c8-dist-01": [60],
      "c8-dist-02": [65],
      "c9-id-01": [65],
      "c9-id-02": [60],
    },
  },
  {
    rollNumber: 16,
    name: "Sneha Mukherjee",
    gender: "F",
    persona: "Inconsistent Sign Inversion & Factoring Slips",
    diagnosticAnswers: {
      "q-c10-sol-01": "D", // inconsistent_sign_inversion
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "C", // inconsistent_sign_inversion
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [70],
      "c8-dist-01": [70],
      "c8-dist-02": [65],
      "c9-id-01": [65],
      "c9-id-02": [65],
    },
  },
  {
    rollNumber: 17,
    name: "Rahul Deshmukh",
    gender: "M",
    persona: "Careless Discriminant Evaluation Slip",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "A", // assumed_discriminant_positive_without_evaluating (isolated slip)
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [90],
      "c6-neg-02": [85],
      "c7-int-01": [85],
      "c7-int-02": [80],
      "c8-dist-01": [85],
      "c8-dist-02": [80],
      "c9-id-01": [85],
      "c9-id-02": [80],
    },
  },
  {
    rollNumber: 18,
    name: "Tanvi Agarwal",
    gender: "F",
    persona: "Factoring Trinomials Middle Term Slip",
    diagnosticAnswers: {
      "q-c10-sol-01": "C", // incorrect_factor_pair_sum -> c9-id-02
      "q-c10-sol-02": "D", // incorrect_factor_pair_sum -> c9-id-02
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [70],
      "c8-dist-01": [70],
      "c8-dist-02": [65],
      "c9-id-01": [65],
      "c9-id-02": [45], // gap
    },
  },
  {
    rollNumber: 19,
    name: "Varun Pillai",
    gender: "M",
    persona: "Severe Sign-Rule Collapse (Multiple Prerequisite Gaps)",
    diagnosticAnswers: {
      "q-c10-sol-01": "C", // incorrect_factor_pair_sum -> c9-id-02
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "B", // confused_zero_discriminant
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [75],
      "c6-neg-02": [70],
      "c7-int-01": [60],
      "c7-int-02": [30], // severe gap
      "c8-dist-01": [45], // gap
      "c8-dist-02": [50],
      "c9-id-01": [55],
      "c9-id-02": [50],
    },
  },
  {
    rollNumber: 20,
    name: "Shreya Nambiar",
    gender: "F",
    persona: "Clean Mastery (Flawless Execution)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [95],
      "c6-neg-02": [95],
      "c7-int-01": [95],
      "c7-int-02": [90],
      "c8-dist-01": [95],
      "c8-dist-02": [90],
      "c9-id-01": [90],
      "c9-id-02": [90],
    },
  },
  {
    rollNumber: 21,
    name: "Vikram Rathore",
    gender: "M",
    persona: "Factor Inversion to Roots Gap",
    diagnosticAnswers: {
      "q-c10-sol-01": "A", // forgot_to_invert_signs_from_factors_to_roots
      "q-c10-sol-02": "A", // forgot_to_invert_signs_from_factors_to_roots
      "q-c10-form-01": "B",
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "B", // forgot_to_invert_signs_from_factors_to_roots
    },
    prereqHistoryScores: {
      "c6-neg-01": [80],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [75],
      "c8-dist-01": [70],
      "c8-dist-02": [70],
      "c9-id-01": [70],
      "c9-id-02": [65],
    },
  },
  {
    rollNumber: 22,
    name: "Nisha Hegde",
    gender: "F",
    persona: "Discriminant & Sign Evaluation Slips",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "A", // forgot_negative_b_sign_flip
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [75],
      "c7-int-02": [55],
      "c8-dist-01": [65],
      "c8-dist-02": [65],
      "c9-id-01": [70],
      "c9-id-02": [70],
    },
  },
  {
    rollNumber: 23,
    name: "Harsh Vardhan",
    gender: "M",
    persona: "Integer Subtraction Reversal & Distributive Slip",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "D", // sign_error_in_subtraction -> c7-int-01
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [75],
      "c6-neg-02": [70],
      "c7-int-01": [40], // gap
      "c7-int-02": [45], // gap
      "c8-dist-01": [55],
      "c8-dist-02": [60],
      "c9-id-01": [60],
      "c9-id-02": [60],
    },
  },
  {
    rollNumber: 24,
    name: "Deepa Nair",
    gender: "F",
    persona: "Careless Discriminant 4ac Slip",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "C", // added_four_ac_instead_of_subtracting (isolated slip)
      "q-c10-form-02": "B",
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [90],
      "c6-neg-02": [85],
      "c7-int-01": [85],
      "c7-int-02": [80],
      "c8-dist-01": [80],
      "c8-dist-02": [85],
      "c9-id-01": [80],
      "c9-id-02": [80],
    },
  },
  {
    rollNumber: 25,
    name: "Yash Kothari",
    gender: "M",
    persona: "Convergent Sign Rules Gap (Class 7 Prerequisite)",
    diagnosticAnswers: {
      "q-c10-sol-01": "B",
      "q-c10-sol-02": "B",
      "q-c10-form-01": "A", // squared_negative_b_as_negative -> c7-int-02
      "q-c10-form-02": "D", // sign_error_negative_times_negative_became_negative -> c7-int-02
      "q-c10-form-03": "C",
      "q-c10-quad-d1-01": "A",
    },
    prereqHistoryScores: {
      "c6-neg-01": [85],
      "c6-neg-02": [80],
      "c7-int-01": [70],
      "c7-int-02": [35], // gap
      "c8-dist-01": [60],
      "c8-dist-02": [60],
      "c9-id-01": [65],
      "c9-id-02": [60],
    },
  },
];

// Concepts to evaluate in the heatmap (10 key pilot spine concepts across Classes 6 to 10)
const heatmapConceptMeta = [
  { id: "c6-neg-01", name: "Opposite Quantities", shortName: "Signed Nums", class: 6 },
  { id: "c6-neg-02", name: "Number Line Ordering", shortName: "Number Line", class: 6 },
  { id: "c7-int-01", name: "Integer Add & Sub", shortName: "Add/Sub Signs", class: 7 },
  { id: "c7-int-02", name: "Integer Sign Rules", shortName: "Mult Signs", class: 7 },
  { id: "c8-dist-01", name: "Distributive Law", shortName: "Distributive", class: 8 },
  { id: "c8-dist-02", name: "Multiplying Binomials", shortName: "Binomials", class: 8 },
  { id: "c9-id-01", name: "Algebraic Identities", shortName: "Identities", class: 9 },
  { id: "c9-id-02", name: "Factoring Trinomials", shortName: "Factoring", class: 9 },
  { id: "c10-quad-01", name: "Solving by Factoring", shortName: "Quad Factor", class: 10 },
  { id: "c10-quad-02", name: "Quadratic Formula", shortName: "Quad Formula", class: 10 },
];

console.log("==================================================");
console.log("  MARGAM — GENERATING SYNTHETIC CLASSROOM DATA    ");
console.log("  Executing pure adaptive & diagnostic engine... ");
console.log("==================================================");

const processedStudents = [];
const mistakeFrequency = {};
const prerequisiteGapCount = {};

let totalScoreSum = 0;

for (const seed of studentSeeds) {
  // 1. Run Real Diagnostic Evaluation Engine
  const diag = evaluateChapterDiagnostic("c10-ch04", seed.diagnosticAnswers, 3);
  const gap = diag.gapAnalysis;

  // Track diagnostic score
  totalScoreSum += diag.scorePercentage;

  // Track mistake tags
  for (const tag of diag.mistakeTags) {
    mistakeFrequency[tag] = (mistakeFrequency[tag] || 0) + 1;
  }

  // Track missing prerequisites if confirmed gap
  if (gap.confirmed && gap.rootConceptId) {
    prerequisiteGapCount[gap.rootConceptId] = (prerequisiteGapCount[gap.rootConceptId] || 0) + 1;
  }

  // 2. Compute mastery for each tested concept
  // Separate c10-quad-01 questions and c10-quad-02 questions
  const qSolCorrect = diag.feedback.filter(
    (f) => f.conceptId === "c10-quad-01" && f.isCorrect
  ).length;
  const qSolTotal = diag.feedback.filter(
    (f) => f.conceptId === "c10-quad-01"
  ).length;
  const c10_01_Score = qSolTotal > 0 ? Math.round((qSolCorrect / qSolTotal) * 100) : 0;
  const c10_01_Mastery = updateMastery(undefined, c10_01_Score);

  const qFormCorrect = diag.feedback.filter(
    (f) => f.conceptId === "c10-quad-02" && f.isCorrect
  ).length;
  const qFormTotal = diag.feedback.filter(
    (f) => f.conceptId === "c10-quad-02"
  ).length;
  const c10_02_Score = qFormTotal > 0 ? Math.round((qFormCorrect / qFormTotal) * 100) : 0;
  const c10_02_Mastery = updateMastery(undefined, c10_02_Score);

  // 3. Compute Concept Heatmap Array
  const conceptMasteryMap = {};
  conceptMasteryMap["c10-quad-01"] = c10_01_Mastery;
  conceptMasteryMap["c10-quad-02"] = c10_02_Mastery;

  for (const [cid, history] of Object.entries(seed.prereqHistoryScores)) {
    let m = undefined;
    for (const score of history) {
      m = updateMastery(m, score);
    }
    conceptMasteryMap[cid] = m ?? 0;
  }

  // Assign Heatmap Status: M, P, G, L
  const heatmap = heatmapConceptMeta.map((meta) => {
    const cid = meta.id;
    const masteryVal = conceptMasteryMap[cid] ?? 0;

    let status = "L"; // L = Learning / Low (< 50%)
    if (gap.confirmed && gap.rootConceptId === cid) {
      status = "G"; // G = Gap Detected
    } else if (masteryVal >= 75) {
      status = "M"; // M = Mastered
    } else if (masteryVal >= 50) {
      status = "P"; // P = Practicing / In Progress
    } else {
      status = "L"; // L = Needs foundation / low
    }

    return {
      conceptId: cid,
      name: meta.name,
      shortName: meta.shortName,
      class: meta.class,
      masteryPercentage: masteryVal,
      status, // 'M' | 'P' | 'G' | 'L'
    };
  });

  const rootConceptObj = gap.rootConceptId ? getConceptById(gap.rootConceptId) : null;
  const needsAttention = gap.confirmed || diag.scorePercentage < 70;

  let attentionReason = "";
  if (gap.confirmed && rootConceptObj) {
    attentionReason = `Prerequisite gap diagnosed in Class ${rootConceptObj.class} "${rootConceptObj.name.en}"`;
  } else if (diag.scorePercentage < 70) {
    attentionReason = `Low diagnostic accuracy (${diag.scorePercentage}%) requires teacher intervention`;
  } else {
    attentionReason = "On track with curriculum progression";
  }

  const recommendedRemedialConcept = gap.confirmed && rootConceptObj ? {
    conceptId: gap.rootConceptId,
    name: rootConceptObj.name.en,
    class: rootConceptObj.class,
    confidence: gap.confidence || "insufficient",
    routing: gap.routing || "none",
    score: gap.score,
    reason: gap.plainLanguageReason || rootConceptObj.learningObjective.en,
    path: gap.prerequisitePath,
  } : null;

  processedStudents.push({
    id: `stu-synth-${String(seed.rollNumber).padStart(2, "0")}`,
    rollNumber: seed.rollNumber,
    name: seed.name,
    gender: seed.gender,
    section: "A",
    class: 10,
    persona: seed.persona,
    needsAttention,
    attentionReason,
    diagnosticScore: diag.scorePercentage,
    correctCount: diag.correctCount,
    totalQuestions: diag.totalQuestions,
    mistakeTags: diag.mistakeTags,
    feedback: diag.feedback.map((f) => ({
      questionId: f.questionId,
      conceptId: f.conceptId,
      selectedOption: f.selectedOption,
      correctAnswer: f.correctAnswer,
      isCorrect: f.isCorrect,
      mistakeTag: f.mistakeTag || null,
    })),
    gapAnalysis: {
      confirmed: gap.confirmed,
      rootConceptId: gap.rootConceptId,
      rootConceptName: rootConceptObj?.name.en || null,
      rootConceptClass: rootConceptObj?.class || null,
      confidence: gap.confidence || "insufficient",
      routing: gap.routing || "none",
      score: gap.score,
      triggerReason: gap.triggerReason || null,
      prerequisitePath: gap.prerequisitePath,
      plainLanguageReason: gap.plainLanguageReason,
      candidates: (gap.candidates || []).map((c) => ({
        conceptId: c.conceptId,
        conceptName: c.concept?.name.en || c.conceptId,
        class: c.concept?.class || 10,
        score: c.score,
        confidence: c.confidence,
        routing: c.routing,
        directEvidenceCount: c.directEvidenceCount,
        propagatedEvidenceScore: c.propagatedEvidenceScore,
        prerequisitePath: c.prerequisitePath,
      })),
    },
    recommendedRemedialConcept,
    heatmap,
  });
}

// 4. Compute Aggregate Statistics
const totalStudents = processedStudents.length;
const averageScore = Math.round(totalScoreSum / totalStudents);
const studentsNeedingAttention = processedStudents.filter((s) => s.needsAttention);

// Sort common misconceptions by descending count
const commonMisconceptions = Object.entries(mistakeFrequency)
  .map(([tag, count]) => {
    return {
      tag,
      count,
      percentage: Math.round((count / totalStudents) * 100),
      description: tag.replace(/_/g, " "),
    };
  })
  .sort((a, b) => b.count - a.count);

// Sort frequently missing prerequisites by descending count
const frequentlyMissingPrerequisites = Object.entries(prerequisiteGapCount)
  .map(([conceptId, count]) => {
    const conceptObj = getConceptById(conceptId);
    return {
      conceptId,
      conceptName: conceptObj?.name.en || conceptId,
      class: conceptObj?.class || 0,
      count,
      percentage: Math.round((count / totalStudents) * 100),
      learningObjective: conceptObj?.learningObjective.en || "",
    };
  })
  .sort((a, b) => b.count - a.count);

const syntheticClassData = {
  syntheticNotice: "Synthetic class, generated by the Margam engine",
  datasetBadge: "Synthetic class, generated by the Margam engine",
  generatedAt: new Date().toISOString(),
  classId: "sec-10a-synth",
  className: "Class 10 — Section A",
  academicYear: "2026-2027",
  teacherName: "Mrs. Lakshmi Devi",
  subject: "maths",
  chapterId: "c10-ch04",
  chapterName: "Quadratic Equations",
  totalStudents,
  metrics: {
    averageScore,
    studentsNeedingAttentionCount: studentsNeedingAttention.length,
    studentsNeedingAttentionPercentage: Math.round((studentsNeedingAttention.length / totalStudents) * 100),
    studentsOnTrackCount: totalStudents - studentsNeedingAttention.length,
    studentsOnTrackPercentage: Math.round(((totalStudents - studentsNeedingAttention.length) / totalStudents) * 100),
    topMissingPrerequisite: frequentlyMissingPrerequisites[0] || null,
  },
  heatmapConcepts: heatmapConceptMeta,
  commonMisconceptions,
  frequentlyMissingPrerequisites,
  students: processedStudents,
};

fs.writeFileSync(outputPath, JSON.stringify(syntheticClassData, null, 2), "utf-8");

console.log(`\n✅ Generated data/synthetic-class.json with ${totalStudents} students:`);
console.log(`   - Average Diagnostic Score: ${averageScore}%`);
console.log(`   - Students Needing Attention: ${studentsNeedingAttention.length}/${totalStudents}`);
console.log(`   - Top Missing Prerequisite: ${frequentlyMissingPrerequisites[0]?.conceptId} (${frequentlyMissingPrerequisites[0]?.conceptName})`);
console.log(`   - Common Misconceptions: ${commonMisconceptions.length} unique tags tracked`);
console.log(`   - Notice Label: "Synthetic class, generated by the Margam engine"\n`);

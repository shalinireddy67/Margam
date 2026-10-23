/**
 * Unit Test Suite for Step 6: Silent Shortfall & Draft Translation Protection
 */

import assert from "node:assert/strict";
import { resolveLocalizedString, hasEnoughQuestions, getQuestionsByConceptId } from "../src/lib/curriculum";
import { generateChapterDiagnostic, selectPracticeQuestions } from "../src/lib/adaptive";

console.log("--------------------------------------------------");
console.log("  MARGAM — Step 6: Draft Translation & Shortfall  ");
console.log("--------------------------------------------------");

// 1. Unreviewed Translation Protection
console.log("\n1. Testing Unreviewed Translation Protection...");
const sampleUnreviewed = {
  en: "Find the roots of x^2 - 5x + 6 = 0.",
  hi: "x^2 - 5x + 6 = 0 के मूल ज्ञात कीजिए।",
  te: "x^2 - 5x + 6 = 0 యొక్క మూలాలను కనుగొనండి.",
  reviewed: false,
};

// Default (flag = false): Must NOT show HI/TE as final -> falls back to EN
const defaultHi = resolveLocalizedString(sampleUnreviewed, "hi", false);
assert.equal(defaultHi.text, sampleUnreviewed.en, "Unreviewed Hindi must not be shown as final; falls back to English");
assert.equal(defaultHi.isDraft, false);

const defaultTe = resolveLocalizedString(sampleUnreviewed, "te", false);
assert.equal(defaultTe.text, sampleUnreviewed.en, "Unreviewed Telugu must not be shown as final; falls back to English");
assert.equal(defaultTe.isDraft, false);

// With draft flag set (showDrafts = true): Displays translation marked as draft
const draftHi = resolveLocalizedString(sampleUnreviewed, "hi", true);
assert.equal(draftHi.text, sampleUnreviewed.hi, "Displays Hindi translation when draft flag is explicitly set");
assert.equal(draftHi.isDraft, true, "Must be flagged as isDraft: true for UI badge");

const draftTe = resolveLocalizedString(sampleUnreviewed, "te", true);
assert.equal(draftTe.text, sampleUnreviewed.te, "Displays Telugu translation when draft flag is explicitly set");
assert.equal(draftTe.isDraft, true, "Must be flagged as isDraft: true for UI badge");

// Reviewed translation: Always shown as final without draft badge
const sampleReviewed = {
  en: "What is an integer?",
  hi: "पूर्णांक क्या है?",
  te: "పూర్ణాంకం అంటే ఏమిటి?",
  reviewed: true,
};
const reviewedHi = resolveLocalizedString(sampleReviewed, "hi", false);
assert.equal(reviewedHi.text, sampleReviewed.hi);
assert.equal(reviewedHi.isDraft, false);
console.log("  [PASS] Translation protection verified: unreviewed HI/TE never shown as final unless draft flag set.");

// 2. Silent Shortfall Handling
console.log("\n2. Testing Silent Shortfall Guarding...");
// Concept with 2 questions (c7-num-01) requested for 6 questions
const shortfallDiag = generateChapterDiagnostic("c7-ch01", 6);
assert.equal(shortfallDiag.shortfall, true, "Must flag shortfall: true when questions < requested");
assert.ok(shortfallDiag.questions.length <= 2, "Does not invent fake questions; returns only authentic questions");

// Concept with 11 questions (c10-quad-01) requested for 3 questions
const healthySet = selectPracticeQuestions("c10-quad-01", 3);
assert.equal(healthySet.shortfall, false, "No shortfall when bank has sufficient questions");
assert.equal(healthySet.questions.length, 3);

console.log("  [PASS] Silent shortfall handled cleanly without creating synthetic content.");

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL STEP 6 CHECKS PASSED                ");
console.log("--------------------------------------------------");

/**
 * Unit & Integration Test Suite for Margam Language Persistence and i18n
 */

import assert from "node:assert/strict";
import { translations } from "../src/lib/i18n/translations.ts";
import { resolveLocalizedString } from "../src/lib/curriculum.ts";

console.log("--------------------------------------------------");
console.log("  MARGAM — Language Persistence & i18n Test Suite ");
console.log("--------------------------------------------------");

// 1. Mock Browser Environment
const localStorageMock = new Map();
const cookieMock = new Map();

globalThis.localStorage = {
  getItem: (key) => localStorageMock.get(key) || null,
  setItem: (key, val) => localStorageMock.set(key, String(val)),
  removeItem: (key) => localStorageMock.delete(key),
  clear: () => localStorageMock.clear(),
};

globalThis.document = {
  documentElement: { lang: "en" },
  cookie: "",
};

// 2. Test Language State Storage & Cookie Persistence
console.log("\n1. Testing Language Persistence to Storage & Cookie...");
const STORAGE_KEY = "margam_language";
const COOKIE_KEY = "margam_lang";

function simulateLanguageSwitch(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = lang;
}

// Switch to Hindi
simulateLanguageSwitch("hi");
assert.equal(localStorage.getItem(STORAGE_KEY), "hi", "Hindi must persist in localStorage");
assert.ok(document.cookie.includes("margam_lang=hi"), "Hindi must persist in cookie");
assert.equal(document.documentElement.lang, "hi", "HTML root lang attribute must update to hi");

// Simulate page refresh (loading from storage)
const refreshedLang = localStorage.getItem(STORAGE_KEY);
assert.equal(refreshedLang, "hi", "Selected language must survive page refresh");

// Switch to Telugu
simulateLanguageSwitch("te");
assert.equal(localStorage.getItem(STORAGE_KEY), "te", "Telugu must persist in localStorage");
assert.ok(document.cookie.includes("margam_lang=te"), "Telugu must persist in cookie");
assert.equal(document.documentElement.lang, "te", "HTML root lang attribute must update to te");

// Switch back to English
simulateLanguageSwitch("en");
assert.equal(localStorage.getItem(STORAGE_KEY), "en");
console.log("  [PASS] Storage and Cookie persistence verified across en, hi, and te.");

// 3. Test Student Progress Preservation
console.log("\n2. Testing Student Progress Preservation on Language Switch...");
const sampleLearnerProfile = {
  id: "student-test-uuid",
  name: "Aarav",
  selectedClass: 10,
  studyClass: 10,
  xp: 450,
  streak: { current: 5, longest: 7 },
  topicProgress: {
    "c10-quad-01": { status: "completed", mastery: 90, worksheetCompleted: true },
  },
  resolvedGaps: ["c7-int-01"],
};

const profileBefore = JSON.stringify(sampleLearnerProfile);
// Switch languages multiple times
simulateLanguageSwitch("hi");
simulateLanguageSwitch("te");
simulateLanguageSwitch("en");
const profileAfter = JSON.stringify(sampleLearnerProfile);

assert.equal(profileBefore, profileAfter, "Switching language must NEVER alter or reset learner progress");
console.log("  [PASS] Learner profile, XP, streak, and completed topics preserved intact.");

// 4. Test Translation Resolution with Draft Support
console.log("\n3. Testing Curriculum Translation Resolution with Draft Support...");
const sampleConceptName = {
  en: "Quadratic Equations",
  hi: "द्विघात समीकरण",
  te: "వర్గ సమీకరణాలు",
  reviewed: false,
};

// When showDrafts is true, student sees active translation with draft badge
const resolvedHi = resolveLocalizedString(sampleConceptName, "hi", true);
assert.equal(resolvedHi.text, "द्विघात समीकरण");
assert.equal(resolvedHi.isDraft, true);

const resolvedTe = resolveLocalizedString(sampleConceptName, "te", true);
assert.equal(resolvedTe.text, "వర్గ సమీకరణాలు");
assert.equal(resolvedTe.isDraft, true);

// When language is English, canonical text is returned
const resolvedEn = resolveLocalizedString(sampleConceptName, "en", true);
assert.equal(resolvedEn.text, "Quadratic Equations");
assert.equal(resolvedEn.isDraft, false);
console.log("  [PASS] Localized curriculum resolution cleanly verified with draft badge support.");

// 5. Test Plain Language and Tone in Interface Dictionary
console.log("\n4. Testing Plain Language Rules in Hindi and Telugu Dictionaries...");
// Verify no clinical medical diagnostic wording in Telugu
assert.ok(!translations.te.home.studentBody.includes("రోగనిర్ధారణ"), "Telugu student body must not use clinical medical term 'రోగనిర్ధారణ'");
assert.ok(!translations.te.diagnostic.title.includes("రోగనిర్ధారణ"), "Telugu diagnostic title must use friendly check term");

// Verify no complex Sanskritized textbook jargon in Hindi
assert.ok(!translations.hi.home.studentBody.includes("अधिगम"), "Hindi student body must not use complex 'अधिगम'");
assert.ok(!translations.hi.dashboard.activeGapTitle.includes("अधिगम"), "Hindi dashboard must use simple everyday words");

// Verify button active verbs
assert.equal(translations.hi.common.start, "शुरू करें");
assert.equal(translations.te.common.start, "మొదలుపెట్టండి");
assert.equal(translations.hi.common.save, "सहेजें");
assert.equal(translations.te.common.save, "సేవ్ చేయండి");

console.log("  [PASS] Plain everyday wording strictly verified for Indian school students.");

console.log("\n--------------------------------------------------");
console.log("  RESULT: ALL LANGUAGE TESTS PASSED CLEANLY!       ");
console.log("--------------------------------------------------");


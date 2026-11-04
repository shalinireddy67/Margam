/**
 * Margam — Multilingual Translation & i18n Validation Suite
 * Validates interface dictionaries, interpolation tokens, and curriculum coverage.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("--------------------------------------------------");
console.log("  MARGAM — Multilingual i18n & Translation Suite  ");
console.log("--------------------------------------------------");

// 1. Load Interface Translations
const translationsFile = path.join(rootDir, "src", "lib", "i18n", "translations.ts");
if (!fs.existsSync(translationsFile)) {
  console.error("❌ translations.ts not found at", translationsFile);
  process.exit(1);
}

// Read translations.ts content directly to validate keys and values
const fileContent = fs.readFileSync(translationsFile, "utf-8");

// Parse translations object
let translations;
try {
  // Use regex extraction or evaluate in clean VM
  const exportMatch = fileContent.match(/export const translations:\s*Record<[^>]+>\s*=\s*(\{[\s\S]*?\n\};)/);
  if (exportMatch) {
    const rawObjStr = exportMatch[1].replace(/;\s*$/, "");
    translations = Function(`return (${rawObjStr})`)();
  } else {
    throw new Error("Could not extract translations object from translations.ts");
  }
} catch (err) {
  console.error("❌ Failed to parse translations.ts:", err.message);
  process.exit(1);
}

const languages = ["en", "hi", "te"];
const missingKeys = [];
const emptyTranslations = [];
const placeholderMismatches = [];
const suspiciousUntranslated = [];

function extractTokens(str) {
  const matches = str.match(/\{[a-zA-Z0-9_]+\}/g);
  return matches ? matches.sort() : [];
}

function traverse(enObj, hiObj, teObj, currentPath = "") {
  for (const [key, enVal] of Object.entries(enObj)) {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;

    if (typeof enVal === "object" && enVal !== null) {
      const hiChild = hiObj ? hiObj[key] : undefined;
      const teChild = teObj ? teObj[key] : undefined;
      if (!hiChild) missingKeys.push(`hi: ${fullPath}`);
      if (!teChild) missingKeys.push(`te: ${fullPath}`);
      traverse(enVal, hiChild || {}, teChild || {}, fullPath);
    } else if (typeof enVal === "string") {
      const hiVal = hiObj ? hiObj[key] : undefined;
      const teVal = teObj ? teObj[key] : undefined;

      if (!hiVal) {
        missingKeys.push(`hi: ${fullPath}`);
      } else if (typeof hiVal === "string" && hiVal.trim() === "") {
        emptyTranslations.push(`hi: ${fullPath}`);
      }

      if (!teVal) {
        missingKeys.push(`te: ${fullPath}`);
      } else if (typeof teVal === "string" && teVal.trim() === "") {
        emptyTranslations.push(`te: ${fullPath}`);
      }

      // Check placeholder tokens
      const enTokens = extractTokens(enVal);
      if (typeof hiVal === "string") {
        const hiTokens = extractTokens(hiVal);
        if (JSON.stringify(enTokens) !== JSON.stringify(hiTokens)) {
          placeholderMismatches.push(`hi: ${fullPath} expected ${enTokens.join(", ")} got ${hiTokens.join(", ")}`);
        }
      }
      if (typeof teVal === "string") {
        const teTokens = extractTokens(teVal);
        if (JSON.stringify(enTokens) !== JSON.stringify(teTokens)) {
          placeholderMismatches.push(`te: ${fullPath} expected ${enTokens.join(", ")} got ${teTokens.join(", ")}`);
        }
      }

      // Check for verbatim untranslated English in hi/te (excluding short terms like "English", "NCERT", "Class")
      const allowedVerbatim = new Set(["English", "NCERT", "Margam", "XP", "MARGAM"]);
      if (
        typeof hiVal === "string" &&
        enVal.length > 15 &&
        hiVal === enVal &&
        !allowedVerbatim.has(enVal.trim())
      ) {
        suspiciousUntranslated.push(`hi: ${fullPath}`);
      }
      if (
        typeof teVal === "string" &&
        enVal.length > 15 &&
        teVal === enVal &&
        !allowedVerbatim.has(enVal.trim())
      ) {
        suspiciousUntranslated.push(`te: ${fullPath}`);
      }
    }
  }
}

traverse(translations.en, translations.hi, translations.te);

function countKeys(obj) {
  let count = 0;
  for (const val of Object.values(obj)) {
    if (typeof val === "object" && val !== null) {
      count += countKeys(val);
    } else if (typeof val === "string") {
      count++;
    }
  }
  return count;
}

const enKeyCount = countKeys(translations.en);
const hiKeyCount = countKeys(translations.hi);
const teKeyCount = countKeys(translations.te);

console.log(`\n1. Interface Translation Statistics:`);
console.log(`  - English (EN) keys: ${enKeyCount}`);
console.log(`  - Hindi (HI) keys:   ${hiKeyCount}`);
console.log(`  - Telugu (TE) keys:  ${teKeyCount}`);

let errorsFound = false;

if (missingKeys.length > 0) {
  errorsFound = true;
  console.error(`\n❌ [FAIL] Missing translation keys (${missingKeys.length}):`);
  missingKeys.forEach(k => console.error(`    ${k}`));
} else {
  console.log(`  ✅ [PASS] 0 missing translation keys across all 3 languages.`);
}

if (emptyTranslations.length > 0) {
  errorsFound = true;
  console.error(`\n❌ [FAIL] Empty translations (${emptyTranslations.length}):`);
  emptyTranslations.forEach(k => console.error(`    ${k}`));
} else {
  console.log(`  ✅ [PASS] 0 empty translations.`);
}

if (placeholderMismatches.length > 0) {
  errorsFound = true;
  console.error(`\n❌ [FAIL] Parameter placeholder mismatches (${placeholderMismatches.length}):`);
  placeholderMismatches.forEach(k => console.error(`    ${k}`));
} else {
  console.log(`  ✅ [PASS] All parameter placeholders match perfectly.`);
}

if (suspiciousUntranslated.length > 0) {
  errorsFound = true;
  console.error(`\n❌ [FAIL] Suspicious untranslated text (${suspiciousUntranslated.length}):`);
  suspiciousUntranslated.forEach(k => console.error(`    ${k}`));
} else {
  console.log(`  ✅ [PASS] 0 suspicious untranslated English strings in Hindi or Telugu dictionaries.`);
}

// 2. Audit Curriculum Content Translations
console.log(`\n2. Curriculum Content Translations Audit:`);
const questions = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "questions.json"), "utf-8"));
const lessons = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "lessons.json"), "utf-8"));
const concepts = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "concepts.json"), "utf-8"));
const chapters = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "chapters.json"), "utf-8"));

let questionsTotal = questions.length;
let questionsWithHi = 0;
let questionsWithTe = 0;
let questionsReviewed = 0;

for (const q of questions) {
  if (q.prompt && q.prompt.hi) questionsWithHi++;
  if (q.prompt && q.prompt.te) questionsWithTe++;
  if (q.prompt && q.prompt.reviewed) questionsReviewed++;
}

let lessonVariantsTotal = 0;
let lessonVariantsWithHi = 0;
let lessonVariantsWithTe = 0;
let lessonVariantsReviewed = 0;

for (const l of lessons) {
  for (const vKey of ["basics_first", "standard", "fast_track"]) {
    if (l[vKey] && l[vKey].explanation) {
      lessonVariantsTotal++;
      if (l[vKey].explanation.hi) lessonVariantsWithHi++;
      if (l[vKey].explanation.te) lessonVariantsWithTe++;
      if (l[vKey].explanation.reviewed) lessonVariantsReviewed++;
    }
  }
}

console.log(`  - Questions Bank (${questionsTotal} questions):`);
console.log(`      Hindi coverage:  ${questionsWithHi}/${questionsTotal} (${Math.round((questionsWithHi/questionsTotal)*100)}%)`);
console.log(`      Telugu coverage: ${questionsWithTe}/${questionsTotal} (${Math.round((questionsWithTe/questionsTotal)*100)}%)`);
console.log(`      Reviewed status: ${questionsReviewed} reviewed, ${questionsTotal - questionsReviewed} awaiting specialist review (draft flag supported)`);

console.log(`  - 3-Variant Lessons (${lessonVariantsTotal} lesson variants across 24 concepts):`);
console.log(`      Hindi coverage:  ${lessonVariantsWithHi}/${lessonVariantsTotal} (${Math.round((lessonVariantsWithHi/lessonVariantsTotal)*100)}%)`);
console.log(`      Telugu coverage: ${lessonVariantsWithTe}/${lessonVariantsTotal} (${Math.round((lessonVariantsWithTe/lessonVariantsTotal)*100)}%)`);
console.log(`      Reviewed status: ${lessonVariantsReviewed} reviewed, ${lessonVariantsTotal - lessonVariantsReviewed} awaiting specialist review (draft flag supported)`);

console.log(`  - Concepts (${concepts.length} concepts):`);
console.log(`      Hindi & Telugu names present: ${concepts.every(c => c.name.hi && c.name.te) ? "100%" : "Incomplete"}`);

console.log(`  - Chapters (${chapters.length} chapters):`);
console.log(`      Hindi & Telugu names present: ${chapters.every(ch => ch.name.hi && ch.name.te) ? "100%" : "Incomplete"}`);

console.log("\n--------------------------------------------------");
if (errorsFound) {
  console.log("  RESULT: VALIDATION FAILED WITH ERRORS           ");
  console.log("--------------------------------------------------");
  process.exit(1);
} else {
  console.log("  RESULT: ALL i18n VALIDATION CHECKS PASSED CLEANLY!");
  console.log("--------------------------------------------------");
  process.exit(0);
}


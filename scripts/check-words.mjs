/**
 * Check-Words Validation Suite (Phase 4)
 * Enforces plain words, student-friendly copy, absence of banned marketing buzzwords,
 * absence of "Minecraft" in public copy, and consistent translation placeholders.
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

console.log("=== MARGAM PLAIN WORDS & COPY AUDIT (PHASE 4) ===\n");

let passed = 0;
let total = 0;

function check(desc, fn) {
  total++;
  try {
    fn();
    console.log(`[PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Verify plain-words.md exists and contains the required guidelines
check("data/plain-words.md exists and documents required word swaps", () => {
  const plainWordsPath = path.join(ROOT, "data/plain-words.md");
  if (!fs.existsSync(plainWordsPath)) {
    throw new Error("data/plain-words.md is missing");
  }
  const content = fs.readFileSync(plainWordsPath, "utf8");
  const requiredTerms = [
    "quick check",
    "earlier topic you missed",
    "common mix-up",
    "picks questions for you",
    "how well you know it",
  ];
  for (const term of requiredTerms) {
    if (!content.includes(term)) {
      throw new Error(`data/plain-words.md missing required plain term '${term}'`);
    }
  }
});

// Student UI files to audit for forbidden words in visible copy
const STUDENT_FILES = [
  "src/app/page.tsx",
  "src/components/landing/LandingSections.tsx",
  "src/components/Hero.tsx",
  "src/components/ProblemSection.tsx",
  "src/app/student/page.tsx",
  "src/app/student/learn/page.tsx",
  "src/app/lesson/[conceptId]/page.tsx",
  "src/app/student/practice/page.tsx",
  "src/app/student/worksheet/[conceptId]/page.tsx",
  "src/app/student/diagnostic/page.tsx",
  "src/app/student/diagnostic/[chapterId]/page.tsx",
  "src/app/student/test/[chapterId]/page.tsx",
  "src/app/student/stickers/page.tsx",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/student/error.tsx",
  "src/app/teacher/error.tsx",
  "src/app/global-error.tsx",
  "src/components/ui/AppStateNotice.tsx",
];

// Helper to extract visible strings from JSX/TSX lines (excluding imports, URLs, and code attributes)
function getVisibleTextLines(filePath) {
  const content = fs.readFileSync(path.join(ROOT, filePath), "utf8");
  return content.split("\n").map((line, idx) => ({ line, idx: idx + 1 })).filter(({ line }) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("import ") || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return false;
    if (trimmed.includes("from \"") || trimmed.includes("from '")) return false;
    return true;
  });
}

// 2. Check for "Minecraft" in public copy
check("No occurrences of 'Minecraft' in public copy or metadata", () => {
  const violations = [];
  for (const file of STUDENT_FILES) {
    const lines = getVisibleTextLines(file);
    for (const { line, idx } of lines) {
      if (line.includes("/images/minecraft/")) continue; // allow asset path
      if (/minecraft/i.test(line)) {
        violations.push(`${file}:${idx}: ${line.trim()}`);
      }
    }
  }
  if (violations.length > 0) {
    throw new Error(`Found 'Minecraft' in public copy:\n  ${violations.join("\n  ")}`);
  }
});

// 3. Check for banned marketing buzzwords in student files
check("No banned marketing buzzwords in student UI", () => {
  const BANNED_BUZZWORDS = [
    "empower",
    "seamless",
    "cutting-edge",
    "revolutionary",
    "serene",
    "pinpoint",
    "leverage",
    "tailored",
    "interactive NCERT mastery",
    "every learner",
  ];

  const violations = [];
  for (const file of STUDENT_FILES) {
    const lines = getVisibleTextLines(file);
    for (const { line, idx } of lines) {
      for (const word of BANNED_BUZZWORDS) {
        const regex = new RegExp(`\\b${word}\\b`, "i");
        if (regex.test(line)) {
          violations.push(`${file}:${idx} [${word}]: ${line.trim()}`);
        }
      }
    }
  }
  if (violations.length > 0) {
    throw new Error(`Found banned marketing buzzwords:\n  ${violations.join("\n  ")}`);
  }
});

// 4. Check that student UI prompts use plain replacements instead of jargon
check("Student UI prompts use plain words ('quick check', 'earlier topic you missed')", () => {
  // Key student pages should use "quick check" in headings/buttons
  const studentPage = fs.readFileSync(path.join(ROOT, "src/app/student/page.tsx"), "utf8");
  if (!studentPage.includes("Start quick check")) {
    throw new Error("src/app/student/page.tsx missing 'Start quick check' button");
  }
  if (!studentPage.includes("No check-ins yet.")) {
    throw new Error("src/app/student/page.tsx missing 'No check-ins yet.'");
  }
  if (!studentPage.includes("earlier topic you missed")) {
    throw new Error("src/app/student/page.tsx missing 'earlier topic you missed'");
  }

  const notFoundPage = fs.readFileSync(path.join(ROOT, "src/app/not-found.tsx"), "utf8");
  if (!notFoundPage.includes("This maths quest does not exist.")) {
    throw new Error("src/app/not-found.tsx missing plain sentence");
  }

  const diagnosticHub = fs.readFileSync(path.join(ROOT, "src/app/student/diagnostic/page.tsx"), "utf8");
  if (!diagnosticHub.includes("Chapter quick checks")) {
    throw new Error("src/app/student/diagnostic/page.tsx missing 'Chapter quick checks'");
  }
  if (!diagnosticHub.includes("Start quick check")) {
    throw new Error("src/app/student/diagnostic/page.tsx missing 'Start quick check'");
  }
});

// 5. Placeholder consistency across translation datasets
check("Placeholders ({name}, {count}, etc.) match across en, hi, and te", () => {
  const jsonFiles = [
    "data/lessons.json",
    "data/questions.json",
    "data/chapters.json",
    "data/concepts.json",
  ];

  function checkObjPlaceholders(obj, pathName) {
    if (!obj || typeof obj !== "object") return;
    if ("en" in obj && typeof obj.en === "string") {
      const enPlaceholders = (obj.en.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
      for (const lang of ["hi", "te"]) {
        if (lang in obj && typeof obj[lang] === "string") {
          const langPlaceholders = (obj[lang].match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
          if (JSON.stringify(enPlaceholders) !== JSON.stringify(langPlaceholders)) {
            throw new Error(`Placeholder mismatch at ${pathName}.${lang}: EN=[${enPlaceholders}] vs ${lang.toUpperCase()}=[${langPlaceholders}]`);
          }
        }
      }
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        checkObjPlaceholders(obj[key], `${pathName}.${key}`);
      }
    }
  }

  for (const relPath of jsonFiles) {
    const fullPath = path.join(ROOT, relPath);
    if (fs.existsSync(fullPath)) {
      const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      checkObjPlaceholders(parsed, relPath);
    }
  }
});

// 6. Sentence case verification on AppStateNotice buttons and titles
check("AppStateNotice buttons and titles use sentence case", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/components/ui/AppStateNotice.tsx"), "utf8");
  const expectedLabels = [
    "Start quick check",
    "Make a class",
    "Go to lessons",
    "Practice more",
    "Clear search",
    "Go home",
    "Sign in",
  ];
  for (const label of expectedLabels) {
    if (!content.includes(label)) {
      throw new Error(`AppStateNotice.tsx missing expected sentence-case button label '${label}'`);
    }
  }
});

console.log(`\nResults: ${passed}/${total} checks passed.`);
if (passed !== total) {
  process.exit(1);
} else {
  console.log("All plain words and copy requirements verified successfully!");
}

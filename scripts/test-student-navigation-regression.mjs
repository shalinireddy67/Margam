/**
 * MARGAM — Regression Test: Student Navigation & "Back to Lessons" Bug (Task 1a)
 *
 * Verifies that all in-app "Back to Lessons", "Back to Path", and navigation
 * handlers in student flow route to the authenticated /student portal and never
 * boot the user out to the public unauthenticated homepage ("/").
 * Also asserts that route guards use ensureActiveProfile() and never prematurely
 * execute router.replace("/") to drop the student on the unauthenticated landing page.
 */

import fs from "fs";
import path from "path";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log("\n==================================================");
console.log("  MARGAM — STUDENT BACK NAVIGATION REGRESSION SUITE");
console.log("==================================================\n");

// 1. Audit StudentHeader component default backHref and brand logo link
const headerPath = path.resolve("src/components/StudentHeader.tsx");
const headerContent = fs.readFileSync(headerPath, "utf8");
assert(
  headerContent.includes('backHref = "/student"') || headerContent.includes("backHref = '/student'"),
  "StudentHeader defaults backHref to '/student' rather than root '/'"
);
assert(
  !headerContent.includes('href="/"'),
  "StudentHeader logo routes inside authenticated portal (/student), not unauthenticated root '/'"
);

// 2. Audit all student and lesson page routes for root back links
function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res.push(...walk(p));
    else if (f.endsWith(".tsx") || f.endsWith(".ts")) res.push(p);
  }
  return res;
}

const targetFiles = [
  ...walk("src/app/student"),
  ...walk("src/app/lesson"),
];

let rootHrefsFound = 0;
const auditedFiles = [];

for (const file of targetFiles) {
  const content = fs.readFileSync(file, "utf8");
  auditedFiles.push(file);
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    // Check for root hrefs or backHref="/"
    if (
      line.includes('backHref="/"') ||
      line.includes("backHref='/'") ||
      (line.includes('href="/"') && (line.includes("Back") || line.includes("Return") || line.includes("Lesson") || line.includes("Path")))
    ) {
      console.error(`  ❌ Root href found in ${file}:${idx + 1}: ${line.trim()}`);
      rootHrefsFound++;
    }
  });
}

assert(
  rootHrefsFound === 0,
  `Audited ${auditedFiles.length} student/lesson files: exactly 0 back links point to root '/'`
);

// 3. Verify specific critical pages route back to /student
const lessonPage = fs.readFileSync("src/app/lesson/[conceptId]/page.tsx", "utf8");
assert(
  lessonPage.includes('href="/student"') && !lessonPage.includes('href="/"'),
  "Lesson page [conceptId] routes all back/return links to /student"
);
assert(
  lessonPage.includes("ensureActiveProfile") && !lessonPage.includes('router.replace("/")'),
  "Lesson page protects session via ensureActiveProfile() without premature homepage ejection"
);

const diagnosticPage = fs.readFileSync("src/app/student/diagnostic/[chapterId]/page.tsx", "utf8");
assert(
  diagnosticPage.includes('backHref="/student"') && !diagnosticPage.includes('backHref="/"'),
  "Diagnostic page [chapterId] configures backHref='/student'"
);
assert(
  diagnosticPage.includes("ensureActiveProfile") && !diagnosticPage.includes('router.replace("/")'),
  "Diagnostic page protects session via ensureActiveProfile() without premature homepage ejection"
);

const testPage = fs.readFileSync("src/app/student/test/[chapterId]/page.tsx", "utf8");
assert(
  testPage.includes('backHref="/student"') && !testPage.includes('backHref="/"'),
  "Chapter test page [chapterId] configures backHref='/student'"
);
assert(
  testPage.includes("ensureActiveProfile") && !testPage.includes('router.replace("/")'),
  "Chapter test page protects session via ensureActiveProfile() without premature homepage ejection"
);

const worksheetPage = fs.readFileSync("src/app/student/worksheet/[conceptId]/page.tsx", "utf8");
assert(
  worksheetPage.includes('backHref="/student"') && !worksheetPage.includes('backHref="/"'),
  "Worksheet page [conceptId] configures backHref='/student'"
);
assert(
  worksheetPage.includes("ensureActiveProfile") && !worksheetPage.includes('router.replace("/")'),
  "Worksheet page protects session via ensureActiveProfile() without premature homepage ejection"
);

console.log("\n==================================================");
console.log(`  RESULT: ${passed} PASSED | ${failed} FAILED`);
console.log("==================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✅ ALL STUDENT BACK NAVIGATION REGRESSION CHECKS PASSED!\n");
}

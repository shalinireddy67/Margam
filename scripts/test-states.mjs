/**
 * Regression Test Suite: Margam App States Verification (Phase 3)
 * Validates that all empty, loading, error, offline, slow network,
 * search, permission, session, and 404 states match the design tokens
 * and exact required copy.
 */

import fs from "fs";
import path from "path";
import assert from "assert";

const ROOT = process.cwd();

console.log("=== MARGAM APP STATES VERIFICATION (PHASE 3) ===\n");

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

// 1. Check not-found.tsx
check("not-found.tsx matches exact 404 requirements", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/not-found.tsx"), "utf8");
  assert(content.includes("Page not found."), "Missing 'Page not found.' title");
  assert(content.includes("This maths quest does not exist."), "Missing 'This maths quest does not exist.' sentence");
  assert(content.includes("Go home"), "Missing 'Go home' button");
});

// 2. Check error.tsx
check("error.tsx matches error state requirements", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/error.tsx"), "utf8");
  assert(content.includes("Something went wrong."), "Missing 'Something went wrong.' title");
  assert(content.includes("We could not load this part of Margam."), "Missing 'We could not load this part of Margam.' sentence");
  assert(content.includes("Try again"), "Missing 'Try again' button");
});

// 3. Check student/error.tsx
check("student/error.tsx matches error state requirements", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/student/error.tsx"), "utf8");
  assert(content.includes("Something went wrong."), "Missing 'Something went wrong.' title");
  assert(content.includes("We could not load this part of Margam."), "Missing 'We could not load this part of Margam.' sentence");
  assert(content.includes("Try again"), "Missing 'Try again' button");
});

// 4. Check teacher/error.tsx
check("teacher/error.tsx matches error state requirements", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/teacher/error.tsx"), "utf8");
  assert(content.includes("Something went wrong."), "Missing 'Something went wrong.' title");
  assert(content.includes("We could not load this part of Margam."), "Missing 'We could not load this part of Margam.' sentence");
  assert(content.includes("Try again"), "Missing 'Try again' button");
});

// 5. Check global-error.tsx
check("global-error.tsx matches root boundary requirements", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/global-error.tsx"), "utf8");
  assert(content.includes("Something went wrong."), "Missing 'Something went wrong.' title");
  assert(content.includes("We could not load this part of Margam."), "Missing 'We could not load this part of Margam.' sentence");
  assert(content.includes("Try again"), "Missing 'Try again' button");
  assert(content.includes("<html") && content.includes("<body"), "global-error.tsx must define <html> and <body>");
});

// 6. Check AppStateNotice.tsx
check("AppStateNotice.tsx exports all 8 standardized state notices", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/components/ui/AppStateNotice.tsx"), "utf8");
  // 1. New student
  assert(content.includes("No check-ins yet."), "Missing 'No check-ins yet.'");
  assert(content.includes("Take a 5-question check-in to find where to start."), "Missing student check-in prompt");
  assert(content.includes("Start quick check"), "Missing 'Start quick check' button");
  // 2. New teacher
  assert(content.includes("No classes yet."), "Missing 'No classes yet.'");
  assert(content.includes("Set up your first class to see topic gaps."), "Missing teacher class prompt");
  assert(content.includes("Make a class"), "Missing 'Make a class' button");
  // 3. No stickers
  assert(content.includes("No badges earned yet."), "Missing 'No badges earned yet.'");
  assert(content.includes("Complete lessons and practice worksheets to earn badges."), "Missing badge prompt");
  assert(content.includes("Go to lessons"), "Missing 'Go to lessons' button");
  // 4. No quests
  assert(content.includes("All quests done."), "Missing 'All quests done.'");
  assert(content.includes("You finished today's quests. Return tomorrow for new ones."), "Missing quest prompt");
  assert(content.includes("Practice more"), "Missing 'Practice more' button");
  // 5. No search results
  assert(content.includes("Nothing found for"), "Missing 'Nothing found for' title");
  assert(content.includes("Try checking for another NCERT topic."), "Missing search prompt");
  assert(content.includes("Clear search"), "Missing 'Clear search' button");
  // 6. Permission denied
  assert(content.includes("Permission denied.") || content.includes("Teachers only.") || content.includes("Students only."), "Missing permission title");
  assert(content.includes("Sign in with the right account to view this page."), "Missing permission prompt");
  assert(content.includes("Go home"), "Missing 'Go home' button");
  // 7. Session expired
  assert(content.includes("Session expired."), "Missing 'Session expired.'");
  assert(content.includes("You were signed out. Sign in to go back to your lesson."), "Missing session expired prompt");
  assert(content.includes("Sign in"), "Missing 'Sign in' button");
  // 8. Success state
  assert(content.includes("Saved successfully."), "Missing 'Saved successfully.'");
});

// 7. Check Toast.tsx for Offline and Slow Network
check("Toast.tsx includes dual offline detection and slow network banner", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/components/ui/Toast.tsx"), "utf8");
  assert(content.includes("No internet. Your work is saved on this phone."), "Missing offline saved copy");
  assert(content.includes("Keep learning"), "Missing 'Keep learning' button");
  assert(content.includes("No internet. Try again when you are back online."), "Missing offline unsaved copy");
  assert(content.includes("This is slow. Still trying."), "Missing slow network copy");
  assert(content.includes("SlowNetworkToast"), "Missing SlowNetworkToast component");
  assert(content.includes("NetworkStatusMonitor"), "Missing NetworkStatusMonitor component");
});

// 8. Check LoadingSkeleton.tsx
check("LoadingSkeleton.tsx includes structured content skeletons", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/components/ui/LoadingSkeleton.tsx"), "utf8");
  assert(content.includes("SkeletonCard"), "Missing SkeletonCard");
  assert(content.includes("SkeletonPathMap"), "Missing SkeletonPathMap");
  assert(content.includes("SkeletonList"), "Missing SkeletonList");
  assert(content.includes("border-[#2B1B0F]"), "Missing brand border token");
});

// 9. Check RootLayout includes NetworkStatusMonitor
check("RootLayout integrates NetworkStatusMonitor globally", () => {
  const content = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf8");
  assert(content.includes("NetworkStatusMonitor"), "layout.tsx must render NetworkStatusMonitor");
});

console.log(`\nResults: ${passed}/${total} checks passed.`);
if (passed !== total) {
  process.exit(1);
} else {
  console.log("All Phase 3 state requirements verified successfully!");
}

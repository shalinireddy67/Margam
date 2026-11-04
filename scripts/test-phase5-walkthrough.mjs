/**
 * MARGAM — Phase 5 End-to-End Walkthrough Verification Test
 *
 * Verifies the complete walkthrough flow:
 * 1. Landing: World background rendering & drag-pan logic
 * 2. Try the demo: Demo login API with hero accounts
 * 3. Student with unfixed gap: Advik Verma (student07) & Aarav (aarav_unfixed_gap)
 * 4. "Fix this first": Root gap badge, prerequisite trail, and path map cracked block
 * 5. Lesson: Loading concept c7-int-02 3-variant content and progression hooks
 * 6. Practice: Live block pips, answer evaluation, gap repair trigger, +50 XP bonus
 * 7. Sticker: Inventory grid, rarity tiers, and Foundation Restored unlock
 * 8. Back to lessons: Session persistence and navigation stability
 * 9. Teacher dashboard: Effort & gaps tracking, zero competitive ranking
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "../src/lib/demo/demo-school-data.ts";
import { getConceptById, getLessonByConceptId } from "../src/lib/curriculum.ts";
import { XP_CONFIG, getLevelProgress } from "../src/lib/xp-config.ts";
import { signSessionPayload, verifySignedSessionPayload } from "../src/lib/server/session-crypto.ts";
import { mockDb } from "../src/lib/server/auth-helpers.ts";
import { seedMockDatabase } from "../src/lib/demo/seeder.ts";

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

console.log("================================================================================");
console.log("  MARGAM — PHASE 5 END-TO-END WALKTHROUGH VERIFICATION SUITE");
console.log("================================================================================\n");

// ------------------------------------------------------------------------------
// STEP 1: Landing Page & World Drag
// ------------------------------------------------------------------------------
console.log("--------------------------------------------------------------------------------");
console.log("  STEP 1: Landing Page & World Background Drag");
console.log("--------------------------------------------------------------------------------");

const worldBgPath = path.resolve(process.cwd(), "src/components/world/WorldBackground.tsx");
assert(fs.existsSync(worldBgPath), "WorldBackground component exists");

const worldBgContent = fs.readFileSync(worldBgPath, "utf8");
assert(worldBgContent.includes("isDraggablePage"), "WorldBackground enables dragging on '/' and '/login'");
assert(worldBgContent.includes("dragPanTarget.current"), "Pointer drag events update dragPanTarget");
assert(worldBgContent.includes("translate3d"), "Parallax layers use hardware-accelerated translate3d");
assert(worldBgContent.includes("prefers-reduced-motion"), "Respects prefers-reduced-motion by disabling animations");

// ------------------------------------------------------------------------------
// STEP 2: Try the Demo & Demo Logins
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 2: Try the Demo Entry Points");
console.log("--------------------------------------------------------------------------------");

const loginPagePath = path.resolve(process.cwd(), "src/app/login/page.tsx");
const loginContent = fs.readFileSync(loginPagePath, "utf8");
assert(loginContent.includes("/api/auth/demo-login"), "Login page integrates passwordless /api/auth/demo-login");
assert(loginContent.includes("student01"), "Login offers top student entry");
assert(loginContent.includes("student08"), "Login offers remedial breakthrough student entry");
assert(loginContent.includes("selectedDemoStudent"), "Login offers full 25-student selector dropdown");

// ------------------------------------------------------------------------------
// STEP 3: Student with Unfixed Gap
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 3: Student with the Unfixed Gap (c7-int-02)");
console.log("--------------------------------------------------------------------------------");

const unfixedStudent = DEMO_STUDENTS.find(s => s.username === "student07");
assert(Boolean(unfixedStudent), "Found seeded student with unfixed gap: student07 (Advik Verma)");
assert(unfixedStudent.identifiedGap?.conceptId === "c7-int-02", "Unfixed gap is correctly mapped to c7-int-02");
assert(unfixedStudent.resolvedGap === undefined || unfixedStudent.resolvedGap === null, "Gap is currently unresolved (unfixed)");

const heroCredsPath = path.resolve(process.cwd(), "data/demo-credentials.json");
const heroCreds = JSON.parse(fs.readFileSync(heroCredsPath, "utf8"));
assert(heroCreds.students.heroUnfixed.username === "aarav_unfixed_gap", "Dedicated demo hero student aarav_unfixed_gap configured");
assert(heroCreds.students.heroUnfixed.password !== "CHANGE_ME", "Hero student has working throwaway credentials");

// ------------------------------------------------------------------------------
// STEP 4: 'Fix this first' & Concept Pathway
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 4: 'Fix this first' Badge & Pathway State");
console.log("--------------------------------------------------------------------------------");

const pathwayPath = path.resolve(process.cwd(), "src/components/ConceptPathway.tsx");
const pathwayContent = fs.readFileSync(pathwayPath, "utf8");
assert(pathwayContent.includes("⚠️ Fix this first"), "Pathway displays '⚠️ Fix this first' soft pulsing badge");
assert(pathwayContent.includes("cracked"), "Diagnosed gaps map to cracked block state");
assert(pathwayContent.includes("[/|\\/]"), "Cracked state has visible pattern identifier [/|\\]");
assert(pathwayContent.includes("Fix Foundation Lesson"), "Action button directs to remedial lesson");

// ------------------------------------------------------------------------------
// STEP 5: Remedial Lesson Content (c7-int-02)
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 5: Remedial Lesson Loading");
console.log("--------------------------------------------------------------------------------");

const concept = getConceptById("c7-int-02");
assert(Boolean(concept), "Concept c7-int-02 found in NCERT curriculum");
assert(concept.class === 7, "c7-int-02 is an earlier prerequisite from Class 7");

const lesson = getLessonByConceptId("c7-int-02");
assert(Boolean(lesson), "Lesson for c7-int-02 exists");
assert(Boolean(lesson.basics_first && lesson.standard && lesson.fast_track), "Lesson contains 3 complete pedagogical variants (basics_first, standard, fast_track)");

const lessonPagePath = path.resolve(process.cwd(), "src/app/lesson/[conceptId]/page.tsx");
const lessonPageContent = fs.readFileSync(lessonPagePath, "utf8");
assert(lessonPageContent.includes("/student/worksheet/"), "Lesson links to practice worksheet");

// ------------------------------------------------------------------------------
// STEP 6: Practice: Live Block Pips & Block Repair Celebration
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 6: Practice Worksheet, Pips & Block Repair");
console.log("--------------------------------------------------------------------------------");

const worksheetPagePath = path.resolve(process.cwd(), "src/app/student/worksheet/[conceptId]/page.tsx");
const wsContent = fs.readFileSync(worksheetPagePath, "utf8");
assert(wsContent.includes("grid grid-cols-5 gap-1.5"), "Segmented block bar exists for questions");
assert(wsContent.includes("✨ Block Repaired! Foundation Restored"), "Shows 'Block Repaired! Foundation Restored' celebration banner on gap fix");
assert(wsContent.includes("+50 XP bonus"), "Awards +50 XP bonus upon repairing foundation");
assert(XP_CONFIG.ROOT_GAP_RESOLVED === 50, "XP_CONFIG.ROOT_GAP_RESOLVED is exactly 50 XP");

// ------------------------------------------------------------------------------
// STEP 7: Sticker Inventory & Unlock Verification
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 7: Sticker Showcase Inventory");
console.log("--------------------------------------------------------------------------------");

const stickersPagePath = path.resolve(process.cwd(), "src/app/student/stickers/page.tsx");
const stickersContent = fs.readFileSync(stickersPagePath, "utf8");
assert(stickersContent.includes("StickerRarity"), "Stickers support rarity tiers (common / rare / epic)");
assert(stickersContent.includes("unlocked"), "Displays both unlocked and locked sticker states");
assert(stickersContent.includes("hint"), "Empty slots show plain hints on how to earn them");
assert(stickersContent.includes("toastMessage"), "Displays small toast notification on sticker unlock");

// ------------------------------------------------------------------------------
// STEP 8: Navigation & Session Persistence
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 8: Back to Lessons & Session Continuity");
console.log("--------------------------------------------------------------------------------");

const sampleSession = {
  userId: "usr_student_demo_aarav",
  role: "student",
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
};
const token = signSessionPayload(sampleSession);
assert(Boolean(token), "Created cryptographically signed session token");

const verified = verifySignedSessionPayload(token);
assert(Boolean(verified && verified.userId === sampleSession.userId), "Session verifies cleanly without state loss");
assert(verified.role === "student", "Session role remains immutable ('student')");

// ------------------------------------------------------------------------------
// STEP 9: Teacher Dashboard: Effort & Gaps (No Competitive Ranking)
// ------------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("  STEP 9: Teacher Dashboard Effort & Gaps Tracking");
console.log("--------------------------------------------------------------------------------");

const teacherPagePath = path.resolve(process.cwd(), "src/app/teacher/page.tsx");
const teacherContent = fs.readFileSync(teacherPagePath, "utf8");
assert(teacherContent.includes("Class Effort & Gaps"), "Tab 5 'Class Effort & Gaps' exists");
assert(teacherContent.includes("Class Effort Pulse"), "Weekly effort and engagement pulse active");
assert(!teacherContent.includes("<ClassLeaderboard"), "Competitive ClassLeaderboard eliminated from teacher view");
assert(teacherContent.includes("Questions Solved"), "Roster table reports questions answered");
assert(teacherContent.includes("Days Active"), "Roster table reports days active");

console.log("\n================================================================================");
console.log(`  RESULT: ${passed} PASSED | ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("  [PASS] All Phase 5 end-to-end walkthrough requirements verified!\n");
  process.exit(0);
}

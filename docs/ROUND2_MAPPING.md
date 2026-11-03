# Margam: Round 2 Evaluator Requirements Mapping Matrix

This document provides a comprehensive mapping of every evaluation requirement to its corresponding **source code implementation**, **automated verification test**, and **step-by-step interactive demo workflow**.

---

## Evaluation Criteria Overview

| # | Evaluator Evaluation Focus | Core Code Implementation | Automated Test Command | Interactive Demo Route & Step |
|---|---|---|---|---|
| **1** | **Explainable Prerequisite Backtracking**<br/>(Class 10 $\to$ Class 7 root-cause gap tracing, convergent tags, mistake tagging) | [adaptive.ts](../src/lib/adaptive.ts)<br/>[tag-roots.json](../data/tag-roots.json)<br/>[concepts.json](../data/concepts.json) | `npm test`<br/>`npm run eval` | `/student/diagnostic/c10-ch04`<br/>Answer Q3 & Q4 with sign errors; view Class 7 gap card & graph path |
| **2** | **Root-Cause Ranking Engine**<br/>(Recency $\lambda=0.9$, Distance $\delta=0.7$, thresholds, 14 evaluation scenarios with 4 held-out) | [adaptive.ts](../src/lib/adaptive.ts#L403-L550)<br/>[eval-scenarios.json](../data/eval-scenarios.json) | `npm run eval` | Run `npm run eval`<br/>View 100% precision, recall, top-1 accuracy on tuning & blind held-out sets |
| **3** | **Three-Stage Adaptation**<br/>(Stage 1 Diagnostic $\to$ Stage 2 Adaptive Practice $\to$ Stage 3 Chapter Test) | [adaptive.ts](../src/lib/adaptive.ts#L690-L1050)<br/>[curriculum.ts](../src/lib/curriculum.ts) | `npx tsx scripts/test-adaptive.mjs` | `/student/diagnostic/c10-ch04`<br/>$\to$ `/student/worksheet/c10-quad-01`<br/>$\to$ `/student/test/c10-ch04` |
| **4** | **3-Variant Remedial Lessons**<br/>(Basics-first, Standard, Fast-track; multilingual EN/HI/TE; unreviewed draft protection) | [lessons.json](../data/lessons.json)<br/>[adaptive.ts](../src/lib/adaptive.ts#L230-L260)<br/>[lesson/[conceptId]](../src/app/lesson/[conceptId]/page.tsx) | `npx tsx scripts/test-draft-translations.mjs` | `/student/lesson/c7-int-02`<br/>Toggle pedagogical variants & language switcher (EN, HI, TE) |
| **5** | **Teacher Empowerment & Live Dashboard**<br/>(25 synthetic student cohort from real engine, concept heatmap M/P/G/L, evidence drill-down, "this device") | [page.tsx](../src/app/teacher/page.tsx)<br/>[generate-synthetic-class.mjs](../scripts/generate-synthetic-class.mjs)<br/>[synthetic-class.json](../data/synthetic-class.json) | `npm run generate:class`<br/>`npm test` | `/teacher`<br/>Inspect attention roster, 25x10 heatmap matrix, click student for evidence drill-down |
| **6** | **Chapter Test Blueprint & Feasibility Report**<br/>(Honest 10-item blueprint, non-diagnostic pool audit, silent shortfall handling, equivalent forms constraint) | [CHAPTER_TEST_BLUEPRINT.md](../docs/CHAPTER_TEST_BLUEPRINT.md)<br/>[adaptive.ts](../src/lib/adaptive.ts#L950-L1050) | `npx tsx scripts/test-adaptive.mjs` | `/student/test/c10-ch04`<br/>Submit test, review score, concept breakdown, and diagnostic gap report |
| **7** | **Multi-Grade Profile Isolation & Migration**<br/>(Independent Class 6 to 10 progression, isolated reset, v0 $\to$ v1 Zod migration, corrupt profile safe recovery) | [storage.ts](../src/lib/storage.ts)<br/>[progression.ts](../src/lib/progression.ts) | `npx tsx scripts/test-progression.mjs` | `/student/select-class`<br/>$\to$ Switch between Class 10 and Class 7; observe total isolation and reset |
| **8** | **Mobile-First UX, Performance & Smoke Test**<br/>(360x800 viewport, min 48px tap targets, neo-brutalist tokens, zero runtime errors, self-hosted fonts) | [smoke-test.mjs](../scripts/smoke-test.mjs)<br/>[tailwind.config.ts](../tailwind.config.ts) | `npm run smoke` | Run `npm run smoke`<br/>Review 60 automated screenshots across 4 journeys in EN/HI/TE |

---

## Detailed Requirement Breakdowns

### 1. Explainable Prerequisite Backtracking & Gap Tracing

- **Evaluator Goal**: Verify that when a Class 10 student makes sign errors in quadratic equations, the platform does not merely mark the answer wrong; it mathematically traces the error across grades to Class 7 integer multiplication.
- **Code Locations**:
  - `evaluateGapTracing()` in [adaptive.ts](../src/lib/adaptive.ts#L551-L658)
  - Distractor mistake mappings in [tag-roots.json](../data/tag-roots.json) (167 mapped mistake tags)
  - DAG prerequisite links with pedagogical justifications in [concepts.json](../data/concepts.json) (`edgeMeta`)
- **Automated Verification**:
  ```bash
  npx tsx scripts/test-gap-tracing.mjs
  ```
  *Verifies: repeated tags trigger confirmation, convergent tags trigger Class 10 $\to$ Class 7 gap, topological display path is acyclic.*
- **Interactive Demo Step**:
  1. Open browser to `http://localhost:3000/student/diagnostic/c10-ch04`.
  2. Answer Q1 with **B** (Correct) and Q2 with **B** (Correct).
  3. Answer Q3 with **A** (Distractor triggering `squared_negative_b_as_negative`).
  4. Answer Q4 with **D** (Distractor triggering `sign_error_negative_times_negative_became_negative`).
  5. Answer Q5 with **C** (Correct) and Q6 with **A** (Correct). Click **Submit Diagnostic**.
  6. **Observed Result**: Score displays 4/6 (67%). The Confirmation Check / Remedial Gap Card renders showing:
     - Foundational Root Cause: **Class 7 Integer Multiplication & Rules of Signs (`c7-int-02`)**.
     - Display Path: `c10-quad-01 → c9-id-02 → c7-int-02`.
     - Direct CTA button: *"Start Class 7 Bridge Lesson"*.

---

### 2. Candidate Root Cause Ranking Formula & Accuracy Benchmark

- **Evaluator Goal**: Prove recommendation accuracy on a pre-labeled evaluation harness with held-out blind test cases.
- **Code Locations**:
  - `rankCandidateRootCauses()` in [adaptive.ts](../src/lib/adaptive.ts#L403-L550)
  - Mathematical decay rules: $w_{\text{recency}} = 0.90^{N - 1 - i}$, $w_{\text{distance}} = 0.70^d$
  - Confidence calibration: $< 1.10$ (slip / none), $1.10 - 1.99$ (low / confirmation), $2.00 - 2.74$ (medium / gap_card), $\ge 2.75$ (high / gap_card).
  - 14 test scenarios in [eval-scenarios.json](../data/eval-scenarios.json) (10 tuning + 4 blind held-out).
- **Automated Verification**:
  ```bash
  npm run eval
  ```
  *Output: Full confusion matrix (TP=10, FP=0, FN=0, TN=4), 100% Precision, 100% Recall, 100% Top-1 Accuracy across both tuning and held-out subsets.*
- **Documentation**:
  - Full algorithmic proof and 3 worked examples with real concept IDs and exact scores in [docs/ALGORITHM.md](../docs/ALGORITHM.md).

---

### 3. Three-Stage Adaptive Engine (Diagnose $\to$ Solve $\to$ Test)

- **Evaluator Goal**: Confirm implementation of all three distinct learning stages.
- **Code Locations**:
  - **Stage 1 (Diagnostic)**: `generateChapterDiagnostic()` and `evaluateChapterDiagnostic()` in [adaptive.ts](../src/lib/adaptive.ts#L694-L810)
  - **Stage 2 (Solve / Adaptive Practice)**: `selectPracticeQuestions()` and `evaluatePracticeSubmission()` in [adaptive.ts](../src/lib/adaptive.ts#L816-L945)
  - **Stage 3 (Chapter Test)**: `generateChapterTest()` and `evaluateChapterTest()` in [adaptive.ts](../src/lib/adaptive.ts#L950-L1050)
  - Pure Mastery update formula: $0.7 \cdot \text{old} + 0.3 \cdot \text{new}$ in `updateMastery()`
  - Deterministic difficulty stepping: promote after 3 consecutive correct, demote after 2 incorrect in `updateConceptDifficulty()`
- **Automated Verification**:
  ```bash
  npx tsx scripts/test-adaptive.mjs
  ```
  *Verifies: Stage 1 diagnostic scoring and mistake tagging, Stage 2 difficulty stepping and streak resets, Stage 3 chapter test generation and question pool shortfall handling.*
- **Interactive Demo Step**:
  1. Complete diagnostic at `/student/diagnostic/c10-ch04`.
  2. Enter adaptive practice at `/student/worksheet/c10-quad-01`. Answer 3 questions correctly in a row; observe difficulty promotes from Level 1 to Level 2.
  3. Enter chapter test at `/student/test/c10-ch04`. Complete test; view per-concept mastery percentages and summative report.

---

### 4. 3-Variant Remedial Lessons & Multilingual Vernacular Support

- **Evaluator Goal**: Verify that remediation is pedagogical (not just more drills), offering 3 tailored variants with verified Indian curriculum models.
- **Code Locations**:
  - 3 variants per concept in [lessons.json](../data/lessons.json):
    1. **Basics-First**: Visual, concrete models (e.g., Kirana store ledger book for positive cash vs negative credit).
    2. **Standard**: NCERT procedural instruction with step-by-step worked examples.
    3. **Fast-Track**: High-density pattern recognition and algebraic shortcut derivations.
  - Variant selector: `selectLessonVariant()` and `getLessonVariantFromMastery()` in [adaptive.ts](../src/lib/adaptive.ts#L233-L265)
  - Unreviewed translation protection: unreviewed Hindi/Telugu text is guarded unless `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS=true`.
- **Automated Verification**:
  ```bash
  npx tsx scripts/test-draft-translations.mjs
  ```
  *Verifies: unreviewed translations safely fall back to English; draft flag controls visual badge rendering; zero synthetic content generated.*
- **Interactive Demo Step**:
  1. Visit `/student/lesson/c7-int-02`.
  2. Inspect the **Basics-First** tab: Observe the Kirana shop ledger illustration for $(-4) \times (-7) = +28$.
  3. Click **Standard** tab: Observe NCERT algebraic sign rule proofs.
  4. Toggle language selector at the top between English, Hindi (हिंदी), and Telugu (తెలుగు).

---

### 5. Teacher Dashboard & Engine-Driven Synthetic Classroom

- **Evaluator Goal**: Verify the teacher dashboard displays a complete 25-student cohort evaluated by the real Margam engine (no hand-typed scores).
- **Code Locations**:
  - Generator script: [generate-synthetic-class.mjs](../scripts/generate-synthetic-class.mjs)
  - Real engine dataset: [synthetic-class.json](../data/synthetic-class.json)
  - Dashboard component: [src/app/teacher/page.tsx](../src/app/teacher/page.tsx)
  - Feature flag: `FEATURE_TEACHER_TOOLS: true` in [flags.ts](../src/lib/flags.ts)
- **Dashboard Features**:
  1. **Cohort Summary Metrics**: 72% class average, 17 flagged students (68%), top missing prerequisite `c7-int-02` (24%).
  2. **Students Needing Attention Roster**: Quick search, attention reason filtering.
  3. **Concept Mastery Heatmap (25 × 10 Matrix)**: Every cell contains a single status letter (**M**, **P**, **G**, **L**) plus distinct background color:
     - **`M`** (Mastered, $\ge 75\%$): Green (`bg-green`)
     - **`P`** (Practicing, $50-74\%$): Cyan (`bg-cyan`)
     - **`G`** (Gap Detected): Pink (`bg-pink`) with pulse animation
     - **`L`** (Learning / Low, $< 50\%$): Yellow (`bg-yellow`)
  4. **Evidence Drill-Down Panel**:
     - Actual question submissions (selected option vs correct answer).
     - Mistake tags triggered.
     - Real engine ranking score (e.g., $1.54$, confidence: low, routing: confirmation_only).
     - Prerequisite DAG path (e.g. `c10-quad-01 → c9-id-02 → c7-int-02`).
     - Engine candidate breakdown table.
  5. **"This Device" Section**:
     - Inspects active student profile on current browser device via `getActiveProfile()`.
  6. **Common Misconceptions & Frequently Missing Prerequisites**:
     - Ranked frequency distribution across the 25 students.
  7. **Print-Ready A4 Remedial Worksheet**:
     - Single-sheet printable A4 practice sheet for offline, low-connectivity classrooms.
- **Automated Verification**:
  ```bash
  npm run generate:class
  npm test
  ```
- **Interactive Demo Step**:
  1. Navigate to `http://localhost:3000/teacher`.
  2. Notice the prominent badge: **"Synthetic class, generated by the Margam engine"**.
  3. Click student **#1 Aarav Sharma**: View his evidence drill-down, question answers, mistake tags, and DAG path.
  4. Click **Concept Heatmap** tab: View the 25 × 10 matrix with **M**, **P**, **G**, **L** letters and colors.
  5. Click **Common Misconceptions** tab: Review top mistake tags across the cohort.
  6. Click **Printable A4 Remedial Worksheet** tab: Review the zero-ink printable layout.

---

### 6. Chapter Test Blueprint & Feasibility Report

- **Evaluator Goal**: Assess test validity against real question bank sizes, verify silent shortfall handling, and understand psychometric constraints.
- **Documentation**:
  - Full audit of 86 questions across 20 concepts in [docs/CHAPTER_TEST_BLUEPRINT.md](../docs/CHAPTER_TEST_BLUEPRINT.md).
- **Core Findings Documented**:
  1. **Disjoint Pool Shortfall**: Chapter `c10-ch04` contains 14 total questions. Excluding 6 diagnostic questions leaves 8 non-diagnostic items (all in `c10-quad-01`).
  2. **Shortfall Handler**: When strictly disjoint items are requested, the engine triggers `shortfall: true`, returning available items without fabricating synthetic questions.
  3. **No False Equivalent Forms Claims**: Acknowledges that creating parallel Form A and Form B ($r \ge 0.80$) requires $\ge 26$ items per chapter, which is planned for post-pilot content authoring.
- **Automated Verification**:
  ```bash
  npx tsx scripts/test-adaptive.mjs
  ```
  *Verifies: blueprint question shortfall and disjoint exclusion correctly enforced.*

---

### 7. Multi-Grade Profile Isolation, Schema Migration & DPDP Compliance

- **Evaluator Goal**: Confirm independent progression across Classes 6 to 10, robust storage schema migration with Zod, and self-healing error recovery.
- **Code Locations**:
  - Schema definition and migrations in [storage.ts](../src/lib/storage.ts):
    - `LearnerProfileSchema` (Zod v1)
    - `migrateLearnerProfile()`: Migrates unversioned v0 legacy profiles to v1 schema.
    - Corrupted profile recovery: Deliberately malformed profiles return `null` and safely reset to default state without throwing uncaught exceptions.
  - Progression isolation in [progression.ts](../src/lib/progression.ts):
    - Switching grades isolates chapter unlocking; resetting one grade leaves other grades intact.
- **Automated Verification**:
  ```bash
  npx tsx scripts/test-progression.mjs
  ```
  *Verifies: All 5 classes tested independently, grade reset complete isolation, legacy profile migration verified, corrupted profile schema rejection verified.*
- **Interactive Demo Step**:
  1. Go to `/student/select-class`, select **Class 10**.
  2. Take diagnostic, earning Class 10 progression.
  3. Go to `/student/select-class`, switch to **Class 7**: Observe Class 7 starts with fresh diagnostic placement.
  4. Return to **Class 10**: Observe Class 10 progress is completely intact.
  5. Go to `/student/reset-class`: Reset Class 10; observe Class 10 resets while Class 7 remains safe.

---

### 8. Mobile-First UX, Performance & Automated Smoke Test Runner

- **Evaluator Goal**: Confirm flawless execution on a real mobile viewport (360x800) with zero runtime errors, zero overflows, and strict accessibility.
- **Specifications Enforced**:
  - 360px minimum viewport width (mobile-first layout).
  - Minimum 48px touch targets on all interactive buttons, inputs, and tabs (`min-h-[48px]`).
  - High-contrast neo-brutalist design tokens (`border-3 border-ink`, `shadow-hard`, `bg-cream`).
  - Zero console errors, zero uncaught page exceptions, zero failed HTTP requests ($\ge 400$).
  - Self-hosted fonts (`Baloo 2`, `Nunito`, `Noto Sans Devanagari`, `Noto Sans Telugu`) with `unicode-range` optimizations.
- **Automated Verification**:
  ```bash
  npm run smoke
  ```
  *Runs headless Chromium at 360x800 across 4 comprehensive user journeys in English, Hindi, and Telugu, verifying 60 screenshots saved to `screenshots/smoke/`.*

# Margam — Chapter Test Blueprint & Question Pool Feasibility Report

> **Dataset & Document Notice**: All specifications, metrics, and scenario benchmarks described in this document reflect synthetic assessments and curriculum models authored by the Margam engineering and curriculum team.

---

## 1. Feasibility Report Against Actual Question Pool

### 1.1 Global Question Bank Overview
The Margam question bank comprises **212 deterministic assessment items** across 24 mapped NCERT concepts spanning Classes 6 through 10.
- **180 Verified Items (`verified: true`)**: Distributed across the 15 fully implemented chapters (Chapters 1 & 2 across Classes 6–10 plus the 5 two-concept pilot chapters). Every concept in these chapters has between 8 and 11 mathematically verified items.
- **32 Pending Review Items (`verified: false`)**: Distributed across 4 Class 10 in-progress chapters (`c10-ch03`, `c10-ch05`, `c10-ch06`, `c10-ch07`, each with 8 items) awaiting educator sign-off.
- **Strict Differentiation**: Only verified questions (`verified: true`) count toward chapter readiness and can be served in student assessments.

### 1.2 Question Pool Audit: Diagnostic vs. Non-Diagnostic Items
In Stage 1 (Chapter Diagnostic), Margam extracts **6 questions** per chapter to evaluate baseline placement and identify root-cause prerequisite gaps. To guarantee assessment independence and prevent item familiarity effects, summative chapter tests (Stage 3) draw from **non-diagnostic items**.

The table below details the updated inventory per concept and difficulty level across the 5 core pilot chapters after expanding question depth from 2 to 8 items on secondary concepts:

| Chapter ID | Concept ID | Concept Title | Total Questions | Diff 1 | Diff 2 | Diff 3 | Diag Questions | Non-Diag Available | Non-Diag Diff Breakdown (D1 / D2 / D3) |
|---|---|---|---|---|---|---|---|---|---|
| **c6-ch10** | `c6-neg-01` | Opposite Quantities & Negative Numbers | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c6-neg-02` | Number Line Ordering | 8 | 3 | 3 | 2 | 2 | **6** | 2 / 2 / 2 |
| *Subtotal* | | *c6-ch10 Total* | *19* | *7* | *7* | *5* | *6* | ***13*** | *4 / 5 / 4* |
| **c7-ch10** | `c7-int-01` | Addition & Subtraction of Signed Integers | 8 | 3 | 3 | 2 | 2 | **6** | 2 / 2 / 2 |
| | `c7-int-02` | Multiplication of Integers & Sign Rules | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| *Subtotal* | | *c7-ch10 Total* | *19* | *7* | *7* | *5* | *6* | ***13*** | *4 / 5 / 4* |
| **c8-ch06** | `c8-dist-01` | Distributive Law with Signed Monomials | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c8-dist-02` | Binomial Multiplication & Like Terms | 8 | 3 | 3 | 2 | 2 | **6** | 2 / 2 / 2 |
| *Subtotal* | | *c8-ch06 Total* | *19* | *7* | *7* | *5* | *6* | ***13*** | *4 / 5 / 4* |
| **c9-ch04** | `c9-id-01` | Standard Algebraic Identities | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c9-id-02` | Factoring Trinomials by Middle Term | 8 | 3 | 3 | 2 | 2 | **6** | 2 / 2 / 2 |
| *Subtotal* | | *c9-ch04 Total* | *19* | *7* | *7* | *5* | *6* | ***13*** | *4 / 5 / 4* |
| **c10-ch04** | `c10-quad-01` | Standard Form & Solving by Factoring | 11 | 4 | 4 | 3 | 3 | **8** | 3 / 3 / 2 |
| | `c10-quad-02` | Quadratic Formula & Discriminant | 8 | 3 | 3 | 2 | 3 | **5** | 2 / 2 / 1 |
| *Subtotal* | | *c10-ch04 Total* | *19* | *7* | *7* | *5* | *6* | ***13*** | *5 / 5 / 3* |

#### Additional 10 Implemented Chapters (Chapters 1 & 2 across Classes 6–10)
In addition to the 5 two-concept pilot chapters above, Margam provides verified question banks for Chapters 1 & 2 across Classes 6 through 10 (each with 8 to 9 verified items, total 85 verified items):
- **Class 6**: `c6-ch01` (9 items, `c6-pat-01`), `c6-ch02` (8 items, `c6-geo-01`)
- **Class 7**: `c7-ch01` (8 items, `c7-num-01`), `c7-ch02` (9 items, `c7-alg-01`)
- **Class 8**: `c8-ch01` (8 items, `c8-sqr-01`), `c8-ch02` (9 items, `c8-exp-01`)
- **Class 9**: `c9-ch01` (8 items, `c9-coord-01`), `c9-ch02` (9 items, `c9-poly-01`)
- **Class 10**: `c10-ch01` (8 items, `c10-real-01`), `c10-ch02` (9 items, `c10-poly-01`)

Every one of these 15 full chapters now satisfies `canTakeChapterDiagnostic` ($\ge 6$ verified questions).

---

### 1.3 Feasibility Analysis & Resolution

#### Resolution 1: Target Test Size Feasibility Achieved
- **Target Chapter Test Size**: **10 questions**.
- **Available Disjoint Pool**: **13 non-diagnostic questions** per pilot chapter (e.g. in `c10-ch04`: 8 items on `c10-quad-01` + 5 items on `c10-quad-02`).
- **Surplus**: A **+3 question surplus** guarantees that full 10-question chapter tests can now be generated strictly disjoint from the 6 diagnostic questions without item recycling.

#### Resolution 2: Balanced Multi-Concept Coverage
- With the second concept in each pilot chapter expanded from 2 to 8 verified items, the post-diagnostic available pool retains **5 to 6 fresh questions** per second concept.
- Non-diagnostic chapter tests now achieve balanced representation across all concepts in the chapter.

#### Finding 3: Parallel Equivalent Forms (Form A / Form B) Status
- Psychometrically parallel equivalent forms (Form A and Form B with disjoint items and comparable reliability $r \ge 0.80$) require:
  $\text{Required Items} = 6 \text{ (Diagnostic)} + 10 \text{ (Form A)} + 10 \text{ (Form B)} = \mathbf{26 \text{ questions per chapter}}.$
- With 19 verified questions currently in each core pilot chapter pool:
  - **Form A (10 questions)** is completely disjoint from the 6 diagnostic questions ($6 + 10 = 16 \le 19$).
  - **Form B** would require an additional 7 fresh items ($26 - 19 = 7$).
- **Explicit Protocol**: Margam transparently documents that **Form B is not claimed as an independent parallel form** in this release, preventing unsubstantiated psychometric claims.

---

## 2. Chapter Test Blueprint Specifications (Target Size: 10 Questions)

### 2.1 Purpose & Assessment Objective
The Stage 3 Chapter Test provides summative evaluation of chapter-level learning objectives, certifies mastery for progression, and diagnoses residual prerequisite gaps following adaptive remediation.

### 2.2 Target Composition & Mastery-Weighted Concept Allocation
The 10-question test dynamically weights items according to the student's current mastery level in each concept:

| Student Concept Mastery | Classification | Selection Weight | Question Quota (10 Items) | Target Difficulty Focus |
|---|---|---|---|---|
| $< 60\%$ | Weak / Developing | **3** | ~6 questions (60%) | Difficulty 1 & 2 (Foundational & Application) |
| $60\% - 79\%$ | Progressing | **2** | ~4 questions (40%) | Difficulty 2 (Application) |
| $\ge 80\%$ | Mastered | **1** | ~2 questions (20%) | Difficulty 2 & 3 (Synthesis & Non-routine) |

#### Mathematical Allocation Rule
For chapter concepts $C_1, C_2, \dots, C_k$ with assigned weights $W_1, W_2, \dots, W_k$:
$$\text{Quota}(C_j) = \max\left(1, \operatorname{round}\left(\frac{W_j}{\sum_{i=1}^k W_i} \times 10\right)\right)$$

Any remaining unallocated slots are backfilled from available concepts in ascending mastery order.

### 2.3 Target Difficulty Distribution
Across the 10 questions, the target difficulty blend is:
- **Level 1 (Foundational Knowledge & Direct Computation)**: 3 questions (30%)
- **Level 2 (Multi-Step Application & Conceptual Transfer)**: 4 questions (40%)
- **Level 3 (Non-Routine Problem Solving & Generalization)**: 3 questions (30%)

*Pool Constraint Note*: In the current 14-item pool of `c10-ch04`, the difficulty distribution is 5 Level 1, 5 Level 2, and 4 Level 3 items.

### 2.4 Seeded Selection Algorithm
To support reproducible testing, session recovery, and audit trails:
1. Item selection accepts an optional pseudo-random numeric `seed`.
2. A deterministic linear congruential generator (LCG) shuffles candidate questions within each difficulty bucket.
3. In the absence of a seed, system timestamp deterministic seeding is applied.

---

## 3. Scoring & Reporting Categories

### 3.1 Concept Accuracy Categorization
Student performance is scored per-concept and aggregated at the chapter level:
- **Mastered ($\ge 80\%$)**: Student demonstrates robust procedural fluency and conceptual grasp.
- **In Progress ($60\% - 79\%$)**: Student grasps core mechanics but exhibits minor inconsistencies.
- **Needs Attention ($< 60\%$)**: Student shows persistent difficulty requiring targeted remediation.

### 3.2 Diagnostic Analysis Categories
Mistakes made during the chapter test are parsed through the calibrated ranking engine:
- **Probable Gap**: Student incurs $\ge 2$ convergent or repeated error tags mapping to a lower-grade prerequisite root, with confidence $\ge \text{medium}$ ($S \ge 2.00$). The report flags the specific prerequisite for remedial study.
- **Careless Slip**: Isolated error with low confidence ($S < 1.10$) where other concept questions were answered correctly. No prerequisite gap is declared.
- **Insufficient Evidence**: Fewer than 2 questions attempted for a concept, or divergent errors with ambiguous root mappings ($1.10 \le S < 2.00$).

### 3.3 Mastery Update Formula
Upon test completion, the learner profile's concept mastery updates via the established recurrence relation:
- **First Attempt**:
  $$\text{Mastery}_{\text{new}} = \text{Score}_{\text{concept}}\%$$
- **Subsequent Attempts**:
  $$\text{Mastery}_{\text{new}} = \operatorname{round}\left(0.70 \times \text{Mastery}_{\text{old}} + 0.30 \times \text{Score}_{\text{concept}}\%\right)$$

### 3.4 Chapter Certification Standard
- **Passing Threshold**: Overall chapter test score $\ge \mathbf{70\%}$.
- **Core Concept Gate**: No individual core concept may score $< \mathbf{50\%}$ for chapter certification.

---

## 4. Submission Validation & Integrity Guards

1. **Completeness Validation**: The UI requires all questions to be answered prior to submission. Attempting submission with unselected items presents an explicit warning banner: *"Please answer all X questions before submitting."*
2. **Post-Submission Immutability**: Once submitted, option buttons transition to review state displaying correct vs. incorrect selections. Retakes require explicit invocation of `Retake Test`.
3. **Client-Side Grading Boundary**: All grading is performed deterministically in the client runtime (`evaluateChapterTest`), ensuring instant feedback even on intermittent rural 2G/3G connections.

---

## 5. Pilot Evaluation Metrics (Operational Definitions)

The Margam pilot evaluates diagnostic and testing efficacy using the following exact mathematical indicators:

### 5.1 Diagnostic Completion Rate
$$\text{Diagnostic Completion Rate} = \frac{N_{\text{diag\_completed}}}{N_{\text{diag\_started}}} \times 100\%$$
- **Numerator**: Count of students who answer all 6 diagnostic questions and view the results screen.
- **Denominator**: Count of students who initiate a chapter diagnostic assessment.

### 5.2 Prerequisite Gap Identification Rate
$$\text{Prerequisite Gap Identification Rate} = \frac{N_{\text{gap\_flagged}}}{N_{\text{diag\_completed}}} \times 100\%$$
- **Numerator**: Students classified with a confirmed prerequisite gap (`confirmationStatus == "failed"` or confidence $\ge \text{medium}$).
- **Denominator**: Total students who completed the diagnostic assessment.

### 5.3 Remediation Engagement Rate
$$\text{Remediation Engagement Rate} = \frac{N_{\text{remedial\_engaged}}}{N_{\text{gap\_flagged}}} \times 100\%$$
- **Numerator**: Flagged students who navigate to and complete at least one recommended lower-grade remedial lesson.
- **Denominator**: Total students flagged with a confirmed prerequisite gap.

### 5.4 Concept Mastery Gain ($\Delta M$)
$$\Delta M = \text{Mastery}_{\text{post-test}} - \text{Mastery}_{\text{pre-diagnostic}}$$
- Measured per concept as the arithmetic difference between the post-chapter test mastery percentage and the initial pre-diagnostic placement score.

### 5.5 Gap Resolution Rate
$$\text{Gap Resolution Rate} = \frac{N_{\text{gap\_resolved}}}{N_{\text{remedial\_engaged}}} \times 100\%$$
- **Numerator**: Students who, after completing remediation, achieve $\ge 70\%$ on subsequent assessment of the prerequisite and target concepts.
- **Denominator**: Total flagged students who completed the recommended remedial lesson.

### 5.6 Chapter Test Pass Rate
$$\text{Chapter Test Pass Rate} = \frac{N_{\text{test\_passed}}}{N_{\text{test\_submitted}}} \times 100\%$$
- **Numerator**: Students scoring $\ge 70\%$ on the summative chapter test.
- **Denominator**: Total chapter test submissions.

### 5.7 Form Equivalence Deficit
$\text{Pool Deficit for Parallel Forms} = N_{\text{required}} - N_{\text{available}} = (6 + 10 + 10) - 19 = \mathbf{-7 \text{ items}}$
- Documents the remaining pool deficit required before releasing independent psychometrically equivalent parallel forms (Form A/B) per chapter. Single-form disjoint assessment (Diagnostic + Form A = 16 items) is fully satisfied with the current 19-item verified pool.

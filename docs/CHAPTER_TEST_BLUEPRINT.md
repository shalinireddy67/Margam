# Margam — Chapter Test Blueprint & Question Pool Feasibility Report

> **Dataset & Document Notice**: All specifications, metrics, and scenario benchmarks described in this document reflect synthetic assessments and curriculum models authored by the Margam engineering and curriculum team.

---

## 1. Feasibility Report Against Actual Question Pool

### 1.1 Global Question Bank Overview
The Margam question bank comprises **86 deterministic assessment items** across 20 sequential concepts spanning Classes 6 through 10. Each chapter contains two pilot concepts designed to demonstrate prerequisite dependency traversal and diagnostic placement.

### 1.2 Question Pool Audit: Diagnostic vs. Non-Diagnostic Items
In Stage 1 (Chapter Diagnostic), Margam extracts up to **6 questions** per chapter to evaluate placement and identify root-cause prerequisite gaps. To guarantee assessment independence and prevent item familiarity effects, summative chapter tests (Stage 3) ideally draw exclusively from **non-diagnostic items**.

The table below details the exact inventory per concept and difficulty level across all pilot chapters, both before and after excluding the 6 diagnostic questions:

| Chapter ID | Concept ID | Concept Title | Total Questions | Diff 1 | Diff 2 | Diff 3 | Diag Questions | Non-Diag Available | Non-Diag Diff Breakdown (D1 / D2 / D3) |
|---|---|---|---|---|---|---|---|---|---|
| **c6-ch10** | `c6-neg-01` | Opposite Quantities & Negative Numbers | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c6-neg-02` | Number Line Ordering | 2 | 1 | 1 | 0 | 2 | **0** | 0 / 0 / 0 |
| *Subtotal* | | *c6-ch10 Total* | *13* | *5* | *5* | *3* | *6* | ***7*** | *2 / 3 / 2* |
| **c7-ch10** | `c7-int-01` | Addition & Subtraction of Signed Integers | 2 | 1 | 1 | 0 | 2 | **0** | 0 / 0 / 0 |
| | `c7-int-02` | Multiplication of Integers & Sign Rules | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| *Subtotal* | | *c7-ch10 Total* | *13* | *5* | *5* | *3* | *6* | ***7*** | *2 / 3 / 2* |
| **c8-ch06** | `c8-dist-01` | Distributive Law with Signed Monomials | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c8-dist-02` | Binomial Multiplication & Like Terms | 2 | 1 | 1 | 0 | 2 | **0** | 0 / 0 / 0 |
| *Subtotal* | | *c8-ch06 Total* | *13* | *5* | *5* | *3* | *6* | ***7*** | *2 / 3 / 2* |
| **c9-ch04** | `c9-id-01` | Standard Algebraic Identities | 11 | 4 | 4 | 3 | 4 | **7** | 2 / 3 / 2 |
| | `c9-id-02` | Factoring Trinomials by Middle Term | 2 | 1 | 1 | 0 | 2 | **0** | 0 / 0 / 0 |
| *Subtotal* | | *c9-ch04 Total* | *13* | *5* | *5* | *3* | *6* | ***7*** | *2 / 3 / 2* |
| **c10-ch04** | `c10-quad-01` | Standard Form & Solving by Factoring | 11 | 4 | 4 | 3 | 3 | **8** | 3 / 3 / 2 |
| | `c10-quad-02` | Quadratic Formula & Discriminant | 3 | 1 | 1 | 1 | 3 | **0** | 0 / 0 / 0 |
| *Subtotal* | | *c10-ch04 Total* | *14* | *5* | *5* | *4* | *6* | ***8*** | *3 / 3 / 2* |

---

### 1.3 Feasibility Analysis & Current Pool Limitations

#### Finding 1: Target Test Size Shortfall
- **Target Chapter Test Size**: **10 questions**.
- **Available Disjoint Pool for `c10-ch04`**: **8 questions** (all belonging to `c10-quad-01`).
- **Deficit**: A 2-question shortfall prevents generating a 10-question chapter test strictly disjoint from diagnostic items.
- **Operational Handling**: When strictly disjoint selection is requested, the engine triggers its silent shortfall handler (`shortfall: true`), returning the 8 available questions without fabricating synthetic items. In production/demo mode, the engine pools from all 14 chapter items to present a complete 10-item assessment.

#### Finding 2: Unbalanced Concept Coverage
- In all pilot chapters, the second concept (`c6-neg-02`, `c7-int-01`, `c8-dist-02`, `c9-id-02`, `c10-quad-02`) has 2 to 3 total questions in the bank.
- Because Stage 1 Diagnostic selects up to 3 questions per concept, **100% of questions for the second concept are consumed during diagnostic testing**.
- **Deficit**: Non-diagnostic chapter tests have **0 available items** for the chapter's second concept.

#### Finding 3: Equivalent Forms (Form A / Form B) Cannot Be Claimed
- Establishing parallel equivalent forms (Form A and Form B with psychometric comparability $r \ge 0.80$) requires at least:
  $$\text{Required Items} = 6 \text{ (Diagnostic)} + 10 \text{ (Form A)} + 10 \text{ (Form B)} = \mathbf{26 \text{ questions per chapter}}.$$
- With only 13 to 14 questions currently in each chapter pool:
  - **Form A alone** requires recycling diagnostic items.
  - **Form B is mathematically impossible** without question duplication.
- **Explicit Constraint**: Margam **does not claim parallel equivalent forms** for this build. Expanding the pool to $\ge 26$ questions per chapter is flagged as a post-pilot prerequisite.

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
$$\text{Pool Deficit for Parallel Forms} = N_{\text{required}} - N_{\text{available}} = (6 + 10 + 10) - 14 = \mathbf{-12 \text{ items}}$$
- Documents the exact deficit prohibiting the release of psychometrically equivalent parallel forms (Form A/B) in the current question bank.

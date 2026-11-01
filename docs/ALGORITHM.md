# Margam Learning-Gap Tracing & Recommendation Algorithm

This document defines the mathematical models, graph data structures, traversal mechanics, ranking formulas, calibrated confidence thresholds, and pedagogical routing rules of the **Margam Adaptive Learning Engine**.

---

## 1. Graph Construction & Data Model

Margam models school mathematics as a **Directed Acyclic Graph (DAG)** of granular competencies spanning Classes 6 through 10 (NCERT curriculum).

### 1.1 Graph Formalism

Let $G = (V, E)$ be a directed acyclic graph where:
- Each vertex $v \in V$ represents a **Concept** (e.g., `c7-int-02`: *Multiplication of Integers and Rules of Signs*).
- Each directed edge $(u, v) \in E$ represents a **Prerequisite Dependency**, indicating that mastery of concept $u$ is a strict pedagogical prerequisite for concept $v$ ($u \to v$).

### 1.2 Edge Metadata (`edgeMeta`) & Tentative Status

Every prerequisite edge in Margam is explicitly annotated with structured curricular provenance in `data/concepts.json`:

```json
{
  "id": "c8-dist-01",
  "class": 8,
  "chapterId": "c8-ch04",
  "name": {
    "en": "The Distributive Law with Signed Monomials"
  },
  "prerequisites": [
    "c7-int-02",
    "c8-exp-01"
  ],
  "edgeMeta": {
    "c7-int-02": {
      "reason": "Distributing a negative monomial across terms requires applying integer sign multiplication rules to each term.",
      "source": "team_curriculum_analysis",
      "status": "tentative, pending teacher review"
    },
    "c8-exp-01": {
      "reason": "Multiplying variable terms such as x · x requires adding exponents (product law of exponents).",
      "source": "team_curriculum_analysis",
      "status": "tentative, pending teacher review"
    }
  }
}
```

#### Fields of `edgeMeta`:
1. **`reason`** *(string)*: Clear pedagogical rationale explaining why the learner must understand concept $u$ before learning concept $v$.
2. **`source`** *(string)*: Authorship attribution (`team_curriculum_analysis` or `ncert_syllabus_mapping`).
3. **`status`** *(string)*: Editorial verification state. Unverified or pilot edges are strictly marked as `"tentative, pending teacher review"`. No edge is promoted to `"verified"` without formal sign-off by practicing classroom teachers.

### 1.3 Cycle Prevention & Strict Acyclicity

Cycles in prerequisite graphs create infinite loops during remediation tracing. Margam enforces strict acyclicity using a 3-color Depth First Search (DFS) algorithm implemented in `src/lib/graph.ts` (`ConceptGraph.detectCycle()`):

- **White (`unvisited`)**: Node has not yet been encountered.
- **Gray (`visiting`)**: Node is in the current DFS recursion stack. Encountering a Gray node indicates a **back-edge** (directed cycle).
- **Black (`visited`)**: Node and all its descendants have been fully explored.

Content validation suite (`scripts/validate-content.mjs`) executes `detectCycle()` on all 20 pilot chain concepts on every test run. If any cycle is detected, build and validation immediately fail with exit code 1.

---

## 2. Graph Traversal Rules

When a student struggles during an assessment, the engine traces backwards from the current grade's chapter concept down into earlier grade foundational prerequisites.

### 2.1 Depth-Bounded Ancestor Resolution

Prerequisite ancestor traversal is bounded to a maximum depth of $D_{\max} = 3$:

$$\text{Ancestors}(C) = \{ p \in V \mid 1 \le \text{dist}(p, C) \le 3 \}$$

Implemented in `src/lib/adaptive.ts` via `getPrerequisitesGraph(conceptId, maxDepth = 3)`:
- Level 1: Immediate prerequisites of $C$ ($\text{dist} = 1$).
- Level 2: Prerequisites of Level 1 nodes ($\text{dist} = 2$).
- Level 3: Prerequisites of Level 2 nodes ($\text{dist} = 3$).

### 2.2 Pedagogical Display Path Generation

To show teachers and learners why a foundational topic was recommended, `findPrerequisitePath(startId, targetId)` performs breadth-first topological pathfinding from the current class concept down to the diagnosed root prerequisite:

$$\text{Path} = [c_{\text{current}} \to c_{\text{inter}} \to \dots \to c_{\text{root}}]$$

Example:
$$[\text{c10-quad-01} \to \text{c9-id-02} \to \text{c7-int-02}]$$

---

## 3. Candidate Root Cause Ranking Formula

When a student answers a diagnostic question incorrectly, the chosen distractor reveals a specific misconception tag (e.g., `squared_negative_b_as_negative`). The engine resolves this tag to a root concept via `data/tag-roots.json`, and computes a multi-factor ranking score for every candidate concept.

### 3.1 Mathematical Formulation

Let $E = \{e_1, e_2, \dots, e_K\}$ be the sequence of error events observed across an assessment of $N$ questions. Each error event $e_j$ has:
- Question index $i_j \in \{0, 1, \dots, N-1\}$ ($0$-indexed).
- Distractor mistake tag $\tau_j$.
- Direct root concept $C_j = \text{TagRoots}[\tau_j]$.

The total score $S(C)$ for any candidate concept $C$ is the sum of direct evidence and distance-decayed propagated evidence:

$$S(C) = \sum_{e_j \in E} w_{\text{recency}}(i_j, N) \cdot w_{\text{distance}}(\text{dist}(C, C_j))$$

### 3.2 Exponential Recency Decay Weight

To give higher weight to errors made toward the end of an assessment (where cognitive load is higher and carelessness is less likely):

$$w_{\text{recency}}(i, N) = \lambda^{N - 1 - i}$$

Where:
- $\lambda = 0.90$ (recency decay factor).
- $N$ = total questions in the assessment (typically 6 for diagnostics).
- $i$ = zero-indexed position of the question ($0 \le i \le N-1$).

#### Recency Weight Table for $N = 6$:
| Question Position ($i$) | Question Number | Exponent ($6 - 1 - i$) | Recency Weight $w_{\text{recency}}$ |
|---|---|---|---|
| $i = 0$ | Q1 | $5$ | $0.90^5 \approx 0.5905$ |
| $i = 1$ | Q2 | $4$ | $0.90^4 \approx 0.6561$ |
| $i = 2$ | Q3 | $3$ | $0.90^3 = 0.7290$ |
| $i = 3$ | Q4 | $2$ | $0.90^2 = 0.8100$ |
| $i = 4$ | Q5 | $1$ | $0.90^1 = 0.9000$ |
| $i = 5$ | Q6 | $0$ | $0.90^0 = 1.0000$ |

### 3.3 Graph Distance Decay Weight

When an error event points directly to root concept $C$, full weight ($1.0$) is awarded to $C$. Its prerequisite ancestors also receive attenuated credit with distance decay factor $\delta = 0.70$:

$$w_{\text{distance}}(d) = \delta^d = 0.70^d$$

Where $d$ is the shortest path distance in the prerequisite DAG from the direct root:
- $d = 0$ (Direct Root Concept): $0.70^0 = 1.0000$ (100% credit)
- $d = 1$ (Immediate Prerequisite): $0.70^1 = 0.7000$ (70% credit)
- $d = 2$ (Grandparent Prerequisite): $0.70^2 = 0.4900$ (49% credit)
- $d = 3$ (Great-Grandparent Prerequisite): $0.70^3 = 0.3430$ (34.3% credit)
- $d > 3$: $0.0000$ (beyond traversal horizon)

### 3.4 Tie-Breaking Hierarchy

If two candidate concepts achieve comparable scores, the engine resolves ties deterministically using the following strict hierarchy:
1. **Score Descending**: Candidate with higher total score wins ($\Delta S > 0.0001$).
2. **Deeper Prerequisite Depth ($10 - \text{Class}$)**: Lower-grade foundational prerequisites take precedence (e.g., Class 6 concept wins over Class 8 concept) to repair root foundations first.
3. **Lexicographical Sort**: Alphabetical comparison on `conceptId` guarantees 100% deterministic reproducibility across platforms.

---

## 4. Calibrated Confidence Thresholds & Routing Actions

Once candidates are ranked, the top candidate's total score $S(C_{\text{top}})$ is evaluated against calibrated confidence thresholds:

| Score Interval | Confidence Level | Routing Action | Pedagogical Outcome & UX Behavior |
|---|---|---|---|
| **$S < 1.10$** | `insufficient` | `none` | **Careless Slip Filter**: A single isolated slip does not indicate a foundational deficit. The student is not diverted; normal chapter progression continues uninterrupted. |
| **$1.10 \le S < 2.00$** | `low` | `confirmation_only` | **Confirmation Probe**: Recurrent error evidence exists, but confidence is low. Routes student to a 1-question confirmation check before triggering full remediation. |
| **$2.00 \le S < 2.75$** | `medium` | `gap_card` | **Targeted Remedial Gap Card**: Convergent error patterns confirm a prerequisite breakdown. Triggers a prominent gap card offering a bridge lesson. |
| **$S \ge 2.75$** | `high` | `gap_card` | **Urgent Foundation Intervention**: Strong, repeated, or severe failure on fundamental rules. Directly routes the student to the lower-grade foundational module. |

### 4.1 Question Shortfall Guard

Even when a student scores above the confidence threshold, routing is **withheld** if the target prerequisite concept has insufficient questions in the question bank (`hasEnoughQuestions(conceptId, minQuestions = 3)`):
- If question count $< 3$: `canRoute = false`, `routing = "none"`, and a `shortfallReport` warning is emitted to the teacher dashboard.
- The engine guarantees no student is ever routed to an empty or truncated practice pool.

---

## 5. Three Worked Examples with Real Concept IDs and Real Computed Scores

The following three worked examples are taken directly from the verified evaluation suite (`scripts/eval-scenarios.mjs`).

---

### Worked Example 1: Class 10 Sign-Rule Convergence (Low Confidence $\to$ `confirmation_only`)

- **Student Context**: Class 10 diagnostic on Quadratic Equations (`c10-ch04`, anchor concept `c10-quad-01`).
- **Total Questions**: $N = 6$.
- **Student Submissions**:
  1. `q-c10-sol-01` ($i = 0$): Selected **B** (Correct) $\implies$ No error.
  2. `q-c10-sol-02` ($i = 1$): Selected **B** (Correct) $\implies$ No error.
  3. `q-c10-form-01` ($i = 2$): Selected **A** (Distractor: $(-6)^2 = -36 \implies D = -56$).
     - Mistake Tag: `squared_negative_b_as_negative` $\implies$ maps to root concept `c7-int-02` (*Multiplication of Integers and Rules of Signs*).
  4. `q-c10-form-02` ($i = 3$): Selected **D** (Distractor: $-4ac = -4(1)(-8) = -32 \implies D = -28$).
     - Mistake Tag: `sign_error_negative_times_negative_became_negative` $\implies$ maps to root concept `c7-int-02`.
  5. `q-c10-form-03` ($i = 4$): Selected **C** (Correct) $\implies$ No error.
  6. `q-c10-quad-d1-01` ($i = 5$): Selected **A** (Correct) $\implies$ No error.

#### Step 1: Compute Recency Weights
- For Error 1 at $i = 2$:
  $$w_{\text{recency}}(2, 6) = 0.90^{6 - 1 - 2} = 0.90^3 = 0.7290$$
- For Error 2 at $i = 3$:
  $$w_{\text{recency}}(3, 6) = 0.90^{6 - 1 - 3} = 0.90^2 = 0.8100$$

#### Step 2: Accumulate Scores for Direct Root (`c7-int-02`)
Both errors point directly to `c7-int-02` ($d = 0$, $w_{\text{distance}} = 1.0$):
$$S(\text{c7-int-02}) = 0.7290 \times 1.0 + 0.8100 \times 1.0 = \mathbf{1.5390}$$

#### Step 3: Propagate Distance Decay to Prerequisites of `c7-int-02`
- Immediate prerequisite ($d = 1$): `c7-int-01` (*Addition and Subtraction of Signed Integers*):
  $$S(\text{c7-int-01}) = 1.5390 \times 0.70^1 = \mathbf{1.0773}$$
- Second-level prerequisites ($d = 2$):
  - `c6-neg-02` (*Integers on the Number Line and Ordering*):
    $$S(\text{c6-neg-02}) = 1.0773 \times 0.70 = \mathbf{0.7541}$$
  - `c7-alg-01` (*Arithmetic Expressions and Order of Operations*):
    $$S(\text{c7-alg-01}) = 1.0773 \times 0.70 = \mathbf{0.7541}$$
- Third-level prerequisites ($d = 3$):
  - `c6-neg-01` (*Opposite Quantities and Need for Negative Numbers*):
    $$S(\text{c6-neg-01}) = 0.7541 \times 0.70 = \mathbf{0.5279}$$
  - `c7-num-01` (*Large Numbers, Place Value, and Estimation*):
    $$S(\text{c7-num-01}) = 0.7541 \times 0.70 = \mathbf{0.5279}$$

#### Step 4: Top Candidate Evaluation & Routing
- Top Candidate: **`c7-int-02`** with score **$1.5390$**.
- Score range: $1.10 \le 1.5390 < 2.00 \implies$ **`confidence = "low"`**.
- Routing: **`routing = "confirmation_only"`**.
- Traversal path: `[c10-quad-01 -> c9-id-02 -> c7-int-02]`.

---

### Worked Example 2: Class 8 Severe Distributive & Sign Collapse (High Confidence $\to$ `gap_card`)

- **Student Context**: Class 8 diagnostic on The Distributive Law (`c8-ch04`, anchor concept `c8-dist-01`).
- **Total Questions**: $N = 6$.
- **Student Submissions**:
  1. `q-c8-dist-01` ($i = 0$): Selected **C** (Distractor: $-3(2x - 5) = -6x - 15$).
     - Mistake Tag: `sign_error_negative_times_negative_became_negative` $\implies$ root `c7-int-02`.
  2. `q-c8-dist-02` ($i = 1$): Selected **D** (Distractor: $-5(x - 4) = -5x - 20$).
     - Mistake Tag: `sign_error_negative_times_negative_became_negative` $\implies$ root `c7-int-02`.
  3. `q-c8-dist-03` ($i = 2$): Selected **C** (Distractor: $-2x(3x - 7) = -6x^2 - 14x$).
     - Mistake Tag: `sign_error_negative_times_negative_became_negative` $\implies$ root `c7-int-02`.
  4. `q-c8-dist-d1-01` ($i = 3$): Selected **B** (Distractor: $-4(2a - 3) = -8a - 12$).
     - Mistake Tag: `sign_error_negative_times_negative_became_negative` $\implies$ root `c7-int-02`.
  5. `q-c8-dist-d1-02` ($i = 4$): Selected **B** (Correct) $\implies$ No error.
  6. `q-c8-dist-d1-03` ($i = 5$): Selected **C** (Correct) $\implies$ No error.

#### Step 1: Compute Recency Weights for Errors
- Error 1 at $i = 0$: $w = 0.90^5 = 0.59049$
- Error 2 at $i = 1$: $w = 0.90^4 = 0.65610$
- Error 3 at $i = 2$: $w = 0.90^3 = 0.72900$
- Error 4 at $i = 3$: $w = 0.90^2 = 0.81000$

#### Step 2: Accumulate Scores for Direct Root (`c7-int-02`)
All 4 errors point directly to `c7-int-02` ($d = 0$, $w_{\text{distance}} = 1.0$):
$$S(\text{c7-int-02}) = 0.59049 + 0.65610 + 0.72900 + 0.81000 = \mathbf{3.0566}$$

#### Step 3: Propagate Distance Decay to Prerequisites
- `c7-int-01` ($d = 1$): $3.0566 \times 0.70 = \mathbf{2.1396}$ (Medium confidence)
- `c6-neg-02` ($d = 2$): $2.1396 \times 0.70 = \mathbf{1.4977}$ (Low confidence)
- `c7-alg-01` ($d = 2$): $2.1396 \times 0.70 = \mathbf{1.4977}$ (Low confidence)
- `c6-neg-01` ($d = 3$): $1.4977 \times 0.70 = \mathbf{1.0484}$ (Insufficient)
- `c7-num-01` ($d = 3$): $1.4977 \times 0.70 = \mathbf{1.0484}$ (Insufficient)

#### Step 4: Top Candidate Evaluation & Routing
- Top Candidate: **`c7-int-02`** with score **$3.0566$**.
- Score range: $3.0566 \ge 2.75 \implies$ **`confidence = "high"`**.
- Routing: **`routing = "gap_card"`**.
- Pedagogical Outcome: Triggers immediate, high-priority remedial gap card directing student to Class 7 signed multiplication.

---

### Worked Example 3: Class 10 Single Careless Factor Slip (Insufficient Evidence $\to$ `none`)

- **Student Context**: Class 10 diagnostic on Quadratic Equations (`c10-ch04`, anchor concept `c10-quad-01`).
- **Total Questions**: $N = 6$.
- **Student Submissions**:
  1. `q-c10-sol-01` ($i = 0$): Selected **C** (Distractor: factor pair $(2, 6)$ chosen instead of $(3, 4)$ for $x^2 - 7x + 12$).
     - Mistake Tag: `incorrect_factor_pair_sum` $\implies$ maps to root concept `c9-id-02` (*Factoring Quadratic Trinomials by Middle-Term Splitting*).
  2. `q-c10-sol-02` ($i = 1$): Selected **B** (Correct).
  3. `q-c10-form-01` ($i = 2$): Selected **B** (Correct).
  4. `q-c10-form-02` ($i = 3$): Selected **B** (Correct).
  5. `q-c10-form-03` ($i = 4$): Selected **C** (Correct).
  6. `q-c10-quad-d1-01` ($i = 5$): Selected **A** (Correct).

#### Step 1: Compute Recency Weight
Only 1 error occurred at $i = 0$:
$$w_{\text{recency}}(0, 6) = 0.90^{6 - 1 - 0} = 0.90^5 = \mathbf{0.5905}$$

#### Step 2: Accumulate Score for Candidate (`c9-id-02`)
$$S(\text{c9-id-02}) = 0.5905 \times 1.0 = \mathbf{0.5905}$$

#### Step 3: Top Candidate Evaluation & Routing
- Top Candidate: `c9-id-02` with score **$0.5905$**.
- Threshold Check: $0.5905 < 1.10 \implies$ **`confidence = "insufficient"`**.
- Routing: **`routing = "none"`**, `confirmed = false`.
- Diagnostic Result: Classified as a careless slip; student achieves 5/6 (83%) score and continues to normal practice without unnecessary remedial redirection.

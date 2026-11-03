# Margam — Supabase Demo Seeder & Judge Evaluation Guide

This guide details how to provision, evaluate, and safely reset the synthetic demo dataset for **Code Kernel '26** judging.

---

## 1. Quick Start Commands

```bash
# Provision the demo classroom (Class 9-B Maths · DEMO26) in Supabase:
npm run seed:demo

# Reset the demo classroom right before judging (deletes ONLY is_demo=true rows):
npm run seed:demo:reset
```

---

## 2. Credentials & Accounts

All credentials read strictly from `.env.local` if provided, or fall back to standard presentation evaluation passwords:

| Role | Identifier | Default Password | Environment Variable Override |
| :--- | :--- | :--- | :--- |
| **Demo Teacher** | `demo.teacher@margam.example` | `MargamDemo@2026` | `DEMO_TEACHER_PASSWORD` |
| **Demo Student** | `demo_student` | `MargamDemo@2026` | `DEMO_STUDENT_PASSWORD` |
| **Demo Class** | Code: `DEMO26` | N/A | Class 9-B Maths (Demo) |

> [!NOTE]
> All 25 additional synthetic classroom peers (`demo_stu_01` to `demo_stu_25`) receive cryptographically randomized, unusable passwords (`crypto.randomBytes(32)`), preventing student account hijacking while enabling realistic class-wide heatmaps.

---

## 3. The Pedagogical Prerequisite Chain

The demo student and class cohort illustrate Margam's core educational journey:
**IDENTIFY ➔ UNDERSTAND ➔ LEARN ➔ PRACTICE ➔ IMPROVE**

### Traced Error Chain:
1. **Class 10 — Quadratic Equations (`c10-quad-01`)**:
   - The student struggles with standard factorisation: $x^2 - 5x + 6 = 0$.
   - Root misconception: `sign_error_both_negative_yields_positive_product`.
2. **Class 9 — Algebraic Identities (`c9-id-02`)**:
   - Distractor tag: `sign_error_constant_product`.
3. **Class 8 — Distributive Law (`c8-dist-01`)**:
   - Mastered ($85\%$), but fails when negative multipliers are introduced.
4. **Class 7 — Integer Sign Rules (`c7-int-02`) [THE ROOT GAP]**:
   - Mistake tag: `negative_times_negative_equals_negative_error`.
   - Mastery is low ($40\%$). The diagnostic flags this as the root prerequisite breakdown.
5. **Class 6 — Negative Numbers (`c6-neg-01`) [DEEPEST FOUNDATION]**:
   - Number line comprehension is solid ($92\%$), proving the gap is specifically sign arithmetic.

### Classroom Cluster Heatmap:
- **8 students** (32% of class) share the `c7-int-02` Integer Sign bottleneck.
- **5 students** (20% of class) share a `c7-frac-01` fraction reciprocal gap.
- **12 students** are on grade level, demonstrating contrasting progress.

---

## 4. Reset & Safety Mechanics

When `npm run seed:demo:reset` is executed:
1. Only rows matching `is_demo = true` in `profiles`, `classes`, `class_members`, `attempts`, `concept_mastery`, and `xp_events` are targeted.
2. The seeder refuses to delete or truncate any row where `is_demo` is `false` or `null`.
3. Demo user authentication records matching `@margam.example` or metadata `is_demo: true` are cleanly removed from `auth.users`.
4. Run `npm run seed:demo:reset && npm run seed:demo` immediately before judge evaluations to guarantee a pristine initial state.

---

## 5. Security & Isolation Evaluation

### Can Real Students Join `DEMO26`?
- **Analysis:** In the current application code, class join codes are verified against the `classes` table via `api/student/join-class`. Any student with a valid account could technically enter `DEMO26` if given the code.
- **Recommendation:** Keep `DEMO26` dedicated to hackathon judging. For production deployments with real schools, demo classes should be provisioned in an isolated environment.

### Can the Demo Teacher See Non-Demo Data Through RLS?
- **Analysis:** Row-Level Security (RLS) on `profiles`, `attempts`, and `concept_mastery` strictly restricts teachers to students enrolled in classes where `teacher_id = auth.uid()`.
- **Verdict:** The demo teacher **CANNOT** view any non-demo students or classes owned by other teachers.

### Multi-Tenant Recommendation:
- We strongly recommend maintaining a **dedicated, isolated Supabase project** exclusively for public hackathon demonstration and testing, completely separated from school production databases.

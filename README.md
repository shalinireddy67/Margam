# Margam (मार्गम् / మార్గం)
> **Every learner has a path. Find yours.**  
> *Adaptive Mathematics Learning Platform for Indian Students in Classes 6–10*

[![Next.js App Router](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![NCERT Aligned](https://img.shields.io/badge/NCERT-Classes%206--10-orange)](#starter-mathematics-chapters)
[![DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP%20Act%202023-047857)](#privacy-accessibility--performance)
[![Validation](https://img.shields.io/badge/Validation%20Suite-100%25%20Passing-success)](#content-validation-tests)

---

## 1. Product Overview

**Margam** represents an individual student's path toward mathematical mastery. Built for **Code Kernel '26 (Decode Round)**, Margam addresses the reality of Indian middle and secondary classrooms: **mathematics builds sequentially**, and when a student struggles with a higher-grade concept, the breakdown is almost always an unaddressed prerequisite from an earlier grade.

Instead of assigning blind repetitive drills or replacing classroom teachers with opaque AI chatbots, Margam provides:
1. **Explainable Prerequisite Backtracking:** Tracing struggles in high-school algebra back to middle-school integer operations via a Directed Acyclic Graph (DAG).
2. **Three-Stage Adaptation:** Adapting **Learn** (3 distinct teaching variants), **Solve** (adaptive difficulty 1–3 with mistake classification), and **Test** (formative checkpoints).
3. **Teacher Empowerment:** Providing class mastery heatmaps, automated peer remedial grouping, and print-ready single-sheet A4 worksheets for students with limited device access.
4. **Child Privacy by Design:** 0 tracking cookies, 0 third-party surveillance scripts, and strictly localized sessions adhering to the **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 2. The Problem We Are Solving

In typical Indian classrooms with 40–50 students:
- A student scores **38% on a Class 9 Polynomials test**. The score confirms struggle, but completely conceals *why*.
- Teachers assume the child cannot grasp algebraic factoring and assign 40 more quadratic factoring problems.
- The student experiences mounting math anxiety because the real breakdown is in **Class 7 Integer Sign Operations** ($(-3) \times (+2) = -6$, but $(-3) + 2 = -1$).
- **Margam's Solution:** Traverses backwards across the NCERT DAG to identify the root cause within minutes, delivers a 10-minute visual remedial lesson (using concrete Indian models like Kirana store debt/credit), and restores confidence before returning to Class 9.

### The Central Learning Loop
$$\text{DIAGNOSE} \longrightarrow \text{ADAPT} \longrightarrow \text{CHECK AGAIN}$$

---

## 3. Tech Stack

- **Framework:** Next.js 14.2 (App Router, Server Components + selective Client Components)
- **Language:** TypeScript 5.6 (strict mode enabled)
- **Styling:** Vanilla Tailwind CSS 3.4 with custom design tokens:
  - Background: Warm linen cream (`#FAF8F5` / `#F4EFEA`)
  - Typography & Structure: Midnight Navy (`#0B192C` / `#132238`)
  - Distinctive Accent: Terracotta Vermilion (`#C2410C`) & Saffron Amber (`#D97706`)
  - Positive Mastery: Restrained Emerald Green (`#047857`)
- **Icons:** Lucide React (lightweight SVG icons)
- **Validation:** Native Node.js test script (`scripts/validate-content.mjs`)
- **Zero Heavy Overheads:** No external font dependencies, no paid LLM grading lock-ins.

---

## 4. Architecture & File Structure

```
kernel2k26/
├── .env.example                       # Documented environment variables
├── .gitignore                         # Configured for node_modules, .next, .env*.local
├── package.json                       # Scripts: dev, build, start, validate, test
├── tsconfig.json                      # Strict TypeScript compiler options with @/* aliases
├── tailwind.config.ts                 # Margam bespoke color palette & typographic scale
├── postcss.config.mjs                 # PostCSS setup
├── next.config.mjs                    # Next.js production configuration
├── README.md                          # Master documentation (this file)
├── data/
│   ├── concepts.json                  # 21-node NCERT DAG with EN/HI/TE translations & audit flags
│   ├── questions.json                 # Question bank with deterministic answers & mistake tags
│   ├── lessons.json                   # 3 variants per concept (Basics-first, Standard, Fast-track)
│   └── demo-class.json                # Synthetic 25-student dataset for Class 8A
├── scripts/
│   └── validate-content.mjs           # Automated test suite for DAG cycles & schema integrity
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout with SEO, semantic HTML, and skip links
    │   ├── page.tsx                   # Master landing page assembling sections A through K
    │   └── globals.css                # CSS variables, print styles, and focus outlines
    ├── config/
    │   └── site.ts                    # Single source of truth for site name, metadata, and chapters
    ├── lib/
    │   ├── types.ts                   # TypeScript interfaces for concepts, questions, and mastery
    │   └── graph.ts                   # Graph utility (DFS cycle detection, topological traversal)
    └── components/
        ├── Navbar.tsx                 # Section A: Original wordmark, anchor nav, language selector
        ├── Hero.tsx                   # Section B: Core headline, CTAs, live concept path preview
        ├── DiagnosticWidget.tsx       # Interactive 3-question diagnostic simulator
        ├── ProblemSection.tsx         # Section C: Class 6–10 dilemma (Class 9 Polynomial story)
        ├── ApproachSection.tsx        # Section D: Diagnose → Adapt → Check Again loop
        ├── ThreeStagesSection.tsx     # Section E: Learn (3 variants), Solve, and Test
        ├── ConceptPathway.tsx         # Section F: Interactive DAG visualizer
        ├── IndianClassrooms.tsx       # Section G: Vernacular languages, Indian math contexts, A4 printout
        ├── TeacherControl.tsx         # Section H: Class grouping engine preview
        ├── StarterChapters.tsx        # Section I: Class 7 Integers, Class 8 Linear Eqns, Class 9 Polynomials
        ├── RoadmapSection.tsx         # Section J: 4-phase roadmap (implemented vs planned)
        └── Footer.tsx                 # Section K: Closing CTA, DPDP Act 2023, repository links
```

---

## 5. Concept Graph (DAG)

The curriculum is structured as a **Directed Acyclic Graph** in `data/concepts.json`. Every node defines an NCERT-aligned concept with learning objectives and prerequisite pointers:

```
[c6-num-01: Whole Numbers]
    ├── [c6-num-02: Opposites & Negatives] ──> [c7-int-01: Number Line] ──> [c7-int-02: Integer Addition/Subtraction]
    │                                                                               │
    ├── [c6-frac-01: Fractions Basics] ────> [c7-frac-01: Rational Numbers]         │
    │                                                                               ▼
    └── [c6-alg-01: Variables] ──> [c7-alg-01: Like Terms] ──> [c8-lin-01: Expressions]
                                                                        │
                                [c7-int-03: Sign Rules] ◄───────────────┤
                                           │                            ▼
                                           │              [c8-lin-03: Transposition & Balancing]
                                           │                            │
                                           │                            ▼
                                           └────────────► [c9-poly-04: Factoring by Splitting Middle Term]
```

### Starter Mathematics Chapters:
1. **Class 7: Integers** (`c7-int-01` to `c7-int-04`)
2. **Class 8: Linear Equations in One Variable** (`c8-lin-01` to `c8-lin-05`)
3. **Class 9: Polynomials** (`c9-poly-01` to `c9-poly-05`)

---

## 6. Question and Lesson Data Schemas

### Question Bank Schema (`data/questions.json`)
```json
{
  "id": "q-poly-02",
  "conceptId": "c9-poly-02",
  "difficulty": 2,
  "type": "multiple_choice",
  "prompt": {
    "en": "Evaluate the polynomial P(x) = x² - 3x - 4 at x = -2.",
    "hi": "x = -2 पर बहुपद P(x) = x² - 3x - 4 का मान ज्ञात कीजिए।",
    "te": "x = -2 వద్ద P(x) = x² - 3x - 4 బహుపది విలువను లెక్కించండి.",
    "reviewed": false
  },
  "options": [
    { "id": "A", "text": { "en": "6", "hi": "6", "te": "6", "reviewed": false } },
    { "id": "B", "text": { "en": "-6", "hi": "-6", "te": "-6", "reviewed": false }, "mistakeTag": "sign_error_integer_product" }
  ],
  "correctAnswer": "A",
  "explanation": { "en": "...", "hi": "...", "te": "...", "reviewed": false },
  "hint": { "en": "...", "hi": "...", "te": "...", "reviewed": false }
}
```

### Three Lesson Pedagogical Variants (`data/lessons.json`)
Every supported concept provides three genuinely distinct teaching variants in English, Hindi, and Telugu:
1. **Basics-First:** Grounded in tangible Indian mental models (e.g. Kirana store ledger balances, two-pan weighing scales, Leh winter temperatures).
2. **Standard:** Structured, formal NCERT steps with explicit algebraic rules and verification checks.
3. **Fast-Track:** High-density conceptual summaries, vector direction shifts, and mental shortcuts for rapid learners.

---

## 7. Synthetic Demo Class Dataset (`data/demo-class.json`)

To prepare for Phase 3's teacher dashboard without violating student privacy, the repository includes a fictional class of **25 students (Class 8A)** with realistic mastery profiles:
- **Foundational Master:** Aarav Sharma (Roll #1) — 90%+ across all concepts.
- **Negative Integer Gap:** Ananya Reddy (Roll #2) & Utkarsh Tiwari (Roll #21) — 45% mastery in transposition due to root integer sign subtraction errors.
- **Fraction Gap:** Eashan Verma (Roll #6) — struggles with fractional equations ($x/3 + 1/2 = 5$) due to unaddressed Class 6 LCM fraction addition.

---

## 8. Setup and Local Development

### Prerequisites
- **Node.js:** `v20.x` or later (LTS recommended)
- **npm:** `10.x` or later

### Installation & Run
```bash
# 1. Clone the repository
git clone https://github.com/shalinireddy67/kernel2k26.git
cd kernel2k26

# 2. Install dependencies
npm install

# 3. Run automated content & DAG validation suite
npm run validate

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Integration Status Note
The directory `src/lib/supabase/` contains optional helper stubs for planned future remote synchronization. No tracked application file imports `src/lib/supabase/`, and it is intentionally left untracked. The application operates entirely with zero-backend local client storage in full compliance with the DPDP Act 2023. Production builds on Vercel do not require or bundle this directory and build cleanly without it.

---

## 9. Content Validation Tests

Run the automated test suite at any time:
```bash
npm test
# or
npm run validate
```

### Checks Performed by `scripts/validate-content.mjs`:
- [x] **Acyclicity (DFS):** Mathematically verifies that the concept graph contains **0 cycles**.
- [x] **Prerequisite Integrity:** Proves that all referenced prerequisites exist in `concepts.json`.
- [x] **Question Schemas:** Checks unique IDs, valid difficulties (1–3), and deterministic answer matching.
- [x] **Multilingual Translation Coverage:** Verifies non-empty strings across EN, HI, and TE for all prompts, hints, and explanations.
- [x] **Pedagogical Variants:** Proves all three variants (`basics_first`, `standard`, `fast_track`) exist for core concepts.
- [x] **Demo Student Integrity:** Verifies student mastery records link to valid concept IDs.

---

## 10. Privacy, Accessibility & Performance

- **Zero Tracking Cookies:** No analytics or surveillance scripts.
- **DPDP Act 2023 Principles:** Collects zero personal data in Phase 1. Subsequent student access uses ephemeral class codes and roll numbers.
- **Accessibility:** Touch targets $\ge 44\text{px}$, visible focus indicators, WCAG AA color contrast, and semantic ARIA attributes.
- **A4 Print Engine:** Clean print stylesheet for generating single-sheet classroom worksheets (`window.print()`).

---

## 11. Four-Phase Project Roadmap

| Phase | Timeline | Focus | Status |
|---|---|---|---|
| **Phase 1** | 21–24 Oct 2026 | Architecture, design system, landing page, concept DAG, question bank, 3 lesson variants, content validation, interactive simulator | **COMPLETED** |
| **Phase 2** | 25–27 Oct 2026 | Student onboarding (class code), diagnostic flow, adaptive Learn/Solve/Test practice engine, mistake classification | Planned |
| **Phase 3** | 28–29 Oct 2026 | Teacher dashboard, mastery heatmap, peer grouping engine, 1-page A4 worksheet generator | Planned |
| **Phase 4** | 30–31 Oct 2026 | Full UI multilingual localization, PWA offline caching, low-data mode, production audit | Planned |

---

## 12. Deployment Instructions for Vercel

To deploy Margam on Vercel:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your changes to GitHub: `git push origin main`.
2. Go to [https://vercel.com/new](https://vercel.com/new) and log in.
3. Import the GitHub repository: `shalinireddy67/kernel2k26`.
4. Configure Environment Variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_APP_NAME="Margam"`
   - `NEXT_PUBLIC_DEFAULT_LOCALE="en"`
   - `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS="false"`
   - `NEXT_PUBLIC_DEMO_UNLOCK="false"`  
     > **CRITICAL PRODUCTION RULE:** `NEXT_PUBLIC_DEMO_UNLOCK` must **STAY `false`** on Vercel and all production environments to enforce standard curriculum progression and placement rules. Setting it to `true` is intended solely for local offline test execution.
5. Click **Deploy**. Vercel will build and deploy the production bundle with automatic SSL and edge caching.

### Option B: Via Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

---

## 13. License & Attribution

- Built for **Code Kernel '26** (Decode Round, 21–24 October 2026).
- Official Problem Statement: *Adaptive Learning for Classes 6 to 10*.
- Repository: [https://github.com/shalinireddy67/kernel2k26](https://github.com/shalinireddy67/kernel2k26)
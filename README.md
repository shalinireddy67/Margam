# Margam

Margam is a maths learning tool that finds earlier prerequisite gaps behind secondary-school maths mistakes and walks students back to fix them.

- **Live site:** https://margam-learningspace.vercel.app
- **Repository:** https://github.com/shalinireddy67/Margam

---

## What Margam does

Students in Classes 6–10 often get stuck with current mathematics topics because an earlier foundation was missed. For example, difficulty factorising quadratic equations in Class 10 often traces back to integer sign rules from Class 7.

Margam maps NCERT mathematics topics into a directed acyclic graph (DAG). When a student takes a quick check or practice problem, Margam traces errors back to earlier topics that need attention and provides step-by-step review lessons and practice worksheets.

---

## What is implemented

- **Prerequisite concept graph (DAG):** 24 concepts mapped across Classes 6–10 focused on two primary pilot chains:
  - Quadratic equations chain (5 concepts): Negative Numbers (Class 6) &rarr; Integer Operations (Class 7) &rarr; Distributive Property (Class 8) &rarr; Algebraic Identities (Class 9) &rarr; Quadratic Equations (Class 10).
  - Algebra foundations chain (5 concepts): Patterns to Algebra (Class 6) &rarr; Algebraic Expressions (Class 7) &rarr; Exponents (Class 8) &rarr; Polynomials (Class 9) &rarr; Polynomial Roots (Class 10).
  - 14 supporting concepts across the NCERT curriculum graph.
- **Question bank:** 239 verified questions across 3 difficulty levels, validated by 169 deterministic mathematical checks.
- **3 lesson variants per concept:** Basics-first, standard, and stepped explanations with worked examples.
- **Diagnostics and worksheets:** Chapter quick checks identify prerequisite gaps and route students to targeted practice worksheets.
- **Student dashboard:** Personalised "Fix this first" prompt, block-style path map, real activity streaks, daily quests, and voxel scholar avatar tiers.
- **Teacher dashboard:** Class roster, join codes, shared gap counts, topic mastery heatmap, student effort view, and printable offline worksheets.
- **Demo accounts:** Pre-seeded student profiles (`demo_riya`, `demo_aarav`) and a demo class of 25 students (`DEMO10A`).
- **Account access:** Email-free student accounts with 16-character recovery codes; teacher accounts with class management.

---

## Try the demo

You can explore Margam without signing up by visiting `/demo`:
- **Student profile (Riya - Class 10):** Username `demo_riya` (Active Class 7 integer sign gap).
- **Student profile (Aarav - Class 10):** Username `demo_aarav` (Active Class 8 distributive property gap).
- **Teacher profile:** Email `demo.teacher@margam.example` (Class 10-A, code `DEMO10A`).
- **Password:** Read from the `DEMO_PASSWORD` environment variable or prefilled on the `/demo` page.

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS (block-world visual theme)
- **Database & auth:** Supabase (PostgreSQL with Row Level Security)
- **Math formulas:** KaTeX
- **Audio:** Web Audio API (synthesized 8-bit blip tones)

---

## Local setup

### Prerequisites
- Node.js 18+ (tested on Node.js 20 LTS)
- npm 9+

### Installation
```bash
git clone https://github.com/shalinireddy67/Margam.git
cd Margam
npm install
```

### Environment variables (optional)
To connect to a live Supabase project, create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
DEMO_PASSWORD=
```

When these variables are absent, Margam operates with its local-first demo and simulation engine.

### Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Test commands

Run the verification suite locally:

```bash
# Content, DAG acyclicity, mistake tags, and deterministic math checks
npm run validate

# Authentication, lockout, session integrity, and RLS tests
npm run test:auth

# Production client bundle security audit (no server secrets or answer keys in client JS)
npm run test:bundle

# Row Level Security (RLS) and immutability trigger checks
npm run test:rls

# Reusable UI states (empty, loading, error, offline notices)
npm run test:states

# Plain English copy rules and word replacement audit
npm run check:words

# Supabase configuration and migration health check
npm run check:supabase

# Production Next.js build (verifies static generation and type safety)
npm run build
```

---

## Scope & limitations

- **Syllabus coverage:** Margam currently implements a 24-concept pilot chain. It does not cover the complete NCERT Classes 6–10 syllabus yet.
- **Languages:** English is fully reviewed. Initial working drafts in हिन्दी (Hindi) and తెలుగు (Telugu) are provided and marked pending native-speaker review.
- **Privacy:** No personal emails, phone numbers, or government IDs are collected or stored for students.

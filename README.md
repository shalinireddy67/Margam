# Margam

Margam is a web application that traces secondary-school maths mistakes back to prerequisite concepts from earlier classes.

- **Live site:** https://margam-learningspace.vercel.app
- **Repository:** https://github.com/shalinireddy67/Margam

---

## What Margam does

Students in Classes 6–10 often struggle with current mathematics topics because of missed concepts from earlier years. For example, errors when factorising quadratic equations in Class 10 frequently trace back to integer sign rules taught in Class 7.

Margam maps NCERT mathematics topics into a directed acyclic graph (DAG). When a student makes an error on a diagnostic or practice problem, the platform identifies the earlier prerequisite topic that caused the mistake and walks the student back to review and practice it.

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS (block-world visual theme)
- **Database and auth:** Supabase (PostgreSQL with row-level security policies)
- **Math formula rendering:** KaTeX
- **Icons:** Lucide React

---

## What is implemented today

- **Prerequisite concept graph (DAG):** 24 concepts mapped across Classes 6–10, focused on two primary pilot chains:
  - Quadratic equations chain (5 concepts): Negative Numbers (Class 6) &rarr; Integer Operations (Class 7) &rarr; Distributive Property (Class 8) &rarr; Algebraic Identities (Class 9) &rarr; Quadratic Equations (Class 10).
  - Algebra foundations chain (5 concepts): Patterns to Algebra (Class 6) &rarr; Algebraic Expressions (Class 7) &rarr; Exponents (Class 8) &rarr; Polynomials (Class 9) &rarr; Polynomial Roots (Class 10).
  - 14 additional supporting concept nodes across the NCERT curriculum graph.
- **Question bank:** 239 verified questions across 3 difficulty levels, validated by 169 deterministic mathematical checks.
- **3 lesson variants per concept:** Basics-first, standard, and fast-track explanations with step-by-step worked examples.
- **Diagnostics and worksheets:** Chapter diagnostics check prerequisite understanding and route students to targeted practice worksheets.
- **Teacher dashboard:** Roster view, class topic progress heatmap, gap distribution metrics, and printable offline worksheets.
- **Demo class data:** Seeded class of 25 demo students showing active and resolved prerequisite gaps (for example, Advik Verma with an unfixed Class 7 integer sign gap).
- **Storage and sync:** Local-first browser storage with optional Supabase cloud synchronisation.
- **Account access:** Email-free student signups with 16-character recovery codes; teacher accounts with class management.

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
```

When these variables are absent, Margam operates with its local-first mock and demo engine.

### Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Test suite

Run the verification suite locally:

```bash
# 1. Validate content catalog, DAG acyclicity, mistake tags, and math assertions
npm run validate

# 2. Test login security, lockout limits, RLS policies, and route interception
npm run test:auth

# 3. Test client bundle security (verifies no leaked server secrets or answer keys)
npm run test:bundle

# 4. Production Next.js build (verifies static page generation for all routes)
npm run build
```

---

## Known limitations

- **Syllabus coverage:** Margam currently implements a 24-concept pilot chain. It does not cover the complete NCERT Classes 6–10 syllabus yet.
- **Regional languages:** Translations in Hindi and Telugu are initial working drafts marked `reviewed: false` and are awaiting native-speaker review.

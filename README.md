# Margam

Adaptive mathematics learning platform for Indian students in Classes 6–10.

- **Live Site:** https://margam-learningspace.vercel.app
- **Repository:** https://github.com/shalinireddy67/Margam

---

## Honest Scope & Current Implementation

Margam is an adaptive learning prototype created for Code Kernel '26.

- **Curriculum:** Pilot coverage for NCERT Mathematics across Classes 6–10.
  - **Quadratic Equations Chain (5 nodes):** Negative Numbers (Class 6) &rarr; Integer Operations (Class 7) &rarr; Distributive Property (Class 8) &rarr; Algebraic Identities (Class 9) &rarr; Quadratic Equations (Class 10).
  - **Algebra Foundations Chain (5 nodes):** Patterns to Algebra (Class 6) &rarr; Algebraic Expressions (Class 7) &rarr; Exponents (Class 8) &rarr; Polynomials (Class 9) &rarr; Polynomial Roots (Class 10).
  - Plus 14 additional curriculum graph concept nodes (24 total nodes across the prerequisite DAG).
- **Question Bank:** 239 total verified questions (18 questions per pilot concept across 3 difficulty tiers with anti-repetition memory).
- **Pedagogy:** 3 adaptive lesson variants per concept (Basics First, Standard, Fast Track) with interactive step-by-step diagnostic feedback.
- **Languages:** English, Hindi, and Telugu UI strings. Note: Regional language translations are working drafts and are pending formal native-speaker review.
- **Data & Privacy:** Email-free student signups with 16-character recovery codes. Multi-teacher classroom scoping and class-specific leaderboards. (Note: Not currently certified for DPDP compliance; this is a demonstration prototype).

---

## Demo Credentials & Presentation

You can explore Margam immediately without entering credit card details or phone numbers:

### Quick 1-Click Demo
On the login screen (`/login`), click **"Try Demo"** to select either the Student or Teacher demo persona.

### Manual Demo Sign-In
- **Student Demo:**
  - Username: `student.demo`
  - Password: `password123` (or use the one-click demo button)
  - Profile: Class 10 student with a diagnosed Class 7 integer arithmetic gap.
- **Teacher Demo:**
  - Email: `teacher.demo@margam.local`
  - Password: `password123` (or use the one-click demo button)
  - Profile: Teacher managing Class 10-A4 with 25 enrolled students, live gap distribution, and mastery heatmap.

### Safe Demo Reset
To restore the demonstration database and mock state to baseline:
```bash
npm run seed:demo:reset
```

---

## Local Setup

### Prerequisites
- Node.js 18+ (tested on Node.js 20 LTS)
- npm 9+

### Installation
```bash
git clone https://github.com/shalinireddy67/Margam.git
cd Margam
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory if connecting to a real Supabase backend. When absent, Margam automatically falls back to its offline mock/demo engine.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_SECRET=
```

> **Security Note:** `SUPABASE_SERVICE_ROLE_KEY` and `SESSION_SECRET` must only live in server environments and are excluded from all client builds.

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Test Suite

Run the test suite locally to verify content integrity, security policies, and client bundle isolation:

```bash
# 1. Validate content, DAG acyclicity, mistake tags, and 169 math assertions
npm run validate

# 2. Test login security, lockout limits, RLS isolation, IDOR defenses, and back navigation
npm run test:auth

# 3. Test question pool capacity and anti-repetition engines (practice, diagnostics, test)
npm run test:anti-repetition

# 4. Production bundle security audit (verifies zero leaked server secrets or answer keys)
npm run test:bundle

# 5. Full Next.js production build (verifies static and dynamic compilation for all routes)
npm run build
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with block-pixel design system
- **Database / Auth:** Supabase (PostgreSQL with RLS policies, HMAC session crypto)
- **Math Engine:** KaTeX for LaTeX formula rendering
- **Icons:** Lucide React

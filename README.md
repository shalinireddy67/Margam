# Margam

**Every learner has a path. Find yours.**

Margam is an adaptive mathematics learning platform for students in Classes 6–10 (NCERT curriculum). It identifies foundational learning gaps, traces prerequisite dependencies across grade levels, and provides personalized remedial lessons, adaptive practice, and chapter assessments.

**Live website:** https://margam-learningspace.vercel.app/  
**GitHub repository:** https://github.com/shalinireddy67/Margam

## What Margam Offers

- **Learning Gap Identification:** Diagnostic assessments detect specific misconceptions and error patterns.
- **Prerequisite Backtracking:** Prerequisite DAG maps foundational concepts across Classes 6 to 10 (e.g. Class 10 Quadratic Equations backtracking to Class 7 Integer Signs).
- **Adaptive Practice Engine:** Stepped difficulty (Levels 1–3) with real-time feedback and misconception hints.
- **3-Variant Pedagogical Lessons:** Basics First, Standard, and Fast Track approaches tailored to individual mastery.
- **Multilingual Support:** Full trilingual support in English, Hindi (हिन्दी), and Telugu (తెలుగు).
- **Gamification & Progress:** Streak flames with freeze token protection, IST daily reset, and XP rank milestones.
- **Teacher Dashboard:** Real-time classroom oversight, concept mastery matrix, and student roster management.

## Student Learning Journey

1. The student selects their grade level (Class 6 to 10).
2. Diagnostic assessments identify prerequisite concepts needing attention.
3. The platform generates personalized lessons and adaptive practice worksheets.
4. Student progress, mastery, and daily streaks are synchronized securely.
5. Chapter tests assess overall topic proficiency.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Fluid Responsive Layout & Voxel Design System)
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Fonts:** Self-hosted WOFF2 fonts for offline resilience

## Run Locally

You will need Node.js (v20+) and npm installed.

```bash
git clone https://github.com/shalinireddy67/Margam.git
cd Margam
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Configure required environment variables in `.env.local` using `.env.example` as a template.

## Verification & Testing

```bash
# Run unit, progression, and curriculum validation suites
npm test

# Run authentication and security authorization suites
npm run test:auth

# Run production bundle secret leak audit
npm run test:bundle

# Production build
npm run build
```

## Links

- **Production Website:** https://margam-learningspace.vercel.app/
- **Source Code:** https://github.com/shalinireddy67/Margam

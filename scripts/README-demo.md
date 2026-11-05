# Margam Demo Runbook & Judge Provisioning Guide

This runbook documents the exact sequence for provisioning, verifying, and resetting the demo dataset for **Code Kernel '26** judging.

---

## 1. Required Environment Variables

Configure these variables in your hosting environment (e.g., Vercel) and local `.env.local`:

| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project API URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public anon key (used by frontend browser client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase backend service role key (used for server-side mutations) |
| `SESSION_SECRET` | Yes | 32+ character random secret for dual-mode HMAC-SHA256 session signatures |
| `DEMO_PASSWORD` | Optional | Password for demo accounts. When set, displayed with a copy button on `/demo` |

> [!IMPORTANT]
> Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` or `SESSION_SECRET`.

---

## 2. Exact Run Order for Deployment & Demo Setup

Follow these steps in strict sequence:

### Step 1: Migration Check
Ensure all local migrations in `supabase/migrations/` have been executed against your Supabase database in order:
1. `20261101_initial_schema.sql`
2. `20261102_gamification_leaderboard.sql`
3. `20261103_demo_data_flags.sql`
4. `20261104_security_repair.sql`
5. `20261105_security_hardening.sql`

Verify that all tables have RLS enabled and contain the `is_demo` boolean flag.

### Step 2: Create the 4 Demo Users in Supabase Auth
Open the **Supabase Dashboard ➔ Authentication ➔ Users** and click **Add user ➔ Create user**.
Create the following 4 accounts with **Auto Confirm User** checked (`email_confirm: true`):

1. **Teacher**:
   - Email: `demo.teacher@margam.example`
   - Password: `<your DEMO_PASSWORD>` (e.g., `MargamDemo@2026`)
2. **Student (Riya - gap unfixed)**:
   - Email: `demo_riya@student.margam.local`
   - Password: `<your DEMO_PASSWORD>`
3. **Student (Aarav - all mastered)**:
   - Email: `demo_aarav@student.margam.local`
   - Password: `<your DEMO_PASSWORD>`
4. **Student (New - clean empty state)**:
   - Email: `demo_new@student.margam.local`
   - Password: `<your DEMO_PASSWORD>`

> [!NOTE]
> The seed script `demo_data.sql` validates these exact email addresses and will abort with `RAISE EXCEPTION` if any are missing from `auth.users`.

### Step 3: Set DEMO_PASSWORD in Vercel / Environment
Set `DEMO_PASSWORD` in your Vercel Project Settings ➔ Environment Variables (and in `.env.local` for local development).
- When `DEMO_PASSWORD` is configured, `/demo` renders the password with a one-click copy button.
- If unset, the password row remains completely hidden.

### Step 4: Run `supabase/seed/demo_data.sql`
Open the **Supabase SQL Editor** and execute the full contents of `supabase/seed/demo_data.sql`.
This single-transaction script performs:
- Verifies the 4 auth accounts exist.
- Creates profiles for Teacher (`demo_teacher`), Riya (`demo_riya`), Aarav (`demo_aarav`), and New Student (`demo_new`).
- Creates Class 10-A (Demo) with code `DEMO10A` and enables the class leaderboard.
- Enrolls 25 synthetic classmates (`synth_01` through `synth_25`) with short first-name-plus-initial labels.
- Seeds the student misconception clusters:
  - 8 students share a weak integer sign rule (`c7-int-02`) and weak quadratic standard form (`c10-quad-01`).
  - 5 students share weak powers & exponents (`c8-exp-01`).
  - Remaining students have solid mastery across all topics.
- Seeds Riya's state: solid on `c6-neg-01`, weak and unfixed on `c7-int-02`, untouched on `c8-dist-01` and `c9-id-01`, weak on `c10-quad-01`, one failed quick check attempt, one practice attempt, and XP events.
- Seeds Aarav's state: 100% mastery across all concepts, 10/10 quick check, 10/10 chapter test, and full XP progression.
- Keeps New Student in a clean empty state (zero attempts, zero mastery, zero XP).
- Marks all seeded rows with `is_demo = true`.

### Step 5: Run Verification Check
Run the verification check script to ensure database connectivity, auth users, RLS policies, and demo data isolation:
```bash
node scripts/check-supabase.mjs
```

### Step 6: Redeploy
Trigger a deployment or push to your repository main branch:
```bash
git push origin main
```

---

## 3. Demo Reset Instructions

To restore the demo class to its initial state before or after judge evaluations:
1. Open the **Supabase SQL Editor**.
2. Run `supabase/seed/demo_reset.sql`.
   - Strictly targets rows where `is_demo = true`.
   - Preserves all real teacher accounts, student profiles, and migration logs.
   - Preserves the 4 manual auth user credentials in `auth.users`.
3. Run `supabase/seed/demo_data.sql` to immediately re-populate the pristine initial demo state.

---

## 4. Evaluation Guide for Judges

| Evaluation Flow | Start Page | Description |
| :--- | :--- | :--- |
| **One-Click Demo** | `/demo` | Click **"Open as Riya (student)"** or **"Open the teacher dashboard"** |
| **Student Journey** | `/student` | Observe "Fix this first" directing Riya to Class 7 Integer Signs (`c7-int-02`) |
| **Teacher Dashboard** | `/teacher` | Observe class topic gap heatmap showing the cluster of 8 students struggling with Integer Signs |
| **Clean Student State** | Sign in as `demo_new` | Observe the empty state prompt: *"No check-ins yet. Take a 5-question check-in to find where to start."* |

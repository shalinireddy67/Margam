# Margam Demo Data & Supabase Environment Setup Guide

This guide describes how to provision, verify, and safely reset the hackathon demo environment for **Margam** (Code Kernel '26).

---

## 1. Execution Order

To set up the complete demo environment with the Demo Teacher, 3 Hero Students, and 25 Synthetic Classmates:

### Step 1: Apply Migration (Database Schema)
Execute the migration script in your Supabase SQL Editor:
```sql
-- File: supabase/migrations/20261104_add_is_demo_flag.sql
```
*Purpose:* Adds the `is_demo boolean not null default false` column and indexes across `profiles`, `classes`, `class_members`, `attempts`, `concept_mastery`, and `xp_events`.

### Step 2: Provision Authentication Accounts (Server/CLI)
Ensure your `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run:
```bash
node scripts/seed-demo.mjs
```
*Purpose:* Idempotently creates the Demo Teacher (`teacher@demo.margam.invalid`), 3 Hero Students (`aarav_unfixed_gap`, `diya_fixed_gap`, `neha_new_student`), and 25 synthetic student accounts in Supabase Auth and synchronizes their `public.profiles` with `is_demo = true`.

### Step 3: Populate Demo Class, Attempts & Mastery (Database)
Execute the seed script in your Supabase SQL Editor:
```sql
-- File: supabase/seed/demo_data.sql
```
*Purpose:* Sets up Class 10-A (`DEMO-10A`), enrolls students, and populates realistic diagnostic attempts, chapter test scores, and concept mastery records (including the 8-student integer sign gap cluster).

### Step 4: Verify Environment Integrity
Run the verification check:
```bash
npm run check:supabase
```
*Purpose:* Validates environment variable presence (names only, zero key leaks), database reachability, table schema readiness, client chunk secret absence, and RLS policy enforcement.

---

## 2. Resetting Demo Data

To wipe all demo data without touching any real students, teachers, or production records:
```sql
-- File: supabase/seed/demo_reset.sql
```
*Safety Guarantee:* Strictly checks `WHERE is_demo = true` and only removes accounts belonging to the demo domains.

---

## 3. Demo Credentials Reference

Credentials are defined in `data/demo-credentials.json`:

| Role | Username / Identifier | Password | Description |
| :--- | :--- | :--- | :--- |
| **Demo Teacher** | `teacher@demo.margam.invalid` | `MargamDemoTeacher#2026` | Class 10-A Teacher (Priya Sharma) |
| **Hero (Unfixed Gap)** | `aarav_unfixed_gap` | `AaravGap#2026` | Has active root gap `c7-int-02` (rules of signs in integer multiplication) |
| **Hero (Fixed Gap)** | `diya_fixed_gap` | `DiyaFixed#2026` | Repaired `c7-int-02` gap via remedial practice; mastered quadratics |
| **Hero (New Student)** | `neha_new_student` | `NehaNew#2026` | Fresh Class 10 student with 0 attempts; ready for diagnostic |

---

## 4. Vercel Environment Variables Configuration

In your Vercel Project Dashboard:
1. Navigate to: **Project Settings** > **Environment Variables**
2. Add the following variables for **Production** and **Preview** environments:

| Environment Variable Name | Type | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client) | Your Supabase project HTTPS URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client) | Supabase `anon` public key (safe for browser client) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret (Server Only)** | Supabase `service_role` secret key. **NEVER** prefix with `NEXT_PUBLIC_`. |
| `SESSION_SECRET` | **Secret (Server Only)** | 64+ character random hex or base64 string for signing session JWTs. |

> [!CAUTION]
> Never commit `.env.local` to Git. The Margam CI/CD pipeline runs `npm run test:bundle` and `npm run check:supabase` on every build to guarantee zero secret keys leak into client JavaScript bundles.

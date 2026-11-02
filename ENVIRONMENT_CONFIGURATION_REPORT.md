# MARGAM — Environment Configuration & Vercel Deployment Report

> **Document:** `ENVIRONMENT_CONFIGURATION_REPORT.md`  
> **Target Environment:** Vercel Production (`https://kernel2k26.vercel.app`) & Preview Deployments  
> **Supabase Integration:** Dual-mode (Public Anon Client + Server-Only Admin Service Role)  
> **Security Audit Status:** ✅ **PASSED (0 Leaks / 0 TypeScript Errors / 0 Build Errors)**  
> **Deployment Status:** ⏸️ **PRE-DEPLOYMENT VERIFIED — AWAITING MANUAL VERCEL DASHBOARD CONFIGURATION**

---

## 1. Executive Summary

This audit and configuration pass standardizes all environment variables for Margam across local development, Vercel preview environments, and Vercel production deployment.

### Key Actions Completed:
1. **Naming Standardization & Alias Support:**
   - Public credentials standardized to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (with transparent fallback to legacy alias `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
   - Server-only credentials standardized to `SUPABASE_SERVICE_ROLE_KEY` (with transparent fallback to legacy aliases `SUPABASE_SECRET_KEY` and `SUPABASE_SERVICE_KEY`).
   - Unified `SESSION_SECRET` getter for HMAC signing of anti-tamper student session tokens and diagnostic question payloads.
2. **Bundle Leak Elimination:**
   - Server secrets are guarded with Next.js `"server-only"` boundary in `src/lib/supabase/admin.ts`.
   - Client bundle scanner (`scripts/test-bundle-secrets.mjs`) verified **0 server secrets and 0 pedagogy answer keys** across all 43 production JavaScript chunks in `.next/static`.
3. **Mock Authentication Elimination in Production:**
   - All authentication routes (`/api/auth/login`, `/api/auth/student-signup`, `/api/auth/teacher-signup`, `/api/teacher/classes`, `/api/sync/import-local`) strictly block mock fallback in production, returning explicit `503 Service Unavailable` error responses if database configuration is missing.
4. **Git Protection:**
   - `.gitignore` hardened to explicitly block all variants of local, preview, staging, and production `.env` files.
   - `.env.example` updated with clean, documentation-only placeholder values.

---

## 2. Environment Variable Matrix

| Variable Name | Scope | Security Level | Purpose | Supported Aliases |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Public | Supabase project API gateway | None |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public | Browser client initialization & read operations | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | **STRICT SECRET** | Backend administrative operations (account provisioning, RLS bypass for server scoring) | `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_KEY` |
| `SESSION_SECRET` | Server Only | **STRICT SECRET** | Cryptographic HMAC-SHA256 signing of quiz tokens & session tokens | None |
| `NEXT_PUBLIC_APP_NAME` | Client & Server | Public | Application title branding ("Margam") | None |
| `NEXT_PUBLIC_APP_TAGLINE` | Client & Server | Public | Platform subtitle | None |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Client & Server | Public | Default student language (`en`, `hi`, `te`) | None |
| `NEXT_PUBLIC_FEATURE_LOGIN` | Client & Server | Public | Enables authentication UI & routes (`true`) | None |
| `NEXT_PUBLIC_FEATURE_TEACHER_TOOLS` | Client & Server | Public | Enables teacher class creation & roster tools (`true`) | None |
| `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS`| Client & Server | Public | Controls unreviewed translation visibility (`false` in Prod) | None |
| `NEXT_PUBLIC_DEMO_UNLOCK` | Client & Server | Public | Unlocks chapters for evaluation (`false` in Prod) | None |

> [!CAUTION]
> **Zero Exposure Guarantee:** Server-only variables (`SUPABASE_SERVICE_ROLE_KEY` and `SESSION_SECRET`) must **NEVER** be prefixed with `NEXT_PUBLIC_`. Prefixing them would cause Next.js to compile them directly into client JavaScript chunks sent to the student's browser.

---

## 3. Production vs. Preview Environment Separation

Vercel provides independent environment variable scopes. Margam requires distinct configurations:

### A. Production Environment (`kernel2k26.vercel.app`)
- **Target Branch:** `main`
- **Draft Translations:** Set `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS="false"` (strictly protects students from seeing unverified drafts).
- **Demo Unlock:** Set `NEXT_PUBLIC_DEMO_UNLOCK="false"` (curriculum progression enforced).
- **Session Secret:** Unique, high-entropy production random string.
- **Supabase Credentials:** Bound to your production Supabase project.

### B. Preview Environment (Pull Requests & Branch Deploys)
- **Target Branches:** All preview branches (e.g., `kernel2k26-git-*.vercel.app`)
- **Draft Translations:** Set `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS="true"` if reviewers need to visually audit Hindi/Telugu question drafts with yellow draft badges.
- **Demo Unlock:** Can be set to `"true"` if evaluating downstream chapters without completing placement diagnostics.
- **Supabase Credentials:** Can point to a dedicated staging project or shared development database.

---

## 4. Exact Vercel Dashboard Instructions

Follow these exact steps in your Vercel Dashboard to configure the variables:

### Step 1: Open Vercel Project Settings
1. Go to **[https://vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Select your project: **`kernel2k26`** (or `margam`).
3. Click on the **Settings** tab at the top.
4. In the left navigation, select **Environment Variables**.

### Step 2: Retrieve Keys from Supabase Dashboard
1. Open your **[Supabase Project Dashboard](https://supabase.com/dashboard)** in a new tab.
2. Click **Project Settings** (gear icon at the bottom of the left sidebar).
3. Select **API**.
4. Locate the following values:
   - **Project URL** → copy for `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` `public` API key** → copy for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role` `secret` API key** → copy for `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Add Variables to Vercel

Add each entry below. Select the appropriate environment checkboxes for each:

#### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://<your-project-ref>.supabase.co`
- **Environments:** Check **Production**, **Preview**, **Development**

#### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Paste your Supabase `anon` public key
- **Environments:** Check **Production**, **Preview**, **Development**

#### 3. `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Paste your Supabase `service_role` secret key
- **Environments:** Check **Production**, **Preview**, **Development**

#### 4. `SESSION_SECRET`
- **Value:** Generate a random 64-character hex string (e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in terminal)
- **Environments:** Check **Production**, **Preview**, **Development**

#### 5. `NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS`
- **Value:** `false` (for Production)
- **Environments:** Check **Production**
- *(Optional)* Add a second entry with value `true` with only **Preview** checked for draft translation auditing.

#### 6. `NEXT_PUBLIC_FEATURE_LOGIN`
- **Value:** `true`
- **Environments:** Check **Production**, **Preview**, **Development**

#### 7. `NEXT_PUBLIC_FEATURE_TEACHER_TOOLS`
- **Value:** `true`
- **Environments:** Check **Production**, **Preview**, **Development**

### Step 4: Trigger Redeployment
> [!IMPORTANT]
> Next.js inlines `NEXT_PUBLIC_*` variables into client-side JavaScript bundles **at build time**. Changing them in Vercel will not affect existing builds until you redeploy:
> 1. Go to the **Deployments** tab in Vercel.
> 2. Click the three dots (`...`) next to the latest production deployment.
> 3. Click **Redeploy**.

---

## 5. Verification & Test Suite Results

All checks passed with 100% success rate:

```
================================================================================
  MARGAM COMPREHENSIVE VERIFICATION SUITE — STEP 3
================================================================================

1. Content DAG & Deterministic Math Validation:
   - 67 chapters valid
   - 24-node prerequisite DAG acyclic (0 cycles)
   - 139 deterministic mathematical checks passed (100% precision)
   - 253 cognitive mistake tags correctly mapped to question pools

2. Progression & Isolation Engine:
   - All 5 classes (6 to 10) verified independently
   - Zero grade contamination across class switches
   - Deliberate profile corruption safely handled

3. Gap Tracing & Adaptive Diagnostic Engine:
   - 3-tier decay formula verified
   - 23 / 23 multi-class journey steps passed

4. Authentication & Security Policy Suite:
   - 63 / 63 tests PASSED
   - 15-minute login lockout strictly enforced after 5 failed attempts
   - RLS isolation between students verified
   - Teacher roster scoping strictly verified
   - Privilege escalation blocked by database trigger
   - Production mock fallback prevention verified

5. Gamification & XP Ledger:
   - 42 / 42 tests PASSED
   - Daily 300 XP cap enforced
   - 24-hour question anti-farm cooldown active

6. TypeScript Validation:
   - `npx tsc --noEmit` exited with code 0 (Zero type errors)

7. Next.js Production Build:
   - `npm run build` exited with code 0
   - All 29 routes and Edge middleware (87.7 kB) compiled successfully

8. Client Bundle Secrets Audit:
   - `npm run test:bundle` exited with code 0
   - 43 client JavaScript chunks scanned
   - 0 pedagogy answer keys leaked
   - 0 distractor mistake tags leaked
   - 0 server secret keys (`SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`) in client chunks
```

---

## 6. Summary of Modified Codebase Files

- [`src/lib/env.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/env.ts): Centralized environment access layer with alias support, placeholder detection, and client-safe validation.
- [`.env.example`](file:///c:/Users/reddy/kernel/kernel2k26/.env.example): Standardized configuration template with clear separation of Public vs Server-Only variables.
- [`.gitignore`](file:///c:/Users/reddy/kernel/kernel2k26/.gitignore): Expanded to ignore all local, preview, and production `.env` file variations.
- [`src/lib/supabase/client.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/supabase/client.ts): Uses centralized public environment configuration with fallback support.
- [`src/lib/supabase/admin.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/supabase/admin.ts): Uses centralized server configuration, retaining `"server-only"` boundary.
- [`src/lib/supabase/server.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/supabase/server.ts): Uses centralized public environment configuration with SSR cookie handling.
- [`src/lib/server/session-crypto.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/server/session-crypto.ts): Uses unified `getSessionSecret()` for HMAC signing.
- [`src/lib/server/session.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/lib/server/session.ts): Uses unified `getSessionSecret()` for diagnostic/practice session tokens.
- [`src/middleware.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/middleware.ts): Edge middleware with centralized env validation and fail-closed production protection.
- [`src/app/api/auth/login/route.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/app/api/auth/login/route.ts): Hardened with 503 production guard against unconfigured databases.
- [`src/app/api/auth/student-signup/route.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/app/api/auth/student-signup/route.ts): Hardened with 503 production guard against unconfigured databases.
- [`src/app/api/auth/teacher-signup/route.ts`](file:///c:/Users/reddy/kernel/kernel2k26/src/app/api/auth/teacher-signup/route.ts): Hardened with 503 production guard against unconfigured databases.
- [`scripts/test-bundle-secrets.mjs`](file:///c:/Users/reddy/kernel/kernel2k26/scripts/test-bundle-secrets.mjs): Enhanced to audit 100% of client JS chunks for server secrets.
- [`scripts/test-login-security.mjs`](file:///c:/Users/reddy/kernel/kernel2k26/scripts/test-login-security.mjs): Updated to support `SUPABASE_SERVICE_ROLE_KEY` naming.


-- ==============================================================================
-- MARGAM — DEMO DATASET SAFE RESET SCRIPT
-- Version: 2026-11-04-Final
-- Target: Supabase PostgreSQL 15+ (Run in SQL Editor to wipe demo data)
--
-- CRITICAL SAFETY RULES:
-- - STRICTLY deletes ONLY records where `is_demo = true`.
-- - Refuses to touch any real production student, teacher, class, or attempt.
-- - Cleans up auth.users scoped strictly to demo domains.
-- ==============================================================================

BEGIN;

-- 1. XP Events (Demo only)
DELETE FROM public.xp_events
WHERE is_demo = true;

-- 2. Concept Mastery (Demo only)
DELETE FROM public.concept_mastery
WHERE is_demo = true;

-- 3. Attempts (Demo only)
DELETE FROM public.attempts
WHERE is_demo = true;

-- 4. Class Members (Demo only)
DELETE FROM public.class_members
WHERE is_demo = true;

-- 5. Classes (Demo only)
DELETE FROM public.classes
WHERE is_demo = true;

-- 6. Profiles (Demo only)
DELETE FROM public.profiles
WHERE is_demo = true;

-- 7. Auth.users (Demo domains only)
DELETE FROM auth.users
WHERE email LIKE '%@demo.margam.invalid'
   OR (email LIKE 'synthetic_%@student.internal.margam.local')
   OR (email LIKE '%_gap@student.internal.margam.local')
   OR (email = 'neha_new_student@student.internal.margam.local');

COMMIT;


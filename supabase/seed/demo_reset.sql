-- ==============================================================================
-- MARGAM DEMO RESET SCRIPT: supabase/seed/demo_reset.sql
-- Deletes ONLY synthetic demo records where is_demo = true in strict dependency order.
-- Preserves all production teacher and student accounts, migration history, and system tables.
-- ==============================================================================

BEGIN;

-- 1. Remove demo XP events
DELETE FROM public.xp_events 
WHERE is_demo = true;

-- 2. Remove demo concept mastery records
DELETE FROM public.concept_mastery 
WHERE is_demo = true;

-- 3. Remove demo assessment & practice attempts
DELETE FROM public.attempts 
WHERE is_demo = true;

-- 4. Remove demo class memberships
DELETE FROM public.class_members 
WHERE is_demo = true;

-- 5. Remove demo classes (e.g. Class 10-A (Demo) DEMO10A)
DELETE FROM public.classes 
WHERE is_demo = true;

-- 6. Remove demo profiles (both synthetic and manual demo accounts)
DELETE FROM public.profiles 
WHERE is_demo = true;

-- 7. Remove synthetic classmates from auth.users
-- Note: Leaves the 4 manual auth accounts (demo.teacher, demo_riya, demo_aarav, demo_new) intact in auth.users
DELETE FROM auth.users 
WHERE email LIKE 'synth_%@student.margam.local';

COMMIT;


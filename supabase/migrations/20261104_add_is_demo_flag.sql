-- ==============================================================================
-- MARGAM — ADD IS_DEMO FLAG FOR DEMO DATA ISOLATION AND CLEANUP
-- Version: 2026-11-04-Final
-- Target: Supabase PostgreSQL 15+
--
-- Adds an `is_demo` boolean flag to all core application tables.
-- Ensures strict isolation, query partitioning, and clean wipe capability
-- for synthetic/fictional hackathon demo data without risking real user records.
-- ==============================================================================

BEGIN;

-- 1. PROFILES
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_is_demo
ON public.profiles(is_demo);

-- 2. CLASSES
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_classes_is_demo
ON public.classes(is_demo);

-- 3. CLASS_MEMBERS
ALTER TABLE public.class_members
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_class_members_is_demo
ON public.class_members(is_demo);

-- 4. ATTEMPTS
ALTER TABLE public.attempts
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_attempts_is_demo
ON public.attempts(is_demo);

-- 5. CONCEPT_MASTERY
ALTER TABLE public.concept_mastery
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_concept_mastery_is_demo
ON public.concept_mastery(is_demo);

-- 6. XP_EVENTS
ALTER TABLE public.xp_events
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_xp_events_is_demo
ON public.xp_events(is_demo);

COMMIT;

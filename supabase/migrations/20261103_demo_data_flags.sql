-- Margam Database Migration: 20261103_demo_data_flags.sql
-- Adds `is_demo` boolean flag to all transactional tables for safe demo data isolation and resets.
-- Preserves strict separation between synthetic hackathon judge demo datasets and real student accounts.

ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.classes 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.class_members 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.attempts 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.concept_mastery 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.xp_events 
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

-- Partial indexes for zero overhead on normal production queries while enabling fast demo resets
CREATE INDEX IF NOT EXISTS idx_profiles_is_demo 
  ON public.profiles(is_demo) WHERE is_demo = true;

CREATE INDEX IF NOT EXISTS idx_classes_is_demo 
  ON public.classes(is_demo) WHERE is_demo = true;

CREATE INDEX IF NOT EXISTS idx_attempts_is_demo 
  ON public.attempts(is_demo) WHERE is_demo = true;

CREATE INDEX IF NOT EXISTS idx_concept_mastery_is_demo 
  ON public.concept_mastery(is_demo) WHERE is_demo = true;

CREATE INDEX IF NOT EXISTS idx_xp_events_is_demo 
  ON public.xp_events(is_demo) WHERE is_demo = true;

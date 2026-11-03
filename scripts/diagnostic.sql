-- ==============================================================================
-- MARGAM SUPABASE DIAGNOSTIC: Check Migration History & Object Existence
-- Read-only query. Safe to run in Supabase SQL Editor.
-- ==============================================================================

-- 1. Check recorded migrations in schema_migrations
SELECT 
  version, 
  name, 
  inserted_at 
FROM supabase_migrations.schema_migrations 
ORDER BY version;

-- 2. Check existence of all Margam tables and their columns
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'classes', 'class_members', 'attempts', 'concept_mastery', 'xp_events')
ORDER BY table_name, ordinal_position;

-- 3. Check functions and triggers
SELECT 
  routine_name, 
  routine_type, 
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('protect_profile_immutability', 'get_current_week_start_ist', 'join_class_with_code', 'get_class_leaderboard');

-- 4. Check triggers
SELECT 
  trigger_name, 
  event_object_table, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- 5. Check RLS policies
SELECT 
  tablename, 
  policyname, 
  cmd, 
  roles
FROM pg_policies
WHERE schemaname = 'public';

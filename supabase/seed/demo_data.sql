-- ==============================================================================
-- MARGAM — DEMO DATASET SEED SCRIPT
-- Version: 2026-11-04-Final
-- Target: Supabase PostgreSQL 15+ (Run in SQL Editor after seed-demo.mjs)
--
-- This script idempotently populates Class 10-A (Demo), enrollments,
-- assessment attempts, and concept mastery records for:
--  - 1 Demo Teacher (priya_teacher)
--  - 3 Hero Students (aarav_unfixed_gap, diya_fixed_gap, neha_new_student)
--  - 25 Synthetic Classmates with realistic pedagogical clusters:
--      * 8 students sharing integer sign gap (c7-int-02)
--      * 5 students sharing distributive law gap (c8-dist-01)
--      * 12 students with solid mastery in foundational concepts
--
-- ALL rows have `is_demo = true` for strict separation and clean reset.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. PROVISION / UPSERT DEMO CLASS
-- ------------------------------------------------------------------------------
WITH teacher AS (
  SELECT id FROM public.profiles WHERE username = 'priya_teacher' LIMIT 1
)
INSERT INTO public.classes (teacher_id, name, grade, class_code, leaderboard_enabled, is_demo)
SELECT
  teacher.id,
  'Example Public School, Class 10-A (Demo)',
  10,
  'DEMO-10A',
  true,
  true
FROM teacher
ON CONFLICT (class_code) DO UPDATE
SET name = EXCLUDED.name,
    teacher_id = EXCLUDED.teacher_id,
    grade = EXCLUDED.grade,
    is_demo = true;

-- ------------------------------------------------------------------------------
-- 2. ENROLL ALL DEMO STUDENTS INTO CLASS 10-A (DEMO)
-- ------------------------------------------------------------------------------
WITH demo_class AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
),
demo_students AS (
  SELECT id FROM public.profiles WHERE is_demo = true AND role = 'student'
)
INSERT INTO public.class_members (class_id, student_id, is_demo)
SELECT
  demo_class.id,
  demo_students.id,
  true
FROM demo_class CROSS JOIN demo_students
ON CONFLICT (class_id, student_id) DO UPDATE SET is_demo = true;

-- ------------------------------------------------------------------------------
-- 3. CLEAN EXISTING DEMO ATTEMPTS TO PREVENT INFLATION ON RERUN
-- ------------------------------------------------------------------------------
DELETE FROM public.attempts WHERE is_demo = true;

-- ------------------------------------------------------------------------------
-- 4. HERO 1: AARAV (UNFIXED ROOT GAP c7-int-02)
-- ------------------------------------------------------------------------------
WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'aarav_unfixed_gap' LIMIT 1
)
-- Attempts
INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
SELECT s.id, 'diagnostic', 'diag-c10-diagnostic', 3, 8, true, NOW() - INTERVAL '2 days' FROM s
UNION ALL
SELECT s.id, 'test', 'test-c10-quad', 2, 6, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'worksheet', 'ws-c9-id-02', 2, 6, true, NOW() - INTERVAL '4 hours' FROM s;

WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'aarav_unfixed_gap' LIMIT 1
)
-- Concept Mastery
INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
SELECT s.id, 'c6-neg-01', 85, 2, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 days' FROM s
UNION ALL
SELECT s.id, 'c7-int-01', 75, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 days' FROM s
UNION ALL
SELECT s.id, 'c7-int-02', 25, 1, 0, 3, 'learning', false, false, true, NOW() - INTERVAL '4 hours' FROM s
UNION ALL
SELECT s.id, 'c8-dist-01', 50, 1, 1, 1, 'available', true, false, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'c9-id-02', 40, 1, 0, 2, 'available', true, false, true, NOW() - INTERVAL '4 hours' FROM s
UNION ALL
SELECT s.id, 'c10-quad-01', 30, 1, 0, 2, 'available', true, false, true, NOW() - INTERVAL '1 day' FROM s
ON CONFLICT (student_id, concept_id) DO UPDATE
SET mastery = EXCLUDED.mastery,
    difficulty = EXCLUDED.difficulty,
    consecutive_correct = EXCLUDED.consecutive_correct,
    consecutive_incorrect = EXCLUDED.consecutive_incorrect,
    status = EXCLUDED.status,
    lesson_completed = EXCLUDED.lesson_completed,
    worksheet_completed = EXCLUDED.worksheet_completed,
    is_demo = true;

WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'aarav_unfixed_gap' LIMIT 1
),
c AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
)
-- XP Events
INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
SELECT s.id, c.id, 40, 'diagnostic_completion', 'demo_xp_aarav_diag', true, NOW() - INTERVAL '2 days' FROM s, c
UNION ALL
SELECT s.id, c.id, 15, 'practice', 'demo_xp_aarav_ws', true, NOW() - INTERVAL '4 hours' FROM s, c
ON CONFLICT (idempotency_key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. HERO 2: DIYA (REPAIRED GAP c7-int-02)
-- ------------------------------------------------------------------------------
WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'diya_fixed_gap' LIMIT 1
)
-- Attempts
INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
SELECT s.id, 'diagnostic', 'diag-c10-diagnostic', 6, 8, true, NOW() - INTERVAL '3 days' FROM s
UNION ALL
SELECT s.id, 'worksheet', 'ws-c7-int-02', 6, 6, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'test', 'test-c10-quad', 6, 6, true, NOW() - INTERVAL '2 hours' FROM s;

WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'diya_fixed_gap' LIMIT 1
)
-- Concept Mastery
INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
SELECT s.id, 'c6-neg-01', 100, 3, 4, 0, 'mastered', true, true, true, NOW() - INTERVAL '3 days' FROM s
UNION ALL
SELECT s.id, 'c7-int-01', 95, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '3 days' FROM s
UNION ALL
SELECT s.id, 'c7-int-02', 95, 3, 4, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'c8-dist-01', 90, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'c9-id-02', 90, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM s
UNION ALL
SELECT s.id, 'c10-quad-01', 92, 3, 4, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 hours' FROM s
ON CONFLICT (student_id, concept_id) DO UPDATE
SET mastery = EXCLUDED.mastery,
    difficulty = EXCLUDED.difficulty,
    consecutive_correct = EXCLUDED.consecutive_correct,
    consecutive_incorrect = EXCLUDED.consecutive_incorrect,
    status = EXCLUDED.status,
    lesson_completed = EXCLUDED.lesson_completed,
    worksheet_completed = EXCLUDED.worksheet_completed,
    is_demo = true;

WITH s AS (
  SELECT id FROM public.profiles WHERE username = 'diya_fixed_gap' LIMIT 1
),
c AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
)
-- XP Events
INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
SELECT s.id, c.id, 40, 'diagnostic_completion', 'demo_xp_diya_diag', true, NOW() - INTERVAL '3 days' FROM s, c
UNION ALL
SELECT s.id, c.id, 50, 'root_gap_resolved', 'demo_xp_diya_root_fix', true, NOW() - INTERVAL '1 day' FROM s, c
UNION ALL
SELECT s.id, c.id, 40, 'chapter_test', 'demo_xp_diya_test', true, NOW() - INTERVAL '2 hours' FROM s, c
ON CONFLICT (idempotency_key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. HERO 3: NEHA (BRAND NEW STUDENT)
-- Intentionally 0 attempts, 0 mastery records, 0 XP events.
-- ------------------------------------------------------------------------------

-- ------------------------------------------------------------------------------
-- 7. SYNTHETIC CLUSTER A: 8 STUDENTS WITH INTEGER SIGN GAP (c7-int-02)
--    Students: synthetic_01 through synthetic_08
-- ------------------------------------------------------------------------------
WITH syn_a AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_01', 'synthetic_02', 'synthetic_03', 'synthetic_04',
                     'synthetic_05', 'synthetic_06', 'synthetic_07', 'synthetic_08')
)
INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
SELECT id, 'diagnostic', 'diag-c10-diagnostic', 3, 8, true, NOW() - INTERVAL '1 day' FROM syn_a
UNION ALL
SELECT id, 'worksheet', 'ws-c9-id-02', 2, 6, true, NOW() - INTERVAL '6 hours' FROM syn_a;

WITH syn_a AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_01', 'synthetic_02', 'synthetic_03', 'synthetic_04',
                     'synthetic_05', 'synthetic_06', 'synthetic_07', 'synthetic_08')
)
INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
SELECT id, 'c6-neg-01', 80, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_a
UNION ALL
SELECT id, 'c7-int-01', 70, 2, 2, 1, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_a
UNION ALL
SELECT id, 'c7-int-02', 30, 1, 0, 3, 'learning', false, false, true, NOW() - INTERVAL '6 hours' FROM syn_a
UNION ALL
SELECT id, 'c8-dist-01', 55, 1, 1, 1, 'available', true, false, true, NOW() - INTERVAL '1 day' FROM syn_a
UNION ALL
SELECT id, 'c9-id-02', 35, 1, 0, 2, 'available', true, false, true, NOW() - INTERVAL '6 hours' FROM syn_a
UNION ALL
SELECT id, 'c10-quad-01', 25, 1, 0, 2, 'available', false, false, true, NOW() - INTERVAL '1 day' FROM syn_a
ON CONFLICT (student_id, concept_id) DO UPDATE
SET mastery = EXCLUDED.mastery,
    difficulty = EXCLUDED.difficulty,
    consecutive_correct = EXCLUDED.consecutive_correct,
    consecutive_incorrect = EXCLUDED.consecutive_incorrect,
    status = EXCLUDED.status,
    lesson_completed = EXCLUDED.lesson_completed,
    worksheet_completed = EXCLUDED.worksheet_completed,
    is_demo = true;

WITH syn_a AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_01', 'synthetic_02', 'synthetic_03', 'synthetic_04',
                     'synthetic_05', 'synthetic_06', 'synthetic_07', 'synthetic_08')
),
c AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
)
INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
SELECT id, c.id, 40, 'diagnostic_completion', 'demo_xp_' || username || '_diag', true, NOW() - INTERVAL '1 day' FROM syn_a, c
UNION ALL
SELECT id, c.id, 10, 'practice', 'demo_xp_' || username || '_ws', true, NOW() - INTERVAL '6 hours' FROM syn_a, c
ON CONFLICT (idempotency_key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 8. SYNTHETIC CLUSTER B: 5 STUDENTS WITH DISTRIBUTIVE LAW GAP (c8-dist-01)
--    Students: synthetic_09 through synthetic_13
-- ------------------------------------------------------------------------------
WITH syn_b AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_09', 'synthetic_10', 'synthetic_11', 'synthetic_12', 'synthetic_13')
)
INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
SELECT id, 'diagnostic', 'diag-c10-diagnostic', 4, 8, true, NOW() - INTERVAL '1 day' FROM syn_b
UNION ALL
SELECT id, 'worksheet', 'ws-c8-dist-02', 3, 6, true, NOW() - INTERVAL '12 hours' FROM syn_b;

WITH syn_b AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_09', 'synthetic_10', 'synthetic_11', 'synthetic_12', 'synthetic_13')
)
INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
SELECT id, 'c6-neg-01', 90, 2, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_b
UNION ALL
SELECT id, 'c7-int-01', 85, 2, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_b
UNION ALL
SELECT id, 'c7-int-02', 80, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_b
UNION ALL
SELECT id, 'c8-dist-01', 40, 1, 0, 2, 'learning', false, false, true, NOW() - INTERVAL '12 hours' FROM syn_b
UNION ALL
SELECT id, 'c8-dist-02', 45, 1, 1, 2, 'available', true, false, true, NOW() - INTERVAL '12 hours' FROM syn_b
UNION ALL
SELECT id, 'c10-quad-01', 50, 1, 1, 1, 'available', false, false, true, NOW() - INTERVAL '1 day' FROM syn_b
ON CONFLICT (student_id, concept_id) DO UPDATE
SET mastery = EXCLUDED.mastery,
    difficulty = EXCLUDED.difficulty,
    consecutive_correct = EXCLUDED.consecutive_correct,
    consecutive_incorrect = EXCLUDED.consecutive_incorrect,
    status = EXCLUDED.status,
    lesson_completed = EXCLUDED.lesson_completed,
    worksheet_completed = EXCLUDED.worksheet_completed,
    is_demo = true;

WITH syn_b AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_09', 'synthetic_10', 'synthetic_11', 'synthetic_12', 'synthetic_13')
),
c AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
)
INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
SELECT id, c.id, 40, 'diagnostic_completion', 'demo_xp_' || username || '_diag', true, NOW() - INTERVAL '1 day' FROM syn_b, c
UNION ALL
SELECT id, c.id, 15, 'practice', 'demo_xp_' || username || '_ws', true, NOW() - INTERVAL '12 hours' FROM syn_b, c
ON CONFLICT (idempotency_key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 9. SYNTHETIC CLUSTER C: 12 STUDENTS WITH SOLID MASTERY
--    Students: synthetic_14 through synthetic_25
-- ------------------------------------------------------------------------------
WITH syn_c AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_14', 'synthetic_15', 'synthetic_16', 'synthetic_17',
                     'synthetic_18', 'synthetic_19', 'synthetic_20', 'synthetic_21',
                     'synthetic_22', 'synthetic_23', 'synthetic_24', 'synthetic_25')
)
INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
SELECT id, 'diagnostic', 'diag-c10-diagnostic', 7, 8, true, NOW() - INTERVAL '2 days' FROM syn_c
UNION ALL
SELECT id, 'test', 'test-c10-quad', 5, 6, true, NOW() - INTERVAL '1 day' FROM syn_c;

WITH syn_c AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_14', 'synthetic_15', 'synthetic_16', 'synthetic_17',
                     'synthetic_18', 'synthetic_19', 'synthetic_20', 'synthetic_21',
                     'synthetic_22', 'synthetic_23', 'synthetic_24', 'synthetic_25')
)
INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
SELECT id, 'c6-neg-01', 95, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 days' FROM syn_c
UNION ALL
SELECT id, 'c7-int-01', 90, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 days' FROM syn_c
UNION ALL
SELECT id, 'c7-int-02', 88, 3, 3, 0, 'mastered', true, true, true, NOW() - INTERVAL '2 days' FROM syn_c
UNION ALL
SELECT id, 'c8-dist-01', 85, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_c
UNION ALL
SELECT id, 'c9-id-02', 85, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_c
UNION ALL
SELECT id, 'c10-quad-01', 80, 2, 2, 0, 'mastered', true, true, true, NOW() - INTERVAL '1 day' FROM syn_c
ON CONFLICT (student_id, concept_id) DO UPDATE
SET mastery = EXCLUDED.mastery,
    difficulty = EXCLUDED.difficulty,
    consecutive_correct = EXCLUDED.consecutive_correct,
    consecutive_incorrect = EXCLUDED.consecutive_incorrect,
    status = EXCLUDED.status,
    lesson_completed = EXCLUDED.lesson_completed,
    worksheet_completed = EXCLUDED.worksheet_completed,
    is_demo = true;

WITH syn_c AS (
  SELECT id, username FROM public.profiles
  WHERE username IN ('synthetic_14', 'synthetic_15', 'synthetic_16', 'synthetic_17',
                     'synthetic_18', 'synthetic_19', 'synthetic_20', 'synthetic_21',
                     'synthetic_22', 'synthetic_23', 'synthetic_24', 'synthetic_25')
),
c AS (
  SELECT id FROM public.classes WHERE class_code = 'DEMO-10A' LIMIT 1
)
INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
SELECT id, c.id, 40, 'diagnostic_completion', 'demo_xp_' || username || '_diag', true, NOW() - INTERVAL '2 days' FROM syn_c, c
UNION ALL
SELECT id, c.id, 40, 'chapter_test', 'demo_xp_' || username || '_test', true, NOW() - INTERVAL '1 day' FROM syn_c, c
ON CONFLICT (idempotency_key) DO NOTHING;

COMMIT;


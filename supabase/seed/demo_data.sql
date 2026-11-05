-- ==============================================================================
-- MARGAM SEED SCRIPT: supabase/seed/demo_data.sql
-- Single-transaction seed for Code Kernel '26 judging evaluation.
-- Requires 4 manual auth users in auth.users:
--   1. demo.teacher@margam.example
--   2. demo_riya@student.margam.local
--   3. demo_aarav@student.margam.local
--   4. demo_new@student.margam.local
-- Creates Class 10-A (Demo) [code: DEMO10A] with 25 synthetic classmates,
-- structured misconception clusters, and exact learner states.
-- All created records are explicitly marked with is_demo = true.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
  v_teacher_id UUID;
  v_riya_id UUID;
  v_aarav_id UUID;
  v_new_id UUID;
  v_class_id UUID;

  v_synth_id UUID;
  v_synth_email TEXT;
  v_synth_name TEXT;
  v_synth_username TEXT;

  -- 25 short first-name-plus-initial synthetic student names
  v_synth_names TEXT[] := ARRAY[
    'Advik V.', 'Vihaan K.', 'Saanvi P.', 'Kabir M.', 'Ishaan D.', 'Diya N.', 'Arjun B.',
    'Meera S.', 'Rohan J.', 'Ananya T.', 'Tanvi K.', 'Siddharth R.',
    'Rahul V.', 'Priya M.', 'Aryan S.', 'Sneha K.', 'Aditya P.', 'Neha D.', 'Vikram B.', 'Pooja C.', 'Dev S.', 'Kavya L.', 'Varun M.', 'Zoya K.', 'Ananya R.'
  ];
  i INTEGER;
BEGIN
  -- ----------------------------------------------------------------------------
  -- 1. VERIFY THE 4 MANUAL AUTH USERS EXIST
  -- ----------------------------------------------------------------------------
  SELECT id INTO v_teacher_id FROM auth.users WHERE LOWER(email) = 'demo.teacher@margam.example';
  IF v_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Missing required auth user: demo.teacher@margam.example. Please create this user in Supabase Auth first with auto-confirm enabled.';
  END IF;

  SELECT id INTO v_riya_id FROM auth.users WHERE LOWER(email) = 'demo_riya@student.margam.local';
  IF v_riya_id IS NULL THEN
    RAISE EXCEPTION 'Missing required auth user: demo_riya@student.margam.local. Please create this user in Supabase Auth first with auto-confirm enabled.';
  END IF;

  SELECT id INTO v_aarav_id FROM auth.users WHERE LOWER(email) = 'demo_aarav@student.margam.local';
  IF v_aarav_id IS NULL THEN
    RAISE EXCEPTION 'Missing required auth user: demo_aarav@student.margam.local. Please create this user in Supabase Auth first with auto-confirm enabled.';
  END IF;

  SELECT id INTO v_new_id FROM auth.users WHERE LOWER(email) = 'demo_new@student.margam.local';
  IF v_new_id IS NULL THEN
    RAISE EXCEPTION 'Missing required auth user: demo_new@student.margam.local. Please create this user in Supabase Auth first with auto-confirm enabled.';
  END IF;

  -- ----------------------------------------------------------------------------
  -- 2. CREATE / UPSERT PROFILES FOR THE 4 MANUAL ACCOUNTS
  -- ----------------------------------------------------------------------------
  -- Teacher
  INSERT INTO public.profiles (id, role, username, full_name, selected_class, consent_confirmed, is_demo, updated_at)
  VALUES (v_teacher_id, 'teacher', 'demo_teacher', 'Demo Teacher', 10, true, true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    role = 'teacher',
    username = 'demo_teacher',
    full_name = 'Demo Teacher',
    selected_class = 10,
    consent_confirmed = true,
    is_demo = true,
    updated_at = NOW();

  -- Riya (Student with unfixed integer sign gap)
  INSERT INTO public.profiles (id, role, username, full_name, selected_class, consent_confirmed, avatar_pixel, is_demo, updated_at)
  VALUES (v_riya_id, 'student', 'demo_riya', 'Riya S.', 10, true, 'wood_scholar', true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    role = 'student',
    username = 'demo_riya',
    full_name = 'Riya S.',
    selected_class = 10,
    consent_confirmed = true,
    avatar_pixel = 'wood_scholar',
    is_demo = true,
    updated_at = NOW();

  -- Aarav (Student with all topics mastered)
  INSERT INTO public.profiles (id, role, username, full_name, selected_class, consent_confirmed, avatar_pixel, is_demo, updated_at)
  VALUES (v_aarav_id, 'student', 'demo_aarav', 'Aarav S.', 10, true, 'diamond_scholar', true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    role = 'student',
    username = 'demo_aarav',
    full_name = 'Aarav S.',
    selected_class = 10,
    consent_confirmed = true,
    avatar_pixel = 'diamond_scholar',
    is_demo = true,
    updated_at = NOW();

  -- New (Clean state student)
  INSERT INTO public.profiles (id, role, username, full_name, selected_class, consent_confirmed, avatar_pixel, is_demo, updated_at)
  VALUES (v_new_id, 'student', 'demo_new', 'New Student', 10, true, 'wood_scholar', true, NOW())
  ON CONFLICT (id) DO UPDATE SET
    role = 'student',
    username = 'demo_new',
    full_name = 'New Student',
    selected_class = 10,
    consent_confirmed = true,
    avatar_pixel = 'wood_scholar',
    is_demo = true,
    updated_at = NOW();

  -- ----------------------------------------------------------------------------
  -- 3. CREATE / UPSERT DEMO CLASS: Class 10-A (Demo) [Code: DEMO10A]
  -- ----------------------------------------------------------------------------
  SELECT id INTO v_class_id FROM public.classes WHERE class_code = 'DEMO10A';
  IF v_class_id IS NULL THEN
    INSERT INTO public.classes (teacher_id, name, grade, class_code, leaderboard_enabled, is_demo)
    VALUES (v_teacher_id, 'Class 10-A (Demo)', 10, 'DEMO10A', true, true)
    RETURNING id INTO v_class_id;
  ELSE
    UPDATE public.classes
    SET teacher_id = v_teacher_id,
        name = 'Class 10-A (Demo)',
        grade = 10,
        leaderboard_enabled = true,
        is_demo = true
    WHERE id = v_class_id;
  END IF;

  -- Enroll the 3 manual students in the class
  INSERT INTO public.class_members (class_id, student_id, is_demo, joined_at)
  VALUES
    (v_class_id, v_riya_id, true, NOW() - INTERVAL '5 days'),
    (v_class_id, v_aarav_id, true, NOW() - INTERVAL '5 days'),
    (v_class_id, v_new_id, true, NOW() - INTERVAL '1 day')
  ON CONFLICT (class_id, student_id) DO UPDATE SET is_demo = true;

  -- ----------------------------------------------------------------------------
  -- 4. SEED RIYA'S DETAILED LEARNING HISTORY
  --    - c6-neg-01: solid (mastery 85%, completed)
  --    - c7-int-02: weak and UNFIXED (mastery 35%, consecutive_incorrect 2, available)
  --    - c8-dist-01: untouched (mastery 0%, available)
  --    - c9-id-01: untouched (mastery 0%, available)
  --    - c10-quad-01: weak (mastery 40%, in_progress)
  --    - 1 failed diagnostic attempt, 1 practice attempt, 2 xp_events
  -- ----------------------------------------------------------------------------
  -- Clear existing attempts & mastery for Riya to ensure clean idempotent seed
  DELETE FROM public.attempts WHERE student_id = v_riya_id;
  DELETE FROM public.concept_mastery WHERE student_id = v_riya_id;
  DELETE FROM public.xp_events WHERE student_id = v_riya_id;

  INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
  VALUES
    (v_riya_id, 'c6-neg-01', 85, 2, 3, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
    (v_riya_id, 'c7-int-02', 35, 1, 0, 2, 'available', false, false, true, NOW() - INTERVAL '2 days'),
    (v_riya_id, 'c8-dist-01', 0, 1, 0, 0, 'available', false, false, true, NOW() - INTERVAL '2 days'),
    (v_riya_id, 'c9-id-01', 0, 1, 0, 0, 'available', false, false, true, NOW() - INTERVAL '2 days'),
    (v_riya_id, 'c10-quad-01', 40, 1, 1, 2, 'in_progress', true, false, true, NOW() - INTERVAL '1 day');

  INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
  VALUES
    (v_riya_id, 'diagnostic', 'c10-ch04', 4, 10, true, NOW() - INTERVAL '2 days'),
    (v_riya_id, 'worksheet', 'c10-quad-01', 2, 5, true, NOW() - INTERVAL '1 day');

  INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
  VALUES
    (v_riya_id, v_class_id, 50, 'diagnostic_completion', 'riya_diag_c10_ch04', true, NOW() - INTERVAL '2 days'),
    (v_riya_id, v_class_id, 20, 'practice', 'riya_prac_c10_quad_01', true, NOW() - INTERVAL '1 day');

  -- ----------------------------------------------------------------------------
  -- 5. SEED AARAV'S DETAILED LEARNING HISTORY (100% MASTERY ACROSS ALL CONCEPTS)
  -- ----------------------------------------------------------------------------
  DELETE FROM public.attempts WHERE student_id = v_aarav_id;
  DELETE FROM public.concept_mastery WHERE student_id = v_aarav_id;
  DELETE FROM public.xp_events WHERE student_id = v_aarav_id;

  INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
  VALUES
    (v_aarav_id, 'c10-quad-01', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '1 day'),
    (v_aarav_id, 'c10-quad-02', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '1 day'),
    (v_aarav_id, 'c9-id-01', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '2 days'),
    (v_aarav_id, 'c9-id-02', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '2 days'),
    (v_aarav_id, 'c8-dist-01', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
    (v_aarav_id, 'c7-int-02', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
    (v_aarav_id, 'c6-neg-01', 100, 3, 5, 0, 'completed', true, true, true, NOW() - INTERVAL '4 days');

  INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
  VALUES
    (v_aarav_id, 'diagnostic', 'c10-ch04', 10, 10, true, NOW() - INTERVAL '3 days'),
    (v_aarav_id, 'test', 'c10-ch04', 10, 10, true, NOW() - INTERVAL '1 day');

  INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
  VALUES
    (v_aarav_id, v_class_id, 100, 'diagnostic_completion', 'aarav_xp_1', true, NOW() - INTERVAL '3 days'),
    (v_aarav_id, v_class_id, 100, 'chapter_test', 'aarav_xp_2', true, NOW() - INTERVAL '1 day'),
    (v_aarav_id, v_class_id, 50, 'first_try', 'aarav_xp_3', true, NOW() - INTERVAL '3 days'),
    (v_aarav_id, v_class_id, 50, 'first_try', 'aarav_xp_4', true, NOW() - INTERVAL '2 days'),
    (v_aarav_id, v_class_id, 50, 'streak_bonus', 'aarav_xp_5', true, NOW() - INTERVAL '2 days'),
    (v_aarav_id, v_class_id, 50, 'practice', 'aarav_xp_6', true, NOW() - INTERVAL '1 day'),
    (v_aarav_id, v_class_id, 50, 'root_gap_resolved', 'aarav_xp_7', true, NOW() - INTERVAL '1 day');

  -- ----------------------------------------------------------------------------
  -- 6. SEED NEW STUDENT (CLEAN EMPTY STATE: 0 ATTEMPTS, 0 MASTERY, 0 XP)
  -- ----------------------------------------------------------------------------
  DELETE FROM public.attempts WHERE student_id = v_new_id;
  DELETE FROM public.concept_mastery WHERE student_id = v_new_id;
  DELETE FROM public.xp_events WHERE student_id = v_new_id;

  -- ----------------------------------------------------------------------------
  -- 7. SEED 25 SYNTHETIC CLASSMATES ENROLLED IN CLASS 10-A (DEMO)
  --    Mastery Clusters:
  --      - First 7 students (+ Riya = 8 students): weak c7-int-02 and weak c10-quad-01
  --      - Next 5 students: weak c8-exp-01
  --      - Remaining 13 students: solid across all topics
  -- ----------------------------------------------------------------------------
  FOR i IN 1..25 LOOP
    v_synth_email := 'synth_' || LPAD(i::TEXT, 2, '0') || '@student.margam.local';
    v_synth_username := 'synth_' || LPAD(i::TEXT, 2, '0');
    v_synth_name := v_synth_names[i];

    -- Look up or create auth.users entry for synthetic classmate
    SELECT id INTO v_synth_id FROM auth.users WHERE LOWER(email) = LOWER(v_synth_email);
    IF v_synth_id IS NULL THEN
      v_synth_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
      ) VALUES (
        v_synth_id, '00000000-0000-0000-0000-000000000000', v_synth_email, '', NOW(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('full_name', v_synth_name, 'username', v_synth_username),
        NOW(), NOW(), 'authenticated', 'authenticated'
      );
    END IF;

    -- Upsert profile for synthetic classmate
    INSERT INTO public.profiles (id, role, username, full_name, selected_class, consent_confirmed, avatar_pixel, is_demo, updated_at)
    VALUES (
      v_synth_id, 'student', v_synth_username, v_synth_name, 10, true,
      CASE WHEN i > 12 THEN 'gold_scholar' WHEN i > 7 THEN 'stone_scholar' ELSE 'wood_scholar' END,
      true, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = v_synth_name,
      username = v_synth_username,
      selected_class = 10,
      consent_confirmed = true,
      is_demo = true,
      updated_at = NOW();

    -- Enroll in Class 10-A (Demo)
    INSERT INTO public.class_members (class_id, student_id, is_demo, joined_at)
    VALUES (v_class_id, v_synth_id, true, NOW() - INTERVAL '5 days')
    ON CONFLICT (class_id, student_id) DO UPDATE SET is_demo = true;

    -- Clean existing progress for idempotency
    DELETE FROM public.attempts WHERE student_id = v_synth_id;
    DELETE FROM public.concept_mastery WHERE student_id = v_synth_id;
    DELETE FROM public.xp_events WHERE student_id = v_synth_id;

    -- Apply Mastery Clusters
    IF i <= 7 THEN
      -- Cluster 1: 7 students (+ Riya = 8) with weak c7-int-02 and weak c10-quad-01
      INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
      VALUES
        (v_synth_id, 'c6-neg-01', 80, 2, 2, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
        (v_synth_id, 'c7-int-02', 32 + (i * 2), 1, 0, 2, 'available', false, false, true, NOW() - INTERVAL '2 days'),
        (v_synth_id, 'c8-dist-01', 45, 1, 1, 1, 'in_progress', false, false, true, NOW() - INTERVAL '2 days'),
        (v_synth_id, 'c10-quad-01', 38 + (i * 2), 1, 1, 2, 'in_progress', true, false, true, NOW() - INTERVAL '1 day');

      INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
      VALUES (v_synth_id, 'diagnostic', 'c10-ch04', 4, 10, true, NOW() - INTERVAL '2 days');

      INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
      VALUES (v_synth_id, v_class_id, 50, 'diagnostic_completion', 'synth_' || i || '_xp_1', true, NOW() - INTERVAL '2 days');

    ELSIF i <= 12 THEN
      -- Cluster 2: 5 students with weak c8-exp-01 (Powers & Exponents)
      INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
      VALUES
        (v_synth_id, 'c7-int-02', 88, 2, 3, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
        (v_synth_id, 'c8-exp-01', 28 + (i * 2), 1, 0, 2, 'available', false, false, true, NOW() - INTERVAL '2 days'),
        (v_synth_id, 'c10-quad-01', 65, 2, 2, 1, 'in_progress', true, true, true, NOW() - INTERVAL '1 day');

      INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
      VALUES (v_synth_id, 'diagnostic', 'c10-ch04', 6, 10, true, NOW() - INTERVAL '2 days');

      INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
      VALUES (v_synth_id, v_class_id, 75, 'diagnostic_completion', 'synth_' || i || '_xp_1', true, NOW() - INTERVAL '2 days');

    ELSE
      -- Cluster 3: 13 students solid across all topics
      INSERT INTO public.concept_mastery (student_id, concept_id, mastery, difficulty, consecutive_correct, consecutive_incorrect, status, lesson_completed, worksheet_completed, is_demo, last_attempt_at)
      VALUES
        (v_synth_id, 'c6-neg-01', 95, 3, 4, 0, 'completed', true, true, true, NOW() - INTERVAL '4 days'),
        (v_synth_id, 'c7-int-02', 92, 3, 4, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
        (v_synth_id, 'c8-dist-01', 90, 3, 3, 0, 'completed', true, true, true, NOW() - INTERVAL '3 days'),
        (v_synth_id, 'c9-id-01', 94, 3, 4, 0, 'completed', true, true, true, NOW() - INTERVAL '2 days'),
        (v_synth_id, 'c10-quad-01', 92, 3, 4, 0, 'completed', true, true, true, NOW() - INTERVAL '1 day'),
        (v_synth_id, 'c10-quad-02', 88, 2, 3, 0, 'completed', true, true, true, NOW() - INTERVAL '1 day');

      INSERT INTO public.attempts (student_id, type, identifier, score, total, is_demo, created_at)
      VALUES
        (v_synth_id, 'diagnostic', 'c10-ch04', 9, 10, true, NOW() - INTERVAL '3 days'),
        (v_synth_id, 'test', 'c10-ch04', 9, 10, true, NOW() - INTERVAL '1 day');

      INSERT INTO public.xp_events (student_id, class_id, amount, reason, idempotency_key, is_demo, created_at)
      VALUES
        (v_synth_id, v_class_id, 100, 'diagnostic_completion', 'synth_' || i || '_xp_1', true, NOW() - INTERVAL '3 days'),
        (v_synth_id, v_class_id, 80, 'chapter_test', 'synth_' || i || '_xp_2', true, NOW() - INTERVAL '1 day');
    END IF;
  END LOOP;

  RAISE NOTICE 'Margam demo seed completed successfully for Class 10-A (DEMO10A).';
END $$;

COMMIT;


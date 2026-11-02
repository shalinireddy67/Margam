-- ==============================================================================
-- MARGAM — CONSOLIDATED PRODUCTION DATABASE SETUP (ONE-CLICK EXECUTION)
-- Version: 2026-11-02-Final
-- Target: Supabase PostgreSQL 15+
--
-- This script safely, idempotently, and atomically initializes the complete
-- Margam database with all tables, constraints, indexes, RLS policies,
-- immutability triggers, and security-definer functions in their final,
-- hardened state.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BASE TABLES & SCHEMAS
-- ------------------------------------------------------------------------------

-- 1.1 PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  selected_class SMALLINT CHECK (selected_class BETWEEN 6 AND 10),
  recovery_code_hash TEXT,
  consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  opt_out_leaderboard BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_pixel TEXT DEFAULT 'wood_scholar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 CLASSES TABLE (Created & owned by Teachers)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 10),
  class_code TEXT NOT NULL UNIQUE,
  leaderboard_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.3 CLASS_MEMBERS TABLE (Students enrolled in a Class)
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hidden_by_teacher BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

-- 1.4 ATTEMPTS TABLE (Diagnostics, Worksheets, Chapter Tests)
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('diagnostic', 'worksheet', 'test')),
  identifier TEXT NOT NULL,
  score NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.5 CONCEPT_MASTERY TABLE (Granular Progress per Concept)
CREATE TABLE IF NOT EXISTS public.concept_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  mastery NUMERIC NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  difficulty SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  consecutive_correct SMALLINT NOT NULL DEFAULT 0,
  consecutive_incorrect SMALLINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  lesson_completed BOOLEAN NOT NULL DEFAULT FALSE,
  worksheet_completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_concept UNIQUE (student_id, concept_id)
);

-- 1.6 XP_EVENTS TABLE (Append-Only Ledger, Server Written via service_role)
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  reason TEXT NOT NULL CHECK (reason IN (
    'correct_answer',
    'first_try',
    'diagnostic_completion',
    'chapter_test',
    'root_gap_resolved',
    'streak_bonus',
    'practice'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  idempotency_key TEXT UNIQUE
);

-- ------------------------------------------------------------------------------
-- 2. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_members_class_id ON public.class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student_id ON public.class_members(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student_id ON public.attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_student_id ON public.concept_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_student_created ON public.xp_events(student_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL 6 TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. PROFILE IMMUTABILITY & ROLE TAMPERING PREVENTION TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Service role and database administrators are permitted to perform trusted updates
  IF (auth.jwt() ->> 'role') = 'service_role'
     OR current_user = 'service_role'
     OR current_user = 'postgres'
     OR current_setting('role', true) = 'service_role' THEN
    NEW.updated_at = NOW();
    RETURN NEW;
  END IF;

  -- Block any non-service_role attempt to change profile ID
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Changing profile ID is strictly prohibited' USING ERRCODE = '42501';
  END IF;

  -- Block any non-service_role attempt to change role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Privilege escalation rejected: modifying profile role is prohibited (attempted % -> %)', OLD.role, NEW.role
      USING ERRCODE = '42501';
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_immutability ON public.profiles;
CREATE TRIGGER trg_protect_profile_immutability
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_immutability();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY POLICIES
-- ------------------------------------------------------------------------------

-- 5.1 PROFILES POLICIES
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_teacher_scoped" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_student_only" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_teacher_scoped"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "profiles_insert_student_only"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'student'
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5.2 CLASSES POLICIES
DROP POLICY IF EXISTS "classes_teacher_manage" ON public.classes;
DROP POLICY IF EXISTS "classes_student_view_enrolled" ON public.classes;

CREATE POLICY "classes_teacher_manage"
  ON public.classes FOR ALL
  TO authenticated
  USING (
    teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  )
  WITH CHECK (
    teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "classes_student_view_enrolled"
  ON public.classes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      WHERE cm.class_id = classes.id
        AND cm.student_id = auth.uid()
    )
  );

-- 5.3 CLASS_MEMBERS POLICIES
DROP POLICY IF EXISTS "class_members_student_select" ON public.class_members;
DROP POLICY IF EXISTS "class_members_teacher_manage" ON public.class_members;
DROP POLICY IF EXISTS "class_members_student_insert" ON public.class_members;

CREATE POLICY "class_members_student_select"
  ON public.class_members FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "class_members_teacher_manage"
  ON public.class_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 5.4 ATTEMPTS POLICIES (SELECT-ONLY FOR STUDENTS, SERVER-WRITTEN)
DROP POLICY IF EXISTS "attempts_student_all" ON public.attempts;
DROP POLICY IF EXISTS "attempts_student_select_own" ON public.attempts;
DROP POLICY IF EXISTS "attempts_teacher_select_scoped" ON public.attempts;

CREATE POLICY "attempts_student_select_own"
  ON public.attempts FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "attempts_teacher_select_scoped"
  ON public.attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = attempts.student_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 5.5 CONCEPT_MASTERY POLICIES (SELECT-ONLY FOR STUDENTS, SERVER-WRITTEN)
DROP POLICY IF EXISTS "concept_mastery_student_all" ON public.concept_mastery;
DROP POLICY IF EXISTS "concept_mastery_student_select_own" ON public.concept_mastery;
DROP POLICY IF EXISTS "concept_mastery_teacher_select_scoped" ON public.concept_mastery;

CREATE POLICY "concept_mastery_student_select_own"
  ON public.concept_mastery FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "concept_mastery_teacher_select_scoped"
  ON public.concept_mastery FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = concept_mastery.student_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 5.6 XP_EVENTS POLICIES (SELECT-ONLY FOR STUDENTS & TEACHERS, SERVICE_ROLE WRITTEN)
DROP POLICY IF EXISTS "xp_events_student_select_own" ON public.xp_events;
DROP POLICY IF EXISTS "xp_events_teacher_select_scoped" ON public.xp_events;

CREATE POLICY "xp_events_student_select_own"
  ON public.xp_events FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "xp_events_teacher_select_scoped"
  ON public.xp_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.classes c
      WHERE c.id = xp_events.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 6. FUNCTIONS, VIEWS & SECURE RPCS
-- ------------------------------------------------------------------------------

-- 6.1 HELPER: IST Week Start (Monday 00:00:00 IST)
CREATE OR REPLACE FUNCTION public.get_current_week_start_ist()
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT (date_trunc('week', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata');
$$;

-- 6.2 CLASS_WEEKLY_LEADERBOARD VIEW
CREATE OR REPLACE VIEW public.class_weekly_leaderboard AS
SELECT
  cm.class_id,
  cm.student_id,
  COALESCE(p.username, 'Student ' || SUBSTRING(cm.student_id::TEXT, 1, 4)) AS display_name,
  COALESCE(p.avatar_pixel, 'wood_scholar') AS avatar_pixel,
  COALESCE(SUM(xe.amount), 0)::INTEGER AS weekly_xp,
  DENSE_RANK() OVER (
    PARTITION BY cm.class_id
    ORDER BY COALESCE(SUM(xe.amount), 0) DESC
  ) AS rank_position
FROM public.class_members cm
JOIN public.classes c ON cm.class_id = c.id
JOIN public.profiles p ON cm.student_id = p.id
LEFT JOIN public.xp_events xe ON (
  xe.student_id = cm.student_id
  AND (xe.class_id = cm.class_id OR xe.class_id IS NULL)
  AND xe.created_at >= public.get_current_week_start_ist()
)
WHERE c.leaderboard_enabled = TRUE
  AND cm.hidden_by_teacher = FALSE
  AND p.opt_out_leaderboard = FALSE
GROUP BY
  cm.class_id,
  cm.student_id,
  p.username,
  p.avatar_pixel;

-- 6.3 SECURE LEADERBOARD RPC
CREATE OR REPLACE FUNCTION public.get_class_leaderboard(target_class_id UUID)
RETURNS TABLE (
  student_id UUID,
  display_name TEXT,
  avatar_pixel TEXT,
  weekly_xp INTEGER,
  rank_position BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  calling_user UUID := auth.uid();
  is_authorized BOOLEAN := FALSE;
BEGIN
  IF calling_user IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.classes c
    LEFT JOIN public.class_members cm ON c.id = cm.class_id
    WHERE c.id = target_class_id
      AND (c.teacher_id = calling_user OR cm.student_id = calling_user)
  ) INTO is_authorized;

  IF NOT is_authorized THEN
    RAISE EXCEPTION 'Access denied: not a member of class %', target_class_id USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    cwl.student_id,
    cwl.display_name,
    cwl.avatar_pixel,
    cwl.weekly_xp,
    cwl.rank_position
  FROM public.class_weekly_leaderboard cwl
  WHERE cwl.class_id = target_class_id
  ORDER BY cwl.rank_position ASC, cwl.weekly_xp DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_class_leaderboard(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_class_leaderboard(UUID) TO authenticated;

-- 6.4 SECURE CLASS JOINING VIA CLASS CODE RPC
CREATE OR REPLACE FUNCTION public.join_class_with_code(p_class_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_student_id UUID := auth.uid();
  v_student_grade SMALLINT;
  v_class_id UUID;
  v_class_grade SMALLINT;
  v_class_name TEXT;
BEGIN
  IF v_student_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;

  -- Verify student role and grade
  SELECT selected_class INTO v_student_grade
  FROM public.profiles
  WHERE id = v_student_id AND role = 'student';

  IF v_student_grade IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only registered students can join classes');
  END IF;

  -- Lookup class by sanitized code
  SELECT id, grade, name INTO v_class_id, v_class_grade, v_class_name
  FROM public.classes
  WHERE UPPER(TRIM(class_code)) = UPPER(TRIM(p_class_code));

  IF v_class_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid class code. Please check with your teacher.');
  END IF;

  -- Ensure grade matches
  IF v_class_grade <> v_student_grade THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Class code is for Class %s, but your profile is registered in Class %s.', v_class_grade, v_student_grade)
    );
  END IF;

  -- Enroll student (idempotent via uq_class_student constraint)
  INSERT INTO public.class_members (class_id, student_id, joined_at)
  VALUES (v_class_id, v_student_id, NOW())
  ON CONFLICT (class_id, student_id) DO NOTHING;

  RETURN jsonb_build_object(
    'success', true,
    'class_id', v_class_id,
    'class_name', v_class_name,
    'grade', v_class_grade
  );
END;
$$;

REVOKE ALL ON FUNCTION public.join_class_with_code(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_class_with_code(TEXT) TO authenticated;


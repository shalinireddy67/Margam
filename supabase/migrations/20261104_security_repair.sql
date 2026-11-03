-- ==============================================================================
-- MARGAM SECURITY REPAIR MIGRATION: 20261104_security_repair.sql
-- Fixes privilege escalation, unauthorized role changes, arbitrary class joins,
-- mutable search paths, and locks down direct client writes to scores and mastery tables.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILE IMMUTABILITY & ROLE TAMPERING PREVENTION (TRIGGER)
-- ------------------------------------------------------------------------------
-- Prohibits non-service_role users from changing their 'role' or 'id'.
CREATE OR REPLACE FUNCTION public.protect_profile_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- If invoked by service_role or database admin, permit trusted updates
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
-- 2. REVISE PROFILES RLS POLICIES
-- ------------------------------------------------------------------------------
-- Drop insecure existing policies
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_student_only" ON public.profiles;

-- Secure INSERT: Direct client inserts can ONLY create 'student' accounts.
-- Teacher accounts MUST be provisioned by trusted server operations (service_role).
CREATE POLICY "profiles_insert_student_only"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'student'
  );

-- Secure UPDATE: Users can update own profile (role and id immutability enforced by trigger)
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. REVISE CLASSES RLS POLICIES (TEACHER OWNERSHIP ONLY)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "classes_teacher_manage" ON public.classes;

CREATE POLICY "classes_teacher_manage"
  ON public.classes
  FOR ALL
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

-- ------------------------------------------------------------------------------
-- 4. SECURE CLASS JOINING VIA CLASS CODE (PREVENT ARBITRARY CLASS INSERTION)
-- ------------------------------------------------------------------------------
-- Drop the insecure policy that allowed students to insert any class_id
DROP POLICY IF EXISTS "class_members_student_insert" ON public.class_members;

-- Secure class join function with validation:
-- 1. Caller must be an authenticated student.
-- 2. Class code must match an active class.
-- 3. Class grade must match student's selected_class.
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

-- Restrict function execution strictly to authenticated users
REVOKE ALL ON FUNCTION public.join_class_with_code(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_class_with_code(TEXT) TO authenticated;

-- ------------------------------------------------------------------------------
-- 5. LOCK DOWN DIRECT CLIENT WRITES TO ATTEMPTS & CONCEPT_MASTERY
-- ------------------------------------------------------------------------------
-- Drop insecure FOR ALL policies
DROP POLICY IF EXISTS "attempts_student_all" ON public.attempts;
DROP POLICY IF EXISTS "concept_mastery_student_all" ON public.concept_mastery;
DROP POLICY IF EXISTS "attempts_student_select_own" ON public.attempts;
DROP POLICY IF EXISTS "concept_mastery_student_select_own" ON public.concept_mastery;

-- Students can ONLY SELECT their own attempts (writes must go through server grading engine)
CREATE POLICY "attempts_student_select_own"
  ON public.attempts
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Students can ONLY SELECT their own mastery records
CREATE POLICY "concept_mastery_student_select_own"
  ON public.concept_mastery
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 6. HARDEN LEADERBOARD RPC SEARCH PATH & GRANTS
-- ------------------------------------------------------------------------------
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

  -- Verify calling user is either enrolled student OR class teacher
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

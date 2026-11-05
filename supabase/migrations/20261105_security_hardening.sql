-- ==============================================================================
-- MARGAM SECURITY HARDENING MIGRATION: 20261105_security_hardening.sql
-- Enforces:
-- 1. Profile immutability trigger for role, is_demo, consent_confirmed, and recovery_code_hash
-- 2. Scoped teacher SELECT, UPDATE, DELETE policies on class_members (no teacher INSERT)
-- 3. Trigger blocking class_members student_id and class_id mutation by non-service_role
-- 4. Revocation of anonymous grants on class_weekly_leaderboard
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILE IMMUTABILITY & PRIVILEGE ESCALATION PREVENTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- When auth.uid() is NULL (service_role, SQL editor, seeders), allow trusted backend updates
  IF auth.uid() IS NULL THEN
    NEW.updated_at = NOW();
    RETURN NEW;
  END IF;

  -- Block non-service_role attempt to change profile ID
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Changing profile ID is strictly prohibited' USING ERRCODE = '42501';
  END IF;

  -- Block non-service_role attempt to change role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Privilege escalation rejected: modifying profile role is prohibited (attempted % -> %)', OLD.role, NEW.role
      USING ERRCODE = '42501';
  END IF;

  -- Block non-service_role attempt to modify is_demo flag
  IF NEW.is_demo IS DISTINCT FROM OLD.is_demo THEN
    RAISE EXCEPTION 'Modifying is_demo flag is strictly prohibited' USING ERRCODE = '42501';
  END IF;

  -- Block non-service_role attempt to modify consent_confirmed
  IF NEW.consent_confirmed IS DISTINCT FROM OLD.consent_confirmed THEN
    RAISE EXCEPTION 'Modifying consent_confirmed status is strictly prohibited' USING ERRCODE = '42501';
  END IF;

  -- Block non-service_role attempt to modify recovery_code_hash
  IF NEW.recovery_code_hash IS DISTINCT FROM OLD.recovery_code_hash THEN
    RAISE EXCEPTION 'Modifying recovery_code_hash is strictly prohibited' USING ERRCODE = '42501';
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
-- 2. TEACHER SCOPED RLS POLICIES ON CLASS_MEMBERS (NO TEACHER INSERT)
-- ------------------------------------------------------------------------------
-- Drop all existing broad management policies
DROP POLICY IF EXISTS "class_members_teacher_manage" ON public.class_members;
DROP POLICY IF EXISTS "class_members_teacher_select" ON public.class_members;
DROP POLICY IF EXISTS "class_members_teacher_update" ON public.class_members;
DROP POLICY IF EXISTS "class_members_teacher_delete" ON public.class_members;

-- Teacher SELECT: Teachers may only view members in their own classes
CREATE POLICY "class_members_teacher_select"
  ON public.class_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Teacher UPDATE: Teachers may update members in their own classes (e.g. toggle hidden_by_teacher)
CREATE POLICY "class_members_teacher_update"
  ON public.class_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Teacher DELETE: Teachers may remove members from their own classes
CREATE POLICY "class_members_teacher_delete"
  ON public.class_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_members.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Note: No teacher INSERT policy is defined. Students join via join_class_with_code or server route.

-- ------------------------------------------------------------------------------
-- 3. CLASS_MEMBERS IMMUTABILITY TRIGGER (STUDENT_ID & CLASS_ID)
-- ------------------------------------------------------------------------------
-- Blocks changes to student_id and class_id when auth.uid() is present.
-- Teachers may still modify hidden_by_teacher.
CREATE OR REPLACE FUNCTION public.protect_class_member_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    IF NEW.student_id IS DISTINCT FROM OLD.student_id THEN
      RAISE EXCEPTION 'Modifying student_id in class_members is strictly prohibited' USING ERRCODE = '42501';
    END IF;
    IF NEW.class_id IS DISTINCT FROM OLD.class_id THEN
      RAISE EXCEPTION 'Modifying class_id in class_members is strictly prohibited' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_class_member_immutability ON public.class_members;
CREATE TRIGGER trg_protect_class_member_immutability
  BEFORE UPDATE ON public.class_members
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_class_member_immutability();

-- ------------------------------------------------------------------------------
-- 4. REVOKE ANONYMOUS ACCESS TO CLASS_WEEKLY_LEADERBOARD
-- ------------------------------------------------------------------------------
REVOKE ALL ON public.class_weekly_leaderboard FROM anon;
GRANT SELECT ON public.class_weekly_leaderboard TO authenticated;


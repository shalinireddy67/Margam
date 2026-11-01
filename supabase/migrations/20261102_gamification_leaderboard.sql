-- ==============================================================================
-- MARGAM DATABASE MIGRATION: 20261102_gamification_leaderboard.sql
-- Gamification, XP events ledger, privacy controls, and class-scoped weekly leaderboard
-- ==============================================================================

-- 1. Extend profiles with opt_out_leaderboard
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS opt_out_leaderboard BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS avatar_pixel TEXT DEFAULT 'wood_scholar';

-- 2. Extend classes with leaderboard_enabled toggle
ALTER TABLE public.classes
  ADD COLUMN IF NOT EXISTS leaderboard_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. Extend class_members with hidden_by_teacher toggle
ALTER TABLE public.class_members
  ADD COLUMN IF NOT EXISTS hidden_by_teacher BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. XP_EVENTS TABLE (Append-only ledger, strictly server-written via service_role)
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

-- Enable RLS on xp_events
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

-- Direct writes by students or teachers are strictly disallowed.
-- ONLY backend server with service_role can INSERT/UPDATE/DELETE.
-- Students can read only their own XP events:
CREATE POLICY "xp_events_student_select_own"
  ON public.xp_events
  FOR SELECT
  USING (student_id = auth.uid());

-- Teachers can read XP events of enrolled students in classes they own:
CREATE POLICY "xp_events_teacher_select_scoped"
  ON public.xp_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.classes c
      WHERE c.id = xp_events.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- 5. Helper Function: Get Start of Current Week in IST (Monday 00:00:00 IST)
CREATE OR REPLACE FUNCTION public.get_current_week_start_ist()
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
AS $$
  -- Convert NOW() to Asia/Kolkata (UTC+5:30) and find preceding Monday at 00:00
  SELECT (date_trunc('week', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata');
$$;

-- 6. CLASS_WEEKLY_LEADERBOARD VIEW
-- Aggregates weekly XP strictly within Monday 00:00 IST reset window.
-- Enforces privacy filters:
-- - Excludes students where opt_out_leaderboard = true
-- - Excludes students where hidden_by_teacher = true
-- - Excludes classes where leaderboard_enabled = false
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

-- 7. Secure Leaderboard RPC with Strict Class-Membership RLS check
-- Students can ONLY query the leaderboard of a class they belong to.
-- Teachers can ONLY query the leaderboard of a class they own.
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
AS $$
DECLARE
  calling_user UUID := auth.uid();
  is_authorized BOOLEAN := FALSE;
BEGIN
  -- Verify calling user is either enrolled student OR class teacher
  SELECT EXISTS (
    SELECT 1
    FROM public.classes c
    LEFT JOIN public.class_members cm ON c.id = cm.class_id
    WHERE c.id = target_class_id
      AND (c.teacher_id = calling_user OR cm.student_id = calling_user)
  ) INTO is_authorized;

  IF NOT is_authorized THEN
    RAISE EXCEPTION 'Access denied: not a member of class %', target_class_id;
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


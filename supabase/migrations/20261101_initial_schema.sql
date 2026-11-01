-- ==============================================================================
-- MARGAM DATABASE MIGRATION: 20261101_initial_schema.sql
-- Core schemas: profiles, classes, class_members, attempts, concept_mastery
-- Row-Level Security: Student self-isolation & Teacher scoped access
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  selected_class SMALLINT CHECK (selected_class BETWEEN 6 AND 10),
  recovery_code_hash TEXT,
  consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CLASSES TABLE (Created & owned by Teachers)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 10),
  class_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CLASS_MEMBERS TABLE (Students enrolled in a Class)
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

-- 4. ATTEMPTS TABLE (Diagnostics, Worksheets, Chapter Tests)
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('diagnostic', 'worksheet', 'test')),
  identifier TEXT NOT NULL,
  score NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CONCEPT_MASTERY TABLE (Granular Progress per Concept)
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

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- A. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- 1. Student / Teacher can read own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Teacher can read profiles of students enrolled in their classes
CREATE POLICY "profiles_select_teacher_scoped"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

-- 3. Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Insert allowed for self (during sign-up)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- B. CLASSES POLICIES
-- ------------------------------------------------------------------------------
-- 1. Teacher can manage their own classes (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "classes_teacher_manage"
  ON public.classes
  FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- 2. Student can view classes they are enrolled in
CREATE POLICY "classes_student_view_enrolled"
  ON public.classes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      WHERE cm.class_id = classes.id
        AND cm.student_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- C. CLASS_MEMBERS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Student can view their own membership
CREATE POLICY "class_members_student_select"
  ON public.class_members
  FOR SELECT
  USING (student_id = auth.uid());

-- 2. Student can join a class (INSERT own student_id)
CREATE POLICY "class_members_student_insert"
  ON public.class_members
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- 3. Teacher can view and manage members in classes they own
CREATE POLICY "class_members_teacher_manage"
  ON public.class_members
  FOR ALL
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

-- ------------------------------------------------------------------------------
-- D. ATTEMPTS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Student can read and write only their own attempts
CREATE POLICY "attempts_student_all"
  ON public.attempts
  FOR ALL
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 2. Teacher can read attempts of students in their own classes
CREATE POLICY "attempts_teacher_select_scoped"
  ON public.attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = attempts.student_id
        AND c.teacher_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- E. CONCEPT_MASTERY POLICIES
-- ------------------------------------------------------------------------------
-- 1. Student can read and write only their own concept mastery
CREATE POLICY "concept_mastery_student_all"
  ON public.concept_mastery
  FOR ALL
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 2. Teacher can read concept mastery of students in their own classes
CREATE POLICY "concept_mastery_teacher_select_scoped"
  ON public.concept_mastery
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_members cm
      JOIN public.classes c ON cm.class_id = c.id
      WHERE cm.student_id = concept_mastery.student_id
        AND c.teacher_id = auth.uid()
    )
  );

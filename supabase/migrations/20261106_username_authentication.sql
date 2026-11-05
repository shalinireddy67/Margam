-- ==============================================================================
-- MARGAM DATABASE MIGRATION: 20261106_username_authentication.sql
-- Enforces case-insensitive username uniqueness on profiles
-- Provides safe backfill for existing legacy Gmail/email-based accounts
-- Preserves all existing IDs, progress, classes, and RLS policies
-- ==============================================================================

-- 1. Ensure case-insensitive uniqueness index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower 
  ON public.profiles (LOWER(username)) 
  WHERE username IS NOT NULL;

-- 2. Safe idempotent backfill for legacy accounts with NULL username
-- Extracts prefix before '@' from auth.users.email, lowercases it, and assigns
-- only if no collision exists with an existing username.
DO $$
DECLARE
  rec RECORD;
  base_user TEXT;
  candidate_user TEXT;
  suffix INT;
BEGIN
  FOR rec IN 
    SELECT p.id, u.email 
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE p.username IS NULL AND u.email IS NOT NULL
  LOOP
    base_user := LOWER(SPLIT_PART(rec.email, '@', 1));
    base_user := REGEXP_REPLACE(base_user, '[^a-z0-9_-]', '', 'g');
    IF LENGTH(base_user) < 3 THEN
      base_user := 'usr_' || SUBSTRING(rec.id::text, 1, 6);
    END IF;

    candidate_user := base_user;
    suffix := 1;

    -- Avoid collision
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = candidate_user) LOOP
      candidate_user := base_user || suffix::text;
      suffix := suffix + 1;
    END LOOP;

    UPDATE public.profiles
    SET username = candidate_user,
        updated_at = NOW()
    WHERE id = rec.id;
  END LOOP;
END $$;


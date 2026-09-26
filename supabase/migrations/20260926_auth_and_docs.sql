-- =============================================================================
-- ExamPilot: Firebase → Supabase migration
-- Migration: 20260926_auth_and_docs.sql
--
-- Run this in the Supabase SQL Editor (or `supabase db push`) for project
-- beahwfkpgplnccrszjvl. It creates:
--   1. public.profiles       — one row per signed-in student (UserProfile JSON)
--   2. public.app_docs       — generic JSON document store replacing the
--                              Firestore collections (test_drafts,
--                              test_submissions, syllabi, learned_modules,
--                              custom_questions)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  uid        TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Reads are open to match the exposure of the existing content tables: the
-- passcode-gated admin app reads the full student roster with the anon key and
-- has no Supabase session. NOTE: this inherits the same caveat already flagged
-- in the security audit — tightening reads requires server-side admin auth.
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Writes are owner-only: a signed-in student can only touch their own profile.
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = uid);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::text = uid)
  WITH CHECK (auth.uid()::text = uid);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid()::text = uid);

-- ---------------------------------------------------------------------------
-- 2. app_docs — Firestore-style documents: (collection, doc_id) → data jsonb
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_docs (
  collection  TEXT NOT NULL,
  doc_id     TEXT NOT NULL,
  user_id    TEXT,
  sort_key   TEXT,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection, doc_id)
);

CREATE INDEX IF NOT EXISTS idx_app_docs_collection ON public.app_docs (collection);
CREATE INDEX IF NOT EXISTS idx_app_docs_user       ON public.app_docs (user_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_sort       ON public.app_docs (collection, sort_key DESC);

ALTER TABLE public.app_docs ENABLE ROW LEVEL SECURITY;

-- Reads are open (parity with the existing content tables: the admin app and
-- cross-device history views read with the anon key and no session).
DROP POLICY IF EXISTS "app_docs_read_all" ON public.app_docs;
CREATE POLICY "app_docs_read_all"
  ON public.app_docs FOR SELECT
  USING (true);

-- Admin-managed content collections stay writable by the passcode-gated admin
-- app, which has no Supabase session (same posture as questions/papers/mocks).
DROP POLICY IF EXISTS "app_docs_write_admin_content" ON public.app_docs;
CREATE POLICY "app_docs_write_admin_content"
  ON public.app_docs FOR ALL
  USING (collection IN ('syllabi', 'custom_questions', 'learned_modules'))
  WITH CHECK (collection IN ('syllabi', 'custom_questions', 'learned_modules'));

-- Everything else is user-owned: only the signed-in owner may write, and the
-- row must carry their uid. Signed-out writers fail RLS and fall back to the
-- services' LocalStorage cache, which is the designed offline path.
DROP POLICY IF EXISTS "app_docs_write_owner" ON public.app_docs;
CREATE POLICY "app_docs_write_owner"
  ON public.app_docs FOR ALL
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid()::text);

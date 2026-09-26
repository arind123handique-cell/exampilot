-- =============================================================================
-- ExamPilot: student-uploaded papers + duplicate-question detection
-- Migration: 20260927_student_papers_and_dedupe.sql
--
-- 1. `questions.stem_hash` — normalised stem fingerprint written by the app so
--    an uploaded paper can be checked against the bank without re-reading
--    every stem. Non-unique on purpose: the client also re-checks against the
--    full stem set, and a unique index would fail on any pre-existing duplicate.
-- 2. `app_docs` read policy tightened: student-owned collections (test drafts,
--    test submissions, student_papers) become owner-only reads. Admin content
--    collections stay publicly readable, which is what the passcode-gated admin
--    app needs with the anon key.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Duplicate detection support
-- ---------------------------------------------------------------------------
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS stem_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_questions_stem_hash ON public.questions (stem_hash);

-- ---------------------------------------------------------------------------
-- 2. app_docs read policy: content collections public, user rows private
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "app_docs_read_all" ON public.app_docs;
DROP POLICY IF EXISTS "app_docs_read" ON public.app_docs;

CREATE POLICY "app_docs_read"
  ON public.app_docs FOR SELECT
  USING (
    collection IN ('syllabi', 'custom_questions', 'learned_modules')
    OR user_id = auth.uid()::text
  );

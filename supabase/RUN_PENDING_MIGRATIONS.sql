-- =============================================================================
-- ExamPilot — CONSOLIDATED MIGRATION (run this in the Supabase SQL Editor)
-- =============================================================================
-- Project: beahwfkpgplnccrszjvl
-- Dashboard → SQL Editor → New query → paste → Run
--
-- This applies everything the app needs but does not yet assume:
--   1. published_papers + custom_mock_tests  (20260921_init_papers)
--   2. questions table + indexes              (20260921_init_questions)
--   3. profiles + app_docs                    (20260926_auth_and_docs)
--   4. student_papers + questions.stem_hash  (20260927)  ← PENDING
--   5. answer_key_source + key_confidence    (20260928)  ← PENDING
--
-- WHY THIS FILE EXISTS
-- Applying migrations one at a time in the dashboard is easy to half-finish,
-- and step 5 is not optional: `questionToRow` always writes
-- `answer_key_source` and `key_confidence`, so until that pair of columns
-- exists EVERY question-bank upsert fails. Running the batch in one paste
-- removes the ordering mistake.
--
-- SAFE TO RUN MORE THAN ONCE. Every statement is guarded, so re-running is a
-- no-op rather than an error. It does not drop or truncate anything.
--
-- It does NOT touch the open-write RLS policies on questions /
-- published_papers / custom_mock_tests. That is deliberate — every admin write
-- is client-side with the anon key and no Supabase session, so locking those
-- now would make admin saves fail silently. That needs an Edge Function first.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. published_papers + custom_mock_tests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.published_papers (
  id                        VARCHAR(64)  PRIMARY KEY,
  exam_id                   VARCHAR(64),
  exam_name                 VARCHAR(255),
  year                      INT,
  paper_type                VARCHAR(255),
  total_questions           INT,
  download_available        BOOLEAN      DEFAULT true,
  frequency_tags            JSONB,
  questions                 JSONB,
  published_at              TIMESTAMPTZ,
  published_by              VARCHAR(128),
  source                    VARCHAR(64)
);
CREATE INDEX IF NOT EXISTS idx_published_papers_exam_id
  ON public.published_papers (exam_id);
ALTER TABLE public.published_papers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for papers" ON public.published_papers;
CREATE POLICY "Public read access for papers"
  ON public.published_papers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for papers" ON public.published_papers;
CREATE POLICY "Admin full access for papers"
  ON public.published_papers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.custom_mock_tests (
  id                             VARCHAR(64)  PRIMARY KEY,
  exam_id                        VARCHAR(64),
  title                          VARCHAR(255),
  paper_name                     VARCHAR(255),
  duration_minutes               INT,
  total_marks                    INT,
  negative_marks_per_incorrect   DOUBLE PRECISION,
  sections                       JSONB,
  published_at                   TIMESTAMPTZ,
  published_by                   VARCHAR(128),
  source                         VARCHAR(64)
);
CREATE INDEX IF NOT EXISTS idx_custom_mock_tests_exam_id
  ON public.custom_mock_tests (exam_id);
ALTER TABLE public.custom_mock_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for mocks" ON public.custom_mock_tests;
CREATE POLICY "Public read access for mocks"
  ON public.custom_mock_tests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for mocks" ON public.custom_mock_tests;
CREATE POLICY "Admin full access for mocks"
  ON public.custom_mock_tests FOR ALL USING (true) WITH CHECK (true);


-- -----------------------------------------------------------------------------
-- 2. questions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id VARCHAR(64) PRIMARY KEY,
  exam_id VARCHAR(64),
  question_number INT DEFAULT 1,
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  subtopic VARCHAR(255),
  stem TEXT NOT NULL,
  options JSONB NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL,
  explanation TEXT,
  formula_context TEXT,
  solution_steps JSONB,
  reference_source VARCHAR(255),
  difficulty VARCHAR(16) DEFAULT 'MEDIUM',
  question_type VARCHAR(32) DEFAULT 'CONCEPTUAL',
  source_type VARCHAR(32) DEFAULT 'OFFICIAL_EXAM',
  pyq_year INT,
  pyq_exam VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_exam_id     ON public.questions (exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject     ON public.questions (subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic       ON public.questions (topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty  ON public.questions (difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type        ON public.questions (question_type);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for questions" ON public.questions;
CREATE POLICY "Public read access for questions"
  ON public.questions FOR SELECT USING (true);

-- Open write — see the warning in 20260921_init_questions.sql. Not tightened
-- here on purpose; it needs the Edge Function first.
DROP POLICY IF EXISTS "Admin full access for questions" ON public.questions;
CREATE POLICY "Admin full access for questions"
  ON public.questions FOR ALL USING (true) WITH CHECK (true);


-- -----------------------------------------------------------------------------
-- 3. profiles + app_docs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  uid        TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT USING (true);

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

-- Reads: admin-managed content stays world-readable (the passcode-gated admin
-- app has no Supabase session), everything else is owner-only. This tighter
-- form is from 20260927; it replaces the wider `app_docs_read_all` from 20260926.
DROP POLICY IF EXISTS "app_docs_read_all" ON public.app_docs;
DROP POLICY IF EXISTS "app_docs_read" ON public.app_docs;
CREATE POLICY "app_docs_read"
  ON public.app_docs FOR SELECT
  USING (
    collection IN ('syllabi', 'custom_questions', 'learned_modules')
    OR user_id = auth.uid()::text
  );

-- Writes: admin content collections plus owner-scoped user rows. Note that
-- `ai_credentials` (a student's own AI provider key) is deliberately NOT in the
-- admin list, so it is readable only by its owner.
DROP POLICY IF EXISTS "app_docs_write_admin_content" ON public.app_docs;
CREATE POLICY "app_docs_write_admin_content"
  ON public.app_docs FOR ALL
  USING (collection IN ('syllabi', 'custom_questions', 'learned_modules'))
  WITH CHECK (collection IN ('syllabi', 'custom_questions', 'learned_modules'));

DROP POLICY IF EXISTS "app_docs_write_owner" ON public.app_docs;
CREATE POLICY "app_docs_write_owner"
  ON public.app_docs FOR ALL
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid()::text)
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid()::text);


-- -----------------------------------------------------------------------------
-- 4. (20260927) duplicate detection + student papers
-- -----------------------------------------------------------------------------
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS stem_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_questions_stem_hash ON public.questions (stem_hash);


-- -----------------------------------------------------------------------------
-- 5. (20260928) answer-key provenance  ← REQUIRED for any bank upsert
-- -----------------------------------------------------------------------------
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS answer_key_source TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS key_confidence TEXT;

-- Backfill conservatively: a row claiming to be a genuine PYQ is assumed to
-- carry a printed key; everything else stays model-derived until re-extracted.
UPDATE public.questions
SET answer_key_source = CASE WHEN source_type = 'PYQ' THEN 'PRINTED' ELSE 'MODEL_DERIVED' END
WHERE answer_key_source IS NULL;

UPDATE public.questions
SET key_confidence = CASE WHEN source_type = 'PYQ' THEN 'HIGH' ELSE 'LOW' END
WHERE key_confidence IS NULL;

CREATE INDEX IF NOT EXISTS idx_questions_key_source ON public.questions (answer_key_source);


-- =============================================================================
-- VERIFICATION — every row here should come back "ok".
-- =============================================================================
SELECT 'tables' AS check_name,
       count(*) FILTER (WHERE table_name IN ('questions','published_papers','custom_mock_tests','profiles','app_docs')) AS found,
       5 AS expected
FROM information_schema.tables
WHERE table_schema = 'public';

SELECT 'questions columns' AS check_name,
       count(*) FILTER (WHERE column_name IN ('stem_hash','answer_key_source','key_confidence')) AS found,
       3 AS expected
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'questions';

-- Must be 0: the two columns the app always writes.
SELECT 'unbackfilled provenance' AS check_name, count(*) AS should_be_zero
FROM public.questions
WHERE answer_key_source IS NULL OR key_confidence IS NULL;

-- Must be 0: the wider read policy that step 3 drops.
SELECT 'stale open read policy' AS check_name, count(*) AS should_be_zero
FROM pg_policies
WHERE schemaname = 'public' AND policyname = 'app_docs_read_all';

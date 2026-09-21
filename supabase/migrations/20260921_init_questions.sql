-- =============================================================================
-- ExamPilot PostgreSQL / Supabase Schema: questions
-- Migration: 20260921_init_questions.sql
-- =============================================================================

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

-- Performance Indexes for CBT Test Engines and Topic Filtering
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);

-- Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all questions for student practice and mock tests
CREATE POLICY "Public read access for questions"
  ON public.questions FOR SELECT
  USING (true);

-- Allow insert/update with service_role or admin client
CREATE POLICY "Admin full access for questions"
  ON public.questions FOR ALL
  USING (true)
  WITH CHECK (true);

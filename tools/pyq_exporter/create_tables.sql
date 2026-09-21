CREATE TABLE IF NOT EXISTS public.published_papers (
  id VARCHAR(64) PRIMARY KEY,
  exam_id VARCHAR(64),
  exam_name VARCHAR(255),
  year INT,
  paper_type VARCHAR(255),
  total_questions INT,
  download_available BOOLEAN DEFAULT true,
  frequency_tags JSONB,
  questions JSONB,
  published_at TIMESTAMPTZ,
  published_by VARCHAR(128),
  source VARCHAR(64)
);
CREATE INDEX IF NOT EXISTS idx_published_papers_exam_id ON public.published_papers(exam_id);
ALTER TABLE public.published_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read access for papers" ON public.published_papers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin full access for papers" ON public.published_papers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.custom_mock_tests (
  id VARCHAR(64) PRIMARY KEY,
  exam_id VARCHAR(64),
  title VARCHAR(255),
  paper_name VARCHAR(255),
  duration_minutes INT,
  total_marks INT,
  negative_marks_per_incorrect DOUBLE PRECISION,
  sections JSONB,
  published_at TIMESTAMPTZ,
  published_by VARCHAR(128),
  source VARCHAR(64)
);
CREATE INDEX IF NOT EXISTS idx_custom_mock_tests_exam_id ON public.custom_mock_tests(exam_id);
ALTER TABLE public.custom_mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read access for mocks" ON public.custom_mock_tests FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin full access for mocks" ON public.custom_mock_tests FOR ALL USING (true) WITH CHECK (true);
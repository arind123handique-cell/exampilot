-- =============================================================================
-- ExamPilot: answer-key provenance
-- Migration: 20260928_answer_key_provenance.sql
--
-- A question whose key was read off the paper is not the same thing as one the
-- model solved. Recording that per question keeps the PYQ archive honest and
-- lets the portal show "verify this answer" where it matters.
--
--   answer_key_source = 'PRINTED'       — the paper itself shows the key
--   answer_key_source = 'MODEL_DERIVED' — the model solved the question
--
-- Safe to run alongside 20260927 (both use IF NOT EXISTS).
-- =============================================================================

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS answer_key_source TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS key_confidence TEXT;

-- Backfill conservatively: a row that claims to be a genuine PYQ is assumed to
-- carry a printed key; everything else is treated as model-derived until it is
-- re-extracted.
UPDATE public.questions
SET answer_key_source = CASE WHEN source_type = 'PYQ' THEN 'PRINTED' ELSE 'MODEL_DERIVED' END
WHERE answer_key_source IS NULL;

UPDATE public.questions
SET key_confidence = CASE WHEN source_type = 'PYQ' THEN 'HIGH' ELSE 'LOW' END
WHERE key_confidence IS NULL;

CREATE INDEX IF NOT EXISTS idx_questions_key_source ON public.questions (answer_key_source);

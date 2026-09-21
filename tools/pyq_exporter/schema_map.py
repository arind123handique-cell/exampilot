#!/usr/bin/env python3
"""Map the exporter's camelCase paper/mock/question dicts to the Supabase schema.

The `questions` table already exists in the project (see
supabase/migrations/20260921_init_questions.sql) with snake_case columns, while the
exporter builds camelCase objects (matching the app's MCQQuestion type). These
converters bridge the two so the same validated payload can be written to both
the generated.ts file and Supabase.
"""


def paper_to_row(paper: dict) -> dict:
    """PYQPaper (camelCase) -> published_papers row (snake_case)."""
    return {
        "id": paper["id"],
        "exam_id": paper.get("examId"),
        "exam_name": paper.get("examName"),
        "year": paper.get("year"),
        "paper_type": paper.get("paperType"),
        "total_questions": paper.get("totalQuestions"),
        "download_available": paper.get("downloadAvailable", True),
        "frequency_tags": paper.get("frequencyTags"),
        "questions": paper.get("questions"),
        "published_at": paper.get("publishedAt"),
        "published_by": paper.get("publishedBy"),
        "source": paper.get("source"),
    }


def mock_to_row(mock: dict) -> dict:
    """MockTest (camelCase) -> custom_mock_tests row (snake_case)."""
    return {
        "id": mock["id"],
        "exam_id": mock.get("examId"),
        "title": mock.get("title"),
        "paper_name": mock.get("paperName"),
        "duration_minutes": mock.get("durationMinutes"),
        "total_marks": mock.get("totalMarks"),
        "negative_marks_per_incorrect": mock.get("negativeMarksPerIncorrect"),
        "sections": mock.get("sections"),
        "published_at": mock.get("publishedAt"),
        "published_by": mock.get("publishedBy"),
        "source": mock.get("source"),
    }


def question_to_row(question: dict) -> dict:
    """MCQQuestion (camelCase) -> questions row (snake_case)."""
    options = question.get("options") or []
    opt_a = next((o.get("text", "") for o in options if o.get("id") == "A"), "")
    opt_b = next((o.get("text", "") for o in options if o.get("id") == "B"), "")
    opt_c = next((o.get("text", "") for o in options if o.get("id") == "C"), "")
    opt_d = next((o.get("text", "") for o in options if o.get("id") == "D"), "")
    return {
        "id": question["id"],
        "exam_id": question.get("examId"),
        "question_number": question.get("questionNumber", 1),
        "subject": question.get("subject") or "General Studies",
        "topic": question.get("topic") or "General",
        "subtopic": question.get("subtopic"),
        "stem": question.get("stem") or "",
        "options": options,
        "option_a": opt_a,
        "option_b": opt_b,
        "option_c": opt_c,
        "option_d": opt_d,
        "correct_option": question.get("correctOption") or "A",
        "explanation": question.get("explanation"),
        "formula_context": question.get("formulaContext"),
        "solution_steps": question.get("solutionSteps"),
        "reference_source": question.get("referenceSource"),
        "difficulty": question.get("difficulty") or "MEDIUM",
        "question_type": question.get("questionType") or "CONCEPTUAL",
        "source_type": question.get("sourceType") or "PYQ",
        "pyq_year": question.get("pyqYear"),
        "pyq_exam": question.get("pyqExam"),
        "updated_at": question.get("publishedAt"),
    }
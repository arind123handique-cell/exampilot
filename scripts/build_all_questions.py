# -*- coding: utf-8 -*-
"""
Build 100 Civil Engineering & 100 General Studies Questions for ExamPilot AI
Modelled after authentic Testbook, State PSC (APSC AE / CCE), GATE and UPSC standards.
"""

import os
import json

# Verify output directory
os.makedirs('src/data', exist_ok=True)

def generate_ts_file(filepath, var_name, questions):
    assert len(questions) == 100, f"Expected 100 questions for {var_name}, got {len(questions)}"
    
    formatted_qs = []
    for q in questions:
        q_obj = {
            "id": q["id"],
            "questionNumber": q["questionNumber"],
            "examId": q["examId"],
            "subject": q["subject"],
            "topic": q["topic"],
            "subtopic": q.get("subtopic", ""),
            "stem": q["stem"],
            "options": [{"id": opt[0], "text": opt[1]} for opt in q["options"]],
            "correctOption": q["correctOption"],
            "formulaContext": q.get("formulaContext", None),
            "explanation": q["explanation"],
            "referenceSource": q.get("referenceSource", "Standard Reference"),
            "difficulty": q.get("difficulty", "MEDIUM"),
            "pyqYear": q.get("pyqYear", 2024),
            "pyqExam": q.get("pyqExam", "Testbook Pattern / State PSC")
        }
        formatted_qs.append(q_obj)

    ts_content = f"""import {{ MCQQuestion }} from '../types';

/**
 * 100 AI-calibrated questions modelled after Testbook & State PSC examinations.
 */
export const {var_name}: MCQQuestion[] = {json.dumps(formatted_qs, indent=2, ensure_ascii=False)};
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Successfully generated {filepath} with {len(questions)} questions.")

print("Question builder module ready.")

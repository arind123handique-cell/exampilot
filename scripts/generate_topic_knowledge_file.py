import json
import re

# Read civil questions
with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    civil_raw = f.read()

# Read GS questions
with open('src/data/generalStudiesQuestions.ts', 'r', encoding='utf-8') as f:
    gs_raw = f.read()

def parse_ts_array(raw_text):
    start = raw_text.find('= [') + 2
    end = raw_text.rfind('];')
    if end == -1:
        end = raw_text.rfind(']')
    else:
        end += 1
    json_str = raw_text[start:end]
    return json.loads(json_str)

civil_qs = parse_ts_array(civil_raw)
gs_qs = parse_ts_array(gs_raw)

def to_topic_q(q):
    return {
        "id": q["id"],
        "stem": q["stem"],
        "options": q["options"],
        "correctOption": q["correctOption"],
        "explanation": q.get("explanation", ""),
        "formulaContext": q.get("formulaContext"),
        "difficulty": q.get("difficulty", "MEDIUM"),
        "examSource": q.get("pyqExam") or q.get("referenceSource") or "State PSC / GATE Standard",
        "topic": q.get("topic"),
        "subtopic": q.get("subtopic")
    }

civil_by_id = {q["id"]: to_topic_q(q) for q in civil_qs}
gs_by_id = {q["id"]: to_topic_q(q) for q in gs_qs}

# Read existing estimating-costing questions from topicKnowledge.ts
with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    tk_text = f.read()

# Extract existing modules from topicKnowledge to preserve their step data
# We'll build modules with rich data
print("Loaded questions successfully.")

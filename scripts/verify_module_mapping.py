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

# Map question to TopicQuestion
def to_topic_q(q):
    return {
        "id": q["id"],
        "stem": q["stem"],
        "options": q["options"],
        "correctOption": q["correctOption"],
        "explanation": q.get("explanation", ""),
        "formulaContext": q.get("formulaContext"),
        "difficulty": q.get("difficulty", "MEDIUM"),
        "examSource": q.get("pyqExam") or q.get("referenceSource") or "APSC AE / GATE",
        "topic": q.get("topic"),
        "subtopic": q.get("subtopic")
    }

# Group civil questions by module id
civil_map = {
    "civil-rcc": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(1, 14)] + ["ce-q-015"]],
    "civil-prestressed": [to_topic_q(q) for q in civil_qs if q["id"] in ["ce-q-014", "ce-q-001", "ce-q-002", "ce-q-003", "ce-q-012"]],
    "civil-structural-analysis": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(16, 28)]],
    "civil-som": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(28, 38)]],
    "civil-geotech": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(38, 53)]],
    "civil-fluids": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(53, 65)]],
    "civil-hydrology-irrigation": [to_topic_q(q) for q in civil_qs if q["id"] in ["ce-q-061", "ce-q-062", "ce-q-063", "ce-q-064", "ce-q-057", "ce-q-058"]],
    "civil-env": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(65, 75)]],
    "civil-surveying": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(75, 83)]],
    "civil-transport": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(83, 91)]],
    "civil-steel": [to_topic_q(q) for q in civil_qs if q["id"] in [f"ce-q-{i:03d}" for i in range(91, 96)] + ["ce-q-027"]],
    "civil-bldg-materials": [to_topic_q(q) for q in civil_qs if q["id"] in ["ce-q-096", "ce-q-097", "ce-q-098", "ce-q-007", "ce-q-012"]],
    "civil-cpm-pert": [to_topic_q(q) for q in civil_qs if q["id"] in ["ce-q-099", "ce-q-100", "ce-q-083", "ce-q-075"]],
}

# Group GS questions by module id
gs_map = {
    "gs-polity": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(1, 19)]],
    "gs-india-history": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(19, 37)]],
    "gs-assam-geography": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(37, 53)]],
    "gs-economy": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(53, 67)]],
    "gs-science": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(67, 81)]],
    "gs-assam-history": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(81, 91)]],
    "gs-aptitude": [to_topic_q(q) for q in gs_qs if q["id"] in [f"gs-q-{i:03d}" for i in range(91, 101)]],
}

print("Civil mapped counts:")
for k, v in civil_map.items():
    print(f"  {k}: {len(v)}")

print("\nGS mapped counts:")
for k, v in gs_map.items():
    print(f"  {k}: {len(v)}")

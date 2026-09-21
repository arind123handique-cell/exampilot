import json
import re

# Load civil questions
with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    civil_text = f.read()

# Load GS questions
with open('src/data/generalStudiesQuestions.ts', 'r', encoding='utf-8') as f:
    gs_text = f.read()

civil_ids = re.findall(r'\"id\":\s*\"(ce-q-\d+)\"', civil_text)
gs_ids = re.findall(r'\"id\":\s*\"(gs-q-\d+)\"', gs_text)
print(f"Total Civil questions in civilQuestions.ts: {len(civil_ids)}")
print(f"Total GS questions in generalStudiesQuestions.ts: {len(gs_ids)}")

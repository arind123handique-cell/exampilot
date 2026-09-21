import re
import json

# Let's parse each question in civilQuestions.ts into a dict
with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# We can find all { "id": "ce-q-..." ... }
pattern = re.compile(r'\{\s*\"id\":\s*\"(ce-q-\d+)\",\s*\"questionNumber\":\s*(\d+),\s*\"examId\":\s*\"[^\"]+\",\s*\"subject\":\s*\"([^\"]+)\",\s*\"topic\":\s*\"([^\"]+)\"')
matches = pattern.findall(text)
print(f"Matched {len(matches)} questions:")
from collections import defaultdict
by_subj = defaultdict(list)
for q_id, q_num, subj, top in matches:
    by_subj[subj].append((q_id, top))

for subj, q_list in by_subj.items():
    print(f"\n{subj} ({len(q_list)}):")
    for q_id, top in q_list:
        print(f"   {q_id}: {top}")

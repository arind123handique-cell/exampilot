import re
from collections import defaultdict

with open('src/data/generalStudiesQuestions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\{\s*\"id\":\s*\"(gs-q-\d+)\",\s*\"questionNumber\":\s*(\d+),\s*\"examId\":\s*\"[^\"]+\",\s*\"subject\":\s*\"([^\"]+)\",\s*\"topic\":\s*\"([^\"]+)\"')
matches = pattern.findall(text)
print(f"Matched {len(matches)} GS questions:")
by_subj = defaultdict(list)
for q_id, q_num, subj, top in matches:
    by_subj[subj].append((q_id, top))

for subj, q_list in by_subj.items():
    print(f"\n{subj} ({len(q_list)}):")
    for q_id, top in q_list[:6]:
        print(f"   {q_id}: {top}")
    if len(q_list) > 6:
        print(f"   ... and {len(q_list)-6} more")

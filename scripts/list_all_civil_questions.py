import json
import re

with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse using regex for objects
pattern = re.compile(r'\{[^{}]*"id":\s*"([^"]+)"[^{}]*"subject":\s*"([^"]+)"[^{}]*"topic":\s*"([^"]+)"[^{}]*\}', re.DOTALL)

# Let's extract full question objects
questions = []
# Or split by "id": "ce-q-
blocks = text.split('"id": "ce-q-')
print("Total question blocks found:", len(blocks) - 1)

for b in blocks[1:]:
    stem_m = re.search(r'"stem":\s*"([^"]+)"', b)
    sub_m = re.search(r'"subject":\s*"([^"]+)"', b)
    top_m = re.search(r'"topic":\s*"([^"]+)"', b)
    ans_m = re.search(r'"correctOption":\s*"([^"]+)"', b)
    if stem_m and sub_m and top_m:
        questions.append({
            'stem': stem_m.group(1),
            'subject': sub_m.group(1),
            'topic': top_m.group(1),
            'correctOption': ans_m.group(1) if ans_m else 'A'
        })

print("Successfully parsed questions:", len(questions))
from collections import Counter
subjects = Counter([q['subject'] for q in questions])
for s, count in subjects.items():
    print(f"\nSubject: {s} ({count} questions)")
    tops = [q['topic'] for q in questions if q['subject'] == s]
    for t, tc in Counter(tops).items():
        print(f"  - {t}: {tc} Qs")

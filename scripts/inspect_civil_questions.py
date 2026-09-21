import json
import re

with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find all subjects
subjects = re.findall(r'"subject":\s*"([^"]+)"', text)
topics = re.findall(r'"topic":\s*"([^"]+)"', text)
ids = re.findall(r'"id":\s*"([^"]+)"', text)

print("Total Civil Questions:", len(ids))
from collections import Counter
sub_counts = Counter(subjects)
for s, c in sub_counts.items():
    print(f"  {s}: {c} questions")

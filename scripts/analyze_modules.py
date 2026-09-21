import re

with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find module titles and whether they have topicQuestions
modules = re.findall(r'id\":\s*\"([^\"]+)\",\s*\"title\":\s*\"([^\"]+)\"', text)
print(f"Total modules in topicKnowledge: {len(modules)}")
for m_id, title in modules:
    print(f"  {m_id}: {title}")

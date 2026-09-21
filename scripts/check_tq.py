import re

with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's split by module id
modules = re.split(r'\{\s*\"id\":\s*\"', text)[1:]
for m in modules:
    m_id = m.split('"')[0]
    has_tq = '"topicQuestions"' in m
    tq_count = len(re.findall(r'\"stem\":', m))
    print(f"Module {m_id}: topicQuestions={has_tq}, questions_count={tq_count}")

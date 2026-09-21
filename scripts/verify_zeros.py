import json

with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    text = f.read()

sig = 'export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = '
start = text.find(sig) + len(sig)
end = text.rfind('];') + 1
modules = json.loads(text[start:end])
print(f"Total modules: {len(modules)}")
zero_count = 0
for m in modules:
    qs = m.get('topicQuestions', [])
    if len(qs) == 0:
        zero_count += 1
        print(f"EMPTY: {m['id']}")
    else:
        print(f"OK: {m['id']} ({m['title'][:35]}...) -> {len(qs)} questions")
print(f"Total empty modules: {zero_count}")

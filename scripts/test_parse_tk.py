import json

with open('src/data/topicKnowledge.ts', 'r', encoding='utf-8') as f:
    text = f.read()

sig = 'export const TOPIC_KNOWLEDGE_MODULES: KnowledgeModule[] = '
start = text.find(sig)
if start != -1:
    start += len(sig)
    end = text.rfind('];') + 1
    json_str = text[start:end]
    try:
        modules = json.loads(json_str)
        print(f"Successfully parsed {len(modules)} existing modules from topicKnowledge.ts!")
    except Exception as e:
        print("Error parsing modules:", e)

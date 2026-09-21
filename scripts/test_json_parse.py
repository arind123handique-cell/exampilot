import json

with open('src/data/civilQuestions.ts', 'r', encoding='utf-8') as f:
    civil_raw = f.read()

with open('src/data/generalStudiesQuestions.ts', 'r', encoding='utf-8') as f:
    gs_raw = f.read()

def parse_ts_array(raw_text):
    start = raw_text.find('= [')
    if start == -1:
        return None
    start += 2
    end = raw_text.rfind('];')
    if end == -1:
        end = raw_text.rfind(']')
    else:
        end += 1
    json_str = raw_text[start:end]
    return json.loads(json_str)

civil_qs = parse_ts_array(civil_raw)
gs_qs = parse_ts_array(gs_raw)

print("Civil successfully parsed:", len(civil_qs))
print("GS successfully parsed:", len(gs_qs))
print("Sample civil q:", civil_qs[0]['id'], civil_qs[0]['topic'])
print("Sample GS q:", gs_qs[0]['id'], gs_qs[0]['topic'])

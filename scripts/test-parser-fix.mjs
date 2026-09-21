function extractTopLevelObjects(text) {
  const objects = [];
  let depth = 0;
  let inString = false;
  let escape = false;
  let startIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === '{') {
      if (depth === 0) startIndex = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && startIndex !== -1) {
        const cand = text.slice(startIndex, i + 1);
        try {
          const cleanedObj = cand.replace(/,\s*([\]}])/g, '$1');
          objects.push(JSON.parse(cleanedObj));
        } catch (e) {}
        startIndex = -1;
      }
    }
  }
  return objects;
}

const sample = `[
  {
    "stem": "What is duty?",
    "options": [
      { "id": "A", "text": "864" },
      { "id": "B", "text": "960" }
    ],
    "correctOption": "A"
  },
  {
    "question": "What is delta?",
    "choices": [
      { "id": "A", "text": "100" },
      { "id": "B", "text": "200" }
    ],
    "correctOption": "B"
  },
`;

const res = extractTopLevelObjects(sample);
console.log('Parsed count:', res.length);
console.log('Item 1:', res[0]);
console.log('Item 2:', res[1]);

const text = `[
  {
    "stem": "What is duty?",
    "options": [
      { "id": "A", "text": "864" },
      { "id": "B", "text": "960" }
    ],
    "correctOption": "A"
  },
  {
    "stem": "What is delta?",
    "options": [
      { "id": "A", "text": "100" },
      { "id": "B", "text": "200" }
    ],
    "correctOption": "B"
  },
`;

const matches = text.match(/\{[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g);
console.log('Matches count:', matches ? matches.length : 0);
if (matches) {
  matches.forEach((m, i) => {
    try {
      console.log(`Match ${i + 1} parsed:`, JSON.parse(m));
    } catch (e) {
      console.log(`Match ${i + 1} parse failed:`, m.replace(/\n/g, ' '));
    }
  });
}

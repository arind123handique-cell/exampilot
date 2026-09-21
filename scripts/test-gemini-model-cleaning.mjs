import assert from 'assert';

console.log('--- Testing Gemini Model Resolution & cleanModelName ---');

const {
  cleanModelName,
  DEFAULT_GEMINI_MODELS,
  getSavedGeminiModel,
  setGeminiModel
} = await import('../src/services/geminiService.ts');

// Test 1: cleanModelName strips models/ prefix correctly
assert.strictEqual(cleanModelName('models/gemini-3.5-flash-lite'), 'gemini-3.5-flash-lite');
assert.strictEqual(cleanModelName('gemini-3.5-flash-lite'), 'gemini-3.5-flash-lite');
assert.strictEqual(cleanModelName(' models/gemini-2.5-flash  '), 'gemini-2.5-flash');
console.log('✓ cleanModelName strips "models/" prefix and whitespace cleanly');

// Test 2: DEFAULT_GEMINI_MODELS defaults to gemini-3.5-flash-lite
assert.strictEqual(DEFAULT_GEMINI_MODELS[0], 'gemini-3.5-flash-lite');
assert(DEFAULT_GEMINI_MODELS.includes('gemini-3.5-flash-lite'), 'gemini-3.5-flash-lite must be present');
assert(DEFAULT_GEMINI_MODELS.includes('gemini-2.5-flash'), 'gemini-2.5-flash must be present');
console.log('✓ DEFAULT_GEMINI_MODELS default is gemini-3.5-flash-lite');

// Test 3: setGeminiModel normalizes input
setGeminiModel('models/gemini-3.5-flash-lite');
assert.strictEqual(getSavedGeminiModel(), 'gemini-3.5-flash-lite');
console.log('✓ setGeminiModel stored and returned clean model name');

console.log('=== All Gemini model resolution tests passed! ===');

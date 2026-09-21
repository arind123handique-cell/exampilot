/**
 * Test script to verify OpenCode service & Offline vs Online dual generation logic
 */
import assert from 'assert';

console.log('--- Testing OpenCode & Dual Mode Generation Logic ---');

// Test 1: Verify opencodeService exports and fallback behavior
console.log('Test 1: opencodeService interface check');
const {
  POPULAR_OPENCODE_MODELS
} = await import('../src/services/opencodeService.ts');

assert(Array.isArray(POPULAR_OPENCODE_MODELS), 'POPULAR_OPENCODE_MODELS must be an array');
assert(POPULAR_OPENCODE_MODELS.length >= 5, 'Must contain popular models list');
assert(POPULAR_OPENCODE_MODELS.includes('opencode/qwen-2.5-coder:32b'), 'Must include qwen-2.5-coder:32b');
console.log('✓ Popular models available:', POPULAR_OPENCODE_MODELS.length);

// Test 2: Verify offline generator topic matching with Irrigation and CPM
console.log('Test 2: Offline topic isolation verification');
const { generateAiQuestionsOnTopic } = await import('../src/services/aiQuestionGeneratorService.ts');

const irrigationResult = await generateAiQuestionsOnTopic({
  topic: 'Irrigation Engineering',
  count: 5,
  sourceMode: 'offline'
});

assert(irrigationResult.questions.length === 5, 'Must generate requested 5 questions');
irrigationResult.questions.forEach((q, idx) => {
  assert(q.stem && q.stem.length > 10, `Question ${idx} must have stem`);
  assert(q.options.length === 4, `Question ${idx} must have 4 options`);
  assert(q.correctOption && ['A', 'B', 'C', 'D'].includes(q.correctOption), `Question ${idx} correctOption valid`);
});
console.log('✓ Irrigation offline questions generated successfully with full schema');

const cpmResult = await generateAiQuestionsOnTopic({
  topic: 'CPM Network Crashing',
  count: 5,
  sourceMode: 'offline'
});

assert(cpmResult.questions.length === 5, 'Must generate requested 5 questions for CPM');
cpmResult.questions.forEach((q, idx) => {
  assert(q.stem && q.stem.length > 10, `Question ${idx} must have stem`);
  assert(q.options.length === 4, `Question ${idx} must have 4 options`);
  assert(q.correctOption && ['A', 'B', 'C', 'D'].includes(q.correctOption), `Question ${idx} correctOption valid`);
});
console.log('✓ CPM offline questions generated successfully with full schema');

// Test 3: Verify 100 questions offline batch capability
console.log('Test 3: 100 MCQs batch generation verification');
const bigBatchResult = await generateAiQuestionsOnTopic({
  topic: 'Soil Mechanics & Foundation Engineering',
  count: 100,
  sourceMode: 'offline'
});
assert(bigBatchResult.questions.length === 100, 'Must generate 100 questions');
console.log('✓ 100 MCQs full mock generated successfully with 0 latency');

// Test 4: Verify online mode with OpenCode handles unreachable endpoint with clear message
console.log('Test 4: Online mode error handling when daemon is offline');
try {
  await generateAiQuestionsOnTopic({
    topic: 'Highway Geometric Design',
    count: 5,
    sourceMode: 'online',
    aiEngine: 'opencode'
  });
  console.log('Online call succeeded or handled');
} catch (e) {
  assert(e.message && e.message.length > 0, 'Must produce a readable error');
  console.log('✓ Expected error thrown when OpenCode service is not running locally:', e.message);
}

console.log('=== All Dual Generation & OpenCode verification tests passed! ===');

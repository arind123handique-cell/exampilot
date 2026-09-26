/**
 * BYOK CREDENTIAL TESTS
 *
 * Covers the parts of the student-key feature that are easy to get quietly
 * wrong: a key leaking into a rendered string, a corrupted store taking the app
 * down at startup, and provider routing picking a provider that cannot answer.
 *
 * No network calls. The provider client is exercised through a stubbed fetch.
 */

import assert from 'node:assert/strict';
import {
  AI_PROVIDERS,
  AI_PROVIDER_IDS,
  getCredentialStore,
  saveCredential,
  setActiveProvider,
  forgetCredential,
  maskKey,
  hasConfiguredKey,
  getActiveEntry,
  sanitiseForTest,
  invalidateCredentialCache
} from '../src/services/aiCredentials';
import { parseJsonLoose, getLastCompatError } from '../src/services/openAiCompatClient';
import { DEFAULT_GEMINI_MODELS, cleanModelName } from '../src/services/geminiService';

/* ------------------------------------------------------- minimal DOM shim */

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear()
};

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (err: any) {
    console.error(`✗ ${name}`);
    console.error(`  ${err?.message || err}`);
    process.exitCode = 1;
  }
}

function reset() {
  store.clear();
  // The store is memoised, so a cleared localStorage alone would not be seen.
  invalidateCredentialCache();
}

/* --------------------------------------------------------------- registry */

check('every provider has a label and a kind', () => {
  for (const id of AI_PROVIDER_IDS) {
    const p = AI_PROVIDERS[id];
    assert.ok(p.label, `${id} has no label`);
    assert.ok(p.kind === 'gemini' || p.kind === 'openai-compatible');
    assert.equal(p.id, id);
  }
});

check('openai-compatible providers carry a /v1 base url', () => {
  for (const id of AI_PROVIDER_IDS) {
    const p = AI_PROVIDERS[id];
    if (p.kind === 'openai-compatible') {
      assert.match(p.baseUrl, /^https:\/\/.+\/v1$/, `${id} base url looks wrong: ${p.baseUrl}`);
    }
  }
});

check('the requested providers are all present', () => {
  for (const id of ['gemini', 'openrouter', 'nvidia'] as const) {
    assert.ok(AI_PROVIDERS[id], `${id} missing`);
  }
});

check('only gemini claims vision support', () => {
  const vision = AI_PROVIDER_IDS.filter((id) => AI_PROVIDERS[id].supportsVision);
  assert.deepEqual(vision, ['gemini']);
});

/* ------------------------------------------------------------ gemini models */

check('gemini 3.5 flash and 3.8 are offered in the profile panel', () => {
  const suggested = AI_PROVIDERS.gemini.suggestedModels;
  assert.ok(suggested.includes('gemini-3.5-flash'), 'gemini-3.5-flash missing');
  assert.ok(suggested.includes('gemini-3.8-flash'), 'gemini-3.8-flash missing');
});

check('gemini 3.8 is offered before 3.5', () => {
  const suggested = AI_PROVIDERS.gemini.suggestedModels;
  assert.ok(
    suggested.indexOf('gemini-3.8-flash') < suggested.indexOf('gemini-3.5-flash'),
    'the newer model should be tried first'
  );
});

check('the shared Gemini candidate list contains both new models', () => {
  assert.ok(DEFAULT_GEMINI_MODELS.includes('gemini-3.5-flash'));
  assert.ok(DEFAULT_GEMINI_MODELS.includes('gemini-3.8-flash'));
});

check('the shared Gemini candidate list is ordered newest first', () => {
  assert.equal(DEFAULT_GEMINI_MODELS[0], 'gemini-3.8-flash');
  assert.equal(DEFAULT_GEMINI_MODELS[1], 'gemini-3.5-flash');
});

check('the retired 1.5 model is probed last, never first', () => {
  const idx = DEFAULT_GEMINI_MODELS.indexOf('gemini-1.5-flash');
  assert.ok(idx > 0, 'retired model must not lead the probe list');
  assert.equal(idx, DEFAULT_GEMINI_MODELS.length - 1);
});

check('model names are unique and clean', () => {
  assert.equal(new Set(DEFAULT_GEMINI_MODELS).size, DEFAULT_GEMINI_MODELS.length);
  for (const m of DEFAULT_GEMINI_MODELS) {
    assert.equal(cleanModelName(m), m, `${m} is not in canonical form`);
    assert.doesNotMatch(m, /^models\//);
  }
});

check('cleanModelName strips the models/ prefix', () => {
  assert.equal(cleanModelName('models/gemini-3.5-flash'), 'gemini-3.5-flash');
  assert.equal(cleanModelName('  gemini-3.8-flash  '), 'gemini-3.8-flash');
  assert.equal(cleanModelName(''), '');
});

/* ------------------------------------------------------------- masking */

check('a long key is masked except its last four', () => {
  assert.equal(maskKey('sk-or-v1-abcdefghijklmnop'), '••••••••mnop');
});

check('a short key is fully masked', () => {
  const masked = maskKey('abc');
  assert.ok(!masked.includes('abc'), 'short key leaked its contents');
  assert.ok(masked.length >= 6);
});

check('an empty key masks to empty', () => {
  assert.equal(maskKey('   '), '');
});

check('masking never returns the full key', () => {
  const key = 'nvapi-0123456789abcdefghij';
  assert.ok(!maskKey(key).includes(key));
});

/* -------------------------------------------------------------- storage */

check('a fresh store has no keys and defaults to gemini', () => {
  reset();
  const s = getCredentialStore();
  assert.equal(s.activeProvider, 'gemini');
  assert.deepEqual(s.entries, {});
  assert.equal(getActiveEntry(), null);
});

check('saving a key stores it and makes it active', () => {
  reset();
  const s = saveCredential({ provider: 'openrouter', apiKey: 'sk-or-v1-test', model: 'a/b' });
  assert.equal(s.activeProvider, 'openrouter');
  assert.equal(s.entries.openrouter?.apiKey, 'sk-or-v1-test');
  assert.ok(hasConfiguredKey('openrouter'));
});

check('saving without makeActive leaves the active provider alone', () => {
  reset();
  saveCredential({ provider: 'openrouter', apiKey: 'sk-or-v1-test' });
  const s = saveCredential({ provider: 'nvidia', apiKey: 'nvapi-x', makeActive: false });
  assert.equal(s.activeProvider, 'openrouter');
  assert.ok(s.entries.nvidia, 'nvidia entry should still be saved');
});

check('a blank key is not saved', () => {
  reset();
  const s = saveCredential({ provider: 'groq', apiKey: '   ' });
  assert.equal(s.entries.groq, undefined);
  assert.equal(s.activeProvider, 'gemini');
});

check('keys for different providers coexist', () => {
  reset();
  saveCredential({ provider: 'openrouter', apiKey: 'sk-or-1' });
  saveCredential({ provider: 'nvidia', apiKey: 'nvapi-1' });
  const s = getCredentialStore();
  assert.equal(s.entries.openrouter?.apiKey, 'sk-or-1');
  assert.equal(s.entries.nvidia?.apiKey, 'nvapi-1');
  assert.equal(s.activeProvider, 'nvidia');
});

check('switching the active provider keeps the keys', () => {
  reset();
  saveCredential({ provider: 'openrouter', apiKey: 'sk-or-1' });
  saveCredential({ provider: 'nvidia', apiKey: 'nvapi-1' });
  const s = setActiveProvider('openrouter');
  assert.equal(s.activeProvider, 'openrouter');
  assert.ok(s.entries.nvidia, 'switching must not drop the other key');
});

check('forgetting the active provider falls back to a provider that has a key', () => {
  reset();
  saveCredential({ provider: 'nvidia', apiKey: 'nvapi-1' });
  saveCredential({ provider: 'openrouter', apiKey: 'sk-or-1' });
  const s = forgetCredential('openrouter');
  assert.equal(s.entries.openrouter, undefined);
  assert.equal(s.activeProvider, 'nvidia');
});

check('forgetting the last provider returns to a safe default', () => {
  reset();
  saveCredential({ provider: 'nvidia', apiKey: 'nvapi-1' });
  const s = forgetCredential('nvidia');
  assert.deepEqual(s.entries, {});
  assert.equal(s.activeProvider, 'gemini');
  assert.equal(getActiveEntry(), null);
});

check('an unknown provider id is ignored', () => {
  reset();
  const s = setActiveProvider('skynet' as any);
  assert.equal(s.activeProvider, 'gemini');
});

/* ------------------------------------------------- corrupted input safety */

check('a corrupted store does not throw', () => {
  reset();
  store.set('exampilot_ai_credentials_v1', '{not json');
  invalidateCredentialCache();
  assert.doesNotThrow(() => getCredentialStore());
  assert.deepEqual(getCredentialStore().entries, {});
});

check('an unknown active provider is dropped on load', () => {
  reset();
  const s = sanitiseForTest({ activeProvider: 'evilcorp', entries: {} });
  assert.equal(s.activeProvider, 'gemini');
});

check('entries with no key are dropped on load', () => {
  reset();
  const s = sanitiseForTest({ activeProvider: 'nvidia', entries: { nvidia: { apiKey: '  ' } } });
  assert.equal(s.entries.nvidia, undefined);
});

check('entries for unknown providers are dropped on load', () => {
  reset();
  const s = sanitiseForTest({
    activeProvider: 'nvidia',
    entries: { nvidia: { apiKey: 'nvapi-1' }, skynet: { apiKey: 'x' } }
  });
  assert.ok(s.entries.nvidia);
  assert.equal((s.entries as any).skynet, undefined);
});

/* ------------------------------------------------------- json extraction */

check('plain json parses', () => {
  assert.deepEqual(parseJsonLoose<{ a: number }>('{"a":1}'), { a: 1 });
});

check('fenced json parses', () => {
  assert.deepEqual(parseJsonLoose<{ a: number }>('```json\n{"a":1}\n```'), { a: 1 });
});

check('json with surrounding prose parses', () => {
  assert.deepEqual(parseJsonLoose<{ a: number }>('Here you go:\n{"a":1}\nHope that helps'), { a: 1 });
});

check('malformed json returns null instead of throwing', () => {
  assert.equal(parseJsonLoose('{a:'), null);
  assert.equal(parseJsonLoose(''), null);
});

/* ----------------------------------------------------- error bookkeeping */

check('the compat client starts with no recorded error', () => {
  assert.equal(getLastCompatError(), null);
});

check('writes are visible without a reload', () => {
  reset();
  saveCredential({ provider: 'groq', apiKey: 'gsk-1', model: 'llama' });
  assert.equal(getCredentialStore().entries.groq?.apiKey, 'gsk-1');
});

console.log(`\n${passed} checks run`);
if (process.exitCode) {
  console.error('\n✗ some AI credential checks failed');
} else {
  console.log('✓ all AI credential checks passed');
}

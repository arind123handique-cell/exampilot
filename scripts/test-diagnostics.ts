/**
 * Diagnostics + upload-job checks.
 *
 * Two guarantees this work rests on:
 *   1. A failure anywhere in the app ends up in one readable list, and nothing
 *      in the reporter can itself throw.
 *   2. An in-flight paper extraction survives the My Papers tab unmounting. The
 *      component is only mounted while that tab is open, so job state used to
 *      live in it and vanished on a tab switch — which looked to the student
 *      like the upload had been cancelled.
 *
 * Run: npx tsx scripts/test-diagnostics.ts
 */

import assert from 'node:assert/strict';
import {
  reportFailure,
  logEvent,
  logWarn,
  getDiagnostics,
  subscribeDiagnostics,
  clearDiagnostics,
  countByLevel,
  exportDiagnostics,
  installGlobalDiagnostics
} from '../src/services/appDiagnostics';

/* ------------------------------------------------------------- DOM shims */

const memStore = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (memStore.has(k) ? memStore.get(k)! : null),
  setItem: (k: string, v: string) => void memStore.set(k, String(v)),
  removeItem: (k: string) => void memStore.delete(k),
  clear: () => memStore.clear()
};

let passed = 0;
const pending: Promise<void>[] = [];
let chain: Promise<void> = Promise.resolve();

// Two things this wrapper has to get right:
//  - tolerate an async body, or an assertion inside one rejects unhandled and
//    takes the whole run down before the result is reported;
//  - run strictly one at a time, because the upload-job tests share module-level
//    state. Kicking them off concurrently let one test reset the store while
//    another was mid-flight, which looked exactly like a broken guard.
function check(name: string, fn: () => void | Promise<void>): void {
  const run = chain.then(async () => {
    try {
      await fn();
      passed += 1;
      console.log(`✓ ${name}`);
    } catch (err: any) {
      console.error(`✗ ${name}\n  ${err?.message || err}`);
      process.exitCode = 1;
    }
  });
  chain = run;
  pending.push(run);
}

/* --------------------------------------------------------- the reporter */

check('reporting an Error records its message', () => {
  clearDiagnostics();
  reportFailure('scope.a', new Error('boom'));
  const events = getDiagnostics();
  assert.equal(events.length, 1);
  assert.equal(events[0].message, 'boom');
  assert.equal(events[0].level, 'error');
  assert.equal(events[0].scope, 'scope.a');
});

check('reporting a string works', () => {
  clearDiagnostics();
  reportFailure('scope.b', 'plain failure');
  assert.equal(getDiagnostics()[0].message, 'plain failure');
});

check('reporting an api-style error object captures the http status', () => {
  clearDiagnostics();
  reportFailure('scope.c', { message: 'Request failed', status: 404 });
  const e = getDiagnostics()[0];
  assert.equal(e.message, 'Request failed');
  assert.equal((e.detail as any).httpStatus, 404);
});

check('reporting nothing does not throw', () => {
  clearDiagnostics();
  assert.doesNotThrow(() => reportFailure('scope.d'));
  assert.equal(getDiagnostics()[0].message, 'Unknown failure');
});

check('an unserialisable detail does not break reporting', () => {
  clearDiagnostics();
  const circular: any = { name: 'loop' };
  circular.self = circular;
  assert.doesNotThrow(() => reportFailure('scope.e', new Error('with detail'), { circular }));
});

check('detail is carried through', () => {
  clearDiagnostics();
  reportFailure('scope.f', new Error('x'), { model: 'gemini-3.5-flash', chars: 42 });
  assert.deepEqual(getDiagnostics()[0].detail, { model: 'gemini-3.5-flash', chars: 42 });
});

check('newest event is first', () => {
  clearDiagnostics();
  logEvent('s', 'first');
  logEvent('s', 'second');
  assert.equal(getDiagnostics()[0].message, 'second');
});

check('levels are counted separately', () => {
  clearDiagnostics();
  reportFailure('s', new Error('e1'));
  logWarn('s', 'w1');
  logEvent('s', 'i1');
  assert.equal(countByLevel('error'), 1);
  assert.equal(countByLevel('warn'), 1);
  assert.equal(countByLevel('info'), 1);
});

check('subscribers are notified and can unsubscribe', () => {
  clearDiagnostics();
  let seen = 0;
  const off = subscribeDiagnostics(() => {
    seen += 1;
  });
  logEvent('s', 'a');
  const afterOne = seen;
  off();
  logEvent('s', 'b');
  assert.ok(afterOne >= 2, 'subscriber should have been called immediately and on change');
  assert.equal(seen, afterOne, 'unsubscribe should stop notifications');
});

check('a throwing subscriber cannot break the reporter', () => {
  clearDiagnostics();
  const off = subscribeDiagnostics(() => {
    throw new Error('bad listener');
  });
  assert.doesNotThrow(() => reportFailure('s', new Error('still recorded')));
  off();
  assert.equal(getDiagnostics().length, 1);
});

check('clearing empties the buffer', () => {
  clearDiagnostics();
  logEvent('s', 'x');
  clearDiagnostics();
  assert.equal(getDiagnostics().length, 0);
});

check('the buffer is bounded', () => {
  clearDiagnostics();
  for (let i = 0; i < 400; i += 1) logEvent('s', `event ${i}`);
  assert.ok(getDiagnostics().length <= 300, `buffer grew to ${getDiagnostics().length}`);
});

check('export produces parseable json with the newest first', () => {
  clearDiagnostics();
  logEvent('s', 'older');
  reportFailure('s', new Error('newer'));
  const parsed = JSON.parse(exportDiagnostics());
  assert.equal(parsed.events[0].message, 'newer');
  assert.equal(parsed.counts.error, 1);
  assert.ok(typeof parsed.userAgent === 'string');
});

check('global diagnostics install is idempotent and safe without a window', () => {
  assert.doesNotThrow(() => {
    installGlobalDiagnostics();
    installGlobalDiagnostics();
  });
});

/* ------------------------------------------------- the upload job store */

async function jobTests() {
  const job = await import('../src/services/paperUploadJob');

  check('a fresh job is idle', () => {
    job.clearUploadJobForTest();
    const s = job.getUploadJob();
    assert.equal(s.busy, false);
    assert.equal(s.status, null);
    assert.equal(s.outcome, null);
    assert.equal(s.error, null);
  });

  check('subscribers see the job and can unsubscribe', () => {
    job.clearUploadJobForTest();
    let calls = 0;
    const off = job.subscribeUploadJob(() => {
      calls += 1;
    });
    const afterSub = calls;
    off();
    assert.ok(afterSub >= 1, 'subscriber should get current state immediately');
  });

  check('a second upload is ignored while one is running', async () => {
    job.clearUploadJobForTest();
    clearDiagnostics();
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
    const first = job.startPaperUpload({ userId: 'u1', file, title: 'A', year: '2024', subject: 'GS' });
    // The guard is synchronous, so the second call sees busy=true even though
    // the first one is about to fail fast in this environment.
    const second = job.startPaperUpload({ userId: 'u1', file, title: 'B', year: '2024', subject: 'GS' });
    await Promise.all([first, second]);
    const events = getDiagnostics().filter((e) => e.message.includes('second upload'));
    assert.equal(events.length, 1, 'the duplicate upload should have been skipped and logged');
  });

  check('a failed upload records the error and does not throw', async () => {
    job.clearUploadJobForTest();
    clearDiagnostics();
    const file = new File(['x'], 'b.pdf', { type: 'application/pdf' });
    // No Gemini key and no FileReader in this environment, so this exercises
    // the real failure path rather than a stub.
    await job.startPaperUpload({ userId: 'u1', file, title: 'B', year: '2024', subject: 'GS' });
    const s = job.getUploadJob();
    assert.equal(s.busy, false, 'busy must be cleared after a failure');
    assert.ok(s.error, 'the failure should be on the job state');
    assert.ok(
      getDiagnostics().some((e) => e.scope === 'paper.upload' && e.level === 'error'),
      'the failure should reach diagnostics'
    );
  });

  check('the job survives a simulated tab switch', async () => {
    job.clearUploadJobForTest();
    clearDiagnostics();
    const file = new File(['x'], 'c.pdf', { type: 'application/pdf' });

    // Simulate the component mounting, starting work, then unmounting because
    // the student switched tabs. The job store is module-level, so nothing here
    // is tied to a component being mounted.
    let runIdSeenWhileBusy = 0;
    const off = job.subscribeUploadJob((s) => {
      if (s.busy) runIdSeenWhileBusy = s.runId;
    });
    const running = job.startPaperUpload({ userId: 'u1', file, title: 'C', year: '2024', subject: 'GS' });
    // "Unmount": the subscriber goes away, exactly as useEffect cleanup would.
    off();
    await running;

    assert.ok(runIdSeenWhileBusy > 0, 'the job should have been observable as running');
    const after = job.getUploadJob();
    assert.equal(after.runId, runIdSeenWhileBusy, 'the run id survives the unmount');
    assert.equal(after.busy, false, 'it settles rather than hanging busy forever');
    assert.ok(after.error || after.outcome, 'a finished job ends in a result or an error');
  });
}

jobTests()
  .catch((err) => {
    console.error('\n✗ diagnostics job tests threw:', err);
    process.exitCode = 1;
  })
  .then(async () => {
    // The async checks registered above settle here.
    await Promise.all(pending);
    console.log(`\n${passed} checks run`);
    if (process.exitCode) console.error('\n✗ some diagnostics checks failed');
    else console.log('✓ all diagnostics checks passed');
  });

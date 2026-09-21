/**
 * Reproduces the student mock-test submit flow against the current StudentPortal.
 *
 * Auth is bypassed by seeding the cached session and blocking Firebase, so the
 * portal falls back to the offline cached user (AuthContext does exactly this
 * when Firebase is unreachable and `exampilot_active_user` exists).
 */
import { chromium } from 'playwright';

const PORT = process.env.PORT || '3000';
const BASE = `http://localhost:${PORT}`;

const profile = {
  uid: 'repro-uid-001',
  email: 'repro@example.com',
  displayName: 'Repro Aspirant',
  photoURL: null,
  isAnonymous: false,
  preferences: {
    examId: 'apsc-ae-civil',
    examName: 'APSC AE Civil',
    targetYear: 2026,
    dailyHoursGoal: 4,
    level: 'intermediate',
    onboarded: true
  },
  stats: { readinessScore: 0, questionsAttempted: 0, accuracyRate: 0, studyStreakDays: 1, totalStudyHours: 0 },
  createdAt: new Date().toISOString()
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

await context.addInitScript((p) => {
  try {
    localStorage.setItem('exampilot_active_user', JSON.stringify(p));
  } catch {}
}, profile);

await context.route('**/*', (route) => {
  const url = route.request().url();
  // Only block the real external providers — Vite serves the app's own modules
  // from localhost (including /src/firebase/*), which must not be blocked.
  const isLocal = url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1');
  if (
    !isLocal &&
    (url.includes('firebase') ||
      url.includes('googleapis') ||
      url.includes('gstatic') ||
      url.includes('identitytoolkit') ||
      url.includes('firestore'))
  ) {
    return route.abort();
  }
  route.continue();
});

const page = await context.newPage();
const errors = [];
page.on('console', (m) => console.log(`[console:${m.type()}]`, m.text()));
page.on('pageerror', (e) => {
  errors.push(e.message);
  console.error('[pageerror]', e.message);
});

const clickByText = (text) =>
  page.evaluate((t) => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find((b) => (b.textContent || '').toLowerCase().includes(t.toLowerCase()));
    if (!btn) return false;
    btn.click();
    return true;
  }, text);

try {
  console.log('--- goto ---');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);

  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400));
  console.log('--- visible text ---\n' + bodyText);

  if (/sign in|register student|continue with google/i.test(bodyText)) {
    console.log('!! Still on the login screen — auth bypass failed.');
    await page.screenshot({ path: 'repro-01-login.png' });
    await browser.close();
    process.exit(2);
  }

  console.log('--- start mock ---');
  const started = await clickByText('Start CBT Mock Test');
  console.log('start clicked:', started);
  await page.waitForTimeout(1500);

  console.log('--- answer first question ---');
  const answered = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    // option buttons sit inside the options grid; they contain an "A"/"B"/"C"/"D" chip
    const opt = btns.find((b) => {
      const t = (b.textContent || '').trim();
      return /^[ABCD]\s/.test(t) || /^[ABCD]$/.test(t);
    });
    if (!opt) return false;
    opt.click();
    return true;
  });
  console.log('option clicked:', answered);
  await page.waitForTimeout(500);

  console.log('--- open submit modal ---');
  const opened = await clickByText('Submit Test');
  console.log('submit-test clicked:', opened);
  await page.waitForTimeout(600);

  const modalOpen = await page.evaluate(() =>
    /submit examination/i.test(document.body.innerText)
  );
  console.log('confirm modal visible:', modalOpen);
  await page.screenshot({ path: 'repro-02-submit-modal.png' });

  console.log('--- confirm submit ---');
  const confirmed = await clickByText('Confirm');
  console.log('confirm clicked:', confirmed);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'repro-03-after-submit.png' });
  const afterText = await page.evaluate(() => document.body.innerText.slice(0, 600));
  console.log('--- after submit text ---\n' + afterText);

  const scoreShown = /scorecard|total marks|accuracy/i.test(afterText);
  console.log(scoreShown ? 'RESULT: submit produced a scorecard' : 'RESULT: submit produced NO scorecard');
} catch (err) {
  console.error('repro failed:', err.message);
} finally {
  console.log('page errors:', errors.length ? errors : 'none');
  await browser.close();
}

import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const logs = [];
page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));
page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() }));
page.on('response', res => {
  if (res.url().includes('identitytoolkit') || res.url().includes('firebase')) {
    logs.push({ type: 'response', url: res.url(), status: res.status() });
  }
});

await page.goto('http://localhost:3002/');
await page.waitForTimeout(1500);

// Click Sign in
const signInBtn = await page.$('button:has-text("Sign in")');
if (signInBtn) await signInBtn.click();
await page.waitForTimeout(500);

// Fill form with the user's email
await page.fill('input[type="email"]', 'arindramhandique9@gmail.com');
await page.fill('input[type="password"]', 'password123');

console.log('Clicking Sign in button...');
const submitBtn = await page.$('button[type="submit"]');
if (submitBtn) await submitBtn.click();

// Wait up to 5 seconds to observe network and state
await page.waitForTimeout(5000);

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';
await page.screenshot({ path: `${brainDir}/debug_signin_attempt.png` });

console.log('Logs captured during sign in:');
console.log(JSON.stringify(logs, null, 2));

await browser.close();

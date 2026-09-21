import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const logs = [];
page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
page.on('response', res => {
  if (res.url().includes('identitytoolkit')) {
    logs.push({ type: 'response', url: res.url(), status: res.status() });
  }
});

await page.goto('http://localhost:3002/');
await page.waitForTimeout(1000);

// Click Sign in
const signInBtn = await page.$('button:has-text("Sign in")');
if (signInBtn) await signInBtn.click();
await page.waitForTimeout(500);

// Click "Sign Up"
const signUpLink = await page.$('button:has-text("Sign Up")');
if (signUpLink) await signUpLink.click();
await page.waitForTimeout(500);

// Fill name, email, pass
await page.fill('input[placeholder="e.g. Rahul Sharma"]', 'Arindram Handique');
await page.fill('input[type="email"]', 'test-aspirant-99@exampilot.ai');
await page.fill('input[type="password"]', 'Password@123');

const submitBtn = await page.$('button[type="submit"]');
if (submitBtn) await submitBtn.click();

await page.waitForTimeout(3000);

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';
await page.screenshot({ path: `${brainDir}/debug_signup_attempt.png` });

console.log('Signup test logs:');
console.log(JSON.stringify(logs, null, 2));

await browser.close();

import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://localhost:3002/');
await page.waitForTimeout(2000);

// Click "Sign in" button in navbar
const signInBtn = await page.$('button:has-text("Sign in")');
if (signInBtn) {
  await signInBtn.click();
  await page.waitForTimeout(1000);
}

// In sign in form, type an email and password and submit to see the enhanced error card
await page.fill('input[type="email"]', 'test@example.com');
await page.fill('input[type="password"]', 'password123');
const submitBtn = await page.$('button[type="submit"]');
if (submitBtn) {
  await submitBtn.click();
  await page.waitForTimeout(2000);
}

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';
await page.screenshot({ path: `${brainDir}/auth_modal_error_handling.png`, fullPage: false });
console.log('Saved auth_modal_error_handling.png');

await browser.close();

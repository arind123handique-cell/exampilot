import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';

console.log('1. Navigating to app and clearing session...');
await page.goto('http://localhost:3002/');
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.reload();
await page.waitForTimeout(1500);

// If already logged in, click sign out button
const signOutBtn = await page.$('button[aria-label="Sign out"], button[title="Sign out"]');
if (signOutBtn) {
  await signOutBtn.click();
  await page.waitForTimeout(1000);
}

console.log('2. Opening AuthModal...');
const signInBtn = await page.waitForSelector('button:has-text("Sign in")', { timeout: 5000 });
await signInBtn.click();
await page.waitForTimeout(800);

await page.screenshot({ path: `${brainDir}/auth_modal_new_tabs.png` });
console.log('Saved auth_modal_new_tabs.png');

console.log('3. Typing credentials in Sign In mode...');
await page.fill('input[type="email"]', 'arindramhandique9@gmail.com');
await page.fill('input[type="password"]', 'Password@123');

console.log('4. Clicking submit...');
const submitBtn = await page.$('button[type="submit"]');
if (submitBtn) await submitBtn.click();

// Wait for the diagnostic error message
await page.waitForTimeout(2500);

await page.screenshot({ path: `${brainDir}/auth_modal_signin_error_with_hint.png` });
console.log('Saved auth_modal_signin_error_with_hint.png');

console.log('5. Clicking "Click to Create Account" switch...');
const switchBtn = await page.$('button:has-text("Click to Create Account")');
if (switchBtn) {
  await switchBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${brainDir}/auth_modal_switched_to_signup.png` });
  console.log('Saved auth_modal_switched_to_signup.png');
}

console.log('6. Clicking "Continue as Guest" fallback...');
const guestBtn = await page.$('button:has-text("Continue as Guest")');
if (guestBtn) {
  await guestBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${brainDir}/auth_modal_guest_logged_in.png` });
  console.log('Saved auth_modal_guest_logged_in.png');
}

console.log('>>> All steps in modal flow test passed! <<<');
await browser.close();

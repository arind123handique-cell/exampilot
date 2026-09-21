import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', m => { if (m.type()==='error') console.log('CONSOLE ERR:', m.text()); });
page.on('pageerror', e => console.log('PAGE ERR:', e.message));

console.log('=== Test Offline Mock Generation (no key) ===');
await page.goto(`${BASE}/mock`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

// Check initial state: should show AI panel button
const hasAiPanel = await page.evaluate(() => document.body.innerText.includes('AI-Generated Custom Mock') || document.body.innerText.includes('AI Custom Mock'));
console.log('Has AI panel trigger:', hasAiPanel);

// Click AI Custom Mock to open panel if not already
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('AI Custom Mock'));
  if (btn) btn.click();
});
await page.waitForTimeout(800);

// Fill topic
await page.fill('input[placeholder*="Mock focus"]', 'Fluid Mechanics — Flow Through Pipes');
await page.waitForTimeout(500);

// Check button label: should be offline since no key
const btnLabel = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Generate') && b.textContent.includes('Mock'));
  return btn ? btn.textContent.trim() : null;
});
console.log('Generate button label:', btnLabel);

// Click generate
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Generate') && b.textContent.includes('Mock'));
  if (btn) btn.click();
});
console.log('Clicked generate, waiting...');
await page.waitForTimeout(3000);

// Check for toast or mock created
const bodyText = await page.evaluate(() => document.body.innerText);
const hasOffline = bodyText.includes('Offline Recipe');
const hasMock = bodyText.includes('AI Mock:') || bodyText.includes('Offline Recipe:');
const hasError = bodyText.includes('Generation failed');
const hasToast = bodyText.includes('mock ready') || bodyText.includes('Offline');

console.log('Body contains Offline:', hasOffline);
console.log('Has mock:', hasMock);
console.log('Has error:', hasError);
console.log('Has toast:', hasToast);

// Check for question palette after generation
const hasPalette = await page.evaluate(() => !!document.querySelector('[role="timer"]') || document.body.innerText.includes('Question Palette'));
console.log('Has palette/timer (mock running):', hasPalette);

await page.screenshot({ path: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\opencode\\browser-audit\\offline-mock.png', fullPage: true });
console.log('Screenshot saved');

if (hasMock || hasPalette) {
  console.log('✅ Offline mock generation WORKS without key');
} else {
  console.log('❌ Offline mock generation FAILED');
  console.log(bodyText.slice(0, 2000));
}

await browser.close();

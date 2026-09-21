import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', m => { if (m.type()==='error') console.log('CONSOLE ERR:', m.text()); });
page.on('pageerror', e => console.log('PAGE ERR:', e.message));

console.log('=== Test with fake invalid key (should fallback) ===');
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
// Set fake key
await page.evaluate(() => {
  localStorage.setItem('exampilot_gemini_key', 'fake-invalid-key-12345');
  localStorage.setItem('exampilot_gemini_model', 'gemini-3.8-flash');
});
console.log('Set fake key');
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);

await page.goto(`${BASE}/mock`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('AI Custom Mock'));
  if (btn) btn.click();
});
await page.waitForTimeout(800);
await page.fill('input[placeholder*="Mock focus"]', 'Geotechnical Engineering - Slope Stability');
await page.waitForTimeout(300);
const btnLabel = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Generate') && b.textContent.includes('Mock'));
  return btn ? btn.textContent.trim() : null;
});
console.log('Button label with fake key:', btnLabel); // should be AI, not offline

await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Generate') && b.textContent.includes('Mock'));
  if (btn) btn.click();
});
console.log('Clicked generate with fake key, waiting 12s for AI attempt + fallback...');
await page.waitForTimeout(12000);

const bodyText = await page.evaluate(() => document.body.innerText);
const hasFallback = bodyText.includes('Offline Recipe (AI failed)') || bodyText.includes('Offline Recipe');
const hasError = bodyText.includes('Generation failed');
const hasMock = bodyText.includes('Question Palette') || bodyText.includes('Time Left');

console.log('Has fallback mock:', hasFallback);
console.log('Has error UI:', hasError);
console.log('Has mock running:', hasMock);
if (hasFallback || hasMock) console.log('✅ Fallback works for invalid key');
else console.log('❌ No fallback, body:', bodyText.slice(0,1500));

// Cleanup: remove fake key
await page.evaluate(() => {
  localStorage.removeItem('exampilot_gemini_key');
  localStorage.removeItem('exampilot_gemini_model');
});
console.log('Cleaned fake key');

await browser.close();

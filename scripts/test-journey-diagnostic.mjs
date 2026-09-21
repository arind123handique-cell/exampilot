import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
page.on('pageerror', err => console.error('[BROWSER ERROR]', err.message));

try {
  await page.goto('http://localhost:3002', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Click 5 questions
  const clicked5 = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn5 = btns.find(b => b.textContent?.trim() === '5');
    if (btn5) { btn5.click(); return true; }
    return false;
  });
  console.log('Clicked 5Q:', clicked5);
  await page.waitForTimeout(300);

  // Click Start Test
  const started = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const startBtn = btns.find(b => b.textContent?.includes('Start Test'));
    if (startBtn) { startBtn.click(); return true; }
    return false;
  });
  console.log('Started test:', started);
  await page.waitForTimeout(1500);

  // Find all buttons on the active test screen
  const testBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim() || '');
  });
  console.log('Buttons on active test screen:', testBtns);

  // Click Submit Test
  const submittedClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.textContent?.includes('Submit Test'));
    if (submitBtn) { submitBtn.click(); return true; }
    return false;
  });
  console.log('Clicked Submit Test:', submittedClicked);
  await page.waitForTimeout(500);

  const modalBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim() || '');
  });
  console.log('Buttons after Submit Test click:', modalBtns);

  // Click Confirm Submit
  const confirmed = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Submit'));
    if (confirmBtn) { confirmBtn.click(); return true; }
    return false;
  });
  console.log('Clicked Confirm Submit:', confirmed);
  await page.waitForTimeout(1500);

  const finalBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim() || '');
  });
  console.log('Buttons on final screen:', finalBtns);
} catch (err) {
  console.error('Error:', err);
} finally {
  await browser.close();
}

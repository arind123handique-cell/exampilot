import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto('http://localhost:3002', { timeout: 5000 });
  await page.waitForTimeout(1000);

  // Open Question Studio
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Question Studio'));
    if (target) target.click();
  });
  await page.waitForTimeout(1000);

  // Click Gemini Config button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const configBtn = btns.find(b => b.title && b.title.includes('Configure Gemini API Key'));
    if (configBtn) configBtn.click();
  });
  await page.waitForTimeout(800);

  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b/gemini_settings_modal.png', fullPage: true });
  console.log('Saved Gemini settings modal screenshot!');
} catch (err) {
  console.error('Error:', err);
} finally {
  await browser.close();
}

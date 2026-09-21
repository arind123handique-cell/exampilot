import { chromium } from 'playwright';

const BASE = 'http://localhost:3000'; // or 3002 if 3000 is occupied
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  let activeUrl = 'http://localhost:3000';
  try {
    await page.goto(activeUrl, { timeout: 3000 });
  } catch {
    activeUrl = 'http://localhost:3002';
    await page.goto(activeUrl, { timeout: 5000 });
  }

  console.log('Loaded app at:', activeUrl);
  await page.waitForTimeout(1000);

  // Open Question Studio / Google Form Question Builder
  // Look for button "Question Studio" or "Create / Edit Questions"
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => 
      b.textContent.includes('Question Studio') || 
      b.textContent.includes('AI Question Studio') ||
      b.textContent.includes('Form Builder') ||
      b.textContent.includes('Custom Questions')
    );
    if (target) {
      target.click();
      return target.textContent.trim();
    }
    return null;
  });

  console.log('Clicked studio button:', clicked);
  await page.waitForTimeout(1000);

  // Check if Offline Generate and AI Model Generate buttons exist
  const buttonsText = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(b => b.textContent.trim()).filter(t => t.length > 0);
  });

  const hasOfflineBtn = buttonsText.some(t => t.includes('Offline Generate'));
  const hasAiModelBtn = buttonsText.some(t => t.includes('AI Model Generate'));
  console.log('Has "Offline Generate" button:', hasOfflineBtn);
  console.log('Has "AI Model Generate (Online Only)" button:', hasAiModelBtn);

  // Check AI Engine selector
  const hasEngineSelector = await page.evaluate(() => {
    const select = document.querySelector('select');
    return Array.from(document.querySelectorAll('select')).some(s => 
      s.innerHTML.includes('Gemini 3.8') && s.innerHTML.includes('OpenCode')
    );
  });
  console.log('Has AI Engine selector (Gemini / OpenCode):', hasEngineSelector);

  // Screenshot UI
  await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b/builder_ui_verification.png', fullPage: true });
  console.log('Screenshot saved to artifact folder!');

  // Test clicking "Offline Generate" on Irrigation
  if (hasOfflineBtn) {
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="CPM Network"]');
      if (input) {
        input.value = 'Irrigation Engineering';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const offlineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Offline Generate'));
      if (offlineBtn) offlineBtn.click();
    });

    console.log('Clicked Offline Generate with Irrigation Engineering...');
    await page.waitForTimeout(1500);

    const questionsCount = await page.evaluate(() => {
      const qCards = document.querySelectorAll('[id^="form-card-"]');
      return qCards.length;
    });
    console.log('Generated questions count in builder:', questionsCount);

    await page.screenshot({ path: 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b/builder_offline_generated.png', fullPage: true });
  }

} catch (err) {
  console.error('Test error:', err);
} finally {
  await browser.close();
}

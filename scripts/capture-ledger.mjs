import { chromium } from 'playwright';

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto('http://localhost:3002', { timeout: 10000 });
  await page.waitForTimeout(800);

  // Click My Test Records tab in top header
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const recTab = tabs.find(b => b.textContent?.includes('My Test Records'));
    if (recTab) recTab.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${brainDir}/step7_history_ledger_completed.png`, fullPage: false });
  console.log('Saved step7_history_ledger_completed.png!');
} catch (err) {
  console.error(err);
} finally {
  await browser.close();
}

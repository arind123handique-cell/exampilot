import { chromium } from 'playwright';

const brainDir = 'C:/Users/Administrator/.gemini/antigravity/brain/5b8c06e2-0431-4519-91c7-8a5326bb4b1b';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
page.on('pageerror', err => console.error('[BROWSER ERROR]', err.message));

async function runVerification() {
  console.log('--- Step 1: Navigating to ExamPilot ---');
  await page.goto('http://localhost:3002', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Take screenshot of Creator Screen
  await page.screenshot({ path: `${brainDir}/step1_creator_screen.png`, fullPage: false });
  console.log('Saved step1_creator_screen.png');

  console.log('--- Step 2: Configure 5Q Multi-Topic Test ---');
  // Click '5' questions button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn5 = btns.find(b => b.textContent?.trim() === '5');
    if (btn5) btn5.click();
  });
  await page.waitForTimeout(300);

  // Click 'Start Test'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const startBtn = btns.find(b => b.textContent?.includes('Start Test'));
    if (startBtn) startBtn.click();
  });
  await page.waitForTimeout(1500);

  console.log('--- Step 3: Active Test Screen & Save Draft ---');
  // Wait for Q 1 to load
  await page.waitForSelector('text=Q 1 /', { timeout: 5000 });

  // Answer Question 1 (click first MCQ option inside the options container)
  await page.evaluate(() => {
    const firstOption = document.querySelector('.space-y-2\\.5 button');
    if (firstOption) firstOption.click();
  });
  await page.waitForTimeout(400);

  // Click Save Draft button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveDraftBtn = btns.find(b => b.textContent?.includes('Save Draft'));
    if (saveDraftBtn) saveDraftBtn.click();
  });
  await page.waitForTimeout(800);

  await page.screenshot({ path: `${brainDir}/step2_active_test_draft_saved.png`, fullPage: false });
  console.log('Saved step2_active_test_draft_saved.png');

  console.log('--- Step 4: Navigate to My Test Records & Ledger ---');
  // Click 'My Test Records' tab in navigation
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const recTab = btns.find(b => b.textContent?.includes('My Test Records'));
    if (recTab) recTab.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${brainDir}/step3_test_records_with_draft.png`, fullPage: false });
  console.log('Saved step3_test_records_with_draft.png');

  console.log('--- Step 5: Resume Draft ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resumeBtn = btns.find(b => b.textContent?.includes('Resume Test Draft'));
    if (resumeBtn) resumeBtn.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${brainDir}/step4_resumed_test.png`, fullPage: false });
  console.log('Saved step4_resumed_test.png');

  console.log('--- Step 6: Submit Test ---');
  // Submit the test
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.textContent?.includes('Submit Test'));
    if (submitBtn) submitBtn.click();
  });
  await page.waitForTimeout(500);

  // Confirm Submit in modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Submit'));
    if (confirmBtn) confirmBtn.click();
  });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: `${brainDir}/step5_test_results_screen.png`, fullPage: false });
  console.log('Saved step5_test_results_screen.png');

  console.log('--- Step 7: Open Detailed Mistake Review Modal ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const reviewBtn = btns.find(b => b.textContent?.includes('Review Mistakes'));
    if (reviewBtn) reviewBtn.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${brainDir}/step6_detailed_mistake_review.png`, fullPage: false });
  console.log('Saved step6_detailed_mistake_review.png');

  // Close review modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close modal"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Close') || b.querySelector('svg.lucide-x'));
    if (closeBtn) closeBtn.click();
  });
  await page.waitForTimeout(500);

  console.log('--- Step 8: View Completed Test Records in History Ledger ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const historyBtn = btns.find(b => b.textContent?.includes('My Test Records'));
    if (historyBtn) historyBtn.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${brainDir}/step7_history_ledger_completed.png`, fullPage: false });
  console.log('Saved step7_history_ledger_completed.png');

  console.log('--- Step 9: Switch to Admin Studio ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminTab = btns.find(b => b.textContent?.includes('Admin Studio'));
    if (adminTab) adminTab.click();
  });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: `${brainDir}/step8_admin_content_studio.png`, fullPage: false });
  console.log('Saved step8_admin_content_studio.png');

  console.log('>>> All 9 verification steps completed successfully! <<<');
}

try {
  await runVerification();
} catch (err) {
  console.error('Verification failed:', err);
  process.exit(1);
} finally {
  await browser.close();
}

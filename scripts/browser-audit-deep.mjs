import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const PREVIEW = 'http://localhost:4173';
const OUT = 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\opencode\\browser-audit';

async function testDeepLinks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', m => { if (m.type()==='error') console.log('CONSOLE ERR:', m.text()); });
  page.on('pageerror', e => console.log('PAGE ERR:', e.message));

  console.log('=== Deep Link Tests ===');
  const links = [
    { url: `${BASE}/`, expect: 'study-plan', check: '#root' },
    { url: `${BASE}/practice?topic=Geotechnical`, expect: 'mcq-practice', checkText: 'Geotechnical' },
    { url: `${BASE}/syllabus?topic=civil-rcc`, expect: 'syllabus', checkText: 'RCC' },
    { url: `${BASE}/tutor?q=neutral%20axis`, expect: 'ai-tutor', checkText: 'neutral' },
    { url: `${BASE}/mock`, expect: 'mock-test', checkText: 'Mock' },
    { url: `${BASE}/pyq`, expect: 'pyq', checkText: 'PYQ' },
    { url: `${BASE}/analytics`, expect: 'analytics', checkText: 'Readiness' },
  ];

  for (const l of links) {
    await page.goto(l.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1500);
    const html = await page.content();
    const hasText = l.checkText ? html.includes(l.checkText) || (await page.evaluate(t => document.body.innerText.includes(t), l.checkText)) : true;
    const hasError = html.includes('Something went wrong');
    const white = await page.$eval('#root', el => el.innerHTML.length);
    const status = hasError ? 'BUG' : (hasText && white > 500) ? 'OK' : 'WARN';
    console.log(`${status === 'OK' ? '✅' : status==='WARN' ? '⚠️' : '❌'} ${l.url} -> ${l.expect} : textFound=${hasText} whiteLen=${white} error=${hasError}`);
    await page.screenshot({ path: `${OUT}/deep-${l.expect}.png`, fullPage: false });
  }

  // Test back/forward
  console.log('\n=== Back/Forward Test ===');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  // click syllabus via UI to push history
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Syllabus Explorer'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1000);
  const url1 = page.url();
  console.log(`After click syllabus: ${url1}`);
  await page.goBack();
  await page.waitForTimeout(800);
  console.log(`After back: ${page.url()}`);
  await page.goForward();
  await page.waitForTimeout(800);
  console.log(`After forward: ${page.url()}`);

  await browser.close();
}

async function testPreviewBundle() {
  console.log('\n=== Preview Bundle Test (4173) ===');
  // Check if preview is running, if not start it
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(PREVIEW, { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(1500);
    const html = await page.content();
    const hasRoot = html.includes('id="root"');
    const scripts = await page.evaluate(() => Array.from(document.querySelectorAll('script[src]')).map(s=>s.src).join(', '));
    console.log(`Preview hasRoot=${hasRoot}, scripts=${scripts.slice(0,300)}`);
    await page.screenshot({ path: `${OUT}/preview.png`, fullPage: true });
    console.log('Preview screenshot taken');
  } catch (e) {
    console.log('Preview not running:', e.message);
    // Start preview in background and retry?
  }
  await browser.close();
}

await testDeepLinks();
await testPreviewBundle();
console.log('\nDone');

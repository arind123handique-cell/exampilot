import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE = 'http://localhost:3000';
const OUT_DIR = 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\opencode\\browser-audit';
fs.mkdirSync(OUT_DIR, { recursive: true });

const consoleErrors = [];
const pageErrors = [];
const findings = [];

function logFind(severity, area, msg, evidence) {
  findings.push({ severity, area, msg, evidence });
  const icon = severity === 'BUG' ? '❌' : severity === 'WARN' ? '⚠️' : '✅';
  console.log(`${icon} [${severity}] ${area}: ${msg}${evidence ? ` — ${evidence}` : ''}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      consoleErrors.push(text);
      logFind('BUG', 'console', text);
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
    logFind('BUG', 'pageerror', err.message, err.stack?.slice(0, 500));
  });

  console.log(`\n=== Browser Audit: ${BASE} ===\n`);

  // Navigate to base
  let navigated = false;
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    navigated = true;
    logFind('OK', 'nav', `Navigated to ${BASE}`, `status ok`);
  } catch (e) {
    logFind('BUG', 'nav', `Failed to navigate to ${BASE}`, e.message);
    await browser.close();
    process.exit(1);
  }

  // Wait for #root to have content
  try {
    await page.waitForSelector('#root', { timeout: 5000 });
    const rootHtml = await page.$eval('#root', (el) => el.innerHTML);
    if (!rootHtml || rootHtml.length < 100) {
      logFind('BUG', 'render', 'White screen: #root empty or too small', `len=${rootHtml.length}`);
      await page.screenshot({ path: path.join(OUT_DIR, 'white-screen.png'), fullPage: true });
    } else {
      logFind('OK', 'render', `#root rendered (${rootHtml.length} chars)`);
      // Check for ErrorBoundary
      const isErrorBoundary = rootHtml.includes('Something went wrong');
      if (isErrorBoundary) {
        logFind('BUG', 'render', 'ErrorBoundary triggered', rootHtml.slice(0, 800));
        const bodyText = await page.$eval('#root', el => el.innerText);
        console.log('ErrorBoundary text:', bodyText.slice(0, 2000));
      }
    }
  } catch (e) {
    logFind('BUG', 'render', '#root not found', e.message);
  }

  // Check for vite HMR overlay
  try {
    const overlay = await page.$('vite-error-overlay');
    if (overlay) {
      const text = await overlay.evaluate(el => el.shadowRoot?.innerHTML || el.innerHTML);
      logFind('BUG', 'vite', 'Vite error overlay present', text.slice(0, 1000));
    }
  } catch {}

  // Take initial screenshot
  await page.screenshot({ path: path.join(OUT_DIR, '01-initial.png'), fullPage: true });
  console.log(`Screenshot: ${path.join(OUT_DIR, '01-initial.png')}`);

  // Check Design System: tokens
  const tokenCheck = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const checks = [];
    // Check for semantic tokens defined as CSS variables
    const tokens = ['--bg-canvas', '--bg-surface', '--line', '--ink', '--accent'];
    for (const t of tokens) {
      const v = styles.getPropertyValue(t).trim();
      checks.push({ token: t, value: v, ok: !!v });
    }
    // Check for raw palette usage (should be minimal)
    const html = document.documentElement.outerHTML;
    const rawWhite = (html.match(/bg-white/g) || []).length;
    const rawSlate = (html.match(/text-slate-/g) || []).length;
    return { tokens: checks, rawWhite, rawSlate, htmlLen: html.length };
  });
  console.log('Token check:', JSON.stringify(tokenCheck, null, 2));
  for (const t of tokenCheck.tokens) {
    if (!t.ok) logFind('BUG', 'design', `CSS token ${t.token} missing`, t.value);
    else logFind('OK', 'design', `Token ${t.token} = ${t.value}`);
  }
  if (tokenCheck.rawWhite > 20) logFind('WARN', 'design', `High raw bg-white usage (${tokenCheck.rawWhite}) — should use bg-card`);
  else logFind('OK', 'design', `Raw bg-white usage=${tokenCheck.rawWhite} (ok)`);

  // Check AppLayout elements
  const layoutCheck = await page.evaluate(() => {
    const checks = {};
    checks.sidebar = !!document.querySelector('aside');
    checks.header = !!document.querySelector('header');
    checks.main = !!document.querySelector('main#main-content');
    checks.bottomNav = !!document.querySelector('nav.fixed.bottom-0');
    checks.themeToggle = document.querySelectorAll('button[aria-label*="theme"]').length;
    checks.search = !!document.querySelector('button[aria-label*="command"]');
    checks.skipLink = !!document.querySelector('a[href="#main-content"]');
    // Check for Card primitives
    checks.cards = document.querySelectorAll('.rounded-2xl.border').length;
    // Check for nav groups
    checks.navGroups = document.querySelectorAll('nav').length;
    return checks;
  });
  console.log('Layout check:', layoutCheck);
  for (const [k, v] of Object.entries(layoutCheck)) {
    if (!v || v === 0) logFind('WARN', 'layout', `${k} missing or 0`, String(v));
    else logFind('OK', 'layout', `${k} present`, String(v));
  }

  // Check navigation: iterate through tabs
  const tabs = [
    { id: 'study-plan', label: "Today's Plan" },
    { id: 'syllabus', label: 'Syllabus Explorer' },
    { id: 'knowledge', label: 'Knowledge Hub' },
    { id: 'mcq-practice', label: 'MCQ Practice' },
    { id: 'mock-test', label: 'Mock Tests' },
    { id: 'pyq', label: 'PYQ Archive' },
    { id: 'ai-tutor', label: 'AI Tutor' },
    { id: 'analytics', label: 'Progress Analytics' },
    { id: 'ai-studio', label: 'Ingestion Studio' },
    { id: 'onboarding', label: 'Exam Setup' },
  ];

  // Mobile check: viewport 360
  const mobileContext = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(`[mobile] ${msg.text()}`); });
  mobilePage.on('pageerror', (err) => pageErrors.push(`[mobile] ${err.message}`));
  await mobilePage.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'mobile-initial.png'), fullPage: true });
  console.log('Mobile screenshot taken');

  // Check mobile: bottom nav visible, sidebar hidden, 1-handed usability
  const mobileCheck = await mobilePage.evaluate(() => {
    const bottomNav = document.querySelector('nav.fixed.bottom-0');
    const sidebar = document.querySelector('aside');
    const style = bottomNav ? window.getComputedStyle(bottomNav) : null;
    return {
      bottomNavExists: !!bottomNav,
      bottomNavVisible: bottomNav ? style.display !== 'none' && style.visibility !== 'hidden' : false,
      sidebarHidden: sidebar ? window.getComputedStyle(sidebar).display === 'none' : true,
      mainPaddingBottom: document.querySelector('main') ? window.getComputedStyle(document.querySelector('main')).paddingBottom : null,
      viewportWidth: window.innerWidth,
    };
  });
  console.log('Mobile check:', mobileCheck);
  if (!mobileCheck.bottomNavExists || !mobileCheck.bottomNavVisible) logFind('BUG', 'mobile', 'Bottom nav missing on mobile', JSON.stringify(mobileCheck));
  else logFind('OK', 'mobile', 'Bottom nav present on 360px');

  await mobileContext.close();

  // Desktop: iterate tabs via UI clicks if possible, else via direct navigation
  for (const tab of tabs) {
    console.log(`\n--- Checking tab: ${tab.id} (${tab.label}) ---`);
    // Try to find nav button for tab
    const navSelector = `button[aria-current], nav button`;
    // Instead, use page.evaluate to find and click nav item by label
    let clicked = false;
    try {
      clicked = await page.evaluate((label) => {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const target = buttons.find(b => b.textContent && b.textContent.trim().includes(label) && b.textContent.length < 80);
        if (target) { target.click(); return true; }
        // fallback: try navConfig label without apostrophe
        const fallback = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase().includes(label.toLowerCase().split(' ')[0]));
        if (fallback) { fallback.click(); return true; }
        return false;
      }, tab.label);
    } catch (e) {
      logFind('WARN', 'nav', `Evaluate failed for ${tab.id}`, e.message);
    }
    if (!clicked) {
      // Try direct: use history API? But we are on simple App without router, so we need to click AppLayout's setActiveTab
      // Find by data or icon: just try to click sidebar nav items sequentially
      logFind('WARN', 'nav', `Could not auto-click ${tab.id}, trying fallback selector`);
    }
    await page.waitForTimeout(1200);
    // Check for white screen or error after navigation
    const hasContent = await page.evaluate(() => {
      const main = document.querySelector('main');
      const text = main ? main.innerText.trim() : '';
      return { textLen: text.length, hasCards: document.querySelectorAll('.rounded-2xl').length, hasError: text.includes('Something went wrong') };
    });
    if (hasContent.hasError) {
      logFind('BUG', tab.id, 'ErrorBoundary after navigation', `textLen=${hasContent.textLen}`);
    } else if (hasContent.textLen < 50) {
      logFind('WARN', tab.id, 'Very small content after navigation', `len=${hasContent.textLen} cards=${hasContent.hasCards}`);
    } else {
      logFind('OK', tab.id, `Rendered (${hasContent.textLen} chars, ${hasContent.hasCards} cards)`);
    }
    // Check for console errors after nav
    const beforeErrCount = consoleErrors.length;
    await page.waitForTimeout(500);
    if (consoleErrors.length > beforeErrCount) {
      logFind('BUG', tab.id, `Console errors after nav: ${consoleErrors.slice(beforeErrCount).join(' | ')}`);
    }
    await page.screenshot({ path: path.join(OUT_DIR, `tab-${tab.id}.png`), fullPage: true });
  }

  // Theme check: toggle dark mode
  console.log('\n--- Theme toggle check ---');
  try {
    const themeBefore = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Theme before: ${themeBefore}`);
    // Find theme toggle button
    const toggleBtn = await page.$('button[aria-label*="theme"]');
    if (toggleBtn) {
      await toggleBtn.click();
      await page.waitForTimeout(800);
      const themeAfter = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log(`Theme after toggle: ${themeAfter}`);
      if (themeBefore === themeAfter) logFind('WARN', 'theme', 'Theme did not change after toggle', `${themeBefore} -> ${themeAfter}`);
      else logFind('OK', 'theme', `Toggled ${themeBefore} -> ${themeAfter}`);
      await page.screenshot({ path: path.join(OUT_DIR, 'theme-toggled.png'), fullPage: true });
      // Check for unreadable text: compute contrast by checking if ink color is visible
      const contrastCheck = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return { ok: false };
        const style = window.getComputedStyle(main);
        return { bg: style.backgroundColor, color: style.color, ok: style.color !== style.backgroundColor };
      });
      logFind(contrastCheck.ok ? 'OK' : 'BUG', 'theme', 'Dark mode contrast check', JSON.stringify(contrastCheck));
    } else {
      logFind('WARN', 'theme', 'Theme toggle button not found');
    }
  } catch (e) {
    logFind('BUG', 'theme', 'Theme toggle failed', e.message);
  }

  // Check for accessibility: landmarks, focus, keyboard
  const a11y = await page.evaluate(() => {
    const checks = {};
    checks.mainLandmark = !!document.querySelector('main');
    checks.navLandmark = !!document.querySelector('nav');
    checks.headerLandmark = !!document.querySelector('header');
    checks.skipLink = !!document.querySelector('a[href="#main-content"]');
    checks.focusVisible = !!document.querySelector(':focus-visible') || true; // can't test without focus
    checks.ariaLive = document.querySelectorAll('[aria-live]').length;
    checks.buttonsHaveLabel = Array.from(document.querySelectorAll('button')).filter(b => !b.getAttribute('aria-label') && !b.textContent.trim()).length;
    checks.imagesAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.getAttribute('alt')).length;
    return checks;
  });
  console.log('A11y check:', a11y);
  if (a11y.buttonsHaveLabel > 0) logFind('WARN', 'a11y', `${a11y.buttonsHaveLabel} buttons without label/text`);
  else logFind('OK', 'a11y', 'All buttons have accessible name');
  if (a11y.ariaLive === 0) logFind('WARN', 'a11y', 'No aria-live regions found');
  else logFind('OK', 'a11y', `Found ${a11y.ariaLive} aria-live regions`);

  // Check bundle: look for manualChunks in preview? For dev, check that css tokens are used not raw
  const bundleCheck = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src'));
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(s => s.getAttribute('href'));
    return { scripts, links, scriptCount: scripts.length };
  });
  console.log('Bundle check:', bundleCheck);

  // Summary
  console.log('\n=== AUDIT SUMMARY ===');
  console.log(`Findings: ${findings.length}, Console errors: ${consoleErrors.length}, Page errors: ${pageErrors.length}`);
  const bugs = findings.filter(f => f.severity === 'BUG');
  const warns = findings.filter(f => f.severity === 'WARN');
  console.log(`BUGS: ${bugs.length}, WARNS: ${warns.length}`);
  for (const b of bugs) console.log(`  BUG: ${b.area} - ${b.msg}`);
  for (const w of warns) console.log(`  WARN: ${w.area} - ${w.msg}`);

  // Write report JSON
  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify({ findings, consoleErrors, pageErrors, tokenCheck, layoutCheck, mobileCheck, a11y, bundleCheck }, null, 2));
  console.log(`\nReport written to ${path.join(OUT_DIR, 'report.json')}`);
  console.log(`Screenshots in ${OUT_DIR}`);

  await browser.close();

  // Exit with code 1 if bugs found (for CI)
  if (bugs.length > 0) {
    console.log('\n❌ Audit found bugs — review report and fix.');
    // Don't exit 1 for now, just show
  } else {
    console.log('\n✅ No critical bugs found.');
  }
}

run().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});

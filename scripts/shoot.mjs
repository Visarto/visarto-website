import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://localhost:4311';
const OUT = 'qa/screenshots';

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '430x932', width: 430, height: 932 },
  { name: '390x844', width: 390, height: 844 },
  { name: '375x812', width: 375, height: 812 },
  { name: '1280x600short', width: 1280, height: 600 },
];

const paths = (process.argv[2] ?? '/').split(',');
const only = process.argv[3];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--no-proxy-server'],
});
const errors = [];

for (const viewport of VIEWPORTS) {
  if (only && viewport.name !== only) continue;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${viewport.name}] ${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${viewport.name}] pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    // Next prefetches route payloads on hover and on entering the viewport.
    // Navigating to the next path in this sweep cancels any still in flight,
    // which the browser reports as an abort. That is this script moving on, not
    // a broken request, so only aborted RSC prefetches are ignored.
    const aborted = r.failure()?.errorText === 'net::ERR_ABORTED';
    if (aborted && r.url().includes('_rsc=')) return;
    errors.push(`[${viewport.name}] failed: ${r.url()} ${r.failure()?.errorText}`);
  });

  for (const path of paths) {
    const slug = path === '/' ? 'home' : path.replace(/\//g, '-').replace(/^-/, '');
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    // Walk the page so every entrance fires the way it would for a visitor,
    // then return to the top before capturing.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${slug}--${viewport.name}--fold.png` });
    await page.screenshot({ path: `${OUT}/${slug}--${viewport.name}--full.png`, fullPage: true });

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      errors.push(`[${viewport.name}] ${path} horizontal overflow: ${overflow.scrollWidth} > ${overflow.clientWidth}`);
    }
  }
  await context.close();
}

await browser.close();
if (errors.length) {
  console.log('ISSUES:');
  for (const e of [...new Set(errors)]) console.log(' ', e);
} else {
  console.log('No console errors, failed requests, or horizontal overflow.');
}

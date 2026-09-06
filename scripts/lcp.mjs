import { chromium } from 'playwright';

/**
 * Largest Contentful Paint, measured on the production build over a throttled
 * connection so the number means something. Run with INTRO=off to compare
 * against the same page with the opening curtain suppressed.
 */
const BASE = process.env.BASE ?? 'http://localhost:4316';
const RUNS = Number(process.env.RUNS ?? 5);
const suppressIntro = process.env.INTRO === 'off';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--no-proxy-server'],
});

const results = [];
for (let run = 0; run < RUNS; run += 1) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // A fresh session each run, so the curtain runs every time rather than being
  // skipped by its own once-per-session rule.
  if (suppressIntro) {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('visarto:intro', '1');
      } catch {}
    });
  }

  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 40,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (1 * 1024 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  // LCP is only exposed through a buffered PerformanceObserver; it never shows
  // up in getEntriesByType, which is the usual reason a measurement like this
  // silently returns nothing.
  const metrics = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = null;
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        setTimeout(() => resolve({ lcp, fcp: fcp ? fcp.startTime : null, cls }), 400);
      }),
  );
  results.push(metrics);
  await context.close();
}

await browser.close();

const median = (nums) => {
  const s = nums.filter((n) => n != null).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

console.log(`${suppressIntro ? 'WITHOUT' : 'WITH'} the opening, ${RUNS} runs, 4x CPU throttle, 4Mbps`);
console.log(`  FCP median  ${median(results.map((r) => r.fcp))?.toFixed(0)}ms`);
console.log(`  LCP median  ${median(results.map((r) => r.lcp))?.toFixed(0)}ms`);
console.log(`  CLS median  ${median(results.map((r) => r.cls))?.toFixed(4)}`);
console.log(`  LCP runs    ${results.map((r) => r.lcp?.toFixed(0)).join(', ')}`);

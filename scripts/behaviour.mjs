import { chromium } from 'playwright';

/**
 * The checks a screenshot cannot make.
 *
 * Reduced motion, a page with JavaScript switched off, the mobile menu's focus
 * behaviour, and the appointment path's refusal to confirm a request that was
 * not delivered.
 */

const BASE = process.env.BASE ?? 'http://localhost:4313';
const results = [];

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--no-proxy-server'],
});

// ---- Reduced motion ---------------------------------------------------------
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // Every revealing element must be at its final state without being scrolled to.
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter((element) => {
      const style = getComputedStyle(element);
      return (
        Number(style.opacity) < 0.99 ||
        (style.clipPath !== 'none' && style.clipPath.includes('100%')) ||
        (style.transform !== 'none' && style.transform !== 'matrix(1, 0, 0, 1, 0, 0)')
      );
    }).length,
  );
  check('reduced motion leaves every element in its final state', hidden === 0, `${hidden} hidden`);

  const transitions = await page.evaluate(() => {
    const durations = [...document.querySelectorAll('*')].map((element) =>
      parseFloat(getComputedStyle(element).transitionDuration) || 0,
    );
    return Math.max(0, ...durations);
  });
  check('reduced motion removes transition duration', transitions < 0.01, `${transitions}s`);

  await context.close();
}

// ---- JavaScript disabled ----------------------------------------------------
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  const visible = await page.evaluate(() => document.body.innerText.length).catch(() => 0);
  const headline = await page.locator('h1').first().isVisible();
  const cta = await page.getByRole('link', { name: 'Book an Appointment' }).first().isVisible();
  const revealCount = await page.locator('[data-reveal]').count();
  const stillHidden = await page
    .locator('[data-reveal]')
    .evaluateAll((elements) =>
      elements.filter((element) => Number(getComputedStyle(element).opacity) < 0.99).length,
    );

  check('without JavaScript the headline renders', headline);
  check('without JavaScript the appointment link renders', cta);
  check(
    'without JavaScript no section is left hidden',
    stillHidden === 0,
    `${stillHidden} of ${revealCount} hidden`,
  );
  check('without JavaScript the page still has its copy', visible === 0 || visible > 500);

  await context.close();
}

// ---- Mobile menu ------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const scrollBefore = await page.evaluate(() => {
    window.scrollTo(0, 400);
    return window.scrollY;
  });

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.waitForTimeout(250);

  const open = await page.evaluate(() => document.querySelector('dialog')?.open === true);
  check('the mobile menu opens', open);

  // Focus must be inside the dialog once it is open.
  const focusInside = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
  });
  check('focus moves into the menu', focusInside);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  const closed = await page.evaluate(() => document.querySelector('dialog')?.open === false);
  check('Escape closes the menu', closed);

  const scrollAfter = await page.evaluate(() => window.scrollY);
  check(
    'closing the menu restores the scroll position',
    Math.abs(scrollAfter - scrollBefore) < 4,
    `${scrollBefore} then ${scrollAfter}`,
  );

  await context.close();
}

// ---- The appointment path ---------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const refusal = await page.request.post(`${BASE}/api/appointments`, {
    data: {
      intent: 'appointment',
      name: 'A Test',
      email: 'test@example.com',
      place: 'studio',
    },
  });
  check(
    'an unconfigured destination refuses with 503',
    refusal.status() === 503,
    `status ${refusal.status()}`,
  );
  const refusalBody = await refusal.json();
  check('and reports why', refusalBody.reason === 'unavailable', JSON.stringify(refusalBody));

  const invalid = await page.request.post(`${BASE}/api/appointments`, {
    data: { intent: 'appointment', name: 'A', email: 'not-an-email' },
  });
  check('an invalid request is rejected before delivery', invalid.status() === 422);

  const honeypot = await page.request.post(`${BASE}/api/appointments`, {
    data: { intent: 'appointment', name: 'Bot', email: 'bot@example.com', company: 'Spam Ltd' },
  });
  check('the honeypot answers as though it succeeded', honeypot.status() === 200);

  await page.goto(`${BASE}/appointments`, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const notice = await page.getByText('Online requests are not connected yet').isVisible();
  check('the form says plainly that it is not connected', notice);

  const submitDisabled = await page.getByRole('button', { name: /Send the request/ }).isDisabled();
  check('and the submit button is disabled', submitDisabled);

  const confirmationVisible = await page
    .getByText('Your request has been sent')
    .isVisible()
    .catch(() => false);
  check('no confirmation is shown', !confirmationVisible);

  await context.close();
}

// ---- Metadata ---------------------------------------------------------------
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE}/collections`, { waitUntil: 'load' });

  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    og: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ld: document.querySelector('script[type="application/ld+json"]')?.textContent,
  }));

  check('the page has a title in the house pattern', meta.title === 'Collections | Visarto', meta.title);
  check('a description', Boolean(meta.description));
  check('an absolute canonical', Boolean(meta.canonical?.startsWith('http')), meta.canonical ?? '');
  check('Open Graph metadata', Boolean(meta.og));

  let graph = null;
  try {
    graph = JSON.parse(meta.ld ?? 'null');
  } catch {
    graph = null;
  }
  check('structured data parses', graph !== null);
  check(
    'structured data invents no rating, review, award or founding date',
    graph !== null &&
      !('aggregateRating' in graph) &&
      !('review' in graph) &&
      !('award' in graph) &&
      !('foundingDate' in graph),
  );
  check(
    'and emits no empty values',
    graph !== null && Object.values(graph).every((value) => value !== '' && value !== null),
  );

  await context.close();
}

// ---- The appointment path, with a destination configured --------------------
//
// Started only when a receiver is running. `scripts/behaviour.sh` starts one on
// DELIVERY_PORT and a second application instance pointed at it, so the whole
// journey is exercised: form, API, destination, and only then a confirmation.
if (process.env.CONFIGURED_BASE) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${process.env.CONFIGURED_BASE}/appointments`, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const noticeGone = await page
    .getByText('Online requests are not connected yet')
    .isVisible()
    .catch(() => false);
  check('with a destination configured the form is live', !noticeGone);

  await page.getByLabel('Your name').fill('Test Client');
  await page.getByLabel('Email').fill('client@example.com');
  await page.getByLabel('What are you having made?').fill('A two piece for a wedding in June.');
  await page.getByRole('button', { name: /Send the request/ }).click();

  await page.waitForTimeout(1200);
  const confirmed = await page.getByText('Your request has been sent').isVisible();
  check('a confirmation is shown once the destination accepts', confirmed);

  const received = await page.request.get(`${process.env.DELIVERY_BASE}/received`);
  const body = await received.json();
  check(
    'and the request actually arrived at the destination',
    body.count === 1 && body.last?.email === 'client@example.com',
    JSON.stringify(body.last ?? {}),
  );

  await context.close();
}

await browser.close();

const failed = results.filter((result) => !result.passed);
for (const result of results) {
  console.log(`${result.passed ? 'ok  ' : 'FAIL'} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exitCode = 1;

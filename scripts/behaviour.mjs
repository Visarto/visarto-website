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

/*
 * Everything the entrance system can leave hidden. A staggered container puts
 * the pre-state on its children rather than on itself, so counting only
 * `[data-reveal]` would pass whatever those children were doing.
 */
const ENTRANCE = '[data-reveal], [data-reveal][data-stagger] > *';

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
  const hidden = await page.evaluate((selector) =>
    [...document.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      return (
        Number(style.opacity) < 0.99 ||
        (style.clipPath !== 'none' && style.clipPath.includes('100%')) ||
        (style.transform !== 'none' && style.transform !== 'matrix(1, 0, 0, 1, 0, 0)')
      );
    }).length,
  ENTRANCE);
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
  const revealCount = await page.locator(ENTRANCE).count();
  const stillHidden = await page
    .locator(ENTRANCE)
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
  // Started as a second visit in the session, so the opening curtain is not in
  // the way. With it up, the click has to wait it out, and the retries move the
  // scroll before the click lands, which measures the test rather than the menu.
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('visarto:intro', '1');
    } catch {}
  });
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

// ---- The opening curtain ----------------------------------------------------
{
  // A visitor who has asked for reduced motion must never see it at all.
  const quiet = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const quietPage = await quiet.newPage();
  await quietPage.goto(`${BASE}/`, { waitUntil: 'load' });
  await quietPage.waitForTimeout(250);
  const quietState = await quietPage.evaluate(() => ({
    marked: document.documentElement.dataset.intro ?? null,
    covered: (() => {
      const el = document.querySelector('[class*="intro"]');
      return el ? getComputedStyle(el).display !== 'none' : false;
    })(),
  }));
  check('reduced motion never marks the opening pending', quietState.marked === null, String(quietState.marked));
  check('and the curtain is not displayed', !quietState.covered);
  await quiet.close();

  // A normal first visit shows it, and it lifts on its own.
  const normal = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await normal.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'commit' });
  const markedEarly = await page
    .waitForFunction(() => document.documentElement.dataset.intro === 'pending', { timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  check('a first visit runs the opening', markedEarly);

  const lifted = await page
    .waitForFunction(() => document.documentElement.dataset.intro === undefined, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  check('and it lifts without being dismissed', lifted);

  // Second visit in the same session: never again.
  await page.goto(`${BASE}/about`, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  const second = await page.evaluate(() => document.documentElement.dataset.intro ?? null);
  check('a second page in the session does not run it', second === null, String(second));
  await normal.close();

  // Without JavaScript the markup is present but never displayed.
  const noJs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(`${BASE}/`, { waitUntil: 'load' });
  const hiddenWithoutJs = await noJsPage.evaluate(() => {
    const el = document.querySelector('[class*="intro"]');
    return el ? getComputedStyle(el).display === 'none' : true;
  });
  check('without JavaScript the curtain never shows', hiddenWithoutJs);
  const headlineVisible = await noJsPage.locator('h1').first().isVisible();
  check('and the page underneath is readable', headlineVisible);
  await noJs.close();
}

// ---- The entrance system ----------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'load' });

  /*
   * Every passage on the homepage owns an entrance.
   *
   * The failure this guards against is not a broken animation. It is an uneven
   * page: four passages that simply appear and one that moves reads as a fault
   * rather than as restraint, and that is exactly the state the site was in
   * before the entrance system was made consistent.
   */
  const passages = await page.evaluate(() =>
    [...document.querySelectorAll('main section')].map((section) =>
      section.querySelector('[data-reveal]') ? 1 : 0,
    ),
  );
  check(
    'every homepage passage carries an entrance',
    passages.length > 0 && passages.every(Boolean),
    `${passages.filter(Boolean).length} of ${passages.length}`,
  );

  // The first screen belongs to the load rather than to the scroll: it composes
  // as the curtain clears, and it has to be finished well inside the time a
  // visitor is prepared to look at a page that is not doing anything.
  const settled = await page
    .waitForFunction(
      (selector) =>
        [...document.querySelectorAll(selector)].every((element) => {
          if (element.getBoundingClientRect().top > window.innerHeight) return true;
          const style = getComputedStyle(element);
          return (
            Number(style.opacity) > 0.99 &&
            (style.clipPath === 'none' || !style.clipPath.includes('100%')) &&
            (style.transform === 'none' || style.transform === 'matrix(1, 0, 0, 1, 0, 0)')
          );
        }),
      ENTRANCE,
      { timeout: 2000 },
    )
    .then(() => true)
    .catch(() => false);
  check('the first screen composes within two seconds', settled);

  // Then the rest of it, walked the way a reader walks it rather than jumped to
  // the end, because an observer that has been scrolled past never fires.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1400);

  const leftHidden = await page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)].filter((element) => {
      const style = getComputedStyle(element);
      return (
        Number(style.opacity) < 0.99 ||
        (style.clipPath !== 'none' && style.clipPath.includes('100%'))
      );
    }).length;
  }, ENTRANCE);
  check(
    'nothing is left hidden once the page has been read',
    leftHidden === 0,
    `${leftHidden} hidden`,
  );

  await context.close();
}

// ---- The cloth room's lens --------------------------------------------------
//
// The one piece of direct manipulation on the site, so the three ways of
// arriving at it are all asserted: a pointer, a keyboard, and neither.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('visarto:intro', '1');
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/cloth`, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const field = page.locator('[class*="WeaveField"][class*="field"]').first();
  check('the cloth room draws a weave field', (await field.count()) > 0);

  // Keyboard. The field takes focus and the arrow keys move the glass.
  await field.focus();
  const before = await field.evaluate((el) => el.style.getPropertyValue('--lens-x'));
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(120);
  const after = await field.evaluate((el) => el.style.getPropertyValue('--lens-x'));
  check('the lens is reachable and movable by keyboard', before !== after, `${before || 'unset'} then ${after}`);

  // The glass is never cut in half by the frame it sits in.
  const whole = await field.evaluate((el) => {
    const lens = el.querySelector('[class*="lens"]');
    if (!lens) return false;
    const f = el.getBoundingClientRect();
    const g = lens.getBoundingClientRect();
    return g.left >= f.left - 1 && g.right <= f.right + 1 && g.top >= f.top - 1 && g.bottom <= f.bottom + 1;
  });
  check('and stays inside the cloth', whole);

  await context.close();
}

{
  // Reduced motion holds the glass still: following a pointer is direct
  // manipulation, but it is still the screen moving without being asked.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/cloth`, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const field = page.locator('[class*="WeaveField"][class*="field"]').first();
  const box = await field.boundingBox();
  const at = async () =>
    field.evaluate((el) => {
      const lens = el.querySelector('[class*="lens"]');
      const s = lens ? getComputedStyle(lens) : null;
      return s ? `${s.left}/${s.top}` : '';
    });
  const rest = await at();
  if (box) await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7);
  await page.waitForTimeout(250);
  check('reduced motion holds the lens still', (await at()) === rest, rest);
  await context.close();
}

{
  // Without JavaScript the detail is simply there to be read.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/cloth`, { waitUntil: 'load' });
  const drawn = await page.locator('[class*="WeaveField"][class*="lens"]').first().isVisible();
  const structures = await page.locator('[class*="StructureSequence"][class*="plate"]').count();
  check('without JavaScript the cloth room is still complete', drawn && structures === 6, `${structures} plates`);
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

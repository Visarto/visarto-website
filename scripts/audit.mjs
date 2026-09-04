import { chromium } from 'playwright';

/**
 * A standing audit of the things that are easy to get wrong and hard to see in
 * a screenshot: heading order, focus reachability, contrast on real rendered
 * colours, touch target size, form labelling, and layout alignment.
 *
 * It is not a substitute for looking at the page. It is the pass that catches
 * what looking at the page does not.
 */

const BASE = process.env.BASE ?? 'http://localhost:4311';
const paths = (process.argv[2] ?? '/').split(',');

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--no-proxy-server'],
});

const findings = [];

function report(path, viewport, message) {
  findings.push(`${path} @ ${viewport}  ${message}`);
}

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();

  for (const path of paths) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    const result = await page.evaluate(() => {
      const problems = [];

      // ---- Heading order ----------------------------------------------------
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const h1s = headings.filter((h) => h.tagName === 'H1');
      if (h1s.length !== 1) problems.push(`h1 count is ${h1s.length}, expected 1`);
      let previous = 0;
      for (const heading of headings) {
        const level = Number(heading.tagName[1]);
        if (previous && level > previous + 1) {
          problems.push(`heading jumps h${previous} to h${level}: "${heading.textContent?.trim().slice(0, 40)}"`);
        }
        previous = level;
      }

      // ---- Landmarks --------------------------------------------------------
      if (!document.querySelector('main')) problems.push('no main landmark');
      if (!document.querySelector('header')) problems.push('no header landmark');
      if (!document.querySelector('footer')) problems.push('no footer landmark');

      // ---- Images -----------------------------------------------------------
      for (const img of document.querySelectorAll('img')) {
        if (img.getAttribute('alt') === null) {
          problems.push(`img without alt attribute: ${img.currentSrc || img.src}`);
        }
      }

      // ---- Links and buttons ------------------------------------------------
      const interactive = [...document.querySelectorAll('a[href], button, [role="button"]')];
      for (const element of interactive) {
        const name = (
          element.getAttribute('aria-label') ??
          element.textContent ??
          ''
        ).trim();
        if (!name) problems.push(`interactive element with no accessible name: ${element.outerHTML.slice(0, 90)}`);

        const rect = element.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0;
        if (visible && rect.height < 24) {
          problems.push(`target under 24px tall (${Math.round(rect.height)}px): "${name.slice(0, 40)}"`);
        }
      }

      // ---- Form controls ----------------------------------------------------
      for (const field of document.querySelectorAll('input, select, textarea')) {
        if (field.type === 'hidden') continue;
        const id = field.getAttribute('id');
        const labelled =
          (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
          field.closest('label') ||
          field.getAttribute('aria-label') ||
          field.getAttribute('aria-labelledby');
        if (!labelled) problems.push(`form control with no label: ${field.outerHTML.slice(0, 90)}`);
      }

      // ---- Contrast ---------------------------------------------------------
      const luminance = (rgb) => {
        const channel = (value) => {
          const v = value / 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      };
      const parse = (value) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const parts = match[1].split(',').map((n) => parseFloat(n));
        if (parts.length > 3 && parts[3] < 1) return null;
        return parts.slice(0, 3);
      };
      const backdrop = (element) => {
        let node = element;
        while (node && node !== document.documentElement) {
          const bg = parse(getComputedStyle(node).backgroundColor);
          if (bg) return bg;
          node = node.parentElement;
        }
        return [255, 255, 255];
      };

      const textNodes = [...document.querySelectorAll('p, span, a, li, dt, dd, h1, h2, h3, h4, label, button, address')];
      const seen = new Set();
      for (const element of textNodes) {
        const own = [...element.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
        );
        if (!own) continue;
        const style = getComputedStyle(element);
        if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const fg = parse(style.color);
        if (!fg) continue;
        const bg = backdrop(element);
        const l1 = luminance(fg);
        const l2 = luminance(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const size = parseFloat(style.fontSize);
        const bold = Number(style.fontWeight) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const required = large ? 3 : 4.5;
        if (ratio < required) {
          const key = `${style.color}|${style.fontSize}`;
          if (seen.has(key)) continue;
          seen.add(key);
          problems.push(
            `contrast ${ratio.toFixed(2)}:1 below ${required}:1 for ${style.fontSize} "${element.textContent.trim().slice(0, 40)}"`,
          );
        }
      }

      // ---- Layout -----------------------------------------------------------
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
        problems.push('document scrolls horizontally');
      }

      return problems;
    });

    for (const problem of result) report(path, viewport.name, problem);

    // ---- Keyboard reachability ---------------------------------------------
    const focusable = await page.evaluate(
      () =>
        document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ).length,
    );
    let reached = 0;
    await page.keyboard.press('Tab');
    for (let i = 0; i < focusable + 4; i += 1) {
      const active = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          tag: el.tagName,
          outline: style.outlineWidth,
          shadow: style.boxShadow,
        };
      });
      if (active) {
        reached += 1;
        if (active.outline === '0px' && active.shadow === 'none') {
          report(path, viewport.name, `focused ${active.tag} has no visible focus indicator`);
        }
      }
      await page.keyboard.press('Tab');
    }
    if (reached === 0) report(path, viewport.name, 'no element could be reached by keyboard');
  }

  await context.close();
}

await browser.close();

if (findings.length === 0) {
  console.log('Audit clean: headings, landmarks, names, labels, contrast, targets, focus, overflow.');
} else {
  console.log(`${findings.length} finding(s):`);
  for (const finding of [...new Set(findings)]) console.log(' ', finding);
  process.exitCode = 1;
}

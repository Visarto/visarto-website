import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Builds a single self-contained HTML file from the production build.
 *
 * The point is client review without deploying. Everything ships inside the one
 * file: the real markup, the real stylesheets, and the fonts as data URIs, so
 * the snapshot keeps working after the machine that made it is gone and depends
 * on no network at all.
 *
 * It is a snapshot, not the application. Navigation is swapped in on the hash,
 * the entrance observer and the menu are reimplemented in a few lines of plain
 * JavaScript, and the appointment form is inert, which is the state it is in on
 * the real site until a destination is configured anyway.
 */

const BASE = process.env.BASE ?? 'http://localhost:4315';
const OUT = process.env.OUT ?? 'qa/visarto-snapshot.html';

const ROUTES = [
  { path: '/', title: 'Visarto' },
  { path: '/made-to-measure', title: 'Made to measure' },
  { path: '/collections', title: 'Collections' },
  { path: '/collections/suits-and-business-wear', title: 'Suits and business wear' },
  { path: '/collections/evening-and-black-tie', title: 'Evening and black tie' },
  { path: '/collections/wedding', title: 'Wedding' },
  { path: '/collections/shirts', title: 'Shirts' },
  { path: '/collections/occasion', title: 'Occasion' },
  { path: '/collections/everyday', title: 'Everyday' },
  { path: '/cloth', title: 'Cloth' },
  { path: '/lookbook', title: 'Lookbook' },
  { path: '/about', title: 'About' },
  { path: '/appointments', title: 'Book an appointment' },
  { path: '/contact', title: 'Make an inquiry' },
  { path: '/privacy', title: 'Privacy' },
  { path: '/terms', title: 'Terms' },
];

const MIME = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
};

async function fetchText(path) {
  const response = await fetch(BASE + path);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.text();
}

/** Reads a build asset off disk rather than over the wire, and encodes it. */
async function assetDataUri(assetPath) {
  const onDisk = join('.next', assetPath.replace(/^\/_next\//, ''));
  const extension = assetPath.slice(assetPath.lastIndexOf('.'));
  const buffer = await readFile(onDisk);
  return `data:${MIME[extension] ?? 'application/octet-stream'};base64,${buffer.toString('base64')}`;
}

/** Everything between the opening <main> and the <footer> that follows it. */
function extractMain(html) {
  const start = html.indexOf('<main');
  const open = html.indexOf('>', start) + 1;
  const end = html.lastIndexOf('</main>');
  if (start < 0 || end < 0) throw new Error('no main element');
  return html.slice(open, end);
}

/** React's hydration payload and Next's runtime are of no use in a snapshot. */
function stripScripts(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, '')
    .replace(/<link\b[^>]*rel="preload"[^>]*>/gi, '');
}

/** Internal links become hash routes so the browser's back button still works. */
function rewriteLinks(html) {
  return html.replace(/href="\/([^"#]*)"/g, (match, path) => {
    if (path.startsWith('_next') || path.startsWith('api/')) return match;
    return `href="#/${path}"`;
  });
}

const pages = [];
const stylesheets = [];
let shell = null;
let htmlClasses = '';

for (const route of ROUTES) {
  const html = await fetchText(route.path);

  for (const href of html.match(/href="(\/_next\/static\/[^"]+\.css)"/g) ?? []) {
    const url = href.slice(6, -1);
    if (!stylesheets.includes(url)) stylesheets.push(url);
  }

  if (shell === null) {
    htmlClasses = html.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? '';
    const bodyStart = html.indexOf('<body');
    const bodyOpen = html.indexOf('>', bodyStart) + 1;
    const bodyEnd = html.lastIndexOf('</body>');
    shell = stripScripts(html.slice(bodyOpen, bodyEnd));
  }

  pages.push({
    ...route,
    main: rewriteLinks(stripScripts(extractMain(html))),
  });
}

// ---- Stylesheets, with every font baked in ---------------------------------
let css = '';
for (const url of stylesheets) {
  css += `\n/* ${url} */\n` + (await fetchText(url));
}

/**
 * The stylesheets live under /_next/static/chunks, so they reference fonts
 * relatively, as ../media/name.woff2. Both that form and the absolute one are
 * resolved back to a build asset and encoded.
 */
const fontRefs = [...new Set(css.match(/(?:\.\.\/media|\/_next\/static\/media)\/[^)"' ]+/g) ?? [])];
for (const ref of fontRefs) {
  const assetPath = ref.replace(/^\.\.\/media/, '/_next/static/media');
  css = css.split(ref).join(await assetDataUri(assetPath));
}

/**
 * next/font declares the family variables on classes it puts on <html>. The
 * artifact owns that element, so the declarations are hoisted onto :root and
 * the classes are carried on a wrapper as well.
 */
const familyDeclarations = [...css.matchAll(/--font-(fraunces|manrope):\s*([^;}]+)/g)]
  .map((match) => `--font-${match[1]}: ${match[2].trim()};`)
  .filter((value, index, all) => all.indexOf(value) === index)
  .join('\n  ');

css += `\n\n/* Hoisted so the families resolve without next/font's html classes. */\n:root {\n  ${familyDeclarations}\n}\n`;

// ---- The shell, with the first page's main swapped out for a slot -----------
const shellStart = shell.indexOf('<main');
const shellOpen = shell.indexOf('>', shellStart) + 1;
const shellEnd = shell.lastIndexOf('</main>');
const shellHtml = rewriteLinks(
  shell.slice(0, shellOpen) + '__MAIN__' + shell.slice(shellEnd),
);

const routerScript = `
(function () {
  var pages = __PAGES__;
  var main = document.getElementById('main');
  var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#/"]'));

  function show(path) {
    var page = pages[path] || pages['/'];
    main.innerHTML = page.main;
    document.title = path === '/' ? 'Visarto' : page.title + ' | Visarto';
    links.forEach(function (link) {
      var target = link.getAttribute('href').slice(1);
      var active = target === path || (target !== '/' && path.indexOf(target + '/') === 0);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    arm();
  }

  // The same entrance the site uses: one observer, and each element is dropped
  // from it once it has arrived.
  var observer = null;
  function arm() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.removeAttribute('data-js');
      return;
    }
    document.documentElement.setAttribute('data-js', 'true');
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    }
    document.querySelectorAll('[data-reveal]').forEach(function (element) {
      if (element.getBoundingClientRect().top < window.innerHeight * 1.2) {
        element.setAttribute('data-revealed', 'true');
      } else {
        observer.observe(element);
      }
    });
  }

  window.addEventListener('hashchange', function () {
    show(location.hash.slice(1) || '/');
  });

  // The mobile menu, as a native dialog, the way the application builds it.
  var dialog = document.querySelector('dialog');
  var trigger = document.querySelector('[data-menu-trigger]');
  if (dialog) {
    document.addEventListener('click', function (event) {
      var open = event.target.closest('button');
      if (open && open.textContent.trim() === 'Menu') dialog.showModal();
      else if (open && open.textContent.trim() === 'Close') dialog.close();
      else if (event.target.closest('dialog a')) dialog.close();
    });
  }
  if (trigger) trigger.addEventListener('click', function () { dialog.showModal(); });

  show(location.hash.slice(1) || '/');
})();
`;

const pageMap = Object.fromEntries(
  pages.map((page) => [page.path, { title: page.title, main: page.main }]),
);

const output = `<title>Visarto</title>
<style>
${css}
</style>
<div class="${htmlClasses}" style="display: contents;">
${shellHtml.replace('__MAIN__', '')}
</div>
<script>
${routerScript.replace('__PAGES__', JSON.stringify(pageMap))}
</script>
`;

await writeFile(OUT, output, 'utf8');
console.log(`${OUT}  ${(Buffer.byteLength(output) / 1024).toFixed(0)} KB, ${pages.length} pages`);

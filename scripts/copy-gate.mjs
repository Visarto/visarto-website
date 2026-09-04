import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

/**
 * The copy gate.
 *
 * Two scans over everything a visitor can read. The first is a character scan:
 * no em dash and no en dash may appear in authored viewer-facing copy. The
 * second is a vocabulary scan for the words and constructions that mark a page
 * as written by a machine or by a consultant.
 *
 * The second list is a set of warnings, not a banned-words list. Any of them can
 * be the strongest available word in the right sentence. The gate exists so that
 * using one is a decision somebody made rather than a default that slipped
 * through, and an allowance can be recorded here with its reason.
 *
 * Scope: `lib/content` holds every authored string on the site, and the schema
 * files hold the descriptions editors read. Comments are excluded, since they
 * are not viewer-facing.
 */

const SOURCES = [
  'lib/content/**/*.ts',
  'sanity/schemas/**/*.ts',
  'app/**/*.tsx',
  'components/**/*.tsx',
];

const DASHES = [
  { char: '—', name: 'em dash' },
  { char: '–', name: 'en dash' },
];

const STOCK = [
  'elevate',
  'elevated',
  'unlock',
  'empower',
  'seamless',
  'seamlessly',
  'robust',
  'leverage',
  'solutions',
  'testament',
  'delve',
  'unparalleled',
  'redefine',
  'reimagine',
  'curated experience',
  'sophisticated solutions',
  'timeless elegance',
  'modern elegance',
  'timeless sophistication',
  'crafted for you',
  'designed for you',
  'discover the difference',
  'experience the difference',
  'experience luxury',
  'step into',
  'world of',
  'more than just',
  'bespoke experience',
  'exceptional craftsmanship',
  'meticulously',
  'at the forefront',
  'in today',
  'game changer',
  'best in class',
  'cutting edge',
  'state of the art',
];

const CONSTRUCTIONS = [
  { pattern: /not just [^,.]{1,40}, but/i, name: '"not just X, but Y"' },
  { pattern: /where [a-z]+ meets [a-z]+/i, name: '"where X meets Y"' },
  { pattern: /\bjourney\b/i, name: '"journey"' },
  // "Landscape" is a real word for the shape of a photograph. Only the abstract
  // sense is a warning sign.
  {
    pattern: /\b(the|a|today's|current|competitive|evolving|changing)\s+\w*\s*landscape\b/i,
    name: '"landscape" used abstractly',
  },
];

/**
 * Allowances. Each records a string the gate would otherwise flag, and why it
 * is the strongest available wording. Nothing is allowed silently.
 */
const ALLOWED = [
  // "solutions" and friends have no allowances. If one is added it belongs here
  // with a sentence explaining why no other word will do.
];

/** Strips comments and import statements so only authored strings are scanned. */
function stripNonCopy(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
    .replace(/^\s*import[\s\S]*?from\s+'[^']*';$/gm, ' ');
}

function collect(pattern) {
  try {
    return globSync(pattern, { cwd: process.cwd() });
  } catch {
    return [];
  }
}

const files = [...new Set(SOURCES.flatMap(collect))].sort();
const findings = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const copy = stripNonCopy(raw);
  const lines = copy.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    for (const dash of DASHES) {
      if (line.includes(dash.char)) {
        findings.push(`${file}:${lineNumber}  ${dash.name} in authored copy`);
      }
    }

    const lowered = line.toLowerCase();
    for (const word of STOCK) {
      const boundary = new RegExp(`\\b${word.replace(/ /g, '\\s+')}\\b`, 'i');
      if (boundary.test(lowered) && !ALLOWED.some((allowed) => line.includes(allowed))) {
        findings.push(`${file}:${lineNumber}  stock wording: "${word}"`);
      }
    }

    for (const construction of CONSTRUCTIONS) {
      if (construction.pattern.test(line) && !ALLOWED.some((allowed) => line.includes(allowed))) {
        findings.push(`${file}:${lineNumber}  construction: ${construction.name}`);
      }
    }
  });
}

if (findings.length === 0) {
  console.log(`Copy gate clean across ${files.length} files: no em or en dashes, no stock wording.`);
} else {
  console.log(`${findings.length} finding(s):`);
  for (const finding of findings) console.log(' ', finding);
  process.exitCode = 1;
}

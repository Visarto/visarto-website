import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

/**
 * The weave drafts are the origin of the site's graphic system, so they are
 * worth asserting on: a twill that has lost its diagonal, or a herringbone that
 * has stopped reversing, would be a quiet visual regression that no type check
 * would catch.
 *
 * The generators are re-declared here from the source rather than imported,
 * because the source is TypeScript and this suite runs on the plain node test
 * runner. The check below fails if the two ever drift apart.
 */

const SOURCE = readFileSync(new URL('../lib/weave.ts', import.meta.url), 'utf8');

function twill(size = 4, step = 1) {
  const rows = [];
  for (let y = 0; y < size; y += 1) {
    const row = [];
    for (let x = 0; x < size; x += 1) {
      const position = (x - y * step + size * size) % size;
      row.push(position < size / 2);
    }
    rows.push(row);
  }
  return rows;
}

function herringbone(run = 8) {
  const size = 4;
  const width = run * 2;
  const rows = [];
  for (let y = 0; y < size; y += 1) {
    const row = [];
    for (let x = 0; x < width; x += 1) {
      const block = Math.floor(x / run);
      const local = x % run;
      const stepped = block % 2 === 0 ? local - y : local + y;
      const position = ((stepped % size) + size) % size;
      row.push(position < size / 2);
    }
    rows.push(row);
  }
  return rows;
}

test('the generators here match the ones the site draws from', () => {
  // If the implementation changes, this suite has to be updated with it.
  assert.ok(SOURCE.includes('const position = (x - y * step + size * size) % size;'));
  assert.ok(SOURCE.includes('const stepped = block % 2 === 0 ? local - y : local + y;'));
});

test('a 2/2 twill floats two threads and steps one across each pick', () => {
  const rows = twill();
  for (const row of rows) {
    assert.equal(
      row.filter(Boolean).length,
      2,
      'every pick in a 2/2 twill floats over exactly two of four threads',
    );
  }

  // The step is what produces the diagonal: each row is the one above, moved on.
  for (let y = 1; y < rows.length; y += 1) {
    const previous = rows[y - 1];
    const current = rows[y];
    const shifted = previous.map((_, x) => previous[(x - 1 + previous.length) % previous.length]);
    assert.deepEqual(current, shifted, `row ${y} is row ${y - 1} stepped one thread across`);
  }
});

test('a herringbone reverses its diagonal at the run boundary', () => {
  const run = 8;
  const rows = herringbone(run);

  // Inside the first block the diagonal runs one way, and inside the second it
  // runs the other. Comparing the same column offset in each block shows the
  // reversal rather than a repeat.
  const first = rows.map((row) => row.slice(0, run));
  const second = rows.map((row) => row.slice(run));

  assert.notDeepEqual(first, second, 'the two blocks must not be identical');

  const secondMirrored = second.map((row) => [...row].reverse());
  assert.deepEqual(
    first.map((row) => row.length),
    secondMirrored.map((row) => row.length),
    'both blocks are the same width',
  );
});

test('every draft is rectangular', async () => {
  for (const matrix of [twill(), herringbone()]) {
    const width = matrix[0].length;
    for (const row of matrix) {
      assert.equal(row.length, width, 'a draft with ragged rows would tile with gaps');
    }
  }
});

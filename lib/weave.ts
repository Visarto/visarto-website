/**
 * Weave structures, written as draft notation.
 *
 * A woven cloth is a grid of warp threads running the length of the roll and
 * weft threads running across it. At every intersection one of the two sits on
 * top. That binary is the entire structure of a cloth, and it is what a weaver
 * writes down as a draft: a grid of filled and empty squares.
 *
 * Visarto's graphic system is built from that notation. The matrices below are
 * real weave drafts, not decorative patterns, which is why they are worth
 * putting on the page.
 *
 * `true` means the warp passes over the weft at that intersection.
 */

export type WeaveId = 'plain' | 'twill' | 'herringbone' | 'hopsack' | 'birdseye' | 'glenCheck';

export type WeaveMatrix = boolean[][];

/** One thread over, one thread under. */
function plain(): WeaveMatrix {
  return [
    [true, false],
    [false, true],
  ];
}

/**
 * A 2/2 twill: the weft passes over two warp threads and under two, stepping
 * one thread across on every pick. The step is what produces the diagonal.
 */
function twill(size = 4, step = 1): WeaveMatrix {
  const rows: WeaveMatrix = [];
  for (let y = 0; y < size; y += 1) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x += 1) {
      const position = (x - y * step + size * size) % size;
      row.push(position < size / 2);
    }
    rows.push(row);
  }
  return rows;
}

/**
 * A twill whose direction reverses at a fixed interval. The reversal turns the
 * diagonal into a chevron, which is the herringbone.
 */
function herringbone(run = 8): WeaveMatrix {
  const size = 4;
  const width = run * 2;
  const rows: WeaveMatrix = [];
  for (let y = 0; y < size; y += 1) {
    const row: boolean[] = [];
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

/** Two threads treated as one in both directions. An open basket. */
function hopsack(): WeaveMatrix {
  return [
    [true, true, false, false],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true],
  ];
}

/**
 * A small dobby figure with a light centre. Read from across a room it looks
 * like a solid colour with a grain to it.
 */
function birdseye(): WeaveMatrix {
  return [
    [true, false, true, true],
    [false, true, false, true],
    [true, false, true, false],
    [true, true, false, true],
  ];
}

export const weaveMatrices: Record<Exclude<WeaveId, 'glenCheck'>, WeaveMatrix> = {
  plain: plain(),
  twill: twill(),
  herringbone: herringbone(),
  hopsack: hopsack(),
  birdseye: birdseye(),
};

/**
 * Glen check is not a separate binding. It is a 2/2 twill woven with the warp
 * and the weft each grouped into bands of dark and light threads. Where two
 * dark bands cross the cloth reads solid, where two light bands cross it reads
 * pale, and the two mixed quarters read as fine stripe. That is the check.
 */
export const glenCheck = {
  band: 8,
  ground: twill(),
} as const;

export type WeaveDescription = {
  id: WeaveId;
  name: string;
  /** A factual description of the structure. No claim about Visarto's stock. */
  note: string;
};

export const weaveIndex: WeaveDescription[] = [
  {
    id: 'plain',
    name: 'Plain',
    note: 'One thread over, one thread under, with no repeat beyond two. It is the flattest and most stable of the bindings, which is why shirting is woven this way.',
  },
  {
    id: 'twill',
    name: 'Twill',
    note: 'The weft passes over two warp threads and under two, stepping one across on every pick. The step leaves a diagonal on the face and lets the cloth fall rather than hold.',
  },
  {
    id: 'herringbone',
    name: 'Herringbone',
    note: 'A twill reversed at a fixed interval so the diagonal breaks into a chevron. The reversal is visible up close and disappears into a soft grain at conversational distance.',
  },
  {
    id: 'hopsack',
    name: 'Hopsack',
    note: 'Two threads treated as one in both directions. The structure is open and porous, so it moves air, and it creases less than a tightly set cloth.',
  },
  {
    id: 'birdseye',
    name: 'Birdseye',
    note: 'A small repeating figure with a light point at its centre. It behaves like a solid from a distance and shows its grain only when you are close enough to shake a hand.',
  },
  {
    id: 'glenCheck',
    name: 'Glen check',
    note: 'A twill woven with the warp and the weft each banded into dark and light groups. Where the bands cross they build four different quarters, and those quarters are the check.',
  },
];

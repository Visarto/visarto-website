import { glenCheck, weaveMatrices, type WeaveId } from '@/lib/weave';

/**
 * Every weave pattern the site can draw, defined once per document.
 *
 * Patterns are declared here rather than inside each media frame so that a page
 * with a dozen cloth fields still holds one copy of each tile. The fields
 * reference them by id.
 *
 * Two scales are published for each structure. `fine` is the texture of cloth
 * seen across a room and is used behind large compositions; `coarse` is the
 * draft itself and is used at swatch size, where the structure is the subject.
 *
 * A pattern referenced with `url(#id)` resolves its custom properties where it
 * is *defined*, not where it is used, so a single set painted with `var()`
 * silently keeps the root palette on every surface. That is invisible while the
 * surfaces are close in tone and glaring the moment they are not. So each tone
 * is emitted as its own set with literal colours, and a generated style block
 * points `--weave-*` at the right set per surface. Components still name only a
 * weave and a scale, and never learn where they are.
 *
 * The thread size is set per structure rather than once for all six, because
 * the repeats are not the same size in the cloth. A plain weave repeats over
 * two threads and a glen check over sixteen, so drawing both at one cell size
 * would make the plain weave read as a chequerboard and flatten the check into
 * noise. These values are chosen so that all six read at roughly the scale they
 * would have on a suit length lying on a table.
 */

const SCALES: Record<WeaveScale, Record<WeaveId, number>> = {
  fine: {
    plain: 1.25,
    twill: 2.75,
    herringbone: 2.5,
    hopsack: 2,
    birdseye: 2.75,
    glenCheck: 2,
  },
  coarse: {
    // Plain and hopsack are drawn small. Their drafts are chequerboards, and in
    // real cloth that reads as texture only because the threads are tiny; drawn
    // large they stop looking like poplin and start looking like a chessboard.
    plain: 2.25,
    twill: 6,
    herringbone: 5.5,
    hopsack: 3.75,
    birdseye: 6,
    glenCheck: 4.25,
  },
};

export type WeaveScale = 'fine' | 'coarse';

/**
 * The surfaces a cloth field can be drawn on, and the threads it takes there.
 *
 * The dark set used to hold warp and weft 1.28:1 apart, which is a difference
 * you can measure and cannot see: six structures drawn at that separation are
 * six identical rectangles, and a page about texture showed none. Warp against
 * ground is now 2:1 and the check bands 2.9:1, which is where a weave starts to
 * read as cloth rather than as a slightly uneven fill.
 */
const TONES = {
  dark: { ground: '#241f19', warp: '#5c4d3c', weft: '#241f19', band: '#77644b' },
  bone: { ground: '#ded6c5', warp: '#b8ab90', weft: '#e1daca', band: '#9c8d70' },
  close: { ground: '#221810', warp: '#57452e', weft: '#221810', band: '#705737' },
} as const;

type Tone = keyof typeof TONES;

const TONE_SELECTOR: Record<Tone, string> = {
  dark: ':root',
  bone: '.on-bone',
  close: '.on-close',
};

function patternId(id: WeaveId, scale: WeaveScale, tone: Tone): string {
  return `visarto-weave-${id}-${scale}-${tone}`;
}

/**
 * What a component asks for. It names a weave and a scale; the surface it is
 * standing on decides which set of threads that resolves to.
 */
export function weavePaint(id: WeaveId, scale: WeaveScale): string {
  return `var(--weave-${id}-${scale})`;
}

/** Squares for every intersection where `predicate` holds, as one path. */
function cellsToPath(
  rows: number,
  cols: number,
  cell: number,
  predicate: (x: number, y: number) => boolean,
): string {
  let d = '';
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!predicate(x, y)) continue;
      const px = +(x * cell).toFixed(3);
      const py = +(y * cell).toFixed(3);
      d += `M${px} ${py}h${cell}v${cell}h${-cell}z`;
    }
  }
  return d;
}

function MonochromeWeave({
  id,
  scale,
  tone,
}: {
  id: Exclude<WeaveId, 'glenCheck'>;
  scale: WeaveScale;
  tone: Tone;
}) {
  const matrix = weaveMatrices[id];
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const cell = SCALES[scale][id];
  const path = cellsToPath(rows, cols, cell, (x, y) => matrix[y]?.[x] === true);

  return (
    <pattern
      id={patternId(id, scale, tone)}
      width={cols * cell}
      height={rows * cell}
      patternUnits="userSpaceOnUse"
    >
      <rect width={cols * cell} height={rows * cell} fill={TONES[tone].weft} />
      <path d={path} fill={TONES[tone].warp} />
    </pattern>
  );
}

function GlenCheckWeave({ scale, tone }: { scale: WeaveScale; tone: Tone }) {
  const { band, ground } = glenCheck;
  const size = band * 2;
  const cell = SCALES[scale].glenCheck;
  const repeat = ground.length;

  // A thread is dark when it falls in a dark band. Which thread shows at an
  // intersection is decided by the twill underneath, so the four quarters of
  // the tile come out solid dark, solid light, and two fine stripes.
  const isDark = (x: number, y: number) => {
    const warpOver = ground[y % repeat]?.[x % repeat] === true;
    const darkBand = warpOver
      ? Math.floor(x / band) % 2 === 0
      : Math.floor(y / band) % 2 === 0;
    return darkBand;
  };

  return (
    <pattern
      id={patternId('glenCheck', scale, tone)}
      width={size * cell}
      height={size * cell}
      patternUnits="userSpaceOnUse"
    >
      <rect width={size * cell} height={size * cell} fill={TONES[tone].weft} />
      <path d={cellsToPath(size, size, cell, isDark)} fill={TONES[tone].band} />
      <path
        d={cellsToPath(size, size, cell, (x, y) => !isDark(x, y))}
        fill={TONES[tone].warp}
        opacity="0.55"
      />
    </pattern>
  );
}

const MONOCHROME: Exclude<WeaveId, 'glenCheck'>[] = [
  'plain',
  'twill',
  'herringbone',
  'hopsack',
  'birdseye',
];

const SCALE_KEYS: WeaveScale[] = ['fine', 'coarse'];

const ALL: WeaveId[] = [...MONOCHROME, 'glenCheck'];
const TONE_KEYS = Object.keys(TONES) as Tone[];

/**
 * The mapping from what a component asks for to the set it gets, generated from
 * the same lists the patterns are, so the two cannot drift apart.
 */
function toneStyles(): string {
  return TONE_KEYS.map((tone) => {
    const declarations = ALL.flatMap((id) =>
      SCALE_KEYS.map((scale) => `--weave-${id}-${scale}:url(#${patternId(id, scale, tone)});`),
    ).join('');
    return `${TONE_SELECTOR[tone]}{${declarations}}`;
  }).join('');
}

export function WeaveDefs() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: toneStyles() }} />
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          {TONE_KEYS.map((tone) =>
            SCALE_KEYS.map((scale) => (
              <Fragmented key={`${tone}-${scale}`}>
                {MONOCHROME.map((id) => (
                  <MonochromeWeave key={`${id}-${scale}-${tone}`} id={id} scale={scale} tone={tone} />
                ))}
                <GlenCheckWeave key={`glen-${scale}-${tone}`} scale={scale} tone={tone} />
              </Fragmented>
            )),
          )}
        </defs>
      </svg>
    </>
  );
}

function Fragmented({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

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

export function weavePatternId(id: WeaveId, scale: WeaveScale): string {
  return `visarto-weave-${id}-${scale}`;
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

function MonochromeWeave({ id, scale }: { id: Exclude<WeaveId, 'glenCheck'>; scale: WeaveScale }) {
  const matrix = weaveMatrices[id];
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const cell = SCALES[scale][id];
  const path = cellsToPath(rows, cols, cell, (x, y) => matrix[y]?.[x] === true);

  return (
    <pattern
      id={weavePatternId(id, scale)}
      width={cols * cell}
      height={rows * cell}
      patternUnits="userSpaceOnUse"
    >
      <rect width={cols * cell} height={rows * cell} fill="var(--cloth-weft)" />
      <path d={path} fill="var(--cloth-warp)" />
    </pattern>
  );
}

function GlenCheckWeave({ scale }: { scale: WeaveScale }) {
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
      id={weavePatternId('glenCheck', scale)}
      width={size * cell}
      height={size * cell}
      patternUnits="userSpaceOnUse"
    >
      <rect width={size * cell} height={size * cell} fill="var(--cloth-weft)" />
      <path d={cellsToPath(size, size, cell, isDark)} fill="var(--cloth-dark)" />
      <path
        d={cellsToPath(size, size, cell, (x, y) => !isDark(x, y))}
        fill="var(--cloth-warp)"
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

export function WeaveDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {SCALE_KEYS.map((scale) => (
          <Fragmented key={scale}>
            {MONOCHROME.map((id) => (
              <MonochromeWeave key={`${id}-${scale}`} id={id} scale={scale} />
            ))}
            <GlenCheckWeave key={`glen-${scale}`} scale={scale} />
          </Fragmented>
        ))}
      </defs>
    </svg>
  );
}

function Fragmented({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

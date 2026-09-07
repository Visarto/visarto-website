'use client';

import { useCallback, useRef } from 'react';

import { weavePaint, type WeaveScale } from '@/components/primitives/WeaveDefs';
import { glenCheck, weaveMatrices, type WeaveId } from '@/lib/weave';
import styles from './WeaveField.module.css';

/**
 * A length of cloth with its own draft drawn over it.
 *
 * This is the one thing on the site that is not a photograph of tailoring and
 * is not a claim about the house. It is the cloth itself, drawn from the
 * notation that produces it, at two scales at once: the field is the structure
 * at the size it has on a suit length, and the lens over it is the same
 * structure at the size it has under a linen tester, with the weaver's own grid
 * of filled and empty squares laid on top and in register.
 *
 * A filled square is a warp thread passing over a weft thread. Six of those
 * decisions repeated is a plain weave; sixteen of them banded is a glen check.
 * Nothing here is decoration: every square is read out of `lib/weave.ts`, which
 * holds real drafts.
 *
 * Three states, in the order a visitor is likely to meet them:
 *
 *   no JavaScript, or reduced motion   the lens sits still, off centre, and the
 *                                      detail is simply there to be read
 *   pointer                            the lens follows it
 *   keyboard                           the arrow keys move it, in the same steps
 *
 * The pointer path writes two custom properties and touches no React state, so
 * moving across a field costs a style recalculation and nothing else.
 */

/** The size of one intersection inside the lens, in SVG units. */
const DRAFT_CELL = 20;
/** How far an arrow key moves the lens, as a fraction of the field. */
const KEY_STEP = 0.06;

type Props = {
  weave: WeaveId;
  /** Names the structure for assistive technology. */
  label: string;
  /**
   * `fine` is cloth at the distance you see it across a room and is right
   * behind a composition. `coarse` is cloth on a table, and is what the cloth
   * room wants: there the structure is the subject and has to read outside the
   * lens as well as inside it.
   */
  scale?: WeaveScale;
  className?: string;
};

/** Squares for every intersection where the warp passes over the weft. */
function draftPath(matrix: boolean[][], cell: number): string {
  let d = '';
  for (let y = 0; y < matrix.length; y += 1) {
    const row = matrix[y];
    if (!row) continue;
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] !== true) continue;
      d += `M${x * cell} ${y * cell}h${cell}v${cell}h${-cell}z`;
    }
  }
  return d;
}

/**
 * The draft for one structure, as a matrix. Glen check has no matrix of its own
 * because it is not a separate binding: it is a twill whose warp and weft are
 * banded, so the notation that explains it is the twill it is built on.
 */
function matrixFor(weave: WeaveId): boolean[][] {
  if (weave === 'glenCheck') return glenCheck.ground as unknown as boolean[][];
  return weaveMatrices[weave];
}

export function WeaveField({ weave, label, scale = 'fine', className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const matrix = matrixFor(weave);
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const patternId = `visarto-draft-${weave}`;

  /*
   * The glass is held whole. Left to follow the pointer exactly it walks off
   * the edge of the cloth and gets cut in half by the frame, which reads as a
   * rendering fault rather than as a tool reaching the selvedge. The travel is
   * inset by half the lens on each side instead, so it stops at the edge the
   * way a real one would.
   */
  const place = useCallback((xRatio: number, yRatio: number) => {
    const element = ref.current;
    const lens = lensRef.current;
    if (!element) return;

    let x = xRatio;
    let y = yRatio;
    if (lens) {
      const field = element.getBoundingClientRect();
      const glass = lens.getBoundingClientRect();
      const insetX = field.width ? glass.width / 2 / field.width : 0;
      const insetY = field.height ? glass.height / 2 / field.height : 0;
      x = Math.min(1 - insetX, Math.max(insetX, x));
      y = Math.min(1 - insetY, Math.max(insetY, y));
    }

    element.style.setProperty('--lens-x', `${(x * 100).toFixed(2)}%`);
    element.style.setProperty('--lens-y', `${(y * 100).toFixed(2)}%`);
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const element = ref.current;
      if (!element) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const box = element.getBoundingClientRect();
      element.dataset.tracking = 'true';
      place((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
    },
    [place],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const element = ref.current;
      if (!element) return;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-KEY_STEP, 0],
        ArrowRight: [KEY_STEP, 0],
        ArrowUp: [0, -KEY_STEP],
        ArrowDown: [0, KEY_STEP],
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      const current = getComputedStyle(element);
      const read = (name: string, fallback: number) => {
        const raw = current.getPropertyValue(name).trim();
        const value = Number.parseFloat(raw);
        return Number.isFinite(value) ? value / 100 : fallback;
      };
      element.dataset.tracking = 'true';
      place(
        Math.min(1, Math.max(0, read('--lens-x', 0.3) + move[0])),
        Math.min(1, Math.max(0, read('--lens-y', 0.42) + move[1])),
      );
    },
    [place],
  );

  return (
    <div
      ref={ref}
      className={[styles.field, className].filter(Boolean).join(' ')}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        const element = ref.current;
        if (element) delete element.dataset.tracking;
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="img"
      aria-label={`${label}, drawn from its weave draft. Move the pointer or use the arrow keys to read the structure at thread scale.`}
    >
      {/* The cloth, at the scale it has on a suit length. */}
      <svg className={styles.cloth} aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill={weavePaint(weave, scale)} />
      </svg>

      {/* The same structure under the glass, with the draft grid over it. */}
      <div ref={lensRef} className={styles.lens} aria-hidden="true">
        <svg className={styles.draft} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern
              id={patternId}
              width={cols * DRAFT_CELL}
              height={rows * DRAFT_CELL}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={draftPath(matrix, DRAFT_CELL)}
                className={styles.draftFill}
                shapeRendering="crispEdges"
              />
              <path
                d={Array.from({ length: cols + 1 }, (_, x) => `M${x * DRAFT_CELL} 0V${rows * DRAFT_CELL}`)
                  .concat(
                    Array.from(
                      { length: rows + 1 },
                      (_, y) => `M0 ${y * DRAFT_CELL}H${cols * DRAFT_CELL}`,
                    ),
                  )
                  .join('')}
                className={styles.draftGrid}
                shapeRendering="crispEdges"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" className={styles.draftGround} />
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    </div>
  );
}

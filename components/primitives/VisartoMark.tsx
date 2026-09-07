import type { SVGProps } from 'react';

/**
 * The Visarto mark.
 *
 * A downward-pointing triangle enclosing a nested V, in the geometry of the
 * business card mark. Rebuilt from primitives rather than traced, so awaits
 * replacement by Nick's approved vector source. Until then, the mark is used
 * only in the two icon slots (`app/icon.svg`, `app/apple-icon.svg`) and any
 * component that opts in by rendering this primitive directly.
 *
 * Drawn with `currentColor` so a caller controls tone through the parent's
 * `color`. Decorative by default; pass a `title` to make it an accessible
 * name.
 */
export function VisartoMark({
  title,
  className,
  ...rest
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      {...rest}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M6 9 H26 L16 25 Z" />
        <path d="M11 12.5 L16 20.5 L21 12.5" />
      </g>
    </svg>
  );
}

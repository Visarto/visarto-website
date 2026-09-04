import Image from 'next/image';

import { focalPosition, imageUrl } from '@/sanity/lib/image';
import type { SanityImageSource } from '@/sanity/lib/types';
import type { WeaveId } from '@/lib/weave';
import { weavePatternId, type WeaveScale } from './WeaveDefs';
import styles from './MediaFrame.module.css';

/**
 * The editorial image frame.
 *
 * Two states, and both are designed. With a photograph it crops to the ratio
 * asked for and holds the focal point supplied by the editor. Without one it
 * draws the cloth field and states, in the margin, exactly which photograph
 * belongs there.
 *
 * The second state is not a broken image. It is a layout waiting for artwork,
 * marked the way a layout waiting for artwork is marked, and it must never be
 * mistaken for a finished photograph of a Visarto garment.
 */

export type MediaFrameProps = {
  ratio: string;
  image?: SanityImageSource | undefined;
  /**
   * Required whenever an image is present. Decorative cloth fields are hidden
   * from assistive technology instead.
   */
  alt?: string;
  sizes: string;
  priority?: boolean;
  weave?: WeaveId;
  weaveScale?: WeaveScale;
  /** The art direction for the photograph this frame is holding open. */
  brief?: string;
  /**
   * `compact` prints the slot name alone. Use it wherever several frames sit
   * together: six copies of the same paragraph of art direction is noise, and
   * the full direction belongs in the CMS field the editor is filling anyway.
   */
  briefTone?: 'full' | 'compact';
  className?: string;
};

export function MediaFrame({
  ratio,
  image,
  alt,
  sizes,
  priority = false,
  weave = 'twill',
  weaveScale = 'fine',
  brief,
  briefTone = 'full',
  className,
}: MediaFrameProps) {
  const src = image ? imageUrl(image, 2000) : null;
  const classes = [styles.frame, className].filter(Boolean).join(' ');

  if (src) {
    return (
      <figure
        className={classes}
        style={
          {
            ['--frame-ratio']: ratio,
            ['--focal']: focalPosition(image),
          } as React.CSSProperties
        }
      >
        <Image
          src={src}
          alt={alt ?? image?.alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      </figure>
    );
  }

  return (
    <figure
      className={classes}
      style={{ ['--frame-ratio']: ratio } as React.CSSProperties}
      data-state="awaiting-photography"
    >
      <svg className={styles.cloth} aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill={`url(#${weavePatternId(weave, weaveScale)})`} />
      </svg>
      <span className={styles.marks} aria-hidden="true" />
      {brief ? (
        <figcaption
          className={briefTone === 'compact' ? styles.briefCompact : styles.brief}
        >
          <span className={`annotation ${styles.briefTitle}`}>Photograph required</span>
          {briefTone === 'compact' ? (
            <span className={styles.briefSlot}>{brief}</span>
          ) : (
            <p className={styles.briefBody}>{brief}</p>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

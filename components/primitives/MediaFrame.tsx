import Image from 'next/image';
import { preload } from 'react-dom';

import { focalPosition, imageUrl } from '@/sanity/lib/image';
import type { SanityImageSource } from '@/sanity/lib/types';
import type { WeaveId } from '@/lib/weave';
import { PhotographRequired } from './PhotographRequired';
import { weavePaint, type WeaveScale } from './WeaveDefs';
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

/**
 * The width variant every placeholder ships alongside its full size file, so a
 * phone is not made to download a desktop photograph. Convention rather than
 * configuration: `foo.jpg` is accompanied by `foo@900.jpg`.
 */
function fallbackSrcSet(src: string): string | undefined {
  if (!src.endsWith('.jpg')) return undefined;
  return `${src.replace(/\.jpg$/, '@900.jpg')} 900w, ${src} 1800w`;
}

export type MediaFrameProps = {
  ratio: string;
  image?: SanityImageSource | undefined;
  /**
   * Local static URL (served from `/public`) used only when no Sanity `image`
   * is present. Development / pre-launch placeholder path — a real photograph
   * uploaded in the studio always wins.
   */
  fallbackSrc?: string;
  /**
   * An art-directed crop of the same subject, used below 48rem.
   *
   * A full-bleed frame is about 1.8:1 on a desktop and about 0.56:1 on a phone.
   * No single landscape file survives both through a centred cover: the phone
   * gets the middle third, which on a portrait subject is the backdrop. Where a
   * slot runs full bleed it carries a second crop rather than a cleverer
   * `object-position`.
   */
  fallbackSrcMobile?: string;
  /**
   * `object-position` for the fallback path, e.g. `'72% 50%'`. The Sanity path
   * takes its focal point from the editor's hotspot instead.
   */
  focal?: string;
  /** The same, below 48rem, for a frame whose crop changes shape. */
  focalMobile?: string;
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
  fallbackSrc,
  fallbackSrcMobile,
  focal,
  focalMobile,
  alt,
  sizes,
  priority = false,
  weave = 'twill',
  weaveScale = 'fine',
  brief,
  briefTone = 'full',
  className,
}: MediaFrameProps) {
  const usingFallback = !image && Boolean(fallbackSrc);
  const src = image ? imageUrl(image, 2000) : fallbackSrc ?? null;
  const classes = [styles.frame, className].filter(Boolean).join(' ');

  /*
   * A priority frame on the placeholder path asks for its photograph in the
   * document head rather than waiting to be discovered when the markup is
   * parsed. `next/image` does this for the CMS path already; the plain <img>
   * that path deliberately avoids does not, and on the opening screen that is
   * the difference between the photograph arriving with the page and arriving
   * after it. The descriptors have to match the element exactly or the browser
   * fetches twice.
   */
  if (usingFallback && priority && src) {
    // Media-scoped, because a frame carrying an art-directed phone crop would
    // otherwise preload the desktop file and then download the phone one as
    // well: two photographs fetched to show one.
    const breakpoint = fallbackSrcMobile ? '(min-width: 48rem)' : undefined;
    preload(src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: fallbackSrcSet(src),
      imageSizes: sizes,
      ...(breakpoint ? { media: breakpoint } : {}),
    });
    if (fallbackSrcMobile) {
      preload(fallbackSrcMobile, {
        as: 'image',
        fetchPriority: 'high',
        media: '(max-width: 47.99rem)',
      });
    }
  }

  if (src) {
    return (
      <figure
        className={classes}
        style={
          {
            ['--frame-ratio']: ratio,
            ['--focal']: image ? focalPosition(image) : (focal ?? '50% 50%'),
            ...(focalMobile ? { ['--focal-mobile']: focalMobile } : {}),
          } as React.CSSProperties
        }
      >
        {usingFallback ? (
          /* Placeholder path: a plain <img>. Bypasses next/image's optimizer
             and its measurement cache, which was pinning the previous encoded
             copy across client-side navigations. Also means overwriting the
             file in `public/placeholders` shows up on the next reload with no
             cache dance. The width variants are carried by hand instead. */
          <picture>
            {fallbackSrcMobile ? (
              <source media="(max-width: 47.99rem)" srcSet={fallbackSrcMobile} />
            ) : null}
            <img
              src={src}
              srcSet={fallbackSrcSet(src)}
              sizes={sizes}
              alt={alt ?? ''}
              className={styles.image}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : undefined}
              decoding="async"
            />
          </picture>
        ) : (
          <Image
            src={src}
            alt={alt ?? image?.alt ?? ''}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.image}
          />
        )}
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
        <rect width="100%" height="100%" fill={weavePaint(weave, weaveScale)} />
      </svg>
      <span className={styles.marks} aria-hidden="true" />
      {brief ? (
        <div className={styles.brief}>
          <PhotographRequired tone={briefTone}>{brief}</PhotographRequired>
        </div>
      ) : null}
    </figure>
  );
}

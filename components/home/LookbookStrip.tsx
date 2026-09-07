import { QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { Reveal } from '@/components/primitives/Reveal';
import type { LookbookItem } from '@/sanity/lib/types';
import styles from './LookbookStrip.module.css';

const RATIOS = ['4 / 5', '3 / 4', '5 / 7'];

/**
 * Fallback tiles used while real photography is being commissioned. The frames
 * are the same shape as the finished passage; only the source differs.
 * Removing an entry here (or letting Sanity supply 3+ items) turns the
 * placeholder off cleanly, with no other change needed.
 */
const PLACEHOLDER_TILES = [
  { src: '/placeholders/lookbook-tile-01.jpg', caption: '' },
  { src: '/placeholders/lookbook-tile-02.jpg', caption: '' },
  { src: '/placeholders/lookbook-tile-03.jpg', caption: '' },
];

export function LookbookStrip({ items }: { items: LookbookItem[] }) {
  const shown = items.slice(0, 3);
  const usePlaceholders = shown.length < 3;

  return (
    <section className={styles.section} aria-labelledby="lookbook-heading">
      <div className="sheet">
        <Reveal stagger className={styles.head}>
          <h2 id="lookbook-heading" className="display-2">
            Recent work
          </h2>
          <QuietLink href="/lookbook">The full lookbook</QuietLink>
        </Reveal>

        {/* Three frames, uncovering left to right. */}
        <Reveal stagger variant="mask" className={styles.grid}>
          {usePlaceholders
            ? PLACEHOLDER_TILES.map((tile, index) => (
                <figure key={tile.src} className={styles.item}>
                  <MediaFrame
                    ratio={RATIOS[index] ?? '4 / 5'}
                    fallbackSrc={tile.src}
                    alt=""
                    sizes="(min-width: 48rem) 40vw, 100vw"
                  />
                </figure>
              ))
            : shown.map((item, index) => (
                <figure key={item._id} className={styles.item}>
                  <MediaFrame
                    ratio={RATIOS[index] ?? '4 / 5'}
                    image={item.image}
                    alt={item.image.alt ?? item.title ?? ''}
                    sizes="(min-width: 48rem) 40vw, 100vw"
                  />
                  {item.caption ? (
                    <figcaption className={styles.caption}>{item.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
        </Reveal>
      </div>
    </section>
  );
}

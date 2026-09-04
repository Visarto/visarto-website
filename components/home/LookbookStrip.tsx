import { QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import type { LookbookItem } from '@/sanity/lib/types';
import styles from './LookbookStrip.module.css';

const RATIOS = ['4 / 5', '3 / 4', '5 / 7'];

export function LookbookStrip({ items }: { items: LookbookItem[] }) {
  const shown = items.slice(0, 3);
  if (shown.length < 3) return null;

  return (
    <section className={styles.section} aria-labelledby="lookbook-heading">
      <div className="sheet">
        <div className={styles.head}>
          <h2 id="lookbook-heading" className="display-2">
            Recent work
          </h2>
          <QuietLink href="/lookbook">The full lookbook</QuietLink>
        </div>

        <div className={styles.grid}>
          {shown.map((item, index) => (
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
        </div>
      </div>
    </section>
  );
}

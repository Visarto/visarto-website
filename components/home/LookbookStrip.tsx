import { QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { Reveal } from '@/components/primitives/Reveal';
import type { LookbookItem } from '@/sanity/lib/types';
import styles from './LookbookStrip.module.css';

const RATIOS = ['4 / 5', '3 / 4', '5 / 7'];

export function LookbookStrip({ items }: { items: LookbookItem[] }) {
  const shown = items.slice(0, 3);
  if (shown.length < 3) return null;

  return (
    <section className={styles.section} aria-labelledby="lookbook-heading">
      <div className="sheet">
        <Reveal stagger className={styles.head}>
          <h2 id="lookbook-heading" className="display-2">
            Recent work
          </h2>
          <QuietLink href="/lookbook">The full lookbook</QuietLink>
        </Reveal>

        {/* Three frames, uncovering left to right. The passage is gated on real
            photography, and it must behave like the rest of the site on the day
            that photography lands rather than becoming the one exception. */}
        <Reveal stagger variant="mask" className={styles.grid}>
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
        </Reveal>
      </div>
    </section>
  );
}

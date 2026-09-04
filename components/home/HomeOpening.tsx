import { CtaLink, QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { Reveal } from '@/components/primitives/Reveal';
import { calls } from '@/lib/content/site';
import { home } from '@/lib/content/home';
import type { SanityImageSource } from '@/sanity/lib/types';
import styles from './HomeOpening.module.css';

/**
 * The first screen answers three questions: what Visarto is, what it makes, and
 * how to start. The headline is a proposition about made-to-measure rather than
 * a mood, so it can be argued with, which is the difference between a position
 * and a slogan.
 */
export function HomeOpening({ image }: { image?: SanityImageSource | undefined }) {
  return (
    <section className={styles.section} aria-labelledby="opening-heading">
      <div className={`sheet ${styles.layout}`}>
        <div className={styles.copy}>
          <h1 id="opening-heading" className={`display-1 ${styles.display}`}>
            {home.opening.display}
          </h1>
          <p className={`lede ${styles.lede}`}>{home.opening.lede}</p>
          <div className={styles.actions}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
            <QuietLink href={calls.secondary.href}>{calls.secondary.label}</QuietLink>
          </div>
          <p className={`fine ${styles.note}`}>{home.opening.note}</p>
        </div>

        <MediaFrame
          className={styles.media}
          ratio="4 / 5"
          image={image}
          alt={image?.alt ?? ''}
          sizes="(min-width: 64rem) 48vw, 100vw"
          priority
          weave="herringbone"
          brief={home.opening.imageBrief}
        />
      </div>

      <div className="sheet">
        <div className={styles.footRule}>
          <Reveal variant="rule" className={styles.footRuleLine} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

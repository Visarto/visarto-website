import { CtaLink, QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
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
    <section className={`on-obsidian ${styles.section}`} aria-labelledby="opening-heading">
      <MediaFrame
        className={styles.media}
        ratio="auto"
        image={image}
        fallbackSrc="/placeholders/home-hero.jpg"
        alt={image?.alt ?? ''}
        sizes="100vw"
        priority
        weave="herringbone"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`sheet ${styles.copy}`}>
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
    </section>
  );
}

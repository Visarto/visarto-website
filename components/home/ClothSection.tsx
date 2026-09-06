import { SpecimenSheet } from '@/components/cloth/SpecimenSheet';
import { ContentRequired } from '@/components/primitives/ContentRequired';
import { QuietLink } from '@/components/primitives/Cta';
import { Reveal } from '@/components/primitives/Reveal';
import { home } from '@/lib/content/home';
import type { Mill } from '@/sanity/lib/types';
import styles from './ClothSection.module.css';

/**
 * Weave structure is a fact about textiles, not a claim about Visarto's stock,
 * which is why this passage can be written in full while the mill list stays
 * empty until Visarto supplies it.
 *
 * It also earns the graphic system the rest of the site is built from: the
 * fields behind every unfilled photograph are these same drafts.
 */
export function ClothSection({ mills }: { mills: Mill[] }) {
  return (
    <section className={`on-bone ${styles.section}`} aria-labelledby="cloth-heading">
      <div className="sheet">
        <Reveal className={styles.head}>
          <h2 id="cloth-heading" className="display-2">
            {home.cloth.heading}
          </h2>
          <p className={`body ${styles.body}`}>{home.cloth.body}</p>
          <p className={`fine ${styles.aside}`}>{home.cloth.aside}</p>
        </Reveal>

        <SpecimenSheet />

        <div className={styles.foot}>
          {mills.length > 0 ? (
            <p className={styles.mills}>
              {mills.map((mill) => mill.name).join(', ')}
            </p>
          ) : (
            <ContentRequired>{home.cloth.millsRequires}</ContentRequired>
          )}
          <QuietLink href="/cloth">{home.cloth.linkLabel}</QuietLink>
        </div>
      </div>
    </section>
  );
}

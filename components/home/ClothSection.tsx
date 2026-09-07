import { MediaFrame } from '@/components/primitives/MediaFrame';
import { QuietLink } from '@/components/primitives/Cta';
import { Reveal } from '@/components/primitives/Reveal';
import { home } from '@/lib/content/home';
import styles from './ClothSection.module.css';

/**
 * A moment, not a lesson.
 *
 * This passage used to carry the whole six-structure specimen sheet, which made
 * it the largest thing on the homepage for the least conversion-relevant
 * content, and duplicated a page that already exists. Someone deciding whether
 * to book does not need to learn what hopsack is; someone who wants to know
 * follows the link.
 *
 * What is kept is the argument, which is the part that carries a point of view,
 * and one length of cloth. The composition runs horizontally where the rest of
 * the page runs in columns, because that is the shape cloth comes in.
 */
export function ClothSection() {
  return (
    <section className={styles.section} aria-labelledby="cloth-heading">
      <div className="sheet">
        <Reveal className={styles.head}>
          <h2 id="cloth-heading" className="display-2">
            {home.cloth.heading}
          </h2>
          <p className={`body ${styles.body}`}>{home.cloth.body}</p>
        </Reveal>
      </div>

      <MediaFrame
        className={styles.band}
        ratio="24 / 7"
        sizes="100vw"
        weave="glenCheck"
        // Coarse, not fine. A glen check repeat is a few centimetres on a real
        // suit length, so at the fine scale a band this wide shows forty of
        // them and reads as gingham rather than as cloth.
        weaveScale="coarse"
        brief={home.cloth.imageBrief}
        briefTone="compact"
      />

      <div className={`sheet ${styles.foot}`}>
        <QuietLink href="/cloth">{home.cloth.linkLabel}</QuietLink>
      </div>
    </section>
  );
}

import { WeaveField } from '@/components/cloth/WeaveField';
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
        <Reveal stagger className={styles.head}>
          <h2 id="cloth-heading" className="display-2">
            {home.cloth.heading}
          </h2>
          <p className={`body ${styles.body}`}>{home.cloth.body}</p>
        </Reveal>
      </div>

      {/*
        The signature, in miniature.
        The cloth room's field and its lens, one structure, so the idea is met
        on the homepage rather than only behind a link. It unrolls from its
        lower edge, which is the one gesture on the site that describes its
        subject rather than transitioning it.
      */}
      <Reveal variant="mask" className={styles.band}>
        <WeaveField weave="glenCheck" label="Glen check" />
      </Reveal>

      <Reveal className={`sheet ${styles.foot}`}>
        <QuietLink href="/cloth">{home.cloth.linkLabel}</QuietLink>
      </Reveal>
    </section>
  );
}

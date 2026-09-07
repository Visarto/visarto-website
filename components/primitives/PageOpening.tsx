import { Reveal } from './Reveal';
import styles from './PageOpening.module.css';

/**
 * Every inner page opens the same way: a mark naming the section, the title,
 * and one paragraph that says what the page is for. Consistency here is what
 * lets the pages beneath it be composed differently without the site coming
 * apart.
 */
export function PageOpening({
  mark,
  title,
  standfirst,
  id = 'page-heading',
}: {
  mark: string;
  title: string;
  standfirst?: string;
  id?: string;
}) {
  return (
    <div className={styles.opening}>
      {/*
        The opening composes in its reading order, the same way the homepage
        does. The title carries `data-reveal-opaque` because on an inner page it
        is the Largest Contentful Paint candidate: it lifts into place at full
        opacity so the measurement is taken on the first frame.
      */}
      <Reveal stagger className={`sheet ${styles.layout}`}>
        <span className={`annotation ${styles.mark}`}>{mark}</span>
        <h1 id={id} className={`display-2 ${styles.title}`} data-reveal-opaque="">
          {title}
        </h1>
        {standfirst ? (
          <p className={`display-voice ${styles.standfirst}`}>{standfirst}</p>
        ) : null}
      </Reveal>
    </div>
  );
}

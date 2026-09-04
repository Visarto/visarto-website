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
      <div className={`sheet ${styles.layout}`}>
        <span className={`annotation ${styles.mark}`}>{mark}</span>
        <h1 id={id} className={`display-2 ${styles.title}`}>
          {title}
        </h1>
        {standfirst ? <p className={`lede ${styles.standfirst}`}>{standfirst}</p> : null}
      </div>
    </div>
  );
}

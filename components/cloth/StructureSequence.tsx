import { Reveal } from '@/components/primitives/Reveal';
import { weaveIndex } from '@/lib/weave';
import { WeaveField } from './WeaveField';
import styles from './StructureSequence.module.css';

/**
 * The six structures, as a sequence rather than a grid.
 *
 * The previous version was six small swatches in three columns, which had two
 * problems. Six tiles of one size read as a product listing, and at that size
 * on this ground the structures were separated by about four percent of
 * lightness, so a page whose entire subject is texture showed none of it.
 *
 * Each structure now gets a plate that runs the width of the sheet, with its
 * caption under it the way a plate is captioned in a book. Moving through them
 * is scrolling, which is the one navigation nobody has to learn.
 */
export function StructureSequence() {
  return (
    <ol className={styles.sequence}>
      {weaveIndex.map((weave, index) => (
        <li key={weave.id} className={styles.plate}>
          <Reveal variant="mask" className={styles.frame}>
            <WeaveField weave={weave.id} label={weave.name} scale="coarse" />
          </Reveal>

          <Reveal stagger className={styles.caption}>
            <span className={`index-mark ${styles.mark}`} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.name}>{weave.name}</h3>
            <p className={styles.note}>{weave.note}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

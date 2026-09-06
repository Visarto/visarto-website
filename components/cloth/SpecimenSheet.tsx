import { weavePaint } from '@/components/primitives/WeaveDefs';
import { weaveIndex } from '@/lib/weave';
import styles from './SpecimenSheet.module.css';

/**
 * The six weave structures, drawn from their own drafts.
 *
 * This is the one piece of the site that appears in two places, on the homepage
 * and in the cloth room, and it is shared because it is genuinely the same
 * thing in both: a bunch of swatches with their notation printed under them.
 */
export function SpecimenSheet({ className }: { className?: string }) {
  return (
    <dl className={[styles.specimens, className].filter(Boolean).join(' ')}>
      {weaveIndex.map((weave) => (
        <div key={weave.id} className={styles.specimen}>
          <svg
            className={styles.swatch}
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
          >
            <rect width="100%" height="100%" fill={weavePaint(weave.id, 'coarse')} />
          </svg>
          <div className={styles.specimenBody}>
            <dt className={styles.name}>{weave.name}</dt>
            <dd className={styles.note}>{weave.note}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

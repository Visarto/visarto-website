import styles from './PhotographRequired.module.css';

/**
 * Names the photograph a frame is holding open.
 *
 * It lives outside `MediaFrame` because a full-bleed frame sits behind a scrim,
 * and anything drawn inside the frame is buried by it. On those compositions
 * the page places this itself, above the scrim, with `overlay`.
 */
export function PhotographRequired({
  children,
  tone = 'full',
  overlay = false,
  className,
}: {
  children: React.ReactNode;
  tone?: 'full' | 'compact';
  overlay?: boolean;
  className?: string;
}) {
  const classes = [
    styles.marker,
    tone === 'compact' ? styles.compact : null,
    overlay ? styles.overlay : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="note">
      <span className={`annotation ${styles.title}`}>Photograph required</span>
      {tone === 'compact' ? (
        <span className={styles.body}>{children}</span>
      ) : (
        <p className={styles.body}>{children}</p>
      )}
    </div>
  );
}

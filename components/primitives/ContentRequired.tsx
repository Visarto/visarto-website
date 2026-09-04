import styles from './ContentRequired.module.css';

/**
 * Marks a business fact that has not been supplied by Visarto.
 *
 * Addresses, telephone numbers, mill relationships, turnaround times, prices
 * and client quotations are facts. None of them are invented anywhere in this
 * project. Where the design needs one and the CMS has none, this marker stands
 * in its place until an editor fills the field.
 */
export function ContentRequired({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.marker} role="note">
      <span className={`annotation ${styles.label}`}>Content required</span>
      <p className={styles.detail}>{children}</p>
    </div>
  );
}

export function ContentRequiredInline({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.inline}>
      <span className="annotation">Required</span>
      <span>{children}</span>
    </span>
  );
}

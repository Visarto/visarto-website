import styles from './SkipLink.module.css';

export function SkipLink() {
  return (
    <a href="#main" className={styles.link}>
      Skip to content
    </a>
  );
}

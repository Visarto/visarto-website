import Link from 'next/link';
import type { Route } from 'next';

import styles from './Cta.module.css';

type Variant = 'solid' | 'outline';

type CtaLinkProps = {
  href: Route | string;
  variant?: Variant;
  children: React.ReactNode;
  full?: boolean;
  className?: string;
  external?: boolean;
};

/**
 * The appointment path uses `solid`. Everything else uses `outline` or the
 * quiet link. Two actions on a page may share a row; three may not.
 */
export function CtaLink({
  href,
  variant = 'solid',
  children,
  full = false,
  className,
  external = false,
}: CtaLinkProps) {
  const classes = [styles.base, styles[variant], full ? styles.full : null, className]
    .filter(Boolean)
    .join(' ');

  if (external) {
    return (
      <a className={classes} href={href as string} rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href as Route}>
      {children}
    </Link>
  );
}

export function QuietLink({
  href,
  children,
  className,
}: {
  href: Route | string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={[styles.quiet, className].filter(Boolean).join(' ')} href={href as Route}>
      <span>{children}</span>
      <span className={styles.quietRule} aria-hidden="true" />
    </Link>
  );
}

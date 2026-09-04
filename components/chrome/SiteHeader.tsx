import Link from 'next/link';

import { CtaLink } from '@/components/primitives/Cta';
import { calls } from '@/lib/content/site';
import { MobileMenu } from './MobileMenu';
import { PrimaryNav } from './PrimaryNav';
import styles from './SiteHeader.module.css';

/**
 * The header is a fixed architectural element: a wordmark, a line of navigation
 * and one action. The hairline beneath it is always drawn, so the header has no
 * scroll state to manage and no contrast switching to get wrong. Only the mobile
 * menu needs JavaScript, and it is the only part shipped to the client.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`sheet ${styles.inner}`}>
        <Link href="/" className={styles.wordmark} aria-label="Visarto, home">
          Visarto
        </Link>

        <PrimaryNav />

        <div className={styles.actions}>
          <CtaLink href={calls.primary.href} className={`${styles.desktopCta} ${styles.headerCta}`}>
            {calls.primary.label}
          </CtaLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

import { primaryNav } from '@/lib/content/site';
import styles from './SiteHeader.module.css';

/**
 * The only reason this is a client component is `aria-current`. Marking the
 * section a visitor is in is worth the few lines it costs; nothing else in the
 * header runs on the client.
 */
export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.navList}>
        {primaryNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                className={styles.navLink}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import Link from 'next/link';
import type { Route } from 'next';

import { ContentRequired } from '@/components/primitives/ContentRequired';
import { calls, footer, primaryNav } from '@/lib/content/site';
import type { SiteSettings } from '@/sanity/lib/types';
import styles from './SiteFooter.module.css';

/**
 * Contact details, opening hours and social accounts are business facts. They
 * are read from `siteSettings` in the CMS and, until an editor supplies them,
 * the footer shows a marker naming what is missing rather than plausible text.
 */
export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const social = settings?.social ?? [];

  return (
    <footer className={styles.footer}>
      <div className="sheet">
        <div className={styles.masthead}>
          <span className={styles.name}>Visarto</span>
          <p className={styles.statement}>{footer.statement}</p>
        </div>

        <div className={styles.columns}>
          <div>
            <span className={`annotation ${styles.columnHead}`}>Visit</span>
            {settings?.studioAddress ? (
              <address className={styles.address}>
                <span style={{ whiteSpace: 'pre-line' }}>{settings.studioAddress}</span>
                {settings.openingNote ? <span>{settings.openingNote}</span> : null}
              </address>
            ) : (
              <ContentRequired>{footer.columns[0].requires}</ContentRequired>
            )}
          </div>

          <div>
            <span className={`annotation ${styles.columnHead}`}>Contact</span>
            {settings?.telephone || settings?.email ? (
              <div className={styles.stack}>
                {settings.telephone ? (
                  <a href={`tel:${settings.telephone.replace(/[^+\d]/g, '')}`}>
                    {settings.telephone}
                  </a>
                ) : null}
                {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
              </div>
            ) : (
              <ContentRequired>{footer.columns[1].requires}</ContentRequired>
            )}
          </div>

          <div>
            <span className={`annotation ${styles.columnHead}`}>Pages</span>
            <ul className={styles.stack}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href as Route}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href={calls.primary.href as Route}>{calls.primary.label}</Link>
              </li>
              <li>
                <Link href={calls.secondary.href as Route}>{calls.secondary.label}</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className={`annotation ${styles.columnHead}`}>Elsewhere</span>
            {social.length > 0 ? (
              <ul className={styles.stack}>
                {social.map((account) => (
                  <li key={account.url}>
                    <a href={account.url} rel="me noreferrer" target="_blank">
                      {account.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <ContentRequired>
                Social accounts Visarto wants linked, with the exact handles.
              </ContentRequired>
            )}
          </div>
        </div>

        <div className={styles.legal}>
          <span>
            &copy; {year} {settings?.legalName ?? 'Visarto'}. {footer.legal.rights}
          </span>
          <div className={styles.legalLinks}>
            {footer.legal.links.map((link) => (
              <Link key={link.href} href={link.href as Route}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

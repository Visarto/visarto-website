'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CtaLink } from '@/components/primitives/Cta';
import { calls, primaryNav } from '@/lib/content/site';
import styles from './MobileMenu.module.css';

/**
 * The mobile menu uses a native modal dialog, which gives focus containment,
 * Escape handling and inert background content without a custom trap.
 *
 * Scroll on the page behind is locked by fixing the body and holding its
 * position, then restoring it, so opening the menu does not jump the page.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollY = useRef(0);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setOpen(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  useEffect(() => {
    const body = document.body;
    if (open) {
      scrollY.current = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY.current}px`;
      body.style.insetInline = '0';
      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.insetInline = '';
        window.scrollTo(0, scrollY.current);
      };
    }
    return undefined;
  }, [open]);

  // A viewport that grows past the desktop breakpoint while the menu is open
  // would leave a modal covering a page that no longer needs one.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)');
    const handle = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) dialogRef.current?.close();
    };
    handle(query);
    query.addEventListener('change', handle);
    return () => query.removeEventListener('change', handle);
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <span className={styles.bars} aria-hidden="true">
          <span />
          <span />
        </span>
        Menu
      </button>

      <dialog ref={dialogRef} className={styles.dialog} aria-label="Site menu">
        <div className={`sheet ${styles.panel}`}>
          <div className={styles.panelHead}>
            <span className="annotation">Visarto</span>
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>

          <nav className={styles.list} aria-label="Primary">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.href} className={styles.item}>
                  <Link href={item.href as Route} className={styles.link} onClick={close}>
                    <span className={styles.linkLabel}>{item.label}</span>
                    {item.note ? <span className={styles.linkNote}>{item.note}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.foot}>
            <CtaLink href={calls.primary.href} full>
              {calls.primary.label}
            </CtaLink>
            <CtaLink href={calls.secondary.href} variant="outline" full>
              {calls.secondary.label}
            </CtaLink>
          </div>
        </div>
      </dialog>
    </>
  );
}

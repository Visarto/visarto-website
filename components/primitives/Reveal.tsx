'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * The site's single entrance mechanism.
 *
 * One IntersectionObserver serves every revealing element on the page rather
 * than one observer per component, and each element is unobserved the moment it
 * has entered. Nothing keeps running after the reveal.
 *
 * The pre-reveal state lives in CSS behind `[data-js='true']` and a
 * no-preference motion query, so a visitor without JavaScript, or with reduced
 * motion turned on, receives the finished composition immediately.
 */

type Observed = Element & { dataset: DOMStringMap };

let observer: IntersectionObserver | null = null;
const pending = new Set<Observed>();

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as Observed;
        element.dataset.revealed = 'true';
        observer?.unobserve(element);
        pending.delete(element);
      }
    },
    // Entrances start a little before the element reaches the fold so the
    // movement has finished by the time it is being read.
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  return observer;
}

export type RevealVariant = 'mask' | 'rise' | 'rule';

type RevealProps = {
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds. Used sparingly, for a short sequence inside one block. */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export function Reveal({
  as: Tag = 'div',
  variant = 'rise',
  delay,
  className,
  children,
  ...rest
}: RevealProps & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current as Observed | null;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.dataset.revealed = 'true';
      return;
    }

    // Anything already at or near the first screen is revealed on mount rather
    // than waiting for a callback, so the opening of the page never animates in
    // behind the reader. This also covers elements already scrolled past (top
    // is negative), which the observer would otherwise miss on client-side
    // navigation back to a page.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.5) {
      // One frame's delay so the initial pre-reveal state paints and the
      // transition plays, rather than snapping to the finished state.
      const raf = window.requestAnimationFrame(() => {
        element.dataset.revealed = 'true';
      });
      return () => window.cancelAnimationFrame(raf);
    }

    const active = ensureObserver();
    if (!active) {
      element.dataset.revealed = 'true';
      return;
    }

    active.observe(element);
    pending.add(element);

    // Safety net. The observer occasionally misses its first callback on
    // client-side navigations because of the scroll-reset timing. Unconditional
    // reveal after a short window. Fast paths never see this timer fire.
    const safety = window.setTimeout(() => {
      if (element.dataset.revealed !== 'true') {
        element.dataset.revealed = 'true';
        active.unobserve(element);
        pending.delete(element);
      }
    }, 250);

    return () => {
      window.clearTimeout(safety);
      active.unobserve(element);
      pending.delete(element);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={className}
      style={delay ? ({ ['--reveal-delay']: `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

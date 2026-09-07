'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * The site's single entrance mechanism.
 *
 * One IntersectionObserver serves every revealing element on the page rather
 * than one observer per component, and each element is unobserved the moment it
 * has entered. Nothing keeps running after the reveal.
 *
 * Two populations, and they are told apart on mount:
 *
 *   below the fold  the observer starts them as they come up, ten percent of
 *                   the viewport before the bottom edge
 *   on the first screen  they belong to the load rather than to the scroll, so
 *                   they compose as the opening curtain clears
 *
 * The pre-reveal state lives in CSS behind `[data-js='true']` and a
 * no-preference motion query, so a visitor without JavaScript, or with reduced
 * motion turned on, receives the finished composition immediately.
 */

/** Dispatched on `window` by the opening curtain once it has cleared the page. */
export const ENTERED_EVENT = 'visarto:entered';

/**
 * Nothing on the first screen may stay hidden longer than this, whatever
 * happens to the curtain. An entrance that never runs is the one failure worse
 * than no entrance at all.
 */
const CURTAIN_FALLBACK_MS = 1600;

type Observed = Element & { dataset: DOMStringMap };

let observer: IntersectionObserver | null = null;

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
      }
    },
    // A zero threshold with the root's bottom edge pulled up ten percent: the
    // entrance starts when the element's top crosses ninety percent of the
    // viewport, whatever the element's height. A fractional threshold would
    // make a tall frame start later than a short paragraph beside it, which is
    // how two things in one passage end up arriving at different moments.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  return observer;
}

/**
 * Runs once the opening curtain has cleared, or on the next painted frame when
 * there is no curtain to wait for. The double frame matters: the pre-state has
 * to be painted before the class changes, or the browser has nothing to
 * transition from and the element simply appears.
 */
function afterCurtain(run: () => void): () => void {
  const root = document.documentElement;
  // `entered` is set the moment the curtain releases the page, and it is what
  // anything mounting part way through the lift reads. Without it such a
  // component would subscribe to an event that has already been dispatched and
  // sit on the fallback timer.
  if (root.dataset.intro !== 'pending' || root.dataset.entered === 'true') {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(run);
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }

  let spent = false;
  const stop = () => {
    window.clearTimeout(timer);
    window.removeEventListener(ENTERED_EVENT, fire);
  };
  function fire() {
    if (spent) return;
    spent = true;
    stop();
    run();
  }
  const timer = window.setTimeout(fire, CURTAIN_FALLBACK_MS);
  window.addEventListener(ENTERED_EVENT, fire, { once: true });

  return stop;
}

export type RevealVariant = 'mask' | 'rise' | 'rule';

type RevealProps = {
  as?: ElementType;
  variant?: RevealVariant;
  /**
   * Applies the entrance to this element's direct children instead of to the
   * element itself, each one a step behind the last. Use it wherever a passage
   * has a reading order: heading, body, list, action.
   */
  stagger?: boolean;
  /** Milliseconds. Used sparingly, to hold one block behind another. */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

export function Reveal({
  as: Tag = 'div',
  variant = 'rise',
  stagger = false,
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

    const active = ensureObserver();
    if (!active) {
      element.dataset.revealed = 'true';
      return;
    }

    if (element.getBoundingClientRect().top < window.innerHeight) {
      return afterCurtain(() => {
        element.dataset.revealed = 'true';
      });
    }

    active.observe(element);
    return () => active.unobserve(element);
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-stagger={stagger ? '' : undefined}
      className={className}
      style={delay ? ({ ['--reveal-delay']: `${delay}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

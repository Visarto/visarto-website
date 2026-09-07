'use client';

import { useEffect, useRef, useState } from 'react';

import { ENTERED_EVENT } from '@/components/primitives/Reveal';
import styles from './Intro.module.css';

/** How long the curtain is allowed to hold before it lifts regardless. */
const MAX_HOLD_MS = 1200;
/** Must match the transition on `.intro`, which reads `--dur-curtain`. */
const LIFT_MS = 560;
/**
 * How far into the lift the page beneath is told to compose itself. The two
 * movements overlap on purpose: the first screen is arriving as the curtain
 * clears it, rather than waiting behind a closed door and then starting from
 * nothing.
 */
const ENTRANCE_AT_MS = 240;
const SESSION_KEY = 'visarto:intro';

/**
 * The opening curtain.
 *
 * The research on these is unambiguous: a timed preloader on a fast page
 * inflates LCP for no benefit and is worth nothing to anybody. So this one is
 * not timed. It waits on the fonts, which is the thing that actually makes the
 * first screen look unfinished, and lifts the moment they are ready. On a fast
 * connection it is almost not there.
 *
 * Four ways out, in order of how often they will be taken:
 *
 *   1. the fonts resolve
 *   2. the visitor scrolls, clicks, or touches anything
 *   3. 1.2 seconds pass
 *   4. the script in the head never marked it pending in the first place,
 *      which is the case without JavaScript, under reduced motion, and on
 *      every page after the first in a session
 */
export function Intro() {
  const [lifting, setLifting] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== 'pending') return;

    let cancelled = false;
    let liftTimer: number | undefined;
    let entranceTimer: number | undefined;

    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    const stopListening = () => {
      for (const event of events) window.removeEventListener(event, finish);
    };

    function finish() {
      if (done.current || cancelled) return;
      done.current = true;
      window.clearTimeout(holdTimer);
      stopListening();
      setLifting(true);
      entranceTimer = window.setTimeout(() => {
        // The attribute is what a component mounting mid-lift reads; the event
        // is what the components already mounted are waiting on. Both, because
        // an entrance that never fires leaves the page blank.
        root.dataset.entered = 'true';
        window.dispatchEvent(new Event(ENTERED_EVENT));
      }, ENTRANCE_AT_MS);
      liftTimer = window.setTimeout(() => {
        delete root.dataset.intro;
      }, LIFT_MS);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Private browsing. The opening simply runs again next navigation.
      }
    }

    for (const event of events) {
      window.addEventListener(event, finish, { passive: true, once: true });
    }

    const holdTimer = window.setTimeout(finish, MAX_HOLD_MS);

    // The fonts are what the hold is actually for: a didone masthead rendered
    // in the fallback and then reflowed is the thing worth covering.
    if (document.fonts?.ready) {
      void document.fonts.ready.then(finish);
    } else {
      finish();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(holdTimer);
      window.clearTimeout(liftTimer);
      window.clearTimeout(entranceTimer);
      stopListening();
    };
  }, []);

  return (
    <div className={styles.intro} data-state={lifting ? 'lifting' : 'held'} aria-hidden="true">
      <div className={styles.mark}>
        <span className={styles.wordmark}>Visarto</span>
        <span className={styles.rule} />
      </div>
    </div>
  );
}

import { Manrope } from 'next/font/google';

/**
 * Times New Roman is Visarto's display voice; Manrope sets everything that has
 * to be read rather than looked at.
 *
 * Times is a system face, so it is not loaded here — it is declared in the
 * `--font-display` token in `tokens.css` and picked up directly by the OS.
 * Nothing to preload, nothing to subset, no network cost. `display` is exported
 * as an empty variable class so `layout.tsx` can compose it alongside Manrope
 * without a conditional.
 *
 * Manrope is the only web font shipped. It appears in the first viewport, so
 * it is preloaded.
 */
export const display = { variable: '' } as const;

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  preload: true,
});

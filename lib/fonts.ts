import { Fraunces, Manrope } from 'next/font/google';

/**
 * Fraunces is Visarto's display voice; Manrope sets everything that has to be
 * read rather than looked at.
 *
 * Both appear in the first viewport, so both are preloaded and nothing else is.
 * Manrope is requested at the three weights the site actually uses.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  // Variable, and subset to the optical size axis alone. `opsz` is the reason
  // this family was chosen: it lets the display sizes take the high stroke
  // contrast of a masthead while the same face at title size stays sturdy.
  // Asking for SOFT and WONK as well nearly doubled the file for a difference
  // that is invisible at these sizes, so they stay at their defaults.
  axes: ['opsz'],
  variable: '--font-fraunces',
  preload: true,
});

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  preload: true,
});

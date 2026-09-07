import { Manrope, Tinos } from 'next/font/google';

/**
 * Times is Visarto's display voice; Manrope sets everything that has to be read
 * rather than looked at.
 *
 * Times is shipped rather than borrowed. Left to the system stack it is four
 * different typefaces: Times New Roman on Windows, Times on macOS, Nimbus Roman
 * on Linux, Tinos or Noto on Android. A wordmark that changes shape by
 * operating system is not a wordmark, so the face is loaded instead of hoped
 * for. Tinos is metrically identical to Times New Roman, which is why it is the
 * substitute those systems already reach for, and it brings the real italic and
 * the real bold rather than letting the browser synthesise them.
 *
 * Two cuts only, roman and italic, both at 400. Times has no light and its bold
 * is a newspaper weight: the display voice here is regular, and everything that
 * used to ask for 300 or 600 was silently getting 400 or Times Bold anyway.
 */
export const display = Tinos({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  preload: true,
});

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  preload: true,
});

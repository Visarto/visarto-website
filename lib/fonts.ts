import { Bodoni_Moda, Manrope } from 'next/font/google';

/**
 * Bodoni Moda is Visarto's display voice; Manrope sets everything that has to
 * be read rather than looked at.
 *
 * A didone is the right register for a tailoring house: extreme stroke
 * contrast, hairline serifs and vertical stress are what a century of fashion
 * mastheads are cut from. It is also the reason the optical size axis matters
 * here more than anywhere. A didone set small with display proportions loses
 * its hairlines entirely, so `opsz` is doing real work rather than decorating
 * the config.
 *
 * The family is subset to that axis alone, which is the same discipline that
 * kept the previous face at 66KB. Both appear in the first viewport, so both
 * are preloaded and nothing else is.
 */
export const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  variable: '--font-bodoni',
  preload: true,
});

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  preload: true,
});

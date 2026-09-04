/**
 * The garment categories Visarto works in.
 *
 * These are the areas named in the brief, arranged so that no two of them
 * describe the same occasion. The notes are about the wearing situation rather
 * than about stock, construction or price, because none of those have been
 * supplied. Anything deeper belongs in the `collection` documents in the CMS,
 * which take over these entries as soon as an editor creates them.
 */

export type CollectionEntry = {
  slug: string;
  title: string;
  note: string;
};

export const collectionEntries: CollectionEntry[] = [
  {
    slug: 'suits-and-business-wear',
    title: 'Suits and business wear',
    note: 'The clothes worn most often, and the first place a poor fit shows.',
  },
  {
    slug: 'evening-and-black-tie',
    title: 'Evening and black tie',
    note: 'Dinner jackets and tuxedos, where the rules are narrow and worth keeping.',
  },
  {
    slug: 'wedding',
    title: 'Wedding',
    note: 'For the couple, and for the people standing next to them.',
  },
  {
    slug: 'shirts',
    title: 'Shirts',
    note: 'The layer worn nearest the skin, and the one a bad collar ruins.',
  },
  {
    slug: 'occasion',
    title: 'Occasion',
    note: 'Anything with a date attached and a photograph at the end of it.',
  },
  {
    slug: 'everyday',
    title: 'Everyday',
    note: 'Clothes with no occasion attached at all.',
  },
];

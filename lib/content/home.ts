/**
 * Homepage copy.
 *
 * The page is written as a sequence rather than a set of sections: who Visarto
 * is, what is made, where the fitting happens, what cloth actually is, and then
 * the appointment. Every claim on it is either given in the brief or is a fact
 * about weaving. Nothing about turnaround, price, mills, clients or history
 * appears, because none of that has been supplied.
 */

/**
 * A place a fitting can happen. Either it carries a note the studio wrote, or
 * it names the fact Visarto still has to supply. Never both, and never neither.
 */
export type FittingPlace = {
  title: string;
  note?: string;
  requires?: string;
};

/**
 * The studio is named separately from the places Visarto travels to, because it
 * is the one entry that needs an address out of the CMS rather than a line of
 * copy.
 */
export const studioPlace: FittingPlace = {
  title: 'The studio',
  requires: 'Studio address, access notes, parking or transit, and the hours it is open.',
};

export const visitingPlaces: FittingPlace[] = [
  {
    title: 'Your home',
    note: 'The easiest place to see a new garment against the wardrobe it has to live with.',
  },
  {
    title: 'Your office',
    note: 'Between meetings, in the clothes you already wear to work.',
  },
];

export const fittingPlaces: FittingPlace[] = [studioPlace, ...visitingPlaces];

export const home = {
  opening: {
    /** The proposition of made-to-measure, stated in five words. */
    display: 'The fit is the design.',
    lede: 'Visarto makes suits, evening wear, shirts, wedding and everyday clothing to measure, for men and women. Every garment begins with a fitting: at the studio, at your home, or at your office.',
    note: 'Appointments are made in advance.',
    imageBrief:
      'Full length or three quarter portrait of a finished Visarto garment on a client, natural light, calm ground behind the figure. Left third of the frame is kept quiet so the composition sits beside the headline. Do not crop through the hands or the shoe line.',
  },

  collections: {
    heading: 'What we make',
    body: 'Six starting points. Where any of them ends is decided at the fitting.',
    linkLabel: 'All collections',
  },

  fitting: {
    heading: 'The fitting comes to you',
    body: 'A fitting needs a room, a mirror and unhurried attention. It does not need a shop floor.',
    places: fittingPlaces,
    closing: 'Other arrangements are possible and are confirmed when you book.',
    imageBrief:
      'A fitting in progress. Hands, chalk, tape and cloth. Shot at working distance rather than macro so the room reads as well as the detail. Real people only, with permission on file.',
  },

  cloth: {
    heading: 'How cloth is built',
    body: 'A suit length is a grid. Warp threads run the length of the roll, weft threads run across it, and at every crossing one of the two sits on top. That single decision, repeated, becomes the character of the cloth: how it falls, how it creases, how it takes light.',
    aside: 'The six structures below are drawn from their own weave drafts.',
    millsRequires:
      'The mills Visarto buys from, the bunches a client can order from, and any relationship that may be named publicly.',
    linkLabel: 'The cloth room',
  },

  appointment: {
    heading: 'Book an appointment',
    body: 'Tell us what you need made and where you would like to be measured. We confirm the time and the place with you.',
    bringRequires:
      'What Visarto asks a client to bring or wear to a first appointment, and how long to set aside.',
  },
} as const satisfies {
  opening: Record<string, string>;
  collections: Record<string, string>;
  fitting: {
    heading: string;
    body: string;
    places: readonly FittingPlace[];
    closing: string;
    imageBrief: string;
  };
  cloth: Record<string, string>;
  appointment: Record<string, string>;
};

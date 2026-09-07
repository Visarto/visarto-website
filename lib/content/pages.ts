/**
 * Copy for the inner pages.
 *
 * The same rule applies here as everywhere else: a statement is written out
 * only when it follows from what Visarto has confirmed, or from what the words
 * "made to measure" mean. Lead times, the number of fittings, prices, mills and
 * anything about the house's history are marked as required and left to the CMS.
 */

export const madeToMeasure = {
  mark: 'Made to measure',
  title: 'From a set of measurements to a finished garment',
  standfirst:
    'Made to measure means a pattern adjusted to one person rather than a size picked off a rack. Here is what that involves, in order.',
  stages: [
    {
      title: 'The appointment',
      note: 'We talk about what the garment is for, how you expect to wear it, and what it has to sit alongside in your wardrobe. Cloth comes into the conversation here rather than at the end.',
    },
    {
      title: 'Measuring',
      note: 'Measurements are taken, and so are the things a tape does not catch: how you stand, which shoulder sits lower than the other, whether you keep a jacket buttoned.',
    },
    {
      title: 'The pattern',
      note: 'A pattern is drafted to those measurements and to that posture. This is the difference between made to measure and buying a size and having it altered afterwards.',
    },
    {
      title: 'The cloth',
      note: 'Weight, weave, colour and season are decided together. A cloth that behaves well in a July wedding is not the cloth for a February week of meetings.',
    },
    {
      title: 'The fitting',
      note: 'The garment is tried on and marked. What is being judged is balance, the set of the collar, the line of the sleeve and how the garment sits when you move rather than when you stand still.',
    },
    {
      title: 'Finishing',
      note: 'The marks from the fitting are worked into the garment, and it is pressed and finished.',
    },
  ],
  practicalRequires:
    'How far ahead to book, how many fittings a first commission usually takes, how long it takes from first appointment to finished garment, and how pricing works.',
} as const;

export const collectionsPage = {
  mark: 'Collections',
  title: 'What Visarto makes',
  standfirst:
    'Six areas of work. They share a pattern and a fitting, and they differ in what the garment has to do once you are wearing it.',
  detailRequires:
    'For each collection: what is included, how it is constructed, the cloths it is usually cut from, and what a client should know before ordering one.',
} as const;

export const clothPage = {
  mark: 'Cloth',
  title: 'The cloth room',
  standfirst:
    'Cloth decides how a garment falls, how it creases and how long it lasts. Before the colour there is a structure, and the structure is worth knowing.',
  structureHeading: 'Six structures',
  structureBody:
    'Warp threads run the length of a roll and weft threads run across it. At every crossing one of the two sits on top, and the pattern of those crossings is the binding. Everything below is drawn from its own weave draft.',
  millsHeading: 'The mills',
  millsRequires:
    'The mills Visarto buys from, the bunches a client can order from, and any relationship that may be named publicly. Nothing is listed here until it is confirmed.',
} as const;

export const lookbookPage = {
  mark: 'Lookbook',
  title: 'Finished work',
  standfirst: 'Garments made by Visarto, photographed after they were delivered.',
  emptyRequires:
    'Photographs of finished Visarto garments, with permission from the clients wearing them. Until they exist this page stays empty rather than showing stock imagery.',
  /*
   * The frames below are placeholders and have to say so.
   *
   * A lookbook is a claim: these are garments this house made. Photographs that
   * are not Visarto's work, shown under that heading without a word, make that
   * claim on the house's behalf and it is not true yet.
   */
  placeholderNote:
    'These frames are placeholders while photography is commissioned. They are not Visarto garments.',
} as const;

export const aboutPage = {
  mark: 'About',
  title: 'The house',
  standfirst: 'Visarto makes clothing to measure for men and women, by appointment.',
  bodyRequires:
    'Who runs Visarto, where the house came from, how long it has been working, who is in the workroom, and what it wants to be known for. Written by Visarto, not by the studio.',
} as const;

export const appointmentsPage = {
  mark: 'Appointments',
  title: 'Book an appointment',
  standfirst:
    'Tell us what you are having made and where you would like to be measured. We reply to confirm a time.',

  /*
   * What happens after the form is sent.
   *
   * Every line here is drawn from copy already written elsewhere on the site:
   * the standfirst above, and the first stage of the process on the made to
   * measure page. Nothing is added about how long any of it takes, because that
   * has not been supplied, and a booking flow is the last place to guess.
   */
  next: {
    heading: 'What happens next',
    steps: [
      {
        title: 'You send the request',
        note: 'What you are having made, where you would like to be measured, and any date it has to be ready for.',
      },
      {
        title: 'We reply to confirm',
        note: 'We confirm the time and the place with you, and answer anything you asked in the request.',
      },
      {
        title: 'The first appointment',
        note: 'We talk about what the garment is for, how you expect to wear it, and what it has to sit alongside in your wardrobe. Cloth comes into the conversation here rather than at the end.',
      },
    ],
  },
  form: {
    nameLabel: 'Your name',
    emailLabel: 'Email',
    telephoneLabel: 'Telephone',
    telephoneHint: 'Optional. Useful if you would rather we call to confirm.',
    placeLabel: 'Where would you like to meet?',
    places: [
      { value: 'studio', label: 'The studio' },
      { value: 'home', label: 'My home' },
      { value: 'office', label: 'My office' },
      { value: 'other', label: 'Somewhere else' },
    ],
    aboutLabel: 'What are you having made?',
    aboutHint: 'A sentence is enough. If there is a date it has to be ready for, say so here.',
    timingLabel: 'When suits you?',
    timingHint: 'Optional. Days of the week or a rough window.',
    submit: 'Send the request',
    submitting: 'Sending',
    privacy:
      'What you send is used to arrange your appointment and to reply to you. It is not added to a mailing list.',
    success: {
      title: 'Your request has been sent',
      body: 'We have it. You will hear back from us to confirm a time and a place.',
    },
    failure: {
      title: 'That did not send',
      body: 'Nothing was received at our end. Please try again in a moment.',
    },
    unavailable: {
      title: 'Online requests are not connected yet',
      body: 'The form below is switched off until an appointment destination is configured, so that nothing is collected and lost. Until then, please get in touch using the details in the footer.',
    },
  },
  external: {
    title: 'Book through our booking system',
    body: 'Appointments are arranged through the booking system linked below.',
    action: 'Open the booking system',
  },
} as const;

export const contactPage = {
  mark: 'Contact',
  title: 'Make an inquiry',
  standfirst:
    'A question about cloth, about what is possible, or about a date you are working towards. Ask, and we will answer.',
  form: {
    aboutLabel: 'What would you like to know?',
    aboutHint: 'As much or as little as you like.',
    submit: 'Send',
    success: {
      title: 'Your message has been sent',
      body: 'We have it, and we will reply.',
    },
  },
} as const;

export const legalPages = {
  privacy: {
    mark: 'Privacy',
    title: 'Privacy',
    requires:
      'The privacy notice for Visarto: what is collected through the appointment and inquiry forms, how long it is kept, who processes it, and how a client asks for it to be removed. This has to be written or approved by Visarto and should be checked against the privacy law that applies where the business operates.',
  },
  terms: {
    mark: 'Terms',
    title: 'Terms',
    requires:
      'The terms Visarto works under: what a commission commits a client to, deposits, cancellation, alterations after delivery, and how disputes are handled. This has to be written or approved by Visarto.',
  },
} as const;

export const notFoundPage = {
  mark: 'Not found',
  title: 'There is nothing at this address',
  standfirst: 'The page you were looking for has either moved or never existed.',
} as const;

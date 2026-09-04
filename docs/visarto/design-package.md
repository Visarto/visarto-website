# Visarto design package

The source of truth for the visual system. Written against the template in the Visarto digital
house system. Anything marked **[CONTENT REQUIRED]** is a fact about the business that Visarto
has not supplied and that has not been invented here.

---

## 1. Brand premise

Visarto believes that in clothing, the fit is the design. A garment is not made better by more
detail on it; it is made better by being cut for one body, and by someone being in the room to
judge it. Everything the house sells follows from that: a pattern drafted to one person, cloth
chosen for how it will actually be worn, and a fitting that happens wherever the client can give
it an hour of attention rather than wherever the shop happens to be.

The idea that has to connect the homepage, the collections, the cloth room and the appointment
page: **one person's measurements, and someone present while the garment is judged against them.**

That premise rejects ideas. It rejects heritage language, because the house is not selling a
past. It rejects a fabric-count arms race, because more cloths is not a better fit. It rejects
an e-commerce pattern, because nothing here can be bought without a fitting.

## 2. Audience and conversion premise

- **Primary audience.** Adults, men and women, commissioning clothing they will wear repeatedly
  or for a fixed occasion. Two shapes of client: the one with a date (a wedding, an event) and
  the one replacing a wardrobe.
- **Why they come.** Ready-to-wear does not fit them, or the occasion is important enough that
  it should not be left to chance.
- **What they are anxious about.** Whether it will fit. How long it takes. What it costs.
  Whether they have to go somewhere and be sold to.
- **What they need to see.** That a real person will measure them, that the process is
  understood and ordered, and that the appointment is low friction.
- **Device.** Assume a phone first for discovery, a laptop for the considered read.

**Primary action, on every page: Book an Appointment.**
**Secondary action: Make an Inquiry.**

Nothing else on the site is given the weight of a button. Collections, cloth and lookbook are
navigation. This is why the header carries one action and not three.

## 3. Visual direction

Three adjectives the system embodies: **drafted, tactile, unhurried.**
Three it avoids: **ornamental, nostalgic, transactional.**

The organising idea is that **the site is set out like a pattern draft.** A tailor works on a
wide sheet with a straight edge, fine rules, generous margins and marks made where they are
needed. That gives the site its structural vocabulary: one visible left axis, hairline rules
instead of containers, margins that are worked in rather than filled, and registration marks
only where a mark does a job.

The material half of the idea is the weave. A cloth is a grid of warp and weft where at every
crossing one thread sits over the other, and that binary is what a weaver writes down as a
draft. Those drafts are drawn on the site directly, at their real relative scales, and they are
the reason the site has a texture that is specific to tailoring rather than to web design.

Image behaviour: documentary and tactile. Real garments, real fittings, real people. Density:
sparse at the top of a page, denser as the reader commits. Tension: precise but warm, and
light rather than dark, with one dark passage held back for the close.

**Luxury quality test.** Turn off every transition on the site and nothing is lost but the
entrances. The page does not depend on motion, glow, blur or grain to look considered.

## 4. Palette

Taken from the materials of a tailoring room. Implemented in `styles/tokens.css`.

| Token | Value | What it is | Contrast |
|---|---|---|---|
| `--chalk` | `#f2eee6` | Pattern paper. The default ground | |
| `--paper` | `#f8f5ef` | A half tone lighter, for raised passages | |
| `--stone` | `#e4ded2` | Pressed cloth, for quiet blocks | |
| `--midnight` | `#1a1f2b` | Evening cloth. Used once per page at most | |
| `--ink` | `#191512` | Warm near-black | 15.7:1 on chalk |
| `--ink-secondary` | `#4e463c` | Body copy | 8.0:1 on chalk |
| `--ink-muted` | `#675e52` | Notes and captions | 5.5:1 on chalk, 4.8:1 on stone |
| `--on-midnight` | `#ede8de` | Text on the dark passage | 13.5:1 |
| `--on-midnight-muted` | `#a7a093` | | 6.4:1 |
| `--rule` | `#d6cfc2` | The drafting line | Non-text |
| `--rule-strong` | `#bdb4a4` | A stronger rule | Non-text |
| `--control-line` | `#867b68` | The outline of a control | 3.6:1 on chalk, 3.1:1 on stone |
| `--control-line-on-midnight` | `#6b7898` | | 3.7:1 |
| `--madder` | `#7b3226` | Basting thread red | 7.8:1 on chalk |
| `--madder-on-midnight` | `#c08573` | | 5.4:1 |

Notes.

- There is no pure black and no pure white anywhere.
- There is no gold. Midnight blue is used where a generic luxury site would reach for black,
  for the reason a dinner jacket is midnight rather than black: black reads flat under light.
- Madder is the only accent, and on the production site its only jobs are the content-required
  markers and form error states. When Visarto's content is complete, madder will be almost
  invisible on the site. That is intended. A rare colour has authority; a democratic one does not.
- A rule and a control line are different things. A rule separates content and can be as quiet
  as it likes; a control line is the outline of a button or the underside of an input, and it is
  the only thing telling somebody a control is there, so it holds 3:1 against every surface it is
  drawn on.
- The palette is provisional until it can be checked against real Visarto photography.

Dark and stone passages are surfaces, not themes: `.on-midnight` and `.on-stone` re-point the
role tokens, so any primitive placed inside adapts without knowing where it is.

## 5. Typography

**Display: Fraunces.** Variable, subset to the optical size axis. SIL OFL.
**Text: Manrope**, at 400, 500 and 600. SIL OFL.

Both self-hosted through `next/font` at build time. 90 KB preloaded for the first viewport.

| Role | Size | Line height | Tracking | `opsz` |
|---|---|---|---|---|
| Display 1 | `clamp(3.25rem, 1.55rem + 7vw, 6.25rem)` | 1.04 | -0.028em | 144 |
| Display 2 | `clamp(2.2rem, 1.6rem + 2.6vw, 4rem)` | 1.12 | -0.02em | 96 |
| Display 3 | `clamp(1.65rem, 1.36rem + 1.25vw, 2.5rem)` | 1.24 | -0.014em | 48 |
| Title | `clamp(1.2rem, 1.1rem + 0.45vw, 1.5rem)` | 1.24 | -0.01em | 32 |
| Lede | `clamp(1.1rem, 1.03rem + 0.34vw, 1.35rem)` | 1.48 | 0 | text |
| Body | `clamp(1rem, 0.975rem + 0.11vw, 1.0625rem)` | 1.66 | 0 | text |
| Small | `0.9375rem` | 1.55 | 0 | text |
| Fine | `0.8125rem` | 1.55 | 0 | text |
| Annotation | `0.6875rem` uppercase | 1 | 0.13em | text |

Rules the system holds to.

- Measures live with the composition, not on the type class. A masthead and a section opener
  want different line lengths, and a global `max-width` on `.display-1` is a bug waiting to be
  overridden by stylesheet order.
- Body copy is capped at 62 characters, a lede at 44, a display at whatever the composition sets.
- The uppercase tracked annotation is used for genuine notation only: section marks, column
  headings, and the content-required label. It is never used as an eyebrow above every heading.
- Numerals in index positions are tabular so columns line up.
- The scale narrows as it descends, so a page can hold three levels of hierarchy without
  everything being enormous.

## 6. Grid and spatial system

| Token | Value |
|---|---|
| Sheet (full width) | 1680px |
| Content | 1240px |
| Reading column | 34rem |
| Gutter | `clamp(1.25rem, 5vw, 5.5rem)` |
| Columns | 12 desktop, 6 tablet, 1 phone |
| Grid gap | `clamp(1rem, 2.2vw, 2.25rem)` |

Section rhythm is deliberately not one value. `--section-tight`, `--section` and
`--section-loose` exist so that an opening passage breathes differently from a dense index.
Identical padding on every section is one of the clearest signals of a template.

Bleed rule: photographs break the sheet margin, type never does. On the homepage the opening
photograph runs off the right edge and the fitting photograph runs off the left; that reversal
is how the page changes subject without a labelled band.

## 7. Hero

**Mode C, still editorial composition.** Chosen, not defaulted to.

There is no Visarto footage. Generated film of a garment would misrepresent a product that
exists, which the prompt laws forbid outright, and a scroll-scrub hero exists to carry a
narrative that has not been shot. A still is the honest and the better choice here, and the
composition is built so that a photograph dropped into it finishes the page rather than changing
it.

- **Composition, desktop.** Two axes. Type holds the left gutter: masthead, standfirst indented
  one step, the two actions, a fine practical note. The photograph occupies the right and runs
  from the underside of the header to the foot of the composition and off the right edge of the
  viewport. It takes the height of the row rather than dictating it, so the type stays on its
  optical centre.
- **Composition, phone.** Recomposed, not stacked: masthead, standfirst, both actions, note,
  then the photograph full bleed below. The primary action stays above the fold at 375px.
- **Short desktop windows.** Below 43rem of height the minimum height is released and the
  photograph reverts to a 4:5 ratio, so the composition is not crushed.
- **Text safety.** No type sits over the photograph at any width, so there is no scrim, no
  darkening, and no worst-frame legibility problem to solve.
- **Photograph required:** full length or three-quarter portrait of a finished Visarto garment
  on a client, natural light, calm ground. Left third kept quiet. No crop through hands or the
  shoe line. Hotspot centred on the figure.

## 8. Scroll-band map

Not applicable. No scrub hero.

## 9. Homepage sequence

Five passages, each answering the question the last one raises, with the ground changing
underfoot: chalk, chalk, paper, stone, midnight.

| # | Passage | Question it answers | Ground |
|---|---|---|---|
| 1 | The opening | Who is this and what do they make | Chalk |
| 2 | What we make | Is what I need on the list | Chalk |
| 3 | The fitting comes to you | Do I have to go somewhere | Paper |
| 4 | How cloth is built | Do they know what they are talking about | Stone |
| 5 | Book an appointment | How do I start | Midnight |

The lookbook passage exists in code and renders only when at least three photographs exist in
the CMS. There is no proof passage: testimonials, press and client names require real material
and permissions, and inventing any of them is out of the question. That is the acknowledged
hole in the sequence and the first thing to build once the material exists.

Section 4 deserves a note. It is the passage that could not be reskinned for another business,
and it exists because it can be written truthfully at full length today. Weave structure is a
fact about textiles, so the page can be substantive about cloth without making a single claim
about Visarto's stock.

## 10. Page system

| Route | Purpose | Primary CTA | Notes |
|---|---|---|---|
| `/` | Establish the house and route to an appointment | Book | |
| `/made-to-measure` | Remove process anxiety | Book | Six stages, numbered |
| `/collections` | Show the range | Book | Staggered grid, unequal ratios |
| `/collections/[slug]` | One category in depth | Book | Falls back to authored areas so links never break |
| `/cloth` | Establish competence in material | Book | Weave notation plus mills |
| `/lookbook` | Show real finished work | Book | Empty until real photographs exist |
| `/about` | The house | Book | **[CONTENT REQUIRED]** |
| `/appointments` | Convert | The form itself | Hands over to an external system if one is configured |
| `/contact` | Answer a question | Send | |
| `/privacy`, `/terms` | Legal | none | **[CONTENT REQUIRED]**, `noindex` |

## 11. CMS model

Implemented in `sanity/schemas`. Eleven types. Editors get content, never layout.

**Singletons.** `siteSettings` (address, service area, hours, telephone, email, social, legal
name, default sharing image), `homePage` (three photographs), `aboutPage`, `processPage`,
`appointmentSettings` (booking URL, fitting locations, lead time, what to bring).

**Collections.** `collection`, `mill`, `lookbookItem`, `testimonial`, `promotion`.

**Objects.** `editorialImage` (hotspot, alt text, and a "do not crop through" note),
`socialAccount`, `appointmentLocation`.

Boundaries held.

- No colour field, no spacing field, no class name field, no free-form page builder.
- Every field description is written for the person filling it and says what the field is for.
- The singletons are opened directly from the desk rather than presented as a list of one, and
  cannot be duplicated or deleted.
- Body copy is a restricted block type: paragraphs, italic and links. No headings, because the
  page template owns the hierarchy.
- Descriptions on the fields that touch facts say plainly to leave them blank rather than
  estimate: the mill note, the process durations, the lead time.
- Every component tolerates a missing field, a long title, a short title, and zero documents.

## 12. Image direction

| Slot | Subject | Ratio | Focal note |
|---|---|---|---|
| Homepage opening | Finished garment on a client, full or three-quarter length | Fills the first screen | Do not crop hands or shoe line |
| Homepage fitting | A fitting in progress: hands, chalk, tape, cloth | 5:6 | Working distance, not macro |
| Collection lead | The category's garment, portrait | 4:5, 3:4, 5:6 by position | On the detail the category is about |
| Lookbook | Delivered garments | Editor chooses portrait, landscape or square | |
| About | The people, in the room they work in | 4:5 | A working shot, not a staged team photograph |

Real photography is required for every one of these, because every one of them is a claim about
a garment Visarto made or a service Visarto performs. Generated imagery is not acceptable in any
of these slots. It would be acceptable only for a genuinely abstract material study that is
clearly not documenting a product, and no such slot currently exists in the design.

Until a photograph exists, each frame draws a cloth field from a real weave draft, with crop
marks and a visible marker naming the photograph that belongs there. The state is designed, and
it cannot be mistaken for a finished image.

## 13. Motion vocabulary

Four behaviours for the whole site. Nothing loops, drifts, tilts, follows the pointer or parallaxes.

| Behaviour | Where | Duration | Easing |
|---|---|---|---|
| Mask | A media frame uncovers from its lower edge | 820ms | `cubic-bezier(.22,.61,.36,1)` |
| Rise | The first block of a passage lifts 12px, once per section | 620ms | same |
| Rule | A drafting line draws left to right | 620ms | same |
| Exchange | Hover response on index rows, collection frames and links | 180 to 320ms | same |

**One gesture per passage, and it lands on whatever the passage is about.** The homepage carries
a rule draw under the opening, a mask on the fitting photograph, and a single rise on the cloth
heading. Nothing else on the page moves. Giving every section the same lift on entry is the most
recognisable tell of a generated page, and it was removed from this one after the first review.

Engineering rules.

- One IntersectionObserver serves the page; each element is unobserved once it has entered.
- Anything within 1.2 screens on mount is revealed immediately rather than animated in behind
  the reader.
- The pre-reveal state applies only under `[data-js='true']` and
  `prefers-reduced-motion: no-preference`. Without JavaScript, and under reduced motion, the
  page renders finished.
- A print stylesheet forces every reveal to its final state.
- The only hover that touches an image is the collection frame, and it is capped at 1.8% scale.

## 14. Signature interaction

There is deliberately none beyond the motion vocabulary. A fabric explorer or a construction
hotspot needs real cloth data and real garment photography, and building either against
placeholder content would be building an interaction with nothing in it. The cloth room's
specimen sheet carries the material story for now, and it needs no interaction to do it.

## 15. Copy system

Voice: concise, confident, specific, calm. Sentences are short, and long ones earn their length
with information. First person plural is used sparingly and only where the house is genuinely
speaking ("we confirm the time and the place with you"). Superlatives are not used at all.

Enforced by `npm run copy-gate`, which fails the build on:

- em dashes and en dashes in authored viewer-facing copy, anywhere
- the stock vocabulary list (elevate, unlock, empower, seamless, robust, leverage, solutions,
  testament, delve, unparalleled, redefine, reimagine, curated experience, timeless elegance,
  discover the difference, and the rest)
- the "not just X, but Y" construction

All authored viewer-facing English lives under `lib/content/`, which is what makes a single scan
meaningful.

## 16. Appointment flow

- Fields: name, email, telephone (optional), where to meet, what is being made, when suits.
  Six fields, three of them optional. A first approach to a tailor is not a procurement form.
- Fields are drawn as ruled lines, not boxes, from the same drafting rule the site is built on.
- Validation runs in the browser and again on the server, with messages that say what to do.
- **A success screen is shown only after the server confirms the destination accepted the
  request.** There is no other path to it.
- With no `APPOINTMENT_ENDPOINT` configured, the form is visibly switched off behind a "Not
  connected" notice and the API answers 503. Nothing is collected that cannot be delivered.
- With a booking system configured, `/appointments` hands over to it plainly rather than
  redirecting, so the visitor keeps their bearings.
- A honeypot field, a ten-minute five-request rate limit, and a ten-second delivery timeout.
- Request contents are never logged.

## 17. Accessibility

Target: WCAG 2.2 AA, verified rather than assumed. `scripts/audit.mjs` runs in a real browser
across every page at two viewports and checks heading order, one `h1` per page, landmarks, alt
attributes, accessible names, form label association, computed contrast against the real
rendered backdrop, target size, focus visibility across a full tab pass, and horizontal overflow.
It currently reports clean.

`scripts/behaviour.sh` covers what a screenshot cannot: reduced motion leaving every element in
its final state, a page with JavaScript switched off, the mobile menu's focus and scroll
behaviour, the metadata and structured data, and the appointment path against both an
unconfigured and a live destination. Twenty-seven checks, all passing.

Beyond the automated pass:

- Focus is a two-part indicator, a ring plus a halo in the surface colour, so it survives any
  background. The ring colour is a role token, so it inverts inside the midnight passage.
- The mobile menu is a native `<dialog>`, which gives focus containment and Escape handling
  without a hand-rolled trap. Body scroll is locked by position, and restored to the same place.
- A viewport growing past the desktop breakpoint closes the menu.
- Skip link to `#main`.
- No information anywhere is available on hover alone.
- Decorative SVG is `aria-hidden`.
- Reduced motion is honoured before load and when toggled live, and every element rests in its
  final state.

## 18. SEO

- Title pattern: `Page | Visarto`, with the homepage as `Visarto | Made-to-measure and custom clothing`.
- Absolute canonicals generated from `NEXT_PUBLIC_SITE_URL`.
- Open Graph and Twitter card metadata on every page.
- `sitemap.xml` generated from the same route table the navigation uses.
- `robots.txt` disallows everything until a canonical origin is configured, so a preview
  deployment cannot compete with production. Once configured it disallows `/studio` and `/api`.
- Legal pages are `noindex` while they are empty.
- Structured data: one `ClothingStore` node built only from confirmed values. Fields with no
  value are omitted from the graph entirely. **There is no `aggregateRating`, no `review`, no
  `foundingDate` and no `award`,** and none will be added without real data behind it.

## 19. Analytics

Six events, and nothing sent until `NEXT_PUBLIC_ANALYTICS_ID` is set: appointment CTA,
appointment request sent, inquiry sent, telephone click, email click, booking system opened.
Each fires once per session by default, so Strict Mode and route transitions cannot double count.
No personal data is attached. Scroll depth and hover are not measured, because no decision would
be made differently because of them.

## 20. Engineering handoff

| Concern | Value |
|---|---|
| Runtime | Node 20.9+ |
| Framework | Next.js 16 App Router |
| Hosting | Any Next.js target. Vercel is the natural default and nothing depends on it |
| Images | Next Image, `cdn.sanity.io` only |
| Breakpoints | 40rem, 48rem, 60rem, 64rem, 75rem, plus a short-height query at 43rem |
| Client JS | Four islands: primary nav, mobile menu, entrance observer, request form |
| Budgets | LCP under 2.5s, CLS under 0.1, fonts 90 KB, no image request for an unfilled slot |

Environment variables are declared in one place, `lib/env.ts`, each with an explicit
"configured" flag, and `.env.example` documents every one.

## 21. Design gate

| Gate | State |
|---|---|
| Every section has a purpose | Met |
| Every line of copy has a source | Met. Authored copy lives in `lib/content`, facts come from the CMS or are marked |
| Mobile is designed, not derived | Met. The hero, the index, the specimen sheet and the collections grid each recompose |
| Reduced motion is designed | Met |
| Imagery requirements are explicit | Met. Every slot names its photograph on the page itself |
| Type and grid are locked | Met |
| Hero has a fallback state | Met. The fallback is the current state |
| CTA hierarchy is clear | Met. One action per page |
| CMS boundaries are defined | Met |
| No decision depends on a plugin default | Met |
| No component looks like a SaaS template | Met. No cards, no pills, no icon grid, no shadows, no radius above 1px |
| Proof passage | **Not met.** Requires real client material |
| Palette checked against real photography | **Not met.** Requires photographs |

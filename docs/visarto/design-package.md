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
predominantly dark, with light held back and spent once.

The site is dark-grounded. The first build was not, and it was wrong: every surface sat between
L\* 78 and 97, a nineteen-point band out of a hundred, which reads calm and well made rather than
expensive. The page now runs from L\* 4 to L\* 90. Warmth is what keeps that out of the
black-and-chrome register, so there is no pure black anywhere and no gold at all.

**Luxury quality test.** Turn off every transition on the site and nothing is lost but the
entrances. The page does not depend on motion, glow, blur or grain to look considered.

## 4. Palette

The materials of a tailoring room seen at night: a darkened fitting room, cloth under a single
lamp, bone-white chalk on a dark ground. Implemented in `styles/tokens.css`.

| Token | Value | L* | What it is |
|---|---|---:|---|
| `--obsidian` | `#100e0c` | 4 | The hero, and the deepest passages |
| `--ink` | `#16130f` | 6 | The default ground |
| `--ink-raised` | `#1e1a16` | 10 | A passage lifted off the ground |
| `--midnight` | `#161b24` | 10 | Evening cloth, the one cool passage |
| `--bone` | `#e8e1d3` | 90 | Type on dark, and the one light passage |
| `--stone` | `#d5ccbb` | 82 | Light passage secondary |

Text, all measured:

| Token | Value | Contrast |
|---|---|---|
| `--bone-1` | `#e8e1d3` | 14.2:1 on ink |
| `--bone-2` | `#c4bba8` | 9.7:1 |
| `--bone-muted` | `#9c9382` | 6.1:1 |
| `--ink-1` | `#16130f` | 14.2:1 on bone |
| `--ink-2` | `#4a423a` | 7.6:1 on bone |
| `--ink-muted` | `#5a5246` | 5.9:1 on bone, 4.8:1 on stone |
| `--control-dark` | `#6e6555` | 3.2:1 on ink |
| `--control-light` | `#736a59` | 4.1:1 on bone, 3.4:1 on stone |
| `--madder-dark` | `#c07a63` | 5.5:1 on ink |
| `--madder-light` | `#7b3226` | 6.9:1 on bone |

Notes.

- No pure black and no pure white anywhere.
- No gold. Midnight blue does the work a generic luxury site gives to black, for the reason a
  dinner jacket is midnight rather than black: black reads flat under light.
- On the dark ground the accent is really light itself, so madder keeps only its functional jobs:
  the content-required markers and form error states. When Visarto's content is complete it will
  be almost invisible on the site. A rare colour has authority; a democratic one does not.
- A rule and a control line are different things. A rule separates content and can be as quiet as
  it likes; a control line is the only thing telling somebody a control is there, so it holds 3:1
  against every surface it is drawn on.

### Two layers, and why it matters

The palette layer names materials. A **role layer** beneath it names jobs, and every component
reads only from that: `--surface`, `--text`, `--line`, `--control`, `--accent`, `--action-fill`.
A surface class re-points the roles, so a passage changes ground without a single component
knowing where it is.

The surfaces are `.on-obsidian`, `.on-raised`, `.on-midnight` and `.on-bone`. The primary action
is a role rather than a rule per surface, which is why one button works on all four with no
special case.

`.on-bone` is applied to a whole page, never to a section inside one. Today that is `/cloth` and
nothing else.

This is what made the inversion a change to one file rather than a hundred call sites, and it is
worth protecting: the first pass had components reaching for raw palette names, and the surfaces
did not actually invert until that was fixed.

### The weave patterns are the exception

An SVG pattern referenced with `url(#id)` resolves its custom properties where it is *defined*,
not where it is used. A single set painted with `var()` therefore keeps the root palette on every
surface, which is invisible while the surfaces are close in tone and glaring the moment they are
not. `WeaveDefs` emits one set per tone with literal colours and generates the `--weave-*` mapping
per surface, so components still name only a weave and a scale.

## 5. Typography

**Display: Bodoni Moda.** Variable, subset to the optical size axis. SIL OFL.
**Text: Manrope**, at 400, 500 and 600. SIL OFL.

Both self-hosted through `next/font` at build time. 71 KB preloaded for the first viewport, down
from 90 KB.

A didone is the register a fashion house is set in: extreme stroke contrast, hairline serifs,
vertical stress. The first build used Fraunces, which is a good typeface with the wrong
temperament here, warm and faintly artisanal. The optical size axis matters more with a didone
than with anything else, because a didone set small with display proportions loses its hairlines
entirely, so `opsz` is doing real work rather than decorating the config.

Two consequences, both learned by looking at it:

- **The wordmark needs the text end of the axis.** At 17px with a display `opsz` it renders as a
  broken font. It is set at `opsz` 11 and weight 600.
- **Titles on a dark ground go to weight 500.** Thin strokes bloom away against near-black.

| Role | Size | Line height | Tracking | `opsz` |
|---|---|---|---|---|
| Display 1 | `clamp(3.25rem, 1.55rem + 7vw, 6.25rem)` | 1.04 | -0.022em | 96 |
| Display 2 | `clamp(2.2rem, 1.6rem + 2.6vw, 4rem)` | 1.12 | -0.018em | 72 |
| Display 3 | `clamp(1.65rem, 1.36rem + 1.25vw, 2.5rem)` | 1.24 | -0.014em | 40 |
| Title | `clamp(1.2rem, 1.1rem + 0.45vw, 1.5rem)` | 1.24 | -0.01em | 28 |
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

**Mode C, still editorial composition, full bleed.**

There is no Visarto footage. Generated film of a garment would misrepresent a product that
exists, which the prompt laws forbid outright, and a scroll-scrub hero exists to carry a
narrative that has not been shot. A still is both the honest and the better choice.

The photograph takes the viewport. It runs the full width and the full height of the first screen
and the type sits on it rather than beside it, which is the clearest single difference between a
fashion house and a business with a website. The first build placed the image in a 45% column
next to the type; that reads as a page with a picture on it.

- **Desktop.** Type on the left half, photograph behind and through it, scrim falling off to
  nothing by 62% so the subject keeps its full tonal range on the right.
- **Phone.** Recomposed, not stacked: the scrim runs bottom to top and the type sits at the foot
  of the frame. The primary action stays above the fold at 375px.
- **Short desktop windows.** Below 43rem of height the minimum height is released and the masthead
  scales down, so the whole opening including the action fits one screen at 1280x600.

### Legibility, in layers

Overlaying type on a photograph creates a contrast problem that the previous composition did not
have. It is solved the way the engineering standard asks, not by darkening the whole frame:

1. the photograph is art-directed with a calm region, written into the brief the frame carries
2. a **directional** scrim, opaque where the words are and gone by the middle of the frame
3. bone type at 14:1, which survives a far worse backdrop than this one

The `scripts/audit.sh` contrast check walks up to the nearest solid background, so it measures
against the ground and not the scrim. Since the scrim only ever darkens, the reported figure is
conservative rather than optimistic.

The marker naming the missing photograph is placed by the page, above the scrim, rather than
inside the frame. Inside the frame it is buried by the scrim, which is what happened first.

**Photograph required:** full length or three-quarter portrait of a finished Visarto garment on a
client, natural light, calm ground. Left third kept quiet. No crop through hands or the shoe line.

## 8. Scroll-band map

Not applicable. No scrub hero.

## 9. Homepage sequence

Four passages, each answering the question the last one raises. The page stays in one tonal world
from the opening to the close; what changes between passages is the composition, not the ground.

| # | Passage | Question it answers | Ground | Shape |
|---|---|---|---|---|
| 1 | The opening | Who is this and what do they make | obsidian | Full-bleed image, type on it |
| 2 | What we make | Is what I need on the list | ink | Sticky intro left, index right |
| 3 | The fitting comes to you | Do I have to go somewhere | raised | Image left, type right |
| 4 | How cloth is built | Do they know what they are talking about | ink | Horizontal band, full width |
| 5 | Book an appointment | How do I start | midnight | The only real tonal event |

Every passage answers one of the homepage's four jobs: establish the house, show the range, kill
the "do I have to go to a shop" objection, get to an appointment.

**A whole page may change world; a section inside a page may not.** The cloth passage was briefly
set on bone, and it was wrong three ways: at 29% of the page it was a second theme rather than an
accent, a hard tonal flip mid-page reads as a section boundary and announces structure the
composition should carry, and putting the brightest thing on the page immediately before the close
left the close reading as a step down. `/cloth` is the light chapter instead, in full, arrived at
through navigation.

The cloth passage carries the material argument and one length of cloth, not the specimen sheet.
Six weave structures with a paragraph each is depth content: it is the reason `/cloth` exists, and
someone deciding whether to book does not need it. Rendering it in both places also made the
homepage a preview of another page.

The lookbook passage exists in code and renders only when at least three photographs exist. There
is no proof passage: testimonials, press and client names require real material and permissions.
That is the acknowledged hole in the sequence, and cutting the cloth passage down is what leaves
room for both.

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

Four behaviours and one opening. Nothing loops, drifts, tilts, follows the pointer or parallaxes.

| Behaviour | Where | Duration |
|---|---|---|
| Mask | A media frame uncovers from its lower edge | 820ms |
| Rise | The first block of a passage lifts 12px, once per section | 620ms |
| Rule | A drafting line draws left to right | 620ms |
| Exchange | Hover response on index rows, collection frames and links | 180 to 320ms |

**One gesture per passage, and it lands on whatever the passage is about.** The homepage carries a
rule draw under the opening, a mask on the fitting photograph, and a single rise on the cloth
heading. Giving every section the same lift on entry is the most recognisable tell of a generated
page, and it was removed after the first review.

### The opening curtain

Shown on the first page of a session only. The research on preloaders is unambiguous: a timed one
on a fast page inflates LCP for nothing. This one is not timed.

- **Real-load.** It waits on `document.fonts.ready`, which is the thing that actually makes the
  first screen look unfinished, and lifts the moment they resolve.
- **Capped at 1.2s**, and dismissed by any pointer, key, wheel or touch.
- **Decided before paint** by an inline script in the head, which is what avoids a flash. The
  curtain is in the server HTML but stays `display: none` unless that script marks it pending.
- **Never shown** without JavaScript, under reduced motion, or on any page after the first in a
  session. All four are asserted in `scripts/behaviour.sh`.

Measured on the production build at 4x CPU throttle over 4Mbps, five runs each: **LCP 488ms with
the curtain, 496ms without**, CLS 0.002 in both. It costs nothing.

### Film grain

A fractal-noise tile from the browser's own SVG filter, inlined as a data URI, fixed over
everything at 3.8% opacity. It removes the flat-digital quality that makes large areas of solid
colour read as a screen, and on a dark ground it does more than anything else of its size.

Deliberately no blend mode: on a full-screen fixed layer a blend mode creates a stacking context
that fights the sticky header and forces a repaint of everything beneath it on every scroll. Flat
opacity looks the same here and costs nothing. It never animates.

Engineering rules for the entrances are unchanged: one IntersectionObserver, unobserved once
entered, anything within 1.2 screens revealed on mount, the pre-state gated behind `[data-js]`
and a no-preference query, and a print stylesheet that forces final state.

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
It currently reports clean, including against the dark palette, which is what it was mainly
built for.

`scripts/behaviour.sh` covers what a screenshot cannot: reduced motion leaving every element in
its final state, a page with JavaScript switched off, the mobile menu's focus and scroll
behaviour, the opening curtain's four bypass conditions, the metadata and structured data, and the
appointment path against both an unconfigured and a live destination. Thirty-four checks, all
passing.

`scripts/lcp.sh` measures LCP, FCP and CLS on the production build under throttling, with and
without the opening curtain, so a change to the first screen can be judged rather than argued
about.

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
| Client JS | Five islands: primary nav, mobile menu, entrance observer, request form, opening curtain |
| Budgets | LCP under 2.5s, CLS under 0.1, fonts 71 KB, no image request for an unfilled slot. Measured: LCP 488ms, CLS 0.002 |

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
| The page has tonal range | Met. L* 4 to 90 across the site, against a 19-point band before |
| No section announces itself with a ground change | Met. The homepage is one world; `/cloth` is a chapter |
| Proof passage | **Not met.** Requires real client material |
| Palette checked against real photography | **Not met.** Requires photographs |

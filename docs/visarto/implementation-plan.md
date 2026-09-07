# Visarto implementation plan

Tracks the actual build. Slices are ordered so that each one is shippable on its own and none of
them depends on content Visarto has not supplied.

## Done

### Slice 1: foundation
Next.js 16 App Router on TypeScript with `strict` and `noUncheckedIndexedAccess`. ESLint flat
config. CSS Modules over a global token layer. Four runtime dependencies.

### Slice 2: design system
Token layer with measured contrast, in two layers: palette names for materials, role names for
jobs, with components reading only the second. Display and text faces self-hosted and subset to
the optical size axis. Fluid type scale with measures held at the composition. Sheet, content and
reading widths. Twelve-column draft grid. Focus system with a surface-coloured halo. Four-behaviour
motion vocabulary with a shared observer.

### Slice 3: the weave system
Real weave drafts in `lib/weave.ts`: plain, 2/2 twill, herringbone, hopsack, birdseye, and glen
check built from banded warp and weft over a twill. Rendered once per document as SVG patterns
at two scales, with the thread size set per structure so all six read at the scale they would
have on a suit length. This is the origin of the site's graphic system and of the state every
unfilled photograph slot sits in.

### Slice 4: application shell
Sticky header with an always-drawn hairline, so there is no scroll state and no contrast
switching. Primary nav as a client island for `aria-current` only. Mobile menu as a native
`<dialog>`. Footer with the masthead, the four columns, and content-required markers where facts
are missing. Skip link. Square-cornered CTA primitives and the quiet rule-drawing link.

### Slice 5: CMS
Eleven Sanity types written as business concepts. Studio embedded at `/studio` behind a client
boundary, with a desk arranged the way the house thinks and singletons opened directly. Typed
GROQ layer where every read degrades to a fallback, so the site builds and runs with no project
configured and survives a CMS outage.

### Slice 6: homepage
Five passages as an editorial sequence, with the ground changing underfoot. Opening, index,
fitting, cloth, appointment. Lookbook passage in place but gated on real photographs.

### Slice 7: inner pages
`/made-to-measure`, `/collections`, `/collections/[slug]`, `/cloth`, `/lookbook`, `/about`,
`/privacy`, `/terms`, and a 404. Collection detail falls back to the six authored areas so no
link on the site can break before the CMS is filled.

### Slice 8: appointment flow
One form for both intents. Ruled-line fields. Validation on both sides. `/api/appointments` with
a honeypot, a rate limit, a delivery timeout, and a hard refusal when no destination is
configured. A success screen only after the destination accepts.

### Slice 9: SEO, structured data, analytics
Metadata helper with absolute canonicals. Sitemap generated from the route table. Robots that
refuse all crawling until a canonical origin exists. One truthful `ClothingStore` node with no
invented properties. Six analytics events behind a configuration flag.

### Slice 10: quality tooling
`scripts/qa.sh` screenshots every page at seven viewports and reports console errors, failed
requests and horizontal overflow. `scripts/audit.sh` runs a real-browser accessibility and layout
audit. `scripts/copy-gate.mjs` scans authored copy for dashes and stock language. All three run
clean.

### Slice 11: the art-direction pass

The site read calm rather than expensive, and the palette was measurably the cause: every surface
sat in a nineteen-point lightness band. Five changes, in the order they were judged:

1. **Palette inverted to dark-dominant.** L\* 4 to 90 across five grounds. The role-token layer had
   to be enforced first, because components were reaching for palette names and the surfaces did
   not actually invert until they stopped.
2. **Bodoni Moda replaces Fraunces.** A didone is the register a fashion house is set in, and it
   ships 20 KB lighter.
3. **Film grain.** A fractal-noise tile from the browser's own SVG filter, fixed, static, 3.8%.
4. **Imagery made dominant.** Full-bleed hero with type on it, full-viewport collection openings,
   an edge-to-edge lookbook, and a layered scrim rather than a blanket darkening.
5. **An opening curtain.** Real-load, once per session, capped at 1.2s, bypassed under reduced
   motion and without JavaScript. Measured at LCP 488ms against 496ms without it.

Three bugs the work exposed and fixed: SVG patterns resolve custom properties at their definition
site, so the cloth swatches kept the dark palette on the light passage; the photograph marker was
buried under the hero scrim; and the marker collided with the call to action on phones.

### Slice 12: homepage rhythm

A correction to slice 11. The cloth passage had been set on bone, and measuring the page showed
it was 29% of it, dead centre, and the single largest passage on the homepage. Three problems: an
accent that size is a second theme, a hard tonal flip mid-page announces a section boundary the
composition should carry, and the brightest thing on the page sat immediately before the close and
flattened it.

The homepage is now one tonal world and four passages. The cloth passage keeps the material
argument and one length of cloth, set as a horizontal band because that is the shape cloth comes
in, and the specimen sheet lives only on `/cloth`. `/cloth` becomes the light chapter in full,
rather than being half dark and half bone, which had the same problem in miniature.

Principle recorded so it is not reintroduced: **a whole page may change world; a section inside a
page may not.**

The homepage lost 777px and gained a real close.

### Slice 13: the entrance system

Sections were arriving unevenly and slowly. Measuring it found four causes, and only the last one
was a matter of taste:

1. Slice 11 had removed the repeated fade-up to avoid the every-section-fades tell, and left the
   homepage with two moving elements across six passages. Four passages that snap in and one that
   wipes open slowly reads as a fault, not as restraint.
2. The observer used a fractional threshold, so a tall frame started later than the short
   paragraph beside it. Two halves of one passage arrived at two different moments.
3. Entrances ran 620 to 820ms and started only once an element was 12% clear of the fold, so they
   were still running when the reader reached the words. An image uncovering gradually while you
   scroll past it is indistinguishable from an image still downloading.
4. Anything within 1.2 screens was revealed with no transition at all, and anything at 1.21
   screens got the full treatment, so the same element behaved differently between loads.

The system that replaced it: three entrances at 480 and 660ms on an expo-out curve, a
height-independent trigger at 90% of the viewport, and a `stagger` mode that moves the entrance to
a container's direct children on a 70ms step. Every passage on every page now carries one, and the
first screen composes as the opening curtain clears it rather than being uncovered already
finished. The curtain lift came down from 820ms to 560ms.

LCP is protected by construction: the headline lifts at full opacity rather than fading, because
an element at zero opacity is not painted. Measured at 472ms with the curtain and 444ms without,
against 488ms and 496ms before.

Three checks added to `scripts/behaviour.sh`, all guarding the failure that started this: every
homepage passage carries an entrance, the first screen composes within two seconds, and nothing is
left hidden once the page has been read. 37/37 pass.

Two bugs the work exposed and fixed: the homepage cloth band never squared up on a phone, because
`MediaFrame` writes `--frame-ratio` into its own style attribute and no stylesheet rule can
outrank that; and the appointment body copy was set as the full text colour held back to 86%
opacity, which is an unmeasured colour of exactly the kind the two-layer token system exists to
prevent.

Principle recorded so it is not undone again: **an entrance is applied to every passage or to
none. What separates a composed page from a template is order within a passage, not scarcity of
passages that move.**

## Next, and not blocked on Visarto

### Slice 14: deferred from the art-direction pass

Route transitions via the View Transitions API, masked line-by-line text reveals, parallax inside
the image mask, a cursor treatment on collection frames, hover image exchange on the garment
index, a pinned cloth sequence, a larger display scale, graded photography treatment, form
micro-interactions, and a scroll-progress hairline.

Smooth scroll was evaluated and rejected: it hijacks native scrolling and risks keyboard, anchor,
history and assistive behaviour for a gain that is purely taste.

## Blocked on Visarto

Ordered by how much each one changes the site.

1. **Photography.** Every image slot. The homepage opening is designed around a full-height
   portrait and is the single highest-value asset.
2. **House details.** Address, telephone, email, hours, service area, social. Unblocks the
   footer, the contact page, the appointments aside and the structured data.
3. **Appointment destination.** `APPOINTMENT_ENDPOINT`, or a booking system URL. Until one
   exists the primary conversion path on the site is switched off.
4. **The practical answers.** Lead time, number of fittings, total time, how pricing works.
   These are the questions a client asks immediately after deciding they are interested.
5. **Logo files.** The wordmark is currently set in Bodoni Moda.
6. **The house's own story**, for the About page.
7. **Mills and bunches**, for the cloth room.
8. **Client words with written permission**, which unblocks the proof passage that the homepage
   sequence is currently missing.
9. **Privacy notice and terms.**
10. **Canonical domain and analytics property.**

## Deliberately not built

- **Any proof passage.** No testimonial, press mention, client name, logo wall or statistic
  appears anywhere on the site, because none of them can be sourced.
- **A scroll-scrub hero.** There is no footage, and generated film of a garment would
  misrepresent a real product.
- **E-commerce, accounts, a customer dashboard.** Nothing here can be bought without a fitting.
- **A fabric explorer or construction hotspot.** Both need real cloth data and real garment
  photography to be anything other than a demonstration.
- **A component catalogue.** Primitives were extracted when a second real use appeared, not in
  advance. `SpecimenSheet` was extracted at its second use; nothing else has been.

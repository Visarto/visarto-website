# Visarto build audit

Written at the start of the build and kept current as the state of the project changes.

## 1. What was here

Nothing. The repository at `Visarto/visarto-website` was empty: no commits on any branch, no
remote branches, no `package.json`, no assets, no documentation.

That matters for two reasons.

First, several things the master directive treats as existing context do not exist in the
repository: there is no `/type-proof` route, there are no typography ADRs, there is no design
system documentation, there is no Phase 0 placeholder homepage, and there is no prior
implementation to preserve or reconcile with. Nothing has been discarded, because there was
nothing to discard.

Second, the provisional typography direction named in the directive (Fraunces with Manrope,
against a DM Serif Display and Inter foil) is not locked by any decision record in the repository.
It has been treated as the standing direction and adopted, not replaced. See section 6.

## 2. Stack as built

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16.3.4, App Router | Server rendering by default, file-based metadata, image optimisation, first-class static output |
| Language | TypeScript 5.9, `strict` plus `noUncheckedIndexedAccess` | Content from a CMS is optional by nature; the compiler should force every component to handle that |
| React | 19.2, Server Components by default | Only four client islands exist across the whole site |
| Styling | CSS Modules over a global token layer | Editorial composition lives in real CSS. No utility-class residue and no component-library visual defaults to fight |
| CMS | Sanity 6, studio embedded at `/studio` | Structured content, hotspot cropping, draft and publish, and an editor experience that can be shaped rather than accepted |
| Animation | None | Four entrance behaviours, roughly forty lines of CSS and one shared IntersectionObserver. A library would have been more code than the code |
| Package manager | npm | No reason to require anything else of whoever maintains this next |

Total runtime dependencies: four (`next`, `react`, `react-dom`, and the two Sanity packages the
site reads images and content through). Everything else is a development dependency.

## 3. Routes

| Route | Rendering | Source of content |
|---|---|---|
| `/` | Static | Authored copy, CMS photographs |
| `/made-to-measure` | Static | Authored copy |
| `/collections` | Static | CMS `collection`, falling back to six authored areas |
| `/collections/[slug]` | Static, generated per slug | CMS `collection`, falling back to authored |
| `/cloth` | Static | Authored weave notation, CMS `mill` |
| `/lookbook` | Static | CMS `lookbookItem` only |
| `/about` | Static | CMS `aboutPage` |
| `/appointments` | Per request | CMS `appointmentSettings` |
| `/contact` | Per request | CMS `siteSettings` |
| `/privacy`, `/terms` | Static, `noindex` | Awaiting Visarto |
| `/studio/[[...tool]]` | Static shell, client-only | Sanity Studio |
| `/api/appointments` | Dynamic | Appointment and inquiry delivery |
| `/sitemap.xml`, `/robots.txt` | Static | Generated from the route table |

## 4. Repository health

Established from scratch, so there is no inherited debt. Current state of the checks:

| Check | Command | Result |
|---|---|---|
| Install | `npm ci` | Clean |
| Types | `npm run typecheck` | Clean |
| Lint | `npm run lint` | Clean |
| Build | `npm run build` | Clean. Every route prerendered except the two conversion pages and the API |
| Copy gate | `npm run copy-gate` | Clean |
| Unit tests | `npm test` | Clean, 10 assertions |
| Behaviour | `bash scripts/behaviour.sh` | Clean, 27 checks including the appointment journey end to end |
| Browser audit | `bash scripts/audit.sh <paths>` | Clean: headings, landmarks, accessible names, form labels, contrast, target size, focus visibility, horizontal overflow |
| Screenshots | `bash scripts/qa.sh <paths>` | No console errors, no failed requests, no horizontal overflow at any of seven viewports |

## 5. Assets

| Item | State |
|---|---|
| Logo and wordmark | **Missing.** The wordmark is currently set in Fraunces, letterspaced. A real mark will replace it |
| Photography | **Missing.** No Visarto photograph of any kind exists |
| Video | **Missing**, and not needed for the chosen hero |
| Brand colours | **Not supplied.** The palette was derived from tailoring materials and is provisional until measured against real photography |
| Written copy | **Not supplied.** All viewer-facing copy was authored for this build and is provisional |
| Business facts | **Not supplied.** See section 7 |

Every photograph slot on the site is drawn as a cloth field with a visible marker naming the
photograph that belongs there. Nothing on the site pretends to be a photograph of a Visarto
garment, and no stock or generated imagery has been used.

## 6. Typography decision

Adopted: **Fraunces** for display, **Manrope** for text. Both are SIL Open Font Licence, so
production web use is licensed. Both are self-hosted at build time through `next/font`.

Fraunces is loaded as a variable font subset to the optical size axis alone. Requesting `SOFT`
and `WONK` as well took the file from 66 KB to 118 KB for a difference invisible at the sizes
used, so they sit at their defaults. `opsz` is the reason the family was chosen: the display
sizes take the high stroke contrast of a masthead while the same face at title size stays sturdy.

Preloaded font weight for the first viewport is 90 KB across both families.

## 7. What Visarto has to supply

None of the following is invented anywhere in the codebase. Each appears on the site as a
visible "Content required" marker until an editor fills the matching CMS field.

| Fact | Where it is needed |
|---|---|
| Studio address, access, hours | Footer, homepage fitting passage, appointments page, structured data |
| Telephone and email | Footer, contact page, structured data |
| Area travelled to for fittings | Structured data, appointments page |
| Social accounts | Footer |
| Mills and bunches | Cloth page, homepage cloth passage |
| Lead time, number of fittings, total time, pricing | Made to measure page, appointments page |
| What to bring to a first appointment | Homepage close, appointments page |
| The house's own story | About page |
| Client words, with permission | Not built. No testimonial appears anywhere until real ones exist |
| Privacy notice and terms | `/privacy`, `/terms`, both currently `noindex` |
| Photography | Every image slot on the site |
| Logo files | Header, footer, favicon, social sharing image |
| Booking system, if one is used | `NEXT_PUBLIC_BOOKING_URL` or `appointmentSettings.bookingUrl` |
| Appointment destination | `APPOINTMENT_ENDPOINT`. Until it is set the form is visibly switched off |
| Canonical domain | `NEXT_PUBLIC_SITE_URL`. Until it is set, `robots.txt` refuses all crawling |
| Analytics property | `NEXT_PUBLIC_ANALYTICS_ID`. Until it is set, no event is sent |

## 8. What should be preserved

- The weave notation in `lib/weave.ts`. It is real draft notation and it is the origin of the
  site's entire graphic system, including the placeholder fields.
- The content integrity boundary: `ContentRequired`, the empty-safe CMS query layer, and the
  refusal in `/api/appointments`. These are what stop the site from making a claim nobody can
  stand behind.
- The token layer in `styles/tokens.css`. The contrast figures in the comments were measured,
  not estimated.
- The four-behaviour motion vocabulary. It is deliberately small.

## 9. Known gaps in this build

- **The two conversion pages render per request.** Whether the appointment destination is
  configured is read from the server environment, and prerendering them baked in whatever that
  was at build time. On a platform where environment variables are set after a build, the form
  would have silently stayed switched off while the destination was live. Everything else on the
  site is still static.
- **No proof passage.** There is no testimonial, press, or client section anywhere, because
  there is no real material for one. This is a deliberate hole in the homepage sequence and the
  first thing to build once permissions exist.
- **The hero is a still, and its photograph does not exist yet.** The composition is designed
  around a full-height portrait; it currently holds a cloth field in that slot.
- **The About page is nearly empty.** It has a shape and a marker, not a story.
- **Performance has been measured against localhost only.** Production receipts are owed once
  a deployment target exists.
- **No visual editing or preview mode.** The query layer is written so that adding one is a
  contained change, but draft preview is not wired.

# Visarto

The website for Visarto, a made-to-measure and custom clothing house.

## Running it

```bash
npm ci
npm run dev
```

No environment variables are needed. With nothing configured the site runs on its authored
baseline: the CMS returns nothing, every photograph slot draws a cloth field naming the
photograph that belongs there, the appointment form is visibly switched off, and no analytics
event is sent. Copy `.env.example` to `.env.local` to connect any of those.

## Checks

```bash
npm run typecheck   # TypeScript, strict
npm run lint        # ESLint
npm run build       # production build
npm test            # weave drafts and the appointment guarantees
npm run copy-gate   # dashes and stock language in authored copy
```

Three browser checks run against a production build:

```bash
bash scripts/qa.sh "/,/collections,/appointments"      # screenshots at seven viewports
bash scripts/audit.sh "/,/collections,/appointments"   # accessibility and layout
bash scripts/behaviour.sh                              # reduced motion, no-JS, menu, booking
```

`qa.sh` writes to `qa/screenshots/` and reports console errors, failed requests and horizontal
overflow. `audit.sh` checks heading order, landmarks, accessible names, form labels, computed
contrast, target size, focus visibility and keyboard reachability. `behaviour.sh` starts a local
receiver and a second application instance pointed at it, so the whole appointment journey is
exercised: form, API, destination, and only then a confirmation.

## Sharing it for review

```bash
bash scripts/snapshot.sh
```

Builds `qa/visarto-snapshot.html`: every page of the site in one file, with the real markup,
the real stylesheets and the fonts as data URIs. It opens in any browser, needs no server and
depends on no network, so the site can be reviewed without deploying it anywhere.

It is a snapshot, not the application. Navigation runs on the hash, the entrance and the mobile
menu are reimplemented in a few lines of plain JavaScript, and the appointment form is inert.

## Editing content

The Sanity Studio is served at `/studio`. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` first.

Editors control content, never layout. There is no colour field, no spacing field and no page
builder: the design system decides how something is placed, and the editor decides what it is.

## Two rules this codebase holds to

**Nothing about the business is invented.** Addresses, telephone numbers, mills, lead times,
prices and client quotations are facts. Where the design needs one and the CMS has none, the site
renders a visible "Content required" marker naming what is missing. There is no placeholder text
anywhere that could be mistaken for a real claim, and there are no testimonials, press mentions or
statistics of any kind.

**The appointment path never lies.** `/api/appointments` refuses with 503 when no destination is
configured, and the confirmation screen is reachable only from a confirmed acceptance by that
destination. `tests/appointments.test.mjs` asserts both.

## Documentation

- `docs/visarto/design-package.md` is the source of truth for the visual system
- `docs/visarto/build-audit.md` records the state of the project and what Visarto still has to supply
- `docs/visarto/implementation-plan.md` tracks the build

# Visarto photography brief

Everything a photographer needs to shoot for this site, and everything an editor needs to know
before uploading. Nothing here is a preference: every ratio and every pixel figure is read off the
composition that will hold the picture.

Twelve placeholder files currently stand in for this shoot. They are placeholders. They are not
Visarto's work, they do not show Visarto's garments, and none of them may be used in anything that
represents the house.

---

## 1. The shot list is missing a whole category, and it is the important one

The site currently shows finished garments on people and rooms with tailoring in them. It shows
nothing at macro distance: no stitch, no buttonhole, no canvas, no chalk line, no shears, no basted
seam, no bunch of swatches fanned on a table.

For made to measure that is not a gap in the gallery, it is a gap in the argument. A client is
being asked to pay for construction they cannot see on a rail and cannot judge from a lookbook. The
close detail is the entire proof mechanism, and it is also the cheapest and fastest category to
shoot: it needs a table, a window, and an afternoon, with no model, no location and no release.

**Shoot at least eight macro frames.** Suggested, in order of usefulness:

1. A basted seam with the tacking still in, canvas visible.
2. A hand-worked buttonhole, raking light across it.
3. Chalk marks on cloth at a fitting, tape over the shoulder.
4. The inside of a jacket front: canvas, haircloth, the shape that is built rather than pressed.
5. Shears on cloth, mid cut.
6. A bunch fanned open, showing the range of a book rather than one swatch.
7. A sleevehead being set, pins in.
8. A finished cuff, buttons and stitching in focus, at conversational distance.

These carry the `/made-to-measure` sequence, a craft passage on the homepage, and the empty
`/lookbook` state until real client work can be shown.

## 2. The hero needs two files, not one

The opening frame is roughly **1.8:1 on a desktop** and roughly **0.56:1 on a phone**. No single
landscape photograph survives both through a centred crop: the phone gets the middle third, and on
a portrait subject the middle third is the backdrop. That is exactly what the placeholder did, and
it is why `MediaFrame` now takes an art-directed second source.

**Deliver every full-bleed slot twice**: one landscape master and one portrait crop of the same
frame, shot with both in mind. The CMS needs a second image field on the home page and collection
documents to carry it.

---

## 3. Every slot, with its numbers

`Deliver at` is the long edge in pixels, sized for a 2x display at the widest viewport the slot can
occupy, before compression. Files are re-encoded on the way in; deliver uncompressed or lightly
compressed masters, not web exports.

| Slot | Ratio | Occupies | Deliver at | Priority |
|---|---|---|---|---|
| Home opening, landscape | free, fills 1.8:1 | full bleed to 1680px | **3400 x 1900** | highest |
| Home opening, portrait | free, fills 0.56:1 | full bleed to 47.99rem | **1600 x 2900** | highest |
| Home fitting | 5 / 6 | 44vw desktop, 100vw phone | **1800 x 2160** | high |
| Home cloth band | drawn, not photographed | full bleed | none | none |
| Collection opening, landscape | free, fills 1.8:1 | full bleed to 1680px | **3400 x 1900** | high, x6 |
| Collection opening, portrait | free, fills 0.56:1 | full bleed to 47.99rem | **1600 x 2900** | high, x6 |
| Collections index | 4/5, 3/4, 5/6 cycling | 30vw desktop | **1400 x 1750** | high, x6 |
| Collection gallery | 4/5, and 3/4 every third | 32vw desktop | **1400 x 1750** | medium |
| Made to measure, practical | 4 / 3 | 46vw desktop | **1900 x 1425** | high |
| Appointments, the studio | 4 / 3 | 32vw desktop | **1400 x 1050** | high |
| About, the workroom | 4 / 5 | 40vw desktop | **1700 x 2125** | medium |
| Lookbook | 4/5 portrait, 4/3 landscape, 1/1 square | 32vw desktop | **1400 x 1750** | high, at least 5 |
| Home lookbook strip | 4/5, 3/4, 5/7 | 40vw | **1400 x 1750** | high, 3 of the above |

Both lookbook surfaces currently run on marked placeholders and switch to real work automatically
the moment the CMS holds three items or more. **The placeholder note above each grid is not
optional.** A lookbook is a claim that these are garments this house made; five photographs under
that heading with nothing beside them make the claim on Visarto's behalf, and it is not true yet.
The note comes off with the placeholders, in the same change.

## 4. Crop-safe zones

The compositions put type on three of these frames. Those areas have to be kept quiet in the
photograph rather than rescued with a darker scrim, because a scrim heavy enough to fix a busy
frame veils the subject as well.

- **Home opening, landscape.** Keep the **left 45%** low in contrast and free of detail. The
  masthead sits at 144px there. The subject belongs right of centre. Do not crop the hands or the
  shoe line.
- **Home opening, portrait.** Keep the **left 55%** and the **bottom 45%** quiet: the headline, the
  standfirst and both calls sit there. The figure belongs in the right third, full length.
- **Collection opening.** Keep the **bottom third** quiet across the full width. The title and
  standfirst sit on it at every size.
- Everything else carries no type and can be composed freely.

## 5. Direction

**The register is a workroom, not a lifestyle shoot.** The current placeholder hero is a man
lounging in a chair with a whisky and red socks. That is menswear advertising. It sells a mood
somebody else already owns. Visarto sells construction, and construction is a room, a pair of
hands, and cloth under tension.

- **Natural light, one direction.** Window light with a single fall-off. No fill from a second
  source, no ring light, no on-camera flash. The palette of the site is one warm dark and one bone;
  photographs lit from two sides fight it.
- **Real people, and permission on file.** No stock. No agency casting that reads as agency
  casting. A client photographed at a fitting, with written permission, is worth more than a model
  in a studio, and it is the only kind of frame that can carry a caption naming what was made.
- **Cloth in tension, not cloth lying flat.** A garment on a hanger says nothing about fit. Shoot
  the moment cloth is being pulled, pinned, marked or worn.
- **Working distance, not macro-for-its-own-sake.** Close enough to see the stitch, far enough that
  the room is still legible behind it. The exception is the eight macro frames above, which are
  deliberately close.
- **Let the frame breathe, but not empty.** The compositions here are generous already. A
  photograph that arrives with its own vast empty half leaves the page with two.
- **No colour beyond the cloth.** The site holds one accent and uses it for notation. A photograph
  with a strong third colour in it will read as the loudest thing on the page.
- **Grain is welcome.** The site carries a fractal-noise layer at 3.8%. Film, or a digital file
  that has not been denoised into plastic, sits into it correctly.

## 6. Delivery

- **Format**: JPEG or TIFF masters, sRGB, no sharpening applied for web.
- **Do not deliver web exports.** Files are resized and re-encoded on the way in, and a
  double-compressed file cannot be recovered.
- **Name by slot**, matching the table above, so an editor can place them without guessing.
- **Focal point**: every CMS image carries a hotspot. Set it on the subject, not the centre of the
  frame. It is what keeps the crop correct when a composition changes shape between breakpoints.
- **Permissions**: a written release for every identifiable person, held before upload, including
  clients photographed at a fitting.

## 7. What the placeholders currently do

Twelve files in `public/placeholders`, re-encoded with a 900px variant each, plus one
art-directed portrait crop for the hero. Six are wired to the home opening, the home fitting, the
collection opening, the made to measure practical block, the appointments aside and the about
workroom; five are the lookbook tiles, which carry a visible placeholder note wherever they appear.

Two files were removed rather than kept. A length of cloth for the homepage band, because that band
is drawn from its weave draft rather than photographed and always will be. And `_new.html`, a
contact sheet that had been committed into `public/`, which means it was being served at
`/placeholders/_new.html` to anyone who guessed the path.

# Document Formats & Specifications

Per-format rules for the document types this skill targets. Use these to choose `@page` geometry, structure, and layout strategy. These are **specifications, not templates** — author the HTML/CSS from these rules.

## Business Card

- **Trim:** 85 × 55 mm (EU/FR standard); 89 × 51 mm (US); 91 × 55 mm (JP). Confirm the region.
- **Orientation:** usually landscape; 4-up or 8-up imposition for press sheets is the printer's job, not WeasyPrint's — emit one card per PDF page and let the printer impose.
- **Safe area:** keep text ≥ 4 mm from the trim edge.
- **Bleed:** 3 mm standard → canvas 91 × 61 mm.
- **Recto/verso:** two `@page` named pages or two PDFs; front and back often share geometry but differ in `background`.
- **Common structure:** name (largest), title, company/logo, contact block (phone, email, web). Logo as SVG (vector). QR code as raster ≥ 200 px for a 20 mm code.
- **Type:** 7–10 pt body; 14–18 pt name. Avoid more than 2 fonts.

```css
@page { size: 91mm 61mm; margin: 0; bleed: 3mm; marks: crop; }
.card { position: absolute; top: 3mm; left: 3mm; width: 85mm; height: 55mm;
        padding: 6mm; display: flex; flex-direction: column; justify-content: space-between; }
```

## Flyer / Handbill

- **Trims:** A6 (105 × 148 mm), A5 (148 × 210 mm), DL (99 × 210 mm). A6 = leaflet; A5 = standard flyer; DL = tall slim flyer (1/3 A4).
- **Orientation:** portrait or landscape — set in `@page`.
- **Single page:** one `@page`, `margin: 0` + full-bleed background, content in a safe-area wrapper.
- **Structure (top→bottom):** hook/headline (large), supporting subhead, hero image, value/offer, details, CTA, footer (contact/logo/QR). Strong visual hierarchy; one focal point.
- **Bleed:** 3 mm; safe text margin 5 mm.
- **Color:** vivid for digital/offset; switch to CMYK + `pdf/x-4` for press.

## Brochure / Dépliant (folded)

Two sub-types. The **flat sheet** is what WeasyPrint prints; folding is physical.

**Tri-fold (A4 → 3 panels):** flat trim 297 × 210 mm (landscape), folded to DL 99 × 210 mm. Six panels (3 front+back). Panel widths are **not equal** when the fold tucks inside: outer panels 99 mm, the panel that folds in ~97 mm. For simplicity use 99/99/99 unless the printer specifies otherwise.

**Bi-fold (A4 → 2 panels):** flat 297 × 210 mm landscape, folded to A5 148 × 210 mm. Four panels.

- **@page:** `size: 297mm 210mm; margin: 0` (landscape). Set up a 3-column or 2-column grid where each column = one panel + gutter.
- **Panel ordering matters** — a tri-fold laid out flat reads in a specific fold sequence (outside: back-panel | front-cover | inside-flap; inside: three continuous panels). Lay panels out in fold order, not reading order.
- **Safe area:** keep text ≥ 5 mm from every fold and trim edge.
- **Bleed:** 3 mm on outer edges only; folds have no bleed.

```css
@page { size: 297mm 210mm; margin: 0; bleed: 3mm; marks: crop; }
.sheet { width: 297mm; height: 210mm; display: grid;
         grid-template-columns: repeat(3, 1fr); gap: 0; }
.panel { padding: 12mm; break-inside: avoid; }
```

> Robustness note: simple fixed-track grids work; avoid `repeat(auto-fit, *)`. If a 3-column flex/grid misbehaves, use absolute positioning or `display: table`.

## Booklet (saddle-stitched)

- **Trim:** A5 (148 × 210 mm) or A4 folded to A5. Multiples of **4 pages** (each sheet = 4 pages: 2 outer + 2 inner).
- **Imposition** (page order for printing) is the printer's job — emit pages in reading order; do not reorder for imposition in WeasyPrint.
- **@page:** facing pages with mirrored margins: `@page :left { margin: 18mm 25mm 20mm 15mm }`, `@page :right { margin: 18mm 15mm 20mm 25mm }`.
- **Running header** (current chapter) + **page numbers** in `@bottom-*` margin boxes (see css-reference.md).
- **TOC** with `target-counter()`; **bookmarks** auto-generated from `<h1>`–`<h6>`.
- **Cover:** `@page cover { margin: 0 }` + `.cover { page: cover }`.

## Card (Invitation, Greeting, Postcard)

- **Trims:** A6 (105 × 148 mm), square (148 × 148 mm or 130 × 130 mm), 120 × 170 mm, postcard A6 / 105 × 148 mm (US 4×6 in = 102 × 152 mm).
- **Single or folded.** Folded: flat = 2× height (e.g. 105 × 296 mm for an A6 portrait fold), `@page` = flat size.
- **Ornate typography** is common — embed display fonts via `@font-face`.
- **Bleed:** 3 mm; safe margin 5 mm.

## Slides / Deck

- **Size:** 16:9 → `size: 1920px 1080px` (or `254mm 142.875mm`); 4:3 → `1024px 768px`. Use `px` for slide decks — it matches screen authoring tools.
- **One slide per page:** force a page break after each slide, last slide excepted.

```css
@page { size: 1920px 1080px; margin: 0; }
.slide {
  width: 1920px; height: 1080px; min-height: 1080px;
  page-break-after: always; break-after: page;
  overflow: hidden;               /* prevent a slide spilling to 2 pages */
  box-sizing: border-box; padding: 64px;
  display: flex; flex-direction: column;
}
.slide:last-child { page-break-after: auto; break-after: auto; }
```

- **Verify page count == slide count** — if not, a slide overflowed 1080 px (long list / oversized image). Tighten content or add `overflow: hidden`.
- **Big type:** titles 60–90 px, body 28–40 px. High contrast for projection.
- **No animations** — PDF is static. Each "build" step becomes its own slide if needed.
- **Background art:** use `background-image` (gradients/`url()`) on `.slide`; remember `box-shadow`/`text-shadow` are unsupported.
- **Speaker handout:** same deck; it already reads well as static pages.

## Invoice / Letter / Report

- **Trim:** A4 (210 × 297 mm) or US Letter (216 × 279 mm = 8.5 × 11 in).
- **@page:** `size: A4; margin: 15mm 18mm 20mm` with `@top-*` for logo/running header and `@bottom-*` for page number + footer (company info, legal).
- **Tables:** `break-inside: avoid` on `tr` and grouped rows; repeat `<thead>` with `thead { display: table-header-group }`. Tables paginate slowly — for very long ledgers consider chunking.
- **Metadata:** `<title>`, `<meta name="author">`, etc. auto-fill PDF fields. For Factur-X e-invoices see cli-api.md.
- **Multi-page running totals:** use `string-set`/counters if you need per-page subtotals.

## General Layout Rules (all formats)

- Author `@page` first (geometry), then a safe-area wrapper, then content.
- Prefer **block / flex** for robust layouts; use grid only for simple fixed tracks.
- Keep critical content in the **safe area** (≥ bleed + a few mm from every trim/fold edge).
- Use **SVG** for logos, icons, line art (crisp at any size). Use raster for photos at the correct DPI.
- Set `lang` on `<html>` for hyphenation and PDF/UA.
- One HTML file, one print CSS via `-s`; keep structure and presentation separate.

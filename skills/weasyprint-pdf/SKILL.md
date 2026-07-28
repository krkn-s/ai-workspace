---
name: weasyprint-pdf
description: Create print-ready PDF documents from HTML and CSS using WeasyPrint — brochures, flyers, cards, invitations, business cards, slides/decks, invoices, tickets, reports, and books. Use when the agent must turn HTML/CSS into a paged PDF, design a single-page or multi-page print layout, set exact page sizes and margins, add page numbers/headers/footers/running titles via @page margin boxes, control page breaks, build a table of contents with target-counter, add PDF bookmarks, embed custom fonts with @font-face, produce print-ready output with bleed and crop marks in CMYK/PDF-X, or generate PDF/A, PDF/UA, and PDF forms. Déclenche aussi en français pour générer un PDF à partir de HTML/CSS, créer une brochure, un flyer, une carte, une carte de visite, un dépliant, un diaporama, une facture, un ticket ; gérer la mise en page imprimable, les marges, numéros de page et en-têtes, les polices personnalisées, le fond perdu et traits de coupe, le CMYK, ou les variantes PDF/A, PDF/UA et formulaires.
---

# WeasyPrint PDF

## Overview

WeasyPrint is a visual rendering engine for HTML and CSS that exports **paginated** PDF. Unlike a browser (one scrolling viewport), WeasyPrint flows content onto fixed-size pages defined by the CSS `@page` rule. This is the core mental model:

- **One `@page` canvas per physical page.** `size`, `margin`, `bleed`, `marks`, and margin boxes are all set on `@page`, not on `body`.
- **The default media type is `print`** (the CLI uses `-m print` by default). Style for `@media print` and `@page`; do not rely on screen-only browser behavior.
- **It is a print engine, not a browser.** There is no JavaScript, no interactivity, no `box-shadow`, no `text-shadow`. See *Unsupported CSS* below before writing CSS.
- **Units are physical.** Use `mm`, `cm`, `pt`, `q` for print. `px` works but maps to 1/96 in. Physical units are exact in the PDF.

This skill is methodology-only: it gives the rules, the exact CSS/CLI/API surface, and the per-format specifications, then lets the agent generate the HTML/CSS. Do not assume bundled templates — author the HTML from scratch using the references.

## Tooling

On macOS, install the full stack (Pango + WeasyPrint) with Homebrew:

```bash
brew install weasyprint          # gives the `weasyprint` CLI + Python lib
weasyprint --info                # verify Pango/Python/versions
```

For Python-API usage inside a project, prefer `uv`:

```bash
uv add weasyprint                # or: uv pip install weasyprint
```

The primary execution path is the **CLI**. Use the Python API only for features the CLI cannot express (PDF/A metadata, Factur-X, custom URL fetchers, programmatic page slicing).

## Core Workflow

1. **Pick the format.** Decide document type, trim size, orientation, and single vs multi-page. Use the *Standard dimensions* table below; load `references/formats.md` for folds and per-type layout rules.
2. **Decide print-readiness.** Screen/digital PDF by default. If the output goes to a commercial printer, switch to print-ready mode (bleed + crop marks + CMYK + PDF/X). See *Print-ready toggle* and `references/print-ready.md`.
3. **Author `@page` first.** Set `size`, `margin` (or `margin: 0` + a safe-area wrapper for full-bleed), and any margin boxes (page numbers, running headers). Named pages (`@page cover`) for page-specific geometry.
4. **Write the HTML/CSS.** Use semantic HTML, author stylesheets, custom properties (`--brand`) for theme values. Avoid unsupported CSS — check *Unsupported CSS* before committing to a technique. Load `references/css-reference.md` for the full supported-property matrix and paged-media primitives (counters, `string-set`, `target-counter`, bookmarks, footnotes, leaders).
5. **Render via CLI.** `weasyprint input.html output.pdf -s print.css`. Verify the result (page count, dimensions, fonts, colors). Iterate.
6. **Iterate fast with watchexec** (install separately): `watchexec -e html,css -- weasyprint input.html output.pdf`.

## Standard Dimensions (trim)

| Document | Trim (mm) | Orientation | Notes |
|---|---|---|---|
| Business card (EU/FR) | 85 × 55 | landscape | US: 89 × 51; JP: 91 × 55 |
| Business card (US) | 89 × 51 | landscape | |
| Flyer / handbill | A6 105 × 148, A5 148 × 210, DL 99 × 210 | portrait or landscape | DL = 1/3 A4 |
| Brochure / dépliant (A4 folded) | 210 × 297 flat | portrait | tri-fold → 3 × 99×210 panels |
| Booklet / A5 brochure | A5 148 × 210 | portrait | saddle-stitched, multiples of 4 |
| Card (invitation, greeting) | A6 105 × 148, square 148 × 148, 120 × 170 | varies | |
| Invoice / letter | A4 210 × 297, US Letter 216 × 279 | portrait | |
| Slide (16:9) | 254 × 142.875 (= 1920×1080 @ 192dpi) | landscape | or `size: 1920px 1080px` |
| Slide (4:3) | 254 × 190.5 (= 1024×768) | landscape | |
| Poster | A3 297 × 420, A2 420 × 594 | portrait or landscape | |

For every print job, the **physical canvas** is `trim + 2 × bleed` (see *Print-ready toggle*). Full per-format guidance (folds, safe margins, panel ordering, common structures) lives in `references/formats.md`.

## Print-Ready Toggle

Two modes. Default to **digital**; switch to **print-ready** only when the PDF goes to a commercial printer.

**Digital (default).** Screen colors (`rgb`/`hex`/`hsl`), web units, no bleed, no marks. Simpler and lighter.

**Print-ready.** Activated when the user names a printer, asks for "print-ready / prêt à imprimer / fond perdu / traits de coupe", or targets a format meant for offset/digital press. It changes four things — load `references/print-ready.md` for the exact technique:

1. **Bleed** — set `@page { size: <trim+2×bleed>mm; margin: 0; marks: crop cross }` (bleed = 3 mm standard, 5 mm large-format). Push full-bleed artwork with negative positioning; pin text inside the trim/safe area.
2. **Color** — use `device-cmyk()` for spot/process color and an `@color-profile` + `--output-intent` for an ICC profile. Target PDF/X (`--pdf-variant pdf/x-4`) for graphics exchange.
3. **Image resolution** — export rasters at `(trim_mm + 2×bleed) / 25.4 × DPI` (300 DPI offset, 400+ large-format). Use `image-rendering: crisp-edges` (mandatory for PDF/A).
4. **Marks** — `marks: crop cross` emits trim + registration marks in the bleed zone.

Always state which mode you are using when you deliver, and give the trim + bleed dimensions explicitly.

## Brand & Custom Fonts

Pull brand values from the project's `BRAND.md` if present (colors, typefaces, voice) and reuse them as CSS custom properties so the document stays on-brand:

```css
:root {
  --brand-primary: #b8341f;   /* from BRAND.md */
  --brand-font: "Brand Sans";
}
body { color: var(--brand-primary); font-family: var(--brand-font); }
```

Embed custom fonts with `@font-face`. **Any `@font-face` rule requires a `FontConfiguration`** passed to both the `CSS` and `write_pdf` call — otherwise the font is silently ignored:

```python
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

font_config = FontConfiguration()
css = CSS(string='''
  @font-face {
    font-family: "Brand Sans";
    src: url(fonts/brand-sans-regular.woff2);
  }
  body { font-family: "Brand Sans" }
''', font_config=font_config)
HTML(filename="doc.html").write_pdf("doc.pdf", stylesheets=[css], font_config=font_config)
```

CLI users cannot use `@font-face` with a separate stylesheet cleanly for runtime font registration — prefer embedding `@font-face` in the HTML `<style>` (where WeasyPrint picks it up) or, better, install the font system-side and reference it by family name (WeasyPrint uses Fontconfig; verify with `fc-list | rg Brand` and `fc-match "Brand Sans"`). WeasyPrint subsets embedded fonts automatically (hb-subset when available).

## Unsupported CSS — Avoid Before Writing

WeasyPrint is not a browser. These common properties are **not** supported and will silently no-op (with a logged warning):

- **`box-shadow`** — not released. Fake depth with borders, layered background gradients, or an absolutely-positioned semi-transparent duplicate rectangle behind the element.
- **`text-shadow`** — not supported. Use `text-decoration`, color, or background instead.
- **3D transforms** (`rotateX/Y/Z`, `perspective`, `matrix3d`, `translateZ`, `scaleZ`), `transform-style`, `backface-visibility`. Only 2D transforms work.
- **`:hover`, `:active`, `:focus`, `:target`, `:visited`** — accepted but never match (PDF is static).
- **`unset`** keyword — use `initial`/`inherit`.
- **`color-mix()`, `contrast-color()`** — not supported.
- **`grid` quirks** — `inline-grid`, `repeat(auto-fill/auto-fit)`, subgrids, `grid-auto-flow: column`, baseline alignment, and grid items with intrinsic size (images) are unsupported or untested. Prefer flexbox or block layout for robustness; use grid only for simple fixed-track cases.
- **`flexbox`** — works for simple cases but is "not deeply tested". Avoid edge cases.
- **Multi-column** — no constrained-height columns, no spanning, limited column breaking. Prefer pagination.
- **`break-*` on columns/regions** — only page breaks are supported.
- **`writing-mode`, RTL/bidi** — logical properties map block/inline to vertical/horizontal only; no vertical text.
- **`table: visibility: collapse`, min/max width/height on table boxes, min/max on page-margin boxes.**

When in doubt about a property, load `references/css-reference.md` for the authoritative supported/unsupported matrix before designing around it.

## Key Supported Features (use these freely)

`@page` with `:left/:right/:first/:blank/:nth()` and named pages; page margin boxes (`@top-center`, `@bottom-right`, …); page counters and `counter()`/`counters()`; `string-set` + `string()` running headers; `target-counter()`/`target-text()` for tables of contents; `leader()`; `bookmark-level`/`bookmark-label`/`bookmark-state`; `float: footnote` with `::footnote-marker`/`::footnote-call`; CSS `var()` custom properties; `calc()`; all physical + font/viewport/page-relative units; 2D transforms; multi-backgrounds, `border-radius`, `border-image`; `linear/radial/repeating-radial-gradient()`; flexbox + grid (simple cases); `hyphens: auto` (needs `lang` attribute); `@font-face`; PDF hyperlinks, attachments, bookmarks, forms, metadata.

## Reference Loading

Load only what the current step needs. Do not paste large reference sections into the answer — apply them.

- `references/css-reference.md` — load when writing CSS, especially `@page`, page breaks, page numbers, running headers, tables of contents, bookmarks, footnotes, or to confirm whether a specific CSS feature is supported.
- `references/cli-api.md` — load when using CLI flags or the Python API (`HTML`/`CSS`/`write_pdf` signatures, PDF variants, attachments, forms, metadata, URL fetchers, image optimization, caching).
- `references/print-ready.md` — load when the output is for a commercial printer (bleed, crop/registration marks, CMYK, `device-cmyk`, ICC profiles, PDF/X, image DPI math).
- `references/formats.md` — load when designing a specific document type and needing exact dimensions, folds, panel ordering, safe margins, and structure rules (brochure, flyer, card, business card, slides, booklet, invoice).
- `references/troubleshooting.md` — load when something renders wrong (missing shadows/fonts/images, wrong colors, huge files, slow renders, empty glyphs) or when rendering untrusted HTML/CSS (security limits).

## Output Rules

- Lead with `@page` (size, margins, margin boxes, named pages) before any content CSS. Page geometry is the skeleton.
- Use physical units (`mm`/`pt`) for print; reserve `px` for slides and screen mockups.
- Keep one concern per file: HTML for structure, CSS for presentation; pass extra CSS via `-s`.
- Always verify after rendering: open the PDF or rasterize a page (`pdftoppm -png -r 72 -f 1 -l 1 out.pdf /tmp/p`) to confirm page count, dimensions, fonts, and color.
- For repeated runs, cache images (`-c /tmp/wpcache`) to avoid re-fetching/re-optimizing.
- State the mode (digital vs print-ready), trim size, and bleed when you deliver the file.
- For current WeasyPrint behavior or version-specific changes, verify against the official docs (`doc.courtbouillon.org/weasyprint`) or the changelog before asserting specifics.

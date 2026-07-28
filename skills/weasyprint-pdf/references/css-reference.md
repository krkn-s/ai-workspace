# CSS & Paged-Media Reference

Authoritative CSS surface for WeasyPrint. Use this to (a) write correct paged-media CSS and (b) confirm whether a feature is supported before designing around it. Generated from WeasyPrint's `docs/api_reference.rst` and source.

## The `@page` Rule (the skeleton)

Page geometry lives here, not on `body`.

```css
@page {
  size: A4;                 /* named | <w> <h> | landscape | portrait */
  margin: 15mm 20mm;        /* content area = size − margin */
  bleed: 3mm;               /* extends canvas beyond trim (print-ready) */
  marks: crop cross;        /* trim + registration marks in bleed zone */
  counter-reset: page;      /* reset page counter (see below) */
  background: white;        /* page background */
}
```

**`size`** accepts named sizes (`A0`–`A6`, `B5`, `Letter`, `Legal`, `Ledger`, …), explicit `<length> <length>`, and `landscape`/`portrait` (alone or after a named size, e.g. `size: A4 landscape`). Custom sizes: `size: 85mm 55mm`.

**`marks`** values: `crop` (trim marks), `cross` (registration marks), `none`. Requires a non-zero `bleed` to be meaningful.

**Page selectors:**
- `:left`, `:right` — facing pages (use for asymmetric margins / mirrored gutters).
- `:first` — first page only.
- `:blank` — intentionally blank pages.
- `:nth(n)`, `:nth(2n+1)` — by position.
- Named pages: `@page cover { … }` then `.cover { page: cover }` to apply a page geometry to a specific section.

```css
@page { margin: 20mm; }
@page :left  { margin-left: 30mm; margin-right: 15mm; }
@page :right { margin-left: 15mm; margin-right: 30mm; }
@page cover  { margin: 0; }
.cover { page: cover; }
```

## Page Margin Boxes (headers, footers, page numbers)

Sixteen margin boxes positioned in the page margin: `@top-left-corner`, `@top-left`, `@top-center`, `@top-right`, `@top-right-corner`, and the same for `@bottom-*`, `@left-*`, `@right-*`. They hold generated content via `content:`.

```css
@page {
  @top-center   { content: string(chapter); }      /* running header */
  @bottom-right { content: counter(page); }        /* page number */
  @bottom-left  { content: counter(pages) " pages"; } /* total pages */
}
```

- `counter(page)` — current page number. `counter(pages)` — total page count.
- `@page :first { @top-center { content: none } }` — suppress on the cover.
- Margin boxes can take `border`, `background`, `padding`, `width`, alignment.

## Running Headers & Footers (`string-set` / `string()`)

Capture the last occurrence of an element on each page and echo it in a margin box — classic "current chapter title at the top".

```css
h2 { string-set: chapter content(); }
@top-center { content: string(chapter); }
```

`string()` can combine static text, counters, and element content/attributes:

```css
h1 { string-set: doctitle "— " content(text); }
```

## Counters (headings, figures, lists)

```css
body { counter-reset: h2; }
h2 { counter-reset: h3; }
h2::before { content: counter(h2) ". "; counter-increment: h2; }
h3::before { content: counter(h2) "." counter(h3) " "; counter-increment: h3; }
```

`counter()` and nested `counters(name, ".")` both work. `counter-reset` / `counter-increment` apply on `@page` too.

## Tables of Contents (`target-counter`, `target-text`, `leader`)

Build a clickable TOC where each entry shows the destination's page number. The TOC links use `attr(href)`:

```css
nav.toc a::after {
  content: leader('.') target-counter(attr(href), page);
}
```

- `target-counter(url, counter-name)` — page number of the target.
- `target-text(url)` — text of the target element.
- `leader(dotted)` / `leader(solid)` / `leader('…')` — fills space between entry and page number.

```html
<nav class="toc">
  <a href="#ch1">Chapter 1 — Intro</a>
  <a href="#ch2">Chapter 2 — Setup</a>
</nav>
…
<h2 id="ch1">Intro</h2>
```

## PDF Bookmarks (outline sidebar)

By default `<h1>`–`<h6>` auto-generate bookmarks. Control them:

```css
h1 { bookmark-level: none; }          /* drop from outline */
h2 { bookmark-level: 2; bookmark-label: content(text); }
.expanded { bookmark-state: open; }   /* open | closed */
```

`bookmark-label` can take `content()`, `attr()`, or a static string.

## Footnotes

```css
.fn { float: footnote; }
::footnote-marker { content: counter(footnote) "."; }
::footnote-call   { content: counter(footnote); vertical-align: super; font-size: .7em; }
```

`footnote-display: block | inline` (not `compact`); `footnote-policy: line | auto`.

## Page Break Control

```css
h1, h2 { break-before: page; }          /* force new page before headings */
table, figure { break-inside: avoid; }  /* keep together */
tr { break-inside: avoid; }
p { orphans: 3; widows: 3; }            /* min lines at bottom/top of page */
h2 { break-after: avoid; }              /* keep heading with next block */
.margin-box { margin-break: discard; }  /* discard top margin after a break */
```

Aliases `page-break-before/after/inside` work too. **Only page breaks** are supported — `break-*` on columns/regions is not.

`box-decoration-break: clone | slice` is supported (backgrounds always repeat, not extend).

## Generated Content

`content` accepts strings, `counter()`, `attr()`, `url()`, `string()`, `target-*()`, `leader()`. Use `::before` / `::after`. On non-replaced elements `content` replaces normal flow only with `content: …` on the element itself (rare).

## Units

Supported: `em ex ch cap ic lh` (font), `vw vh vi vb vmin vmax pvw pvh…` (viewport / page), `cm mm q in pt pc px` (absolute), `rad grad turn deg` (angles), `dpi dpcm dppx x` (resolution).

**Page-relative units** (`pvw`, `pvh`, …) are relative to the *whole page* (including margins); all other units are relative to the *page area* (excluding margins). `calc()` works everywhere.

## Selectors

Selectors L3 fully supported; L4 except `:dir`, input pseudo-classes (`:valid`, `:invalid`, …), and column selectors (`||`, `:nth-col`). `:hover/:active/:focus/:target/:visited` are valid but never match.

## Properties at a Glance

**Supported.** CSS 2.1 (near-complete for print), `transform`/`transform-origin` (2D only), `transform-origin`, all backgrounds/borders (`background-*`, `border-radius`, `border-image-*`), gradients (`linear`, `radial`, `repeating-radial`), `object-fit`/`object-position`, `box-sizing`, `overflow` (not `-x/-y`), `text-overflow`, `line-clamp`, `max-lines`, `continue`, `text-decoration-*` (not `text-shadow`, `text-underline-position`, `text-emphasis-*`), `outline-*` + `outline-offset`, `appearance` (auto = PDF form), `hyphens`/`hyphenate-*`, `column-*` (simple multicol), flexbox (simple), grid (simple — see below), logical properties (`*-block-*`, `*-inline-*`, `*-start`, `*-end`), `font-*` incl. `font-feature-settings`, `font-variation-settings`, `@font-face`, `color` (all L4 notations: `#rgba`, `rgb()`, `hsl()`, `hwb()`, `lab()`, `color()`, `light-dark()`, `device-cmyk()`), `opacity`, `z-index`, CSS variables (`var()`), `attr()` in `content`/`string-set`.

**Not supported.** `box-shadow`, `text-shadow`, `color-mix()`, `contrast-color()`, `unset` (use `initial`/`inherit`), `image()` notation for backgrounds, `image-resolution` `from-image`/`snap`, 3D transforms + `perspective`/`backface-visibility`, `resize`/`cursor`/`caret-*`/`nav-*`/`accent-color`, `writing-mode` + bidi/RTL, `table: visibility: collapse`, min/max width/height on table boxes and on page-margin boxes, `line-break`, `hanging-punctuation`, multi-column spanning/constrained-height, `break-*` on columns/regions.

## Flexbox & Grid — Use Cautiously

**Flexbox** works for simple cases, "not deeply tested". All `flex-*`, `align-*`, `justify-*`, `order`, `flex`/`flex-flow` shorthands work. Avoid relying on edge behavior.

**Grid** supports `display: grid` with `grid-template-*`, `grid-auto-*`, `fr` units, line names, grid areas, `repeat(X, *)`, `minmax()`, `gap`, dense auto flow, `z-index`, fragmentation between rows. **Unsupported/untested:** `inline-grid`, `display: grid` auto content sizing, `grid-auto-flow: column`, subgrids, `repeat(auto-fill/auto-fit, *)`, auto margins on items, `span` with line names or flexible tracks, `safe`/`unsafe` alignment, baseline alignment, intrinsic-size items (images), `min/max-width/height` on items, complex min/max-content, absolutely-positioned/floating items, fragmentation within rows. Prefer flexbox or block layout when robustness matters.

## Tables

Slower than block layout, especially when paginated across pages. For multi-page data, consider whether a block/grid layout is faster. `break-inside: avoid` on `tr` keeps rows intact. `border-collapse: collapse` and `separate` both work.

## Image & Object

`<img>`, `<embed>`, `<object>` accept raster formats (PNG, JPEG, GIF, …) via Pillow and **SVG rendered as vectors** (not rasterized — stays crisp). `object-fit`, `object-position`, `image-rendering` (`crisp-edges` mandatory for PDF/A), `image-orientation` supported. Missing images log a warning and render nothing — check logs.

## A Complete `@page` Example (multi-page book)

```css
@page {
  size: A5;
  margin: 18mm 15mm 20mm;
  @top-center { content: string(chapter); font: 9pt sans-serif; color: #666; }
  @bottom-center { content: counter(page); font: 9pt sans-serif; }
}
@page :first { @top-center { content: none } }
@page cover { margin: 0; @top-center { content: none } @bottom-center { content: none } }

.cover { page: cover; }
h1 { string-set: chapter content(text); break-before: page; }
h1:first-of-type { break-before: avoid; }
table, figure { break-inside: avoid; }
```

# html2realpdf 0.1.13 Reference

Pinned to **@imggion/html2realpdf@0.1.13**. CDN base: `https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/`. ESM entry: `dist/index.js`. WASM: `dist/libhtml2realpdf.wasm` (auto-resolved from the module URL). Package is `"type": "module"` (ESM only). Source: `src/`, docs: `docs/css-support.md`.

## What it is

Generates a **real PDF** in the browser: text stays selectable/searchable, fonts are embedded subsets, supported graphics are vectors, links become PDF annotations. Written in Zig, compiled to WebAssembly. Unlike `html2pdf.js`/html2canvas, it never turns the page into a screenshot.

## Import (single file, from CDN)

```js
import { renderPdf, createRenderer } from "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/index.js";
```

Because the module loads from jsDelivr, its `import.meta.url` is the jsDelivr URL, so the Worker and the `.wasm` **resolve automatically to the same pinned CDN paths**. No extra config needed for the common case.

## Quick usage (deck export)

```js
const pdf = await renderPdf(exportContainer, {
  page: { format: [297, 167.0625], unit: "mm", margin: 0 },
  cssProfile: "web",
  mediaType: "print",
  layoutContext: "page",
  pageBreak: { after: ".slide" },
  metadata: { title: "Deck" },
});
pdf.download("deck.pdf");
if (pdf.diagnostics?.length) console.table(pdf.diagnostics);
pdf.dispose();
```

`renderPdf(source, options)` uses a lazily-created default **Worker** renderer cached for the page lifetime. For custom fonts, explicit disposal, or main-thread execution, use `createRenderer` instead.

## `createRenderer(init)` — reusable renderer

```js
const renderer = await createRenderer({
  execution: "worker",        // default; "main" runs WASM on the UI thread
  wasmUrl: "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/libhtml2realpdf.wasm",
  fonts: [{ family: "Inter", data: await (await fetch("/fonts/Inter-Regular.ttf")).arrayBuffer(), weight: 400 }],
});
const pdf = await renderer.render(element, { /* RenderOptions */ });
pdf.download("deck.pdf");
pdf.dispose();
renderer.dispose();
```

### Renderer-lifetime options (`RendererInit`)

| Option | Values / default | Use |
|---|---|---|
| `execution` | `"worker"` (default) / `"main"` | Keep WASM off the UI thread; fall back to `"main"` if cross-origin module Workers are blocked. |
| `wasmUrl` | `string \| URL`; package-relative by default | Override only when the default resolution fails. |
| `fonts` | `FontRegistration[]`; none by default | Register reusable TrueType faces once per renderer. |

Font registration: `{ family, data: ArrayBuffer|Uint8Array, weight?: number|"normal"|"bold" (400), style?: "normal"|"italic" }`.

## Per-render options (`RenderOptions`)

| Option | Default | Use |
|---|---|---|
| `page` | captured `@page`, else A4 portrait, 0 margin | Explicit page geometry (see below). |
| `cssProfile` | `"document"` | **`"web"` for slides** (flex/grid/transforms/shadows/position/float). `"document"` rejects non-static layout; `"strict"` = web + errors on unsupported CSS. |
| `strict` | `false` | Promote unsupported CSS to errors without selecting `web`. |
| `mediaType` | `"screen"` | `"print"` selects the print media environment for computed styles/queries. |
| `layoutContext` | `"source"` | `"page"` reflows the root to the PDF content box (use for the deck export). |
| `viewport` | source env | `{ width, height }` for deterministic responsive layout. |
| `unsupportedCss` | `"warn"` (`"error"` in strict) | `"warn"`/`"error"`/`"ignore"`. |
| `fallback` | `"error"` | `"rasterize-subtree"` opt-in scoped rasterization for unsupported SVG. |
| `canvasToSvg` | none | Adapter converting live `<canvas>` charts to SVG. |
| `canvasFallback` | `"error"` | `"rasterize"` for a `null` `canvasToSvg`. |
| `includeShadowDom` | `false` | Flatten open Shadow DOM into the snapshot. |
| `baseUrl` | source document URL | Resolve relative image/stylesheet URLs. |
| `resourcePolicy` | `"error"` | `"omit"` drops failed resources with diagnostics. |
| `resourceResolver` | none | Supply protected/virtual images and stylesheets. |
| `pageBreak` | none | Selector-driven pagination (see below). |
| `metadata` | none | `{ title, author, subject, keywords, creator }` into PDF info dict. |
| `enableLinks` | `true` | Preserve link annotations; `false` removes all. |
| `signal` | none | `AbortSignal`; cancel at snapshot/render boundaries. |
| `onProgress` | none | `{ phase: "snapshot"|"wasm"|"complete", completed, total }`. |

### Page geometry (`page`)

| Page option | Values / default |
|---|---|
| `format` | `"a4"` (default) / `"letter"` / custom `[width, height]` |
| `orientation` | `"portrait"` (default) / `"landscape"` |
| `unit` | `"pt"` (default) / `"px"` / `"mm"` / `"cm"` / `"in"` |
| `margin` | one number · `[vertical, horizontal]` · `[top, left, bottom, right]` · **0 by default** |

Named formats keep physical size regardless of `unit`; custom dims + margins use the selected unit. For the deck export use `format: [297, 167.0625], unit: "mm", margin: 0` (16:9, A4-wide, full-bleed slides).

> Four-value margins are `[top, left, bottom, right]` (html2pdf.js compat order), **not** CSS shorthand order.

### Page breaks (`pageBreak`)

```js
pageBreak: {
  before: "section.cover",          // selector string or array
  after:  ".slide",                 // forces one page per matching element
  avoid:  ["figure", "table"],
  avoidAll: false,                  // break-inside: avoid on everything
  legacy: false,                    // honor .html2pdf__page-break
}
```
Injected as `break-before:page!important` / `break-after:page!important` / `break-inside:avoid!important`. Authored inline `!important` break declarations still win.

## CSS profiles — when to use which

- **`document`** (default): for invoices/reports/letters; rejects positioned/floated/transformed layout so layout never silently mis-paints.
- **`web`** (staged 0.2+): enables normal-flow, flex, grid, float, positioning (`relative`/`absolute`/`fixed`/`sticky`), 2D transforms, multiple backgrounds + gradients, `box-shadow`/`text-shadow`, isolated opacity, SVG vectors. **Use this for slides.**
- **`strict`**: `web` engine + unsupported CSS becomes an immediate error.

Full per-property matrix in `docs/css-support.md` (the repo). Highlights: full flexbox + grid, `aspect-ratio`, `object-fit`, multi-background + gradients, `border-radius`, break `page`/`avoid`/`left`/`right`/`recto`/`verso`, named/pseudo `@page` + margin boxes + `counter(page)`/`counter(pages)`, `position` (incl. fixed repeating headers/footers), `z-index`, `opacity`, 2D `transform`, `var()`, `::before`/`::after` + `counter()`.

## Output methods (PdfDocument)

| Method | Use |
|---|---|
| `pdf.download(filename)` | Trigger a browser download. |
| `pdf.toBlob()` / `toArrayBuffer()` / `toUint8Array()` | Application-owned bytes. |
| `pdf.createObjectURL()` (+ `revokeObjectURL`) | Manual URL management. |
| `pdf.preview(target, opts)` | Render the real PDF in-page (Shadow DOM + canvas pages). |
| `pdf.diagnostics` | Array of `{ code, severity, message }`. |
| `pdf.dispose()` | Free WASM resources (always call). |

Preview options: `showToolbar`, `padding` (28, 16 narrow), `initialScale` (`"fit-width"` or number), `minScale` (0.25), `maxScale` (3), `zoomStep` (0.25), `maxPixelRatio` (2), `ariaLabel`. Dispose previews before their document.

## Fonts in the PDF

Without registration, html2realpdf embeds four **Noto Sans Latin** faces plus built-in Arabic/Hebrew fallbacks. To use your deck's fonts (Inter, JetBrains Mono, …), register TrueType faces via `createRenderer({ fonts: […] })` — fetch each `.ttf` as an `ArrayBuffer`. The default `renderPdf` cannot register fonts; switch to `createRenderer` when the PDF must match the live typography.

**Format constraint (important):** html2realpdf only accepts **raw TrueType/OpenType bytes (`.ttf`/`.otf`)**. `woff2`/`woff` — what Google Fonts and Fontshare CSS serve — will **not** embed (the WASM parses TrueType tables directly); the PDF silently falls back to Noto Sans. Use a `.ttf` CDN source. The most reliable is **`@expo-google-fonts/<name>` on jsDelivr** (versioned, CORS, real `.ttf`): `https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_400Regular.ttf`. Google Fonts gstatic `.ttf` is also fetchable (`font/ttf`, CORS `*`) but its URLs are opaque and change on every font update.

**Glyph constraint:** if a glyph used in the deck is absent from every registered font and every built-in fallback, the render throws a hard `WasmRenderError: MissingGlyph` and aborts. **Emoji are the usual culprit** (not in Inter/Noto Sans) — avoid them in slides meant for export, or register an emoji face. Common arrows (→ ← ↓ ↑, U+2190–2193) and punctuation (·) are present in Noto Sans and are safe.

## Links

PDF link annotations keep absolute `http`/`https`/`mailto`/`tel`/`ftp`. Relative links resolve against `baseUrl`. `javascript:`/`data:`/`file:` are removed. Set `enableLinks: false` to strip all links.

## Resources (images, stylesheets)

For a DOM-element source, images/CDN stylesheets are snapshotted from the live page (subject to CORS). For an HTML-string source, stylesheets are **inert** unless a `resourceResolver` supplies them — prefer passing a live DOM element for the deck export. Use `baseUrl` for relative URLs, `resourcePolicy: "omit"` to drop failed resources instead of erroring.

## Worker vs main-thread, and CDN robustness

- **Use `execution: "main"` for standalone decks** (the skill default). It fetches the `.wasm` directly (jsDelivr serves `application/wasm` + CORS `*`, so `instantiateStreaming` works) and runs WASM on the UI thread — no Worker construction, which sidesteps cross-origin-Worker restrictions when the file is opened via `file://`. The render blocks ~1–2s; fine for a one-click export.
- **`execution: "worker"`** (the library default) is non-blocking and fine when the deck is served over `https://`, but cross-origin module Workers (loaded from jsDelivr) can be blocked from a `file://` page. Prefer `main` for portable single files.
- If WASM fails to load, set an explicit pinned `wasmUrl` via `createRenderer`.

## Diagnostics

Inspect `pdf.diagnostics` (a table via `console.table`). Codes cover unsupported CSS, raster fallbacks, and resource failures. Use `unsupportedCss: "error"` or `cssProfile: "strict"` to make unsupported CSS fail loudly during development.

## html2pdf.js compatibility (default export)

```js
import html2pdf from "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/index.js";
await html2pdf().set({ filename: "deck.pdf", margin: 0, jsPDF: { format: "a4", orientation: "landscape" } })
  .from(document.querySelector("#deck-export")).save();
```
Only PDF-oriented stages are supported; `toCanvas`/`toImg`/`html2canvas`/`image` options throw `UnsupportedCompatibilityFeatureError`. Prefer the modern `renderPdf`/`createRenderer` API for new code.

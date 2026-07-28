# Deck → PDF Export (in depth)

The complete strategy for turning a reveal.js deck into a clean, one-slide-per-page vector PDF via html2realpdf. The minimal version lives in SKILL.md; this covers the why, edge cases, an enhanced variant, and troubleshooting.

## Why a stacked export container (not the live `.reveal`)

reveal.js renders one slide at a time and applies 3D transforms (`.present`, `.future`, scaling) to position slides. If you pass `.reveal` to html2realpdf, the snapshot captures those transforms and the single visible slide — you'd get one transformed page, not the whole deck.

So the export:
1. Reads every slide via `Reveal.getSlides()` (returns all `<section>` elements, including vertical/nested slides).
2. Clones each slide's **innerHTML** into a fresh `<div class="slide">` inside a `#deck-export` container positioned at `left:0; top:0` (hidden behind the deck via `z-index:-1`).
3. Strips speaker notes and reveal-only helpers.
4. Renders the container with html2realpdf at 16:9 with `cssProfile: "web"` and `pageBreak: { after: ".slide" }`.
5. Removes the container.

html2realpdf does its **own** snapshot + layout (cssProfile `web`), so the export container just needs clean HTML + a self-contained stylesheet mirroring the theme.

## The export stylesheet

The export slides live under `#deck-export`, **not** under `.reveal`, so reveal's slide rules don't reach them. Mirror the theme using the same `--r-*` variables (they're declared on `:root`, so they're global):

```css
#deck-export { position: absolute; left: 0; top: 0; width: 297mm; z-index: -1; } /* on-page; z-index hides it */
#deck-export .slide {
  width: 297mm; height: 167.0625mm; box-sizing: border-box;
  padding: 14mm 18mm;
  display: flex; flex-direction: column; justify-content: center; /* vertical centering like reveal */
  background: var(--r-background-color); color: var(--r-main-color);
  font-family: var(--r-main-font); font-size: var(--r-main-font-size);
  break-after: page; page-break-after: always;
}
#deck-export h1, #deck-export h2, #deck-export h3, #deck-export h4 {
  color: var(--r-heading-color); font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight, 700);
  line-height: var(--r-heading-line-height, 1.1);
  letter-spacing: var(--r-heading-letter-spacing, normal);
  text-transform: var(--r-heading-text-transform, none);
  margin: 0 0 var(--r-block-margin, 24px);
}
#deck-export a { color: var(--r-link-color); }
#deck-export pre, #deck-export code { font-family: var(--r-code-font); }
#deck-export pre { overflow: hidden; background: rgba(255,255,255,.06); padding: 1em; border-radius: 6px; }
#deck-export ul, #deck-export ol { margin: 0 0 var(--r-block-margin, 24px); }
#deck-export img { max-width: 100%; height: auto; }
```

Key points:
- **`width: 297mm`** on both the container and each `.slide` + `layoutContext: "page"` reflows content to the PDF content box (297mm). Each `.slide` is exactly one 16:9 page.
- **`height: 167.0625mm`** makes the slide's background fill the whole page (297 × 9/16 = 167.0625). Use `min-height` instead if you want short slides to still start a new page after.
- **On-page, non-fixed position is mandatory.** html2realpdf renders content at the element's **real position**, so off-screen (`left:-9999px`) → off-page → blank PDF. Use `position: absolute; left: 0; top: 0; z-index: -1` (the deck covers it). Do **not** use `position: fixed` — html2realpdf treats fixed elements as page fixtures and collapses the whole deck onto a single page. Do **not** use `display: none` — it breaks the snapshot.
- **Re-declare theme colors inline.** html2realpdf resolves `var()` only from the document's **inline** `<style>`, not from an external theme `<link>` like `black.css`. Re-declare `--r-background-color`, `--r-main-color`, `--r-heading-color` (and any color `#deck-export` uses) in the inline `:root`, or the PDF paints white pages with invisible text.
- **`break-after: page`** is belt-and-suspenders alongside the `pageBreak.after: ".slide"` option.

## Stripping reveal-only content

```js
page.querySelectorAll(".notes, .speaker-notes, .progress, .controls").forEach((n) => n.remove());
```
Speaker notes (`<aside class="notes">`) must be removed or they appear as text on the slide PDF.

## Backgrounds, fragments, auto-animate

- **`data-background-*`** (color/image/video) are **not** in `<section>` — they aren't cloned. Options:
  - Set the background on the export `.slide` via an extra class: add `data-export-bg` or a class to the `<section>`, then `#deck-export .slide.has-bg { background: … }`.
  - Or add a full-bleed child (`<div class="bg">`) inside the section so it travels with the clone.
- **Fragments** render **fully visible** (no animation steps in a static PDF). That's usually what you want in a handout.
- **Auto-animate** is irrelevant to the PDF (it's a live transition); the start and end slides each export as their own page.

## Custom fonts in the PDF (match the live deck)

The default `renderPdf` embeds Noto Sans only. To match the deck's fonts, switch to `createRenderer` and register **raw `.ttf`** faces — `woff2`/`woff` will not embed. For a standalone file, fetch the `.ttf` from a CORS CDN and use the **same URL in `@font-face` and `DECK_FONTS`** so live and PDF match:

```js
const DECK_FONTS = [
  { family: "Inter", url: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_400Regular.ttf", weight: 400 },
  { family: "Inter", url: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_700Bold.ttf", weight: 700 },
];

const renderer = await createRenderer({
  execution: "main",                       // robust for file:// (no cross-origin Worker)
  wasmUrl: "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/libhtml2realpdf.wasm",
  fonts: await Promise.all(DECK_FONTS.map(async (f) => ({
    family: f.family, weight: f.weight ?? 400, style: f.style ?? "normal",
    data: await (await fetch(f.url)).arrayBuffer(),
  }))),
});
```

`@expo-google-fonts/<name>` on jsDelivr is the most reliable `.ttf` source (versioned, CORS). Google Fonts gstatic `.ttf` works too but its URLs are opaque and change per update. On any per-font fetch failure, that face falls back to Noto Sans — the PDF is never broken.

## Enhanced export (fonts + progress + main-thread fallback)

```js
import { createRenderer } from "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/index.js";

const PDF_PAGE = { format: [297, 167.0625], unit: "mm", margin: 0 };

async function exportDeckToPdf() {
  const btn = document.getElementById("export-pdf");
  btn.disabled = true; btn.textContent = "Rendering…";

  const root = document.createElement("div");
  root.id = "deck-export";
  for (const slide of Reveal.getSlides()) {
    const page = document.createElement("div");
    page.className = "slide";
    page.innerHTML = slide.innerHTML;
    page.querySelectorAll(".notes, .speaker-notes, .progress, .controls").forEach((n) => n.remove());
    root.appendChild(page);
  }
  document.body.appendChild(root);

  const renderer = await createRenderer({
    execution: "main",                       // robust for file:// (no cross-origin Worker)
    fonts: window.__DECK_FONTS ?? [],           // pre-fetched FontRegistration[]
  });

  try {
    const pdf = await renderer.render(root, {
      page: PDF_PAGE,
      cssProfile: "web",
      mediaType: "print",
      layoutContext: "page",
      pageBreak: { after: ".slide" },
      metadata: { title: document.title, creator: "reveal-slides skill" },
      onProgress: (p) => console.log(`export ${p.phase}`),
    });
    pdf.download(`${document.title || "deck"}.pdf`);
    if (pdf.diagnostics?.length) console.table(pdf.diagnostics);
    pdf.dispose();
  } catch (err) {
    console.error("PDF export failed:", err);
    alert("PDF export failed. See console. If this is a Worker/CORS issue, retry with execution:'main'.");
  } finally {
    renderer.dispose();
    root.remove();
    btn.disabled = false; btn.textContent = "Export PDF";
  }
}
```

## Reading diagnostics

`pdf.diagnostics` is an array of `{ code, severity, message }`. Common codes during deck export:
- Unsupported CSS (flex/grid edge cases, 3D transforms) — usually harmless with `web` profile; resolve with `unsupportedCss: "ignore"` to silence.
- Resource fetch failure (CORS-blocked image/font) — set `resourcePolicy: "omit"` or `baseUrl`, or register fonts.
- SVG fallback triggered — opt into `fallback: "rasterize-subtree"` only for that subtree.

During development, use `unsupportedCss: "error"` (or `cssProfile: "strict"`) to surface real layout problems.

## Troubleshooting the export

| Symptom | Cause / fix |
|---|---|
| Only one slide / wrong transforms | You passed `.reveal` or a live slide. Pass the `#deck-export` container. |
| PDF text is wrong font (Noto Sans) | Fonts not registered, or registered as `woff2` (html2realpdf needs raw `.ttf`). Use `createRenderer({ fonts })` with `@expo-google-fonts` `.ttf`; use the same URL in `@font-face` and `DECK_FONTS`. |
| `WasmRenderError: MissingGlyph` / export aborts | A glyph isn't in any registered or built-in font — usually **emoji**. Remove emoji (use text/SVG icons), or register an emoji face. Arrows → ← ↓ ↑ and · are safe. |
| "Could not load WASM: HTTP …" | Wrong/unreachable `wasmUrl`, or offline. Confirm the CDN URL and network. |
| Worker init failed (-20) | Cross-origin module Worker blocked. Use `execution: "main"`. |
| Slides overlap / wrong page count | Missing `pageBreak: { after: ".slide" }` or `break-after: page`. Verify `.slide` has a definite `width: 297mm`. |
| Empty pages / content missing | (a) `display: none` on the export container; (b) positioned off-screen (`left:-9999px`) → off-page; (c) **`position: fixed`** on the container → html2realpdf collapses everything to **1 page** (use `position: absolute`); or (d) white-on-white: the slide bg didn't paint because the color came from an external-theme `var()` → re-declare `--r-background-color` in the inline `:root`. |
| Images missing | CORS / relative URL. Set `baseUrl`, or `resourcePolicy: "omit"` to drop silently. |
| Background color missing | `data-background` not cloned. Set background on `.slide` (see above). |
| Export button did nothing | Not wired after `Reveal.initialize()`. Wire inside `.then(...)`. |

## Verifying the result

- **Page count** equals slide count (`Reveal.getTotalSlides()`).
- **Dimensions**: each page is 297 × 167.0625 mm (≈ 842 × 473 pt). Check with `pdfinfo deck.pdf` (`brew install poppler`) — `Page size: 841.89 x 473.74 pts`.
- **Selectable text**: open the PDF and try selecting/copying slide text. If it's an image, the export fell back to raster (check diagnostics / `fallback`).
- **Fonts**: in a PDF reader, document properties → Fonts should list Inter/JetBrains Mono (if registered), not just Noto.

## Two exports, one file

Some users want both the quick browser print and the clean vector PDF. Keep the html2realpdf button as the primary "Export PDF"; document that `?print-pdf` (browser Save as PDF) remains available for raster screenshots. Don't present `?print-pdf` as the deliverable.

---
name: reveal-slides
description: Create self-contained presentation decks as a single HTML file using reveal.js 6, exported to real vector PDFs (selectable text, embedded fonts, no black bars) via html2realpdf — both loaded from pinned jsDelivr URLs. Use when the agent must build slides, a deck, a slide deck, a keynote-style presentation, speaker slides, a webinar deck, a training support, or a pitch; author slides in HTML or Markdown with syntax-highlighted code, speaker notes, fragments, auto-animate, and a one-click dark/light theme toggle; or export the deck to a clean one-slide-per-page PDF containing only the slides. Déclenche aussi en français pour créer un diaporama, une présentation, des slides, un deck, un support de formation ou de conférence, un pitch ; écrire les slides en HTML ou Markdown avec coloration de code et notes, bascule de thème sombre/clair ; ou exporter un PDF vectoriel propre avec une slide par page, texte sélectionnable, via html2realpdf.
---

# Reveal Slides

Build a **single self-contained HTML file** that runs a reveal.js presentation in the browser and exports a **real vector PDF** (one slide per page, selectable text) via html2realpdf. Both libraries are loaded from pinned jsDelivr URLs so the file has no build step and no local dependencies — only an internet connection.

## Pinned Versions (single source of truth)

Pin to these exact versions. When the skill is updated, update both the version here, the CDN URLs, and the references in lockstep.

```
REVEAL_JS      = 6.0.1        # https://github.com/hakimel/reveal.js
HTML2REALPDF   = 0.1.13       # https://github.com/imggion/html2realpdf
```

**jsDelivr base URLs:**
- `https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/`
- `https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/`

Always emit the `@<version>` segment. Never use `@latest` or omit it — the skill is documented against these specific releases.

## Architecture

- **reveal.js** renders the live deck (keyboard nav, transitions, speaker view). CSS from `dist/reveal.css` + a theme; JS from `dist/reveal.mjs` + plugins.
- **html2realpdf** renders the deck DOM to a real PDF in the browser (Zig → WebAssembly). It does its **own** snapshot + layout (cssProfile `web`), so we feed it a clean stacked export container, not the live transformed `.reveal`.
- **One slide per page** is achieved with `pageBreak: { after: ".slide" }` + a 16:9 custom page. No browser print dialog, no screenshots, no black bars.

## Core Workflow

1. **Single file.** Emit one `.html` file. Put all CSS in `<head>`, all JS in one `<script type="module">`. No separate asset files. The fastest start is to copy `references/skeleton.html` (lean) or `references/demo-deck.html` (richer example) and edit the slides.
2. **Head: pinned CSS + a standard theme.** `reset.css`, `reveal.css`, a built-in reveal theme (`dist/theme/black.css` — required for backgrounds and typography), the highlight theme (`plugin/highlight/monokai.css`), then a `<style>` that `@font-face`-loads your fonts and overrides `--r-*`. See *Theme* below.
3. **Markup: `.reveal > .slides`** containing `<section>` slides. Author in HTML or Markdown (`<section data-markdown>`). Add code blocks (``` ```), fragments, and `<aside class="notes">`.
4. **Module script.** Import Reveal + Markdown + Highlight + Notes from pinned CDN URLs, call `Reveal.initialize({ plugins:[...] })`, then wire the **Export PDF** button after `Reveal.initialize()` resolves.
5. **Export.** The button calls `exportDeckToPdf()` (below) — clones every slide into a stacked container, renders with html2realpdf at 16:9, downloads the PDF.
6. **Verify.** Open the file in a browser (it needs network for the CDN). Navigate slides; click Export PDF; confirm the PDF has one page per slide with selectable text.

## The Single-File Skeleton

Start from a ready-made full HTML file:

- `references/skeleton.html` — minimal single-file deck: pinned URLs, plugin set, export function, one starter slide. Copy it and edit the slides and theme; keep the load-bearing parts intact.
- For a richer verified starting point (theme `black` + Inter + vertical slides + fragments + code + metrics + icon export button), copy `references/demo-deck.html` instead.

## Export: why a stacked container (not the live `.reveal`)

reveal.js applies 3D transforms and shows one slide at a time; html2realpdf would capture those transforms. So `exportDeckToPdf()` clones each slide's **innerHTML** into a clean `#deck-export` container (off-screen), strips speaker notes, and lets html2realpdf lay it out fresh with the `web` profile. The export `.slide` rules mirror the `--r-*` theme so the PDF matches the live look.

- **Page = 16:9** (`[297, 167.0625] mm`, margin 0) → no letterboxing, each slide fills a page.
- **One slide per page** via `pageBreak: { after: ".slide" }` + `break-after: page`.
- **Selectable text** — html2realpdf keeps text as text, fonts as subsets, links as annotations.
- **`cssProfile: "web"` is mandatory** for slides (the default `document` profile rejects positioned/floated/transformed layout).

Limitations to tell the user about: reveal `data-background` slide backgrounds are **not** cloned (they live outside `<section>`); add an explicit background to the export `.slide` if needed. Fragments appear **fully revealed** in the PDF (there is no animation). Speaker notes are stripped from the export. For the full option matrix and edge cases, load `references/export-pdf.md` and `references/html2realpdf.md`.

## Theme

**Always load a built-in reveal theme.** Without one, `reveal.css` applies no background or typography defaults → the deck renders with a white background and unstyled text. The skeleton loads `black.css` (dark, polished, the reveal reference look):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/theme/black.css">
```
Available themes: `black`, `white`, `beige`, `league`, `sky`, `night`, `serif`, `simple`, `solarized`, `blood`, `moon`, `dracula`, `black-contrast`, `white-contrast`.

**Customize via `--r-*` overrides** in a `:root` block loaded *after* the theme (keep the theme; just retune). The themes define these variables, which reveal.css consumes — so layout stays correct while you restyle: `--r-background-color`, `--r-main-color`, `--r-heading-color`, `--r-link-color` (+ `-hover`), `--r-main-font`, `--r-heading-font`, `--r-main-font-size`, `--r-block-margin`, `--r-heading-line-height`, `--r-code-font`. The export container mirrors these too, so the PDF matches the live look. If you switch themes, do a quick PDF export check and port that theme's `--r-*` values into the export `<style>` if colors look off.

## Custom Fonts (standalone files)

The deck is a single portable file, so it must not depend on fonts in surrounding folders. Two rules:

1. **html2realpdf only embeds raw TrueType bytes (`.ttf`/`.otf`).** `woff2`/`woff` — what Google Fonts and Fontshare CSS serve — will **not** embed; the PDF silently falls back to the bundled Noto Sans. Use a `.ttf` CDN source. The most reliable is **`@expo-google-fonts/<name>` on jsDelivr** (versioned, CORS, real `.ttf`): `https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_400Regular.ttf`. Google Fonts gstatic `.ttf` also works but its URLs are opaque and change on every font update.
2. **Use the same `.ttf` URL for the live deck and the PDF.** Declare it via `@font-face` (live display) **and** list it in `DECK_FONTS` (the export fetches the same bytes and registers them). This guarantees live and PDF match. If a fetch fails, that face falls back to Noto Sans — the PDF is never broken.

The skeleton wires `Inter` (400 + 700) this way. To use your own fonts, replace both the `@font-face` URLs and the `DECK_FONTS` entries together. Leave `DECK_FONTS = []` for zero-config Noto Sans output.

## Export Button

The PDF export is triggered by a single, unobtrusive icon button — **bottom-left, icon-only, no background fill** — sized and styled with the same restraint as reveal's left/right navigation arrows, so it never competes with the slides. The skeleton's CSS makes it a translucent light icon with a soft white drop-shadow glow (visible on dark slides), and auto-darkens it on light slide backgrounds via `body:has(.reveal.has-light-background)`. Tune the icon's `color`/glow to the deck's palette if needed, but keep it: bottom-left, icon-only, no fill, ~42px, wired to `exportDeckToPdf()` after `Reveal.initialize()`.

## Theme Toggle (dark / light)

Every deck ships with a **one-click dark/light toggle** (sun/moon icon, top-right) so a viewer who can't tolerate a bright (or dark) background can switch instantly. The exported PDF follows whichever mode is active when Export is clicked.

- **Two *designed* palettes, not a naive invert.** The skeleton defines `:root[data-theme="dark"]` and `:root[data-theme="light"]`. Pick colors for each that look intentional — e.g. dark `#191919` bg / `#fff` text / `#6ea8ff` accent; light `#fafafa` bg / `#1a1a1a` text / `#2563eb` accent (a slightly deeper accent holds contrast on light). Tune both sets for the deck's brand.
- **The PDF export follows the active theme.** Both palettes are declared in the **inline** `<style>`, so html2realpdf resolves whichever `data-theme` is current — toggle before clicking Export.
- **Button** is icon-only, no fill, top-right; its color/glow adapt to the theme via `--btn-*` variables (same restraint as the export button).
- **Default** is `data-theme="dark"` on `<html>`. To ship a deck that opens in light, set `data-theme="light"` on `<html>`.
- When designing the two palettes, also set theme-aware helpers (`--muted`, `--code-bg`) so secondary text and code blocks read well in both modes.

## Authoring Patterns

- **HTML slide:** `<section><h2>…</h2><p>…</p></section>`.
- **Markdown slide:** `<section data-markdown><textarea data-template>…</textarea></section>`. Use `---` inside the textarea to split, `----` for vertical/nested slides.
- **Code:** triple-backtick fences inside markdown, or `<pre><code class="language-js">` in HTML. Highlight plugin + monokai.css style it.
- **Fragments:** `class="fragment"`, `fragment fade-up`, `fragment strike`, etc. They reveal in the live deck; fully shown in the PDF.
- **Auto-animate:** add `data-auto-animate` to consecutive sections to morph matching elements.
- **Nested/vertical slides:** nest `<section>` inside `<section>` for sub-slides (Down/Up to navigate).
- **Speaker notes:** `<aside class="notes">…</aside>` inside a section; press `S` for the speaker view.
- **Math:** not wired by default — add the math plugin if needed (`references/reveal-api.md`).
- **List indentation:** reveal's stock `<ul>`/`<ol>` left indent is tight, so bullets often look flush with the text above. The skeleton/demo ship a small indent boost (`.reveal ul, .reveal ol { margin-left:1.5em; padding-left:1em }`, mirrored in `#deck-export` so the PDF matches). Keep it; if you restyle lists, preserve enough left indent that bullets read as nested under the preceding text.
- **Slide number:** `slideNumber: "c/t"` shows "current / total" at the bottom. The skeleton/demo restyle it to plain text, bottom-**center**, no background box, and reuse the themed `--btn-*` chrome color (the nav arrows' adaptive rule) + a soft glow so it stays readable on any background, ~10% smaller than reveal's stock size. Reposition/recolor there if you change the chrome.

## Anti-Patterns

- **Don't hide `#deck-export` off-screen** (`left:-9999px`) — html2realpdf renders content at the element's **real position**, so off-screen → off-page → a blank PDF. Position it `left:0; top:0` and hide with `z-index:-1`.
- **Don't rely on `var()` from the external theme `<link>` for the export** — html2realpdf only resolves CSS variables declared in the document's **inline** `<style>`. Re-declare `--r-background-color`, `--r-main-color`, `--r-heading-color` (and any color the export container uses) in the inline `:root`, or the PDF paints white pages with invisible text.
- **Don't skip the theme `<link>`** — without `black.css` (or another theme) the deck has no background or typography (white background, unstyled text).
- **Don't use emoji** in slides — they aren't in Inter/Noto Sans, and html2realpdf throws a hard `MissingGlyph` error that aborts the export. Use text or inline SVG icons instead (or register an emoji font).
- **Don't feed `woff2` to the PDF** — html2realpdf needs raw `.ttf`. Use `@expo-google-fonts` `.ttf` (see *Custom Fonts*).
- **Don't use Worker execution by default** — `createRenderer({ execution: "main" })` avoids cross-origin-Worker issues when the file is opened via `file://`. The export takes ~1-2s on the main thread; fine for a one-click export.
- **Don't render the live `.reveal` to PDF** — it carries transforms and shows one slide. Always use the stacked export container.
- **Don't omit `cssProfile: "web"`** — slides need flex/grid/positioning; the default `document` profile rejects them.
- **Don't use `@latest` or unversioned CDN URLs** — the skill is pinned to 6.0.1 / 0.1.13.
- **Don't split assets into multiple files** — the deliverable is one HTML file.
- **Don't put speaker notes in the export** — they're stripped; keep them for the live deck.
- **Don't rely on `?print-pdf` for the final deliverable** — that path uses the browser's raster print and loses html2realpdf's selectable-text vector output. (It remains a reveal.js option for quick screenshots.)

## Reference Loading

Load only what the step needs. Apply, don't paste.

- `references/skeleton.html` — one starter slide of the minimal deck described in *The Single-File Skeleton*; a leaner start than the demo.
- `references/demo-deck.html` — a **complete, verified working example** (theme `black` + Inter + vertical slides + fragments + code + metrics + the icon export button). Copy it as the starting point for a new deck and edit the slides; it already wires fonts, the on-page export container, and `createRenderer({ execution: "main" })` correctly.
- `references/reveal-api.md` — reveal.js 6.0.1 `Reveal.initialize` config keys, slide markup (HTML + Markdown), fragments, auto-animate, backgrounds, nested slides, keyboard shortcuts, API methods (`slide`, `getSlides`, `on`), and the full built-in theme list.
- `references/html2realpdf.md` — html2realpdf 0.1.13 API (`renderPdf` / `createRenderer`), full option tables, cssProfile `web` vs `document`, page geometry, WASM/CDN loading, Worker vs main-thread, fonts, metadata, link handling, diagnostics.
- `references/export-pdf.md` — the deck→PDF strategy in depth: why the export container, the export stylesheet, handling backgrounds/fragments/notes, custom fonts in the PDF, reading diagnostics, and troubleshooting the export.

## Output Rules

- Emit a single `.html` file with pinned CDN URLs, one `<style>`, one `<script type="module">`.
- Always load a reveal **theme `<link>`** (`black.css` by default) and the **icon export button** (bottom-left, icon-only, no fill) wired to `exportDeckToPdf()` after `Reveal.initialize()`.
- Keep the five import lines (Reveal + Markdown + Highlight + Notes + `createRenderer`) and the pinned versions intact.
- For custom fonts, keep `@font-face` and `DECK_FONTS` pointing at the same `.ttf` URLs.
- No emoji in slide text (they abort the PDF export).
- State the slide count, the 16:9 page size, and that text is selectable when you deliver.
- Test by opening the file in a browser (network required), navigating, and exporting once before handing off.
- For current reveal.js / html2realpdf behavior or version changes, verify against their docs (`revealjs.com`, the GitHub READMEs) before asserting specifics.

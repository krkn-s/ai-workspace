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

1. **Single file.** Emit one `.html` file. Put all CSS in `<head>`, all JS in one `<script type="module">`. No separate asset files. The fastest start is to copy `references/demo-deck.html` and edit the slides.
2. **Head: pinned CSS + a standard theme.** `reset.css`, `reveal.css`, a built-in reveal theme (`dist/theme/black.css` — required for backgrounds and typography), the highlight theme (`plugin/highlight/monokai.css`), then a `<style>` that `@font-face`-loads your fonts and overrides `--r-*`. See *Theme* below.
3. **Markup: `.reveal > .slides`** containing `<section>` slides. Author in HTML or Markdown (`<section data-markdown>`). Add code blocks (``` ```), fragments, and `<aside class="notes">`.
4. **Module script.** Import Reveal + Markdown + Highlight + Notes from pinned CDN URLs, call `Reveal.initialize({ plugins:[...] })`, then wire the **Export PDF** button after `Reveal.initialize()` resolves.
5. **Export.** The button calls `exportDeckToPdf()` (below) — clones every slide into a stacked container, renders with html2realpdf at 16:9, downloads the PDF.
6. **Verify.** Open the file in a browser (it needs network for the CDN). Navigate slides; click Export PDF; confirm the PDF has one page per slide with selectable text.

## The Single-File Skeleton

Copy this verbatim, then edit the slides and theme. The pinned URLs, plugin set, and export function are the load-bearing parts — keep them intact.

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Deck Title</title>

  <!-- reveal.js 6.0.1 CSS (pinned) + a standard theme as the polished base -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/theme/black.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/highlight/monokai.css">

  <style>
    /* Fonts: the same raw .ttf is used by the live deck (@font-face) AND
       registered for the PDF. @expo-google-fonts on jsDelivr ships real .ttf —
       woff2 will NOT embed in html2realpdf. Leave DECK_FONTS empty for Noto Sans. */
    @font-face { font-family: "Inter"; src: url("https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_400Regular.ttf") format("truetype"); font-weight: 400; font-display: swap; }
    @font-face { font-family: "Inter"; src: url("https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_700Bold.ttf") format("truetype"); font-weight: 700; font-display: swap; }

    /* Dual theme (dark default + light), both declared inline so html2realpdf
       resolves the ACTIVE one for the PDF export. Toggle via #theme-toggle.
       The two palettes are designed (not a naive invert) so each looks good. */
    :root, :root[data-theme="dark"] {
      --r-background-color: #191919;
      --r-main-color: #ffffff;
      --r-heading-color: #ffffff;
      --r-link-color: #6ea8ff;
      --r-link-color-hover: #9cc2ff;
      --muted: #9aa0aa;
      --code-bg: rgba(255,255,255,.06);
      --btn-color: rgba(255,255,255,.82);
      --btn-hover: #ffffff;
      --btn-glow: rgba(255,255,255,.6);
      --r-main-font: "Inter", "Source Sans Pro", Helvetica, sans-serif;
      --r-heading-font: "Inter", "Source Sans Pro", Helvetica, sans-serif;
      --r-code-font: "JetBrains Mono", ui-monospace, monospace;
    }
    :root[data-theme="light"] {
      --r-background-color: #fafafa;
      --r-main-color: #1a1a1a;
      --r-heading-color: #0a0a0a;
      --r-link-color: #2563eb;
      --r-link-color-hover: #1d4ed8;
      --muted: #6b7280;
      --code-bg: rgba(0,0,0,.06);
      --btn-color: rgba(0,0,0,.55);
      --btn-hover: #000000;
      --btn-glow: rgba(255,255,255,.95);
    }
    /* Export container: MUST sit on-page (left:0; top:0) — html2realpdf captures
       the element's real position, so off-screen (left:-9999px) renders all
       content off-page → blank PDF. z-index:-1 hides it behind the deck. */
    #deck-export { position: absolute; left: 0; top: 0; width: 297mm; z-index: -1; }
    #deck-export .slide {
      width: 297mm; height: 167.0625mm; box-sizing: border-box;
      padding: 16mm 20mm; display: flex; flex-direction: column; justify-content: center;
      background: var(--r-background-color); color: var(--r-main-color);
      font-family: var(--r-main-font); font-size: 26px; text-align: center;
      break-after: page; page-break-after: always;
    }
    #deck-export h1, #deck-export h2, #deck-export h3 { color: var(--r-heading-color); font-family: var(--r-heading-font); line-height: 1.1; margin: 0 0 0.4em; }
    #deck-export a { color: var(--r-link-color); }
    #deck-export pre, #deck-export code { font-family: var(--r-code-font); text-align: left; }
    #deck-export pre { overflow: hidden; background: var(--code-bg); padding: 0.8em; border-radius: 8px; font-size: 0.55em; }
    /* Default bullet/ordered lists: bump the left indent so bullets sit clearly
       under any heading/paragraph above them (reveal's stock indent is tight). */
    .reveal ul, .reveal ol { display: inline-block; text-align: left; margin: 0.4em 0 0.6em 1.5em; padding: 0 0 0 1em; }
    #deck-export ul, #deck-export ol { display: inline-block; text-align: left; margin: 0.4em 0 0.6em 1.5em; padding: 0 0 0 1em; }

    /* Two icon-only chrome buttons, no fill — same restrained elegance as the
       nav arrows. Colors adapt to the active theme via --btn-* vars. */
    #export-pdf, #theme-toggle {
      position: fixed; z-index: 99;
      width: 42px; height: 42px; border: 0; border-radius: 50%;
      background: transparent; color: var(--btn-color); cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      transition: transform .12s ease, color .12s ease;
    }
    #export-pdf { left: 16px; bottom: 16px; }
    #theme-toggle { right: 16px; top: 16px; }
    #export-pdf:hover, #theme-toggle:hover { transform: scale(1.08); color: var(--btn-hover); }
    #export-pdf:disabled { opacity: .45; cursor: progress; }
    #export-pdf svg, #theme-toggle svg { width: 22px; height: 22px; filter: drop-shadow(0 0 3px var(--btn-glow)) drop-shadow(0 1px 1px var(--btn-glow)); }
    /* Sun = "switch to light" (shown in dark); moon = "switch to dark" (in light). */
    #theme-toggle .icon-moon { display: none; }
    :root[data-theme="light"] #theme-toggle .icon-sun { display: none; }
    :root[data-theme="light"] #theme-toggle .icon-moon { display: inline; }

    /* Slide number: plain text, bottom-CENTER, no background box. Reuses the
       themed --btn-* chrome color (the same adaptive rule as the nav arrows and
       chrome buttons) + a soft glow, so it stays readable on any background.
       ~11px is ~10% smaller than reveal's stock 12px. */
    .reveal .slide-number {
      left: 50%; right: auto; bottom: 8px;
      transform: translateX(-50%);
      background: transparent !important;
      color: var(--btn-color);
      font-size: 11px; padding: 0;
      text-shadow: 0 0 3px var(--btn-glow);
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section>
        <h1>Deck Title</h1>
        <p>Subtitle or author</p>
      </section>

      <section data-markdown>
        <textarea data-template>
          ## Markdown slide
          - Bullet one
          - Bullet two

          ```js
          console.log("syntax highlighted");
          ```
          <aside class="notes">Speaker notes only visible in the notes view (S key).</aside>
        </textarea>
      </section>

      <section>
        <h2>Fragments</h2>
        <p class="fragment">Reveal step by step</p>
        <p class="fragment fade-up">…then this</p>
      </section>
    </div>
  </div>

  <!-- Export button: icon-only, bottom-left -->
  <button id="export-pdf" title="Export PDF" aria-label="Export PDF">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  </button>

  <!-- Theme toggle (top-right): switches the dual palette; the PDF export follows. -->
  <button id="theme-toggle" title="Toggle light / dark" aria-label="Toggle light and dark theme">
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>

  <script type="module">
    import Reveal from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.mjs";
    import RevealMarkdown from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/markdown.mjs";
    import RevealHighlight from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/highlight.mjs";
    import RevealNotes from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.mjs";
    import { createRenderer } from "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/index.js";

    const PDF_PAGE = { format: [297, 167.0625], unit: "mm", margin: 0 }; // 16:9 (A4-wide)
    const WASM_URL = "https://cdn.jsdelivr.net/npm/@imggion/html2realpdf@0.1.13/dist/libhtml2realpdf.wasm";

    // Fonts to embed in the PDF (raw .ttf). Same URLs as @font-face above so the
    // live deck and the PDF match. Empty [] = html2realpdf falls back to Noto Sans.
    const DECK_FONTS = [
      { family: "Inter", url: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_400Regular.ttf", weight: 400 },
      { family: "Inter", url: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.2.3/Inter_700Bold.ttf", weight: 700 },
    ];

    Reveal.initialize({
      width: 1280, height: 720,        // 16:9 canvas (matches the PDF page)
      hash: true, slideNumber: "c/t", transition: "slide",
      controls: true, progress: true, center: true,
      plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    }).then(() => {
      document.getElementById("export-pdf").addEventListener("click", exportDeckToPdf);
      document.getElementById("theme-toggle").addEventListener("click", () => {
        document.documentElement.dataset.theme =
          document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      });
    });

    // Main-thread renderer (no cross-origin Worker) — robust for file:// and https.
    let _renderer = null;
    async function getRenderer() {
      if (_renderer) return _renderer;
      const fonts = [];
      for (const f of DECK_FONTS) {
        try { fonts.push({ family: f.family, data: await (await fetch(f.url)).arrayBuffer(), weight: f.weight ?? 400, style: f.style ?? "normal" }); }
        catch (e) { console.warn("[deck] font fetch failed (Noto Sans fallback for this face):", f.family, e); }
      }
      _renderer = await createRenderer({ execution: "main", wasmUrl: WASM_URL, fonts });
      return _renderer;
    }

    async function exportDeckToPdf() {
      const btn = document.getElementById("export-pdf");
      btn.disabled = true;
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
      try {
        const pdf = await (await getRenderer()).render(root, {
          page: PDF_PAGE,
          cssProfile: "web",      // required for slides: flex/grid/transforms/shadows/positioning
          mediaType: "print",
          layoutContext: "page",  // reflow to the PDF content box (297mm)
          pageBreak: { after: ".slide" },
          metadata: { title: document.title },
        });
        pdf.download(`${document.title || "deck"}.pdf`);
        if (pdf.diagnostics?.length) console.table(pdf.diagnostics);
        pdf.dispose();
      } catch (err) {
        console.error("[deck] PDF export failed:", err);
        alert("PDF export failed:\n" + (err?.message || err) + "\n\nSee console (DevTools).");
      } finally {
        root.remove();
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>
```

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

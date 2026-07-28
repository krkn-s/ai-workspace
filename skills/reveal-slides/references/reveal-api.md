# reveal.js 6.0.1 Reference

Pinned to **reveal.js@6.0.1**. CDN base: `https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/`. Source: `dist/reveal.mjs` (ESM) / `dist/reveal.js` (UMD, global `Reveal`). CSS: `dist/reset.css`, `dist/reveal.css`, `dist/theme/<name>.css`, `dist/plugin/highlight/monokai.css`.

## Initialization (ESM, single file)

```js
import Reveal from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.mjs";
import RevealMarkdown from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/markdown.mjs";
import RevealHighlight from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/highlight.mjs";
import RevealNotes from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.mjs";

Reveal.initialize({ plugins: [RevealMarkdown, RevealHighlight, RevealNotes] })
  .then(() => { /* deck ready */ });
```

Optional plugins (same flat path pattern `dist/plugin/<name>.mjs`): `RevealZoom` (`dist/plugin/zoom.mjs`), `RevealSearch` (`dist/plugin/search.mjs`), `RevealMath` (`dist/plugin/math.mjs`, loads KaTeX from its own CDN). The skill wires **Markdown + Highlight + Notes** by default; add others on demand.

## `Reveal.initialize` config (common keys)

| Key | Default | Effect |
|---|---|---|
| `controls` | `true` | Arrow UI (bottom-right). |
| `progress` | `true` | Progress bar. |
| `slideNumber` | `false` | `"c/t"` shows `current/total`; `true`, `"h.v"`, `"h/v"`. |
| `hash` | `false` | URL `#/slide` deep-linking. |
| `respondToHashChanges` | `true` | Update slide on hash change. |
| `center` | `true` | Vertically center slide content. |
| `transition` | `"slide"` | `none`/`fade`/`slide`/`convex`/`concave`/`zoom`. |
| `transitionSpeed` | `"default"` | `default`/`fast`/`slow`. |
| `backgroundTransition` | `"fade"` | Transition for slide backgrounds. |
| `width` / `height` | `960` / `700` | Slide canvas size in px; scales to viewport. Set `width:1280, height:720` for 16:9. |
| `margin` | `0.04` | Viewport margin factor. |
| `minScale` / `maxScale` | `0.2` / `2.0` | Scale clamps. |
| `autoSlide` | `0` | Auto-advance ms (0 = off). `loop`/`slideNumber` interact. |
| `loop` | `false` | Loop back to first slide. |
| `shuffle` | `false` | Randomize slide order. |
| `keyboard` | `true` | Keyboard navigation. |
| `overview` | `true` | Esc / overview mode. |
| `touch` | `true` | Touch navigation. |
| `mouseWheel` | `false` | Navigate with wheel. |
| `previewLinks` | `false` | Open links in a preview iframe. |
| `help` | `true` | `?` shows help overlay. |
| `pdfSeparateFragments` | `true` | (Browser `?print-pdf` only.) |
| `plugins` | `[]` | Plugin array. |

Set 16:9 explicitly: `width: 1280, height: 720` (matches the export's 16:9 page).

## Slide Markup

**HTML slide:** `<section>…content…</section>`.

**Markdown slide** (single-file friendly): 
```html
<section data-markdown>
  <textarea data-template>
    ## Heading
    - item
    - item

    ---

    ## Vertical sub-slide (navigated with ↓/↑)

    ```js
    const x = 1;
    ```
  </textarea>
</section>
```
- `---` inside the textarea splits **horizontal** slides (→).
- `----` splits **vertical** sub-slides (↓).
- An external `.md` file is also supported (`<section data-markdown="deck.md">`) but breaks the single-file rule — avoid for the deliverable.

**Nested/vertical slides (HTML):**
```html
<section>
  <h2>Parent</h2>
  <section><p>Sub 1</p></section>
  <section><p>Sub 2</p></section>
</section>
```

## Attributes on `<section>`

| Attribute | Effect |
|---|---|
| `data-markdown` | Markdown content (with `data-template` textarea). |
| `data-background-color="#hex"` | Slide background color. |
| `data-background-image="url"` | Background image (cover). |
| `data-background-size`, `data-background-position`, `data-background-repeat` | Background tuning. |
| `data-background-video="url"` | Background video (no audio in PDF). |
| `data-background-iframe="url"` | Background iframe (not in PDF). |
| `data-transition="zoom"` | Per-slide transition override. |
| `data-background-transition="fade"` | Per-slide background transition. |
| `data-auto-animate` | Enable auto-animate on this slide **and** the next. |
| `data-auto-animate-easing`, `data-auto-animate-duration` | Tune the morph. |
| `data-visibility="hidden"` | Skip slide (not counted, not navigable). |

> **PDF caveat:** `data-background-*` backgrounds live outside `<section>` and are **not** cloned by the export. If a background matters for the PDF, set it on the export `.slide` (`#deck-export .slide { background: … }`) or add a full-bleed child element inside the section.

## Fragments

```html
<p class="fragment">step 1</p>
<p class="fragment fade-up">step 2</p>
<p class="fragment strike">step 3</p>
<p class="fragment" data-fragment-index="3">explicit order</p>
```
Built-in fragment styles: `grow`, `shrink`, `fade-out`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-in-then-out`, `fade-in-then-semi-out`, `highlight-current-blue/red/green`, `highlight-blue/red/green`, `strike`. In the PDF export, all fragments render **fully visible** (no animation).

## Auto-Animate

Add `data-auto-animate` to two consecutive `<section>`s; reveal morphs elements that match by tag/`data-id`/content. Use `data-id` to pair specific elements:
```html
<section data-auto-animate><h1 data-id="t">Hello</h1></section>
<section data-auto-animate><h1 data-id="t">Hello, world</h1></section>
```

## Speaker Notes

```html
<section>
  <h2>Slide</h2>
  <aside class="notes">Only visible in the speaker view.</aside>
</section>
```
Press **S** to open the speaker notes window. Notes are stripped from the PDF export.

## Code Highlighting

The highlight plugin (highlight.js under the hood) + `plugin/highlight/monokai.css`. In markdown, use fenced code blocks with a language. In HTML:
```html
<pre><code class="language-python" data-trim data-line-numbers="1-2|4">
def f():
    return 1
</code></pre>
```
- `data-trim` removes leading/trailing blank lines.
- `data-line-numbers` adds line numbers; `"1-2|4"` steps highlights (fragments).

## Math (optional, not wired by default)

Add the math plugin (loads KaTeX):
```js
import RevealMath from "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/math.mjs";
Reveal.initialize({ plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath], math: { tex2jax: { inlineMath: [["$","$"],["\\(","\\)"]] } } });
```
Then `$E=mc^2$` inline or `$$\int_a^b$$` block.

## API Methods

| Method | Effect |
|---|---|
| `Reveal.initialize(config)` | Init; returns a Promise. |
| `Reveal.ready` | Promise resolving when ready. |
| `Reveal.slide(h, v, f)` | Jump to horizontal/vertical/fragment index. |
| `Reveal.next()` / `Reveal.prev()` | Step. |
| `Reveal.right()`/`left()`/`down()`/`up()` | Directional nav. |
| `Reveal.getSlides()` | Array of all slide `<section>` elements (used by the export). |
| `Reveal.getCurrentSlide()` | Current slide element. |
| `Reveal.getIndices(slide?)` | `{h, v, f}`. |
| `Reveal.fragment(next?)` / `Reveal.nextFragment()` / `prevFragment()` | Fragments. |
| `Reveal.on(event, cb)` / `.off(event, cb)` | Events: `ready`, `slidechanged`, `fragmentshown`, `fragmenthidden`, `overviewshown`. |
| `Reveal.configure(opts)` | Change config live. |
| `Reveal.sync()` | Re-sync after DOM changes. |
| `Reveal.toggleOverview()` / `toggleHelp()` / `togglePause()` | Modes. |
| `Reveal.isReady()` / `isOverview()` / `isPaused()` | State. |
| `Reveal.destroy()` | Tear down. |

## Keyboard Shortcuts

`→/Space` next · `←` prev · `↓/↑` vertical · `Esc/O` overview · `S` speaker notes · `F` fullscreen · `B/.` blackout (pause) · `?` help.

## Themes

Built-in (`dist/theme/<name>.css`): `black`, `white`, `beige`, `league`, `sky`, `night`, `serif`, `simple`, `solarized`, `blood`, `moon`, `dracula`, `black-contrast`, `white-contrast`. All set the `--r-*` variables. To go custom, drop the theme `<link>` and set the `--r-*` variables yourself (see SKILL.md *Theme*).

## Browser `?print-pdf` (alternative, raster)

Append `?print-pdf` to the URL and use the browser's **Save as PDF**. It stacks slides and paginates. This is a **raster/browser-print** path — use it only for quick screenshots. The skill's html2realpdf export is the recommended path for a clean **vector** PDF.

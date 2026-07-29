# Troubleshooting & Security

Common rendering problems, root causes, and fixes — plus security limits for untrusted input.

## Debugging Workflow

1. **Run from the CLI with verbose logging** to see every ignored CSS property and missing resource:
   ```bash
   weasyprint doc.html out.pdf --verbose 2>wp.log
   rg -i 'warn|ignored|not support|cannot|error' wp.log
   ```
2. **Uncompressed PDF** for low-level inspection: `--uncompressed-pdf`.
3. **Rasterize a page** to visually verify (poppler: `brew install poppler`):
   ```bash
   pdftoppm -png -r 72 -f 1 -l 1 out.pdf /tmp/p    # page 1
   ```
   `sips` on macOS only extracts page 1; use `pdftoppm` for arbitrary pages.
4. **Confirm geometry:** `pdfinfo out.pdf` shows page size (in pts; 1 pt = 1/72 in).

## Previewing in the Browser

The HTML "looks wrong" when opened directly in a browser — content stretches across the full viewport with no page boxes. **This is expected, not a bug.** WeasyPrint renders in `print` media against the `@page` rule (size, margin, margin boxes); a browser renders in `screen` media by default and **ignores `@page`** for on-screen layout, so it shows one continuous full-width scroll. The PDF is the only faithful preview.

Options to preview without leaving the browser:

1. **Screen-only stylesheet (recommended).** Add a `@media screen` block that constrains `body` to the trim width — a white "page" centered on a gray desk, padded to the safe area. It is `screen`-only, so it **never affects the PDF** (WeasyPrint uses `print`):
   ```css
   @media screen {
     html { background: #e9e9ee; }
     body {
       max-width: 210mm;          /* trim width — match @page size */
       min-height: 297mm;
       margin: 2em auto;
       padding: 20mm;             /* = @page margin → safe area */
       background: #fff;
       box-shadow: 0 2px 12px rgba(0,0,0,.25);
     }
   }
   ```
   Limit: a multi-page document shows as one tall column (no visible page breaks). For a single-page card/flyer this is a faithful preview; for multi-page, still render the PDF for true pagination.

2. **DevTools media emulation (no file edit).** Chrome/Firefox → DevTools → ⋮ → *More tools* → *Rendering* → **Emulate CSS media type: print**. Applies your `@media print` rules, but does **not** draw page boxes — useful to check print-specific styling, not pagination.

3. **Browser print preview (Cmd/Ctrl+P).** The browser's own print pipeline honors `@page` and shows page breaks, but uses the browser's rasterizer — colors, backgrounds, and margin-box `content` may differ from WeasyPrint. Use only as a rough check; the PDF is authoritative.

## Symptoms → Causes → Fixes

### No text / squares instead of letters
The font lacks the glyphs (often emoji, CJK, or a web font that didn't load).
- Install the font system-side and verify: `fc-list | rg Brand`, `fc-match "Brand Sans"`.
- Or embed via `@font-face` with a `FontConfiguration` (see SKILL.md). Forgetting `font_config=` is the #1 cause of silently-ignored web fonts.
- Check `<html lang="…">` — needed for fallback chains.

### Web font (`@font-face`) is ignored
You forgot the `FontConfiguration`. It must be passed to **both** the `CSS` and `write_pdf`:
```python
font_config = FontConfiguration()
css = CSS(string='@font-face{…}', font_config=font_config)
HTML('doc.html').write_pdf('out.pdf', stylesheets=[css], font_config=font_config)
```
CLI-only: put `@font-face` inside the HTML `<style>` block (WeasyPrint picks it up there), or install the font system-side.

### Missing shadows / no depth
`box-shadow` and `text-shadow` are **unsupported**. Simulate:
- **Borders** + background contrast for separation.
- **Layered background gradients** for soft edges.
- An **absolutely-positioned duplicate** rectangle behind the element, offset by a few px, in a semi-transparent dark color (poor man's shadow).

### Images don't appear
- Path is wrong / 404 / blocked. Check logs for the failed fetch. Relative URLs resolve against the input file's location or `base_url` (`-u`).
- Undersized image is stretched/blurry → export at `(box_mm)/25.4 × DPI` px (see print-ready.md).
- `data:` URIs work; verify the MIME/base64 is correct.

### Wrong colors on screen
Screen viewers and printers differ. For press, use `device-cmyk()` + an ICC `--output-intent` and target `pdf/x-4`. For screen, sRGB (`rgb`/`hex`) is fine.

### Huge PDF / slow render
- Cap raster DPI: `-D 150` (150 is plenty for screen, 300 for print).
- Optimize: `--optimize-images -j 70`.
- Avoid heavy CSS frameworks (cascade cost) and large multi-page tables.
- Cache reused images: `-c /tmp/wpcache`.
- `--uncompressed-pdf` makes files larger — only for debugging.

### A slide/document spills onto an extra page
Content overflows one page. For slides: ensure `.slide` has `height` + `overflow: hidden` and `min-height` equals `height`. For documents: `break-inside: avoid` on figures/tables, trim content, or check for an element taller than the page area.

### Page numbers / running headers don't show
- Margin boxes need `content:` — `@bottom-right { content: counter(page) }`.
- Running headers need `string-set` on the source element **and** `string()` in the margin box.
- `@page :first` can suppress them — check you're not hiding them everywhere.

### TOC page numbers missing / blank
`target-counter(attr(href), page)` needs the `href` to resolve to an in-document `id`. Use `<a href="#ch1">…</a>` + `<h2 id="ch1">`. Fragment must start with `#`.

### Flex/Grid layout looks wrong
Both are "simple cases only". Prefer block or flex; avoid grid edge cases (`auto-fit`, subgrids, intrinsic-size items). See css-reference.md.

### `unset` rejected
Not supported — use `initial` or `inherit`.

## Security — Rendering Untrusted HTML/CSS

When the input is not fully trusted (user-supplied HTML, server-side generation), WeasyPrint can be abused for **long renderings**, **infinite loops**, **huge values**, **network access**, and **local file reads**. Mitigations (combine):

1. **Run as a non-root, limited user**; containerize (Docker/uWSGI with `evil-reload-on-as` + `harakiri`).
2. **Limit memory/CPU at the OS level** (`ulimit`, cgroups).
3. **Kill long runs**: a watchdog that terminates processes exceeding a time/memory budget.
4. **Truncate and sanitize** HTML/CSS input; strip `<link>`, `<style>` `@import`, `<img>`/`url()` to external hosts.
5. **Block `file://` and untrusted protocols** with a custom `URLFetcher`:
   ```python
   class SafeFetcher(URLFetcher):
       def fetch(self, url, headers=None):
           if url.startswith('file://'):
               raise FatalURLFetchingError(f'file:// blocked: {url}')
           return super().fetch(url, headers)
   ```
   Use `--allowed-protocols http,https,data` on the CLI.
6. **Set a fetch timeout** (`URLFetcher(timeout=10)` or `-t 10`); default HTTP timeout is 10 s (does **not** apply to `file://`).
7. **Beware special files** — `/dev/urandom` and similar are infinite; block `file://` outright.
8. **Expect information leaks** even with limits: installed fonts, network config, and library versions can be probed.

## SVG Security
SVG rendering shares the same risk surface as HTML/CSS — apply the same controls to untrusted SVG. The URL fetcher is used when rendering SVG.

## Performance Tips
- Long-lived Python process > spawning the CLI per document (avoids startup cost).
- Share an image cache across renders: `cache={}` (Python) or `-c DIR` (CLI).
- Prefer vector (SVG) over raster; subset-embedded fonts are automatic (hb-subset).
- Avoid large CSS frameworks and giant multi-page tables for latency-critical paths.

# Print-Ready Output (bleed, marks, CMYK, PDF/X, DPI)

Activate this mode only when the PDF goes to a commercial printer. The default mode is digital/screen. WeasyPrint has **no native PDF/X bleed-box metadata** — bleed is achieved by expanding the `@page` canvas and using negative positioning, while text stays inside the trim/safe area.

## The Four-Zone Model

```
┌─────────────────────────────┐  ← physical canvas edge (= trim + 2 × bleed)
│ ░░░░░ bleed zone ░░░░░░░░░░ │     artwork extends here
│ ░ ┌───────────────────┐ ░░░ │  ← trim boundary (final cut line)
│ ░ │  safe area        │ ░░░ │     all text/overlays stay inside
│ ░ │  (trim − margin)  │ ░░░ │
│ ░ └───────────────────┘ ░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────┘
```

- **Trim** — final cut size (e.g. 85×55 mm business card).
- **Bleed** — artwork extends beyond trim so no white edge shows after cutting. Standard **3 mm**, large-format **5 mm**.
- **Physical canvas** — `size` in `@page` = `trim + 2 × bleed` on each axis.
- **Safe area** — keep all critical text ≥ bleed (3 mm) inside the trim edge; many printers want 4–5 mm.

## The `@page` Setup (print-ready)

```css
:root {
  --trim-w: 85mm;
  --trim-h: 55mm;
  --bleed: 3mm;
}
@page {
  size: calc(85mm + 6mm) calc(55mm + 6mm);   /* trim + 2×bleed = 91×61mm */
  margin: 0;
  bleed: 3mm;
  marks: crop cross;                          /* trim + registration marks */
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
```

> `marks: crop` needs WeasyPrint ≥ 56. `marks: cross` adds registration marks. If your press doesn't need them, omit — they add corner marks in the bleed zone.

## Full-Bleed Artwork

Push background images/colors past the trim with negative positioning:

```css
.bleed-bg {
  position: absolute;
  top: -3mm; left: -3mm;
  width: calc(100% + 6mm);
  height: calc(100% + 6mm);
  object-fit: cover;
  image-rendering: crisp-edges;   /* mandatory for PDF/A */
}
```

For a full-bleed color, simpler — set it on `@page { background: var(--brand) }` (the page background fills the whole canvas including bleed).

## Keep Text in the Safe Area

Pin a content wrapper at the trim offset:

```css
.content {
  position: absolute;
  top: 3mm; left: 3mm;
  width: 85mm;
  height: 55mm;
  padding: 5mm;                  /* inner safe margin */
}
```

## Color: CMYK & ICC Profiles

For press, use process/spot CMYK instead of RGB:

```css
@color-profile device-cmyk {
  components: cyan, magenta, yellow, black;
  src: url(profiles/GRACoL2013_ICCprofile.icc);
}
body { color: device-cmyk(0% 10% 100% 0%); }       /* a vivid red */
.accent { background: device-cmyk(100% 0% 0% 0%); } /* cyan */
```

Set the output intent (CLI `--output-intent`, Python `output_intent=`):

```bash
weasyprint card.html card.pdf -s print.css \
  --output-intent srgb --pdf-variant pdf/x-4
```

- `device-cmyk(c m y k)` — each 0–100%. WeasyPrint can also infer from RGB with `unencoded-profile()`.
- Pure black text: `device-cmyk(0% 0% 0% 100%)` (avoids rich-black registration issues).
- Rich black for large solids: `device-cmyk(60% 50% 50% 100%)`.
- Always confirm the printer's required ICC profile (ISO Coated v2, GRACoL, FOGRA, …).

## PDF/X (graphics exchange)

Prefer **`pdf/x-4`** (allows transparency; older variants forbid it). Requires device-dependent CMYK + output intent everywhere.

```bash
weasyprint poster.html poster.pdf --pdf-variant pdf/x-4 --output-intent device-cmyk
```

## PDF/A (archiving) image rule

Any image in a PDF/A document needs `image-rendering: crisp-edges` — anti-aliasing is forbidden by the spec.

```css
img { image-rendering: crisp-edges; }
```

## Raster Image Resolution Math

WeasyPrint embeds rasters at the CSS box size **without intelligent upsampling** — undersized images get stretched and blurred. Export rasters at the exact canvas size:

```
pixels = (trim_mm + 2 × bleed_mm) / 25.4 × DPI
```

| Use | DPI |
|---|---|
| Offset / commercial print | 300 |
| Large-format (posters, roll-ups) | 150–200 |
| Highest quality / fine detail | 400+ |

Example — A4 (210×297) + 3 mm bleed @ 300 DPI:
- width = (210 + 6) / 25.4 × 300 ≈ **2548 px**
- height = (297 + 6) / 25.4 × 300 ≈ **3579 px**

Use SVG for logos, icons, line art — WeasyPrint renders SVG as vectors at native resolution regardless of DPI. Vector > raster for anything geometric.

## Image Optimization (file size)

```bash
weasyprint doc.html out.pdf --optimize-images -j 80 -D 300
```

- `--optimize-images` — lossless re-compression (smaller PDF, slightly slower).
- `-j, --jpeg-quality N` — JPEG quality 0–95.
- `-D, --dpi N` — cap max raster resolution; downscales oversized images.
- `-c, --cache-folder DIR` — reuse optimized images across runs.

## Crop Marks Only (no full-bleed artwork)

If you only need marks for a press that will trim to a non-standard size but your artwork already has white margins, still set `bleed` + `marks` on `@page` with `size` = trim + 2×bleed, and keep content within trim.

## Verification

Rasterize a page to confirm the canvas, marks, and bleed before sending to press:

```bash
pdftoppm -png -r 150 -f 1 -l 1 card.pdf /tmp/proof    # page 1 at 150 DPI
```

Check: physical page size = trim + 2×bleed; crop marks visible at corners; no text within 3 mm of trim; CMYK (not RGB) where required.

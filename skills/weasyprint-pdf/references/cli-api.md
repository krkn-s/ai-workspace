# CLI & Python API Reference

Exact flags, signatures, and PDF variants. Verified against WeasyPrint source (`weasyprint/__main__.py`, `weasyprint/__init__.py`, `weasyprint/pdf/*.py`).

## CLI — Basic Usage

```bash
weasyprint <input> <output>          # input = URL or file or - for stdin; output = file or - for stdout
weasyprint input.html output.pdf
weasyprint https://example.com out.pdf
weasyprint - output.pdf < input.html
```

## CLI — Rendering Options

| Flag | Effect |
|---|---|
| `-s, --stylesheet FILE` | User CSS stylesheet (repeatable). Process substitution works in bash/zsh: `-s <(echo '@page{size:A3}')`. |
| `-a, --attachment FILE` | Attach a file to the PDF (repeatable). |
| `--attachment-relationship REL` | Relationship per attachment (`Source`/`Data`/`Alternative`/`Supplement`). |
| `--pdf-identifier ID` | PDF document identifier. |
| `--pdf-variant VAR` | See *PDF Variants* below. |
| `--pdf-version VER` | PDF version (e.g. `1.7`, `2.0`). |
| `--pdf-forms` | Turn HTML forms into real PDF form fields. |
| `--pdf-tags` | Tag PDF for accessibility (required for PDF/UA and PDF/A level A). |
| `--uncompressed-pdf` | No compression — for debugging. |
| `--xmp-metadata FILE` | Include XMP metadata (repeatable). |
| `--custom-metadata` | Include custom `<meta>` tags in PDF info dict. |
| `--output-intent SPEC` | `srgb`, `device-cmyk`, or a CSS identifier of an output-intent color space. |
| `-p, --presentational-hints` | Follow HTML presentational attributes (color, align, …). |
| `--optimize-images` | Lossless size optimization for embedded images (slower render). |
| `-j, --jpeg-quality N` | JPEG quality 0–95. |
| `-D, --dpi N` | Max resolution (DPI) for embedded raster images. |
| `--full-fonts` | Embed unmodified font files when possible. |
| `--hinting` | Keep hinting info in embedded fonts. |
| `-c, --cache-folder DIR` | Cache images on disk (created, cleaned after). Pass a dict in Python to share cache across docs. |

## CLI — HTML / Fetcher Options

| Flag | Effect |
|---|---|
| `-e, --encoding ENC` | Force input character encoding. |
| `-m, --media-type TYPE` | Media type for `@media` (default `print`). |
| `-u, --base-url URL` | Base for relative URLs (defaults to input filename/dir). |
| `-t, --timeout SEC` | Timeout for HTTP requests (default 10s). |
| `--allowed-protocols LIST` | Comma-separated allowed protocols for fetching. |
| `--no-http-redirects` | Do not follow HTTP redirects. |
| `--fail-on-http-errors` | Abort on any HTTP error. |

CLI logging: `--verbose` / `--debug` / `--quiet`.

## CLI — Common Recipes

```bash
# External print stylesheet
weasyprint flyer.html flyer.pdf -s print.css

# Inline CSS without a file (bash/zsh)
weasyprint doc.html out.pdf -s <(echo '@page { size: A3 landscape; margin: 3cm }')

# Print-ready business card with crop marks (CSS holds size/bleed/marks)
weasyprint card.html card.pdf -s print-ready.css --output-intent srgb

# Optimize for a small digital PDF
weasyprint report.html report.pdf --optimize-images -j 70 -D 150 -c /tmp/wpcache

# PDF/A-3u archive
weasyprint doc.html doc.pdf --pdf-variant="pdf/a-3u"

# Accessibility-tagged
weasyprint doc.html doc.pdf --pdf-variant="pdf/ua-1" --pdf-tags

# Watch & regenerate on change
watchexec -e html,css -- weasyprint input.html output.pdf
```

## PDF Variants (exact string values)

Pass to `--pdf-variant` (CLI) or `pdf_variant=` (Python). From `weasyprint/pdf/`.

**PDF/A (archiving):**
- `pdf/a-1b`, `pdf/a-1a` (level A needs `--pdf-tags`)
- `pdf/a-2b`, `pdf/a-2u`, `pdf/a-2a`
- `pdf/a-3b`, `pdf/a-3u`, `pdf/a-3a`
- `pdf/a-4u`, `pdf/a-4e`, `pdf/a-4f`

Prefer **`pdf/a-3u`** (transparency allowed, Unicode text, arbitrary file attachments). Level `u` = Unicode text, level `a` = accessible (needs tagging). For images in any PDF/A, set `image-rendering: crisp-edges` (anti-aliasing is forbidden).

**PDF/UA (accessibility):** `pdf/ua-1`, `pdf/ua-2`. Requires correct HTML structure, `<title>`, and `lang` on `<html>`.

**PDF/X (graphics exchange):** `pdf/x-1a`, `pdf/x-3`, `pdf/x-4`, `pdf/x-5g`. Prefer **`pdf/x-4`** (allows transparency). Use `device-cmyk()` colors and define an output-intent ICC profile.

**Debug:** `debug` (visualizes boxes).

> WeasyPrint tries to produce valid variant PDFs but does not guarantee validity — the HTML/CSS must obey each spec's constraints.

## Python API — Core Objects

### `HTML`

```python
from weasyprint import HTML, CSS

HTML('doc.html')                # filename guessed
HTML(filename='doc.html')
HTML(url='https://example.com')
HTML(string='<h1>Hi</h1>')      # must be named
HTML(file_obj=open('doc.html')) # must be named
```

`.write_pdf(target=None, **options)` → writes to file/`target`, or returns bytes if no target. `**options` maps to CLI flags (see `DEFAULT_OPTIONS`): `stylesheets`, `attachments`, `attachment_relationships`, `pdf_identifier`, `pdf_variant`, `pdf_version`, `pdf_forms`, `pdf_tags`, `uncompressed_pdf`, `xmp_metadata`, `custom_metadata`, `presentational_hints`, `output_intent`, `optimize_images`, `jpeg_quality`, `dpi`, `full_fonts`, `hinting`, `cache`.

```python
HTML('doc.html').write_pdf('out.pdf')                                  # bytes if no arg
HTML('doc.html').write_pdf('out.pdf', stylesheets=[CSS('print.css')])
HTML('doc.html').write_pdf('out.pdf', pdf_variant='pdf/a-3u')
HTML('doc.html').write_pdf('out.pdf', optimize_images=True, jpeg_quality=70, dpi=150)
```

`.render(**options)` → `Document` with `.pages` (list of `Page`), `.metadata` (`DocumentMetadata`), `.make_bookmark_tree()`, `.copy(pages)` (subset pages), `.write_pdf(target, **options)`.

```python
doc = HTML('doc.html').render()
doc.copy(doc.pages[::2]).write_pdf('odd.pdf')   # odd pages
doc.copy(doc.pages[1::2]).write_pdf('even.pdf') # even pages
print(len(doc.pages))                           # page count
```

### `CSS`

```python
CSS('print.css')
CSS(filename='print.css')
CSS(string='@page { size: A3; margin: 1cm }')   # must be named
CSS(string='...', font_config=font_config)        # required if using @font-face
```

User stylesheets have **lower** priority than author stylesheets unless declarations use `!important`.

### `Attachment`

```python
from weasyprint import Attachment
a = Attachment('note.txt')
a = Attachment(string=b'...', name='note.txt', relationship='Data')
HTML('doc.html').write_pdf('out.pdf', attachments=[a])
```

### `FontConfiguration`

Required whenever CSS contains `@font-face`:

```python
from weasyprint.text.fonts import FontConfiguration
font_config = FontConfiguration()
css = CSS(string='@font-face { font-family: X; src: url(x.woff2) } body{font-family:X}',
          font_config=font_config)
HTML('doc.html').write_pdf('out.pdf', stylesheets=[css], font_config=font_config)
```

### `URLFetcher` (custom resource loading)

Override to handle cookies/auth, restrict `file://`, or generate images on the fly:

```python
from weasyprint import HTML
from weasyprint.urls import URLFetcher, URLFetcherResponse, FatalURLFetchingError

class SafeFetcher(URLFetcher):
    def fetch(self, url, headers=None):
        if url.startswith('file://') and '/etc/' in url:
            raise FatalURLFetchingError(f'blocked {url}')
        return super().fetch(url, headers)

HTML('doc.html', url_fetcher=SafeFetcher()).write_pdf('out.pdf')
# Or set a timeout:
HTML('doc.html', url_fetcher=URLFetcher(timeout=20)).write_pdf('out.pdf')
```

Default fetcher handles `file`, `http`, `https`, `ftp`, `data:` URIs. No cookies/auth. Raise `FatalURLFetchingError` to stop rendering; any other exception is caught and logged as a warning.

## DocumentMetadata & PDF Metadata

HTML `<meta>` tags auto-populate PDF fields:

```html
<html lang="en">
  <head>
    <title>Document Title</title>
    <meta name="author" content="Jane Doe">
    <meta name="keywords" content="pdf, weasyprint">
    <meta name="description" content="A sample">
    <meta name="dcterms.created" content="2025-01-31T12:00:00+02:00">
    <meta name="dcterms.modified" content="2025-02-01">
  </head>
</html>
```

Custom `<meta name="…">` fields require `custom_metadata=True` to land in the info dict. Via Python, set `document.metadata.title`, `.authors`, `.keywords`, `.attachments`, `.xmp_metadata` before `write_pdf`.

## PDF Forms

Two ways:
- Global: `write_pdf(..., pdf_forms=True)` or CLI `--pdf-forms`.
- Per-field: set `appearance: auto` on selected `input`/`select`/`textarea`/`button` (override the UA form style).

```html
<style>.field { appearance: auto } .field::before { visibility: hidden }</style>
<label>Editable <input class="field" value="dynamic"></label>
```

Form support varies by PDF reader — test in the target reader.

## Factur-X / ZUGFeRD (electronic invoices)

Based on PDF/A-3b. Provide two XML files (RDF metadata + Factur-X cross-industry invoice), then:

```bash
weasyprint invoice.html invoice.pdf \
  --attachment=factur-x.xml --attachment-relationship=Data \
  --xmp-metadata=rdf.xml --pdf-variant=pdf/a-3a
```

```python
from weasyprint import Attachment, HTML
from pathlib import Path
doc = HTML('invoice.html').render()
doc.metadata.attachments = [Attachment(string=Path('factur-x.xml').read_text(),
                                       name='factur-x.xml', relationship='Data')]
doc.metadata.xmp_metadata = [Path('rdf.xml').read_bytes()]
doc.write_pdf('invoice.pdf', pdf_variant='pdf/a-3b')
```

Adapt the XML content to the real invoice data — see `docs/common_use_cases.rst` for the full RDF + Factur-X XML templates.

## Image Caching (repeated renders)

```python
cache = {}
for i in range(10):
    HTML('doc.html').write_pdf(f'out-{i}.pdf', cache=cache)  # shared in-memory cache
# Or on disk:
HTML('doc.html').write_pdf('out.pdf', cache='/tmp/wpcache')
```

## Logging (library use)

Logs are silent by default when used as a library. Configure to see warnings:

```python
import logging
logging.getLogger('weasyprint').setLevel(logging.WARNING)
logging.getLogger('weasyprint').addHandler(logging.StreamHandler())
```

`weasyprint.progress` reports rendering progress.

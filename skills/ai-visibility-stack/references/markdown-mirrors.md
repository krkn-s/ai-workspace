# Markdown Mirrors

Use this reference when the task involves clean markdown versions of site pages for LLMs and agents.

## Purpose

Markdown mirrors give machines a low-noise version of a page that is easier to parse than production HTML with navigation, scripts, layout wrappers, widgets, and visual chrome.

Use mirrors for page-level detail. Use `llms.txt` as the directory that points to them.

## Source Of Truth Decision

Choose the first option that already solves the problem:

1. reuse existing public docs or markdown pages if they are already clean and authoritative
2. use markdown mirrors when production HTML is too noisy or hard to parse
3. do not add a new machine-readable layer if it would only duplicate content without improving machine readability

## When To Use Them

Use mirrors when:

- the production HTML is noisy or heavily componentized
- the site relies on client-side rendering
- the user wants pages to be easier to quote or summarize
- page-level content is more useful than a root summary alone

Skip them when:

- the project already publishes clean markdown or text versions
- the public pages are already simple, static, and easily parsed
- the site content is private, gated, or intentionally excluded from machine access
- the additional mirror layer would create duplicate public surfaces with no practical parsing benefit

## URL Strategy

Prefer a stable, predictable public pattern.

Default preference:

1. exact page URL plus `.md` when feasible and consistent with the host
2. sibling `index.md` or equivalent only when that is the most reliable deploy shape for the site

Do not change the public pattern casually once shipped. If mirrors exist, `llms.txt` should link to the exact deployed URLs rather than assuming a consumer will infer them.

Choose one public pattern and document it. Do not mix multiple mirror URL conventions on the same site unless there is an unavoidable legacy reason.

If a legacy mixed pattern already exists, preserve the live URLs and treat normalization as a migration project, not as cleanup during unrelated work.

## Mirror Content Standard

Each mirror should contain:

- the page title
- a short description if the site has one
- the canonical public URL
- the cleaned body content in readable markdown

The mirror should preserve meaning, hierarchy, and important links, but remove presentation noise.

## What To Remove

Remove or suppress:

- global nav and footer chrome
- scripts, styles, iframes, embeds, chat widgets, cookie walls
- repeated CTA rails and decorative blocks
- empty wrappers
- step-number ornaments or visual separators with no semantic meaning
- duplicate page fragments

Keep:

- headings
- body copy
- meaningful lists and tables
- internal links when they add navigation value
- disclaimers or constraints that affect interpretation

## Exclusions

Normally exclude:

- `404` pages
- thank-you pages
- confirmation screens
- search results
- faceted duplicates
- `noindex` pages
- authenticated or gated content

By default, do not mirror every page. Start with the minimum useful set:

- homepage
- primary service or product pages
- important proof, FAQ, or guide pages

Expand beyond that only when the site actually benefits from wider page-level machine-readable coverage.

## Serving Rules

Mirrors should be publicly fetchable as plain text or markdown without download friction.

The important behavior is:

- stable public URL
- fetchable without auth
- correct content type for inline reading
- same factual content as the source page

The skill should not hard-code host-specific config unless the project requires it.

If the user explicitly wants to limit answer-engine access, do not silently publish mirrors as a broad public surface. First decide whether mirrors should exist at all, and whether standard search crawling and AI crawling should be treated differently.

## Relationship To `llms.txt`

If mirrors exist, `llms.txt` should:

- mention that mirrors are the cleanest source when true
- link to the most valuable mirror URLs directly
- avoid listing low-value or near-duplicate mirrors

Do not assume every page needs to be listed in `llms.txt`.

## Validation Checklist

- mirror URL resolves publicly
- mirror content is meaningfully cleaner than the HTML page
- title, description, and canonical URL are preserved when available
- excluded page types are not surfaced accidentally
- `llms.txt` links point to real mirror URLs
- the chosen URL pattern is documented and consistent
- the mirror layer adds real parsing value rather than duplicate noise

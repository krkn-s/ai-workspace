# `llms.txt`

Use this reference when the task involves creating, reviewing, or correcting `/llms.txt`.

## Source Of Truth

Follow the official `llmstxt.org` structure first:

1. `#` H1 with the site or project name
2. Blockquote summary immediately below it
3. Optional non-heading prose or lists that explain how to use the file
4. One or more `##` sections containing markdown link lists
5. Optional `## Optional` section for lower-priority links

For business websites, the playbook's practical content is still useful, but it should be mapped into this structure rather than copied as custom headings like `About`, `Services and Pricing`, or `Locations`.

## What `llms.txt` Should Do

- Give LLMs a compact mental model of the business or product
- Point to the best detailed markdown pages
- Clarify how the site is organized and which sources are authoritative
- Surface high-signal files first, secondary files later

It is an index layer, not a full website export.

## Before You Write It

Check these first:

- whether the site already has a valid `llms.txt`
- whether clean markdown mirrors already exist
- whether the cleanest public source is a docs page, a markdown page, or a mirror
- whether any public pages should be intentionally excluded because they are private, duplicate, or unsuitable for citation

If an existing `llms.txt` is present, audit it before rewriting it:

- invalid structure
- broken or private links
- overstuffed link lists with no prioritization
- business facts that belong on linked pages instead of the root file

## Business-Site Content Model

The H1 and blockquote should quickly answer:

- who the business is
- what it does
- who it serves
- where it operates if geography matters
- what kind of pages the linked files cover

Optional prose below the blockquote can capture durable operating notes such as:

- whether pricing is indicative or custom
- whether locations are physical, regional, or remote
- whether mirrors are the cleanest source for page content
- whether some pages are intentionally omitted

## Recommended Section Patterns

Choose only the sections that materially help navigation:

- `## Core Pages`
- `## Services`
- `## Locations`
- `## Pricing And Policies`
- `## Case Studies` or `## Proof`
- `## Blog` or `## Guides`
- `## Optional`

Each section should be a markdown bullet list of links. Notes after the link should stay short and specific.

## What To Keep Inline Versus Linked

Keep inline:

- the one-paragraph business summary
- interpretation notes that help an agent decide where to look next
- short warnings about omitted, duplicated, or non-authoritative content

Link out:

- page-level service details
- FAQs
- pricing detail
- long-form guides
- case studies
- policy pages

If a fact changes frequently or belongs to a specific page, it usually belongs in a linked mirror rather than in the root `llms.txt`.

If the site already has clean public docs or markdown, prefer linking those authoritative pages over creating a second markdown surface only for symmetry.

## Authoring Rules

- Keep the top of the file compact.
- Put high-value, high-authority links first.
- Use the actual deployed public URLs.
- Do not include broken, private, gated, or `noindex` URLs.
- Do not stuff every page into the file if a smaller curated set is more useful.
- Do not turn `llms.txt` into a directory dump of the entire site.
- Use `## Optional` only for genuinely secondary material.

## Skeleton

```md
# Example Business

> Example Business provides managed payroll software for multi-location service companies in the US and Canada. Start with Core Pages for positioning and product basics, then use Guides and Policies for detail.

Use markdown mirrors when available because they strip navigation and UI chrome from the main site.

## Core Pages

- [Homepage](https://example.com/index.md): Positioning, ICP, and primary CTA.
- [About](https://example.com/about/index.md): Company background and operating model.

## Services

- [Implementation](https://example.com/services/implementation/index.md): Scope, onboarding, and deliverables.

## Guides

- [Multi-location payroll guide](https://example.com/guides/multi-location-payroll/index.md): Long-form educational content.

## Optional

- [Privacy policy](https://example.com/privacy/index.md)
```

The URLs above are examples only. Use the site's real deployed mirror pattern. Do not normalize everything to `index.md` if the production convention is different.

## Validation Checklist

- H1 exists and is unique
- blockquote summary sits directly under the H1
- all detailed sections use `##`
- every list item contains a real markdown link
- linked URLs are public and stable
- linked URLs match the site's actual deployed mirror or docs pattern
- the file helps an agent choose where to read next in one pass

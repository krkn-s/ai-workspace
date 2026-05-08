---
name: ai-visibility-stack
description: AI visibility workflow for business websites. Use when Codex needs to create, review, or preserve llms.txt, markdown mirrors, sitemap.xml, robots.txt, AI crawler access, Google Search Console handoff, or the invisible SEO and AI-readable structure that lets websites be discovered, parsed, and cited by search engines and answer engines.
---

# AI Visibility Stack

Use this skill for website work where the goal is not just to publish pages, but to make the site legible to crawlers, answer engines, and LLM-based agents.

This skill is instruction-only. Do not assume bundled tools, generators, or frameworks. Choose the repo-native implementation that fits the project.

## When To Use This Skill

Use it when the task is about any of these:

- creating or fixing `/llms.txt`
- adding or reviewing markdown mirrors or other clean machine-readable page versions
- creating or correcting `sitemap.xml` or `robots.txt`
- preserving AI-readable and crawler-readable infrastructure during a rebuild or redesign
- auditing whether a business site is easy for search engines and answer engines to discover and parse

Do not use it as the primary skill when:

- the task is purely visual design with no discoverability or crawl concerns
- the project already publishes canonical docs or markdown that fully solves the machine-readable layer
- the user explicitly wants to block answer-engine access rather than improve it

## Task Matrix

Use this routing table before loading references:

| Task Type | Load First | Expected Output |
|---|---|---|
| AI visibility audit | `references/templates.md` and `references/crawl-signals.md` | Current-state audit, gaps, priority fixes, preservation notes |
| New `/llms.txt` | `references/llms-txt.md` | A spec-aligned `llms.txt` draft or correction plan |
| Mirror strategy | `references/markdown-mirrors.md` | Mirror decision, page set, URL pattern, exclusions, validation steps |
| Crawl signal work | `references/crawl-signals.md` | `sitemap.xml` / `robots.txt` guidance plus operator handoff |
| Redesign or rebuild preservation | `references/site-guardrails.md` | Keep/replace/remove matrix for invisible infrastructure |
| Limited AI exposure policy | `references/crawl-signals.md` and `references/templates.md` | Explicit crawl policy separating search and AI agents |

## Reference Loading

Load only the reference that matches the task:

- Read `references/llms-txt.md` for `/llms.txt` structure, content rules, and business-site adaptation.
- Read `references/markdown-mirrors.md` for markdown mirror strategy, URL patterns, exclusions, and validation.
- Read `references/crawl-signals.md` for `sitemap.xml`, `robots.txt`, AI crawler access, and Google Search Console handoff.
- Read `references/site-guardrails.md` when building, redesigning, or expanding a website without breaking invisible SEO and AI visibility infrastructure.
- Read `references/templates.md` when you need reusable planning or instruction templates for the conversation.

Do not load every reference by default. Keep context narrow.

## Core Workflow

1. Inspect the current site shape first: routes, page types, existing metadata, schema, crawl files, public URL patterns, and whether AI-readable files already exist.
2. Triage the situation before changing anything:
   - if the site already has clean public markdown or docs, prefer indexing that instead of creating duplicate mirrors
   - if the site contains private, gated, or regulated content, define what must stay out of machine-readable surfaces
   - if the task is a redesign, identify the invisible files and behaviors that must survive the change
3. Decide which layer is actually needed:
   - `llms.txt` only
   - markdown mirrors only
   - sitemap / robots only
   - a full stack audit or preservation pass
4. Treat `llms.txt` as the top-level index for LLMs, not as a dump of every business fact or every page URL.
5. Use markdown mirrors only where page-level detail is easier to quote and parse than production HTML.
6. Keep traditional crawl signals healthy too: `sitemap.xml`, `robots.txt`, canonical URLs, internal linking, and indexable page structure still matter.
7. When changing design or site architecture, preserve invisible infrastructure unless the user explicitly wants it replaced.
8. Finish with a validation pass and call out any manual operator steps, especially DNS verification or Google Search Console setup.

## Decision Order

Apply this order to avoid unnecessary work:

1. Reuse existing clean public content if it already serves as the machine-readable source of truth.
2. Add or fix `llms.txt` so there is a compact top-level index.
3. Add mirrors only for pages where HTML is noisy, JS-heavy, or structurally hard to parse.
4. Confirm `sitemap.xml` and `robots.txt` align with the pages you actually want discovered.
5. During rebuilds, preserve existing invisible infrastructure before expanding it.

## Stop-And-Ask Checkpoints

Pause and confirm with the user before doing any of these:

- replacing an existing docs or markdown source of truth with a new mirror layer
- changing a public mirror URL pattern that may already be referenced externally
- shifting from normal search visibility to selective AI crawler blocking or allowance
- removing or rewriting existing `llms.txt`, `robots.txt`, or `sitemap.xml` instead of correcting them
- dropping machine-readable files during a redesign because the visible site changed

If none of these apply, proceed with the conservative option that preserves current discoverability.

## Default Rules

- Prefer the official `llms.txt` format from `llmstxt.org` over ad hoc business-file formats.
- Adapt the playbook's useful business content into that format instead of copying its section structure verbatim.
- Prefer durable, stable public URLs for markdown mirrors. If original-URL-plus-`.md` routing is feasible and clean, prefer it. If the site architecture naturally uses sibling `index.md` files, that is acceptable only when the deployed URLs are stable, public, and explicitly referenced from `llms.txt`.
- Skip `404`, thank-you, gated, duplicate, and `noindex` pages unless the user explicitly wants them surfaced.
- If the user wants limited AI exposure, separate that policy decision from general crawl hygiene and preserve standard search indexing where appropriate.
- Avoid invented claims, inflated SEO promises, and page farms with thin near-duplicate content.
- Preserve or improve accessibility, mobile readability, and page speed. AI visibility should not come at the cost of a broken human site.

## Failure Modes

Handle these explicitly instead of improvising:

- Existing docs already solve the machine-readable layer:
  Reuse them and only add `llms.txt` or crawl fixes if still needed.
- Private, gated, or regulated content is mixed with public content:
  define the allowed public surface before proposing mirrors or index files.
- Legacy mixed mirror conventions already exist:
  document the live pattern and avoid renaming unless the user accepts a migration.
- The site has visibility goals but weak page quality:
  do not compensate with crawler files alone; call out the content or architecture gap.

## Output Rules

- Be explicit about what exists now, what should be added, and what should be preserved.
- Prefer concrete structures, checklists, and implementation guidance over hype.
- Separate machine-readable infrastructure from marketing copy.
- If the task includes a redesign or rebuild, state which invisible files or behaviors must not regress.
- If Search Console or DNS work is required, prepare the user-facing steps instead of pretending those actions can be completed automatically.
- End with a short validation checklist covering `llms.txt`, mirrors when applicable, crawl signals, and any manual operator steps.

## Output Contracts

Match the response shape to the task:

- Audit:
  return current state, gaps, top fixes, and preservation risks.
- `llms.txt` task:
  return either a draft file or a correction list against the spec.
- Mirror task:
  return keep/reuse/create decision, URL pattern, exclusions, and validation steps.
- Crawl task:
  return file-level changes plus any manual operator actions.
- Redesign preservation task:
  return keep/replace/remove guidance for every invisible infrastructure layer.

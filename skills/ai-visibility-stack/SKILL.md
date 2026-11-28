---
name: ai-visibility-stack
description: "Make a site machine-readable for search crawlers and AI agents: sitemap.xml, robots.txt, AI crawler policy, Content-Signal, llms.txt, markdown for agents, semantic HTML. Use for site audits, redesigns that must keep crawl access, or agents that cannot parse or act on a site."
---

# AI Visibility Stack

Use this skill for the infrastructure layer of search and agent visibility: what crawlers and agents can fetch, parse, and act on before and around any content decision.

This skill is instruction-only. Do not assume bundled tools, generators, or frameworks. Choose the repo-native implementation that fits the project.

## What These Files Do, And Do Not Do

State this honestly in every output, because the market overstates it:

- Retrieval dominates citations. Whether an engine's own search returns a page explains the largest single share of citation variance (32% in one 158,099-answer study) while all on-page features together explained 2.8%. Crawlability is therefore the highest-value work in this skill.
- `llms.txt` and markdown copies of pages have no measured effect on AI search citations. 28% of monitored domains publish an `llms.txt`, and 97% of those files receive zero requests. Google states that Search ignores them.
- They still have a real audience: coding agents and documentation tooling. Claude Code fetches `llms.txt` and requests `Accept: text/markdown` more than any AI retrieval bot does.
- Structured data does not earn AI citations. Keep it for rich results and clarity.
- Crawl directives are not a hard wall either. Some cited pages disallow the crawler that cited them. Treat `robots.txt` as a signal and a policy statement, not a guarantee.

So: publish these files when they serve an agent, a reader, or a policy. Never sell them as a citation tactic.

## When To Use This Skill

Use it when the task is about any of these:

- creating or fixing `/llms.txt`
- adding, reviewing, or fixing `sitemap.xml` or `robots.txt`
- defining which AI crawlers may train, retrieve, or act on the site
- serving markdown or text versions for agents that ask for them
- checking that pages render and parse without JavaScript
- preparing a site for browser agents and other automated visitors
- auditing whether a business site is discoverable and machine-readable
- preserving this infrastructure during a rebuild or redesign

Do not use it as the primary skill when:

- the task is content strategy, SEO or GEO briefs, article outlines, content audits, editorial plans, or citation measurement, so use `seo-aeo-content` instead. Its `geo-ai-search-2026` reference holds the citation evidence.
- the task is purely visual design with no discoverability or crawl concerns
- the project already publishes canonical docs or markdown that fully solves the machine-readable layer
- the user explicitly wants to block answer-engine access rather than improve it

## Task Matrix

Use this routing list before loading references:

- **AI visibility audit**
  - **Load first**: `references/templates.md` and `references/crawl-signals.md`
  - **Expected output**: Current-state audit, gaps, priority fixes, preservation notes, honest expectation setting
- **Crawl signal work**
  - **Load first**: `references/crawl-signals.md`
  - **Expected output**: `sitemap.xml` / `robots.txt` guidance, crawler policy, Search Console handoff
- **AI crawler policy**
  - **Load first**: `references/crawl-signals.md`
  - **Expected output**: Explicit policy per use case (search, ai-input, ai-train), affected files, tradeoffs
- **New or broken `/llms.txt`**
  - **Load first**: `references/llms-txt.md`
  - **Expected output**: A spec-aligned `llms.txt` draft or correction list, with its real audience named
- **Markdown for agents**
  - **Load first**: `references/markdown-mirrors.md`
  - **Expected output**: Mirror decision, delivery mechanism, page set, exclusions, validation steps
- **Agent readability**
  - **Load first**: `references/site-guardrails.md`
  - **Expected output**: Semantic HTML, accessibility-tree, layout-stability, and agent-protocol fixes
- **Redesign or rebuild preservation**
  - **Load first**: `references/site-guardrails.md`
  - **Expected output**: Keep/replace/remove matrix for invisible infrastructure

## Reference Loading

Load only the reference that matches the task:

- Read `references/crawl-signals.md` for `sitemap.xml`, `robots.txt`, AI crawler policy, `Content-Signal`, and Google Search Console handoff.
- Read `references/llms-txt.md` for `/llms.txt` structure, content rules, business-site adaptation, and its measured value.
- Read `references/markdown-mirrors.md` for markdown delivery, content negotiation, URL patterns, exclusions, and validation.
- Read `references/site-guardrails.md` when building, redesigning, or expanding a website without breaking crawl access or agent readability.
- Read `references/templates.md` when you need reusable planning or instruction templates for the conversation.

Do not load every reference by default. Keep context narrow.

## Core Workflow

1. Inspect the current site shape first: routes, page types, rendering strategy, existing metadata, schema, crawl files, public URL patterns, and whether machine-readable files already exist.
2. Check retrieval before anything else: are key pages server-rendered or otherwise renderable, linked, canonical, and indexable. A page that needs JavaScript for its main text loses citations.
3. Triage the policy question:
   - if the site already has clean public markdown or docs, prefer indexing that instead of creating duplicate mirrors
   - if the site contains private, gated, or regulated content, define what must stay out of machine-readable surfaces
   - if the site wants a narrower AI exposure policy, write it explicitly per use case instead of half-blocking by accident
4. Choose the layers that are actually needed:
   - crawl signals and indexability
   - AI crawler policy
   - agent readability
   - `llms.txt` and markdown, only when an agent or a reader will use them
5. Treat `llms.txt` as a compact index for agents, not as a dump of every business fact or every page URL.
6. Use markdown delivery where an agent asks for it or where documentation is read by coding tools. Prefer content negotiation over a second public surface when the platform supports it.
7. When changing design or site architecture, preserve invisible infrastructure unless the user explicitly wants it replaced.
8. Finish with a validation pass, an honest statement of expected effect, and any manual operator steps, especially DNS verification or Search Console setup.

## Decision Order

Apply this order to avoid unnecessary work:

1. Confirm the pages are renderable, crawlable, canonical, and indexable.
2. Confirm `sitemap.xml` and `robots.txt` match the pages that should be discovered.
3. Make the AI crawler policy explicit if the user cares about training, retrieval, or agent use.
4. Fix agent readability: semantic HTML, real buttons and links, labels tied to inputs, stable layout, no invisible overlays.
5. Reuse existing clean public content if it already serves as the machine-readable source of truth.
6. Add or fix `llms.txt` when agents need a compact top-level index.
7. Add markdown delivery only for pages where an agent or a coding tool actually benefits.
8. During rebuilds, preserve existing invisible infrastructure before expanding it.

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
- Adapt the useful business content pattern into that format instead of copying a section structure verbatim.
- Prefer server-rendered or statically rendered content for anything a crawler must read.
- Use semantic HTML with real interactive elements: agents read the accessibility tree and the DOM, not your CSS.
- Prefer content negotiation or a declared alternate link over serving different content by user agent.
- Prefer durable, stable public URLs. If original-URL-plus-`.md` routing is feasible and clean, prefer it. Sibling `index.md` files are acceptable only when the deployed URLs are stable, public, and explicitly referenced from `llms.txt`.
- Skip `404`, thank-you, gated, duplicate, and `noindex` pages unless the user explicitly wants them surfaced.
- If the user wants limited AI exposure, separate that policy decision from general crawl hygiene and preserve standard search indexing where appropriate.
- Avoid invented claims, inflated SEO promises, and page farms with thin near-duplicate content.
- Preserve or improve accessibility, mobile readability, and page speed. Agent readability and human accessibility are the same work.

## Failure Modes

Handle these explicitly instead of improvising:

- The user expects `llms.txt` or markdown to earn AI citations:
  say plainly that no measured effect exists, name the audience these files do serve, and redirect the effort to retrieval, page-question match, and third-party mentions.
- The main content requires JavaScript:
  fix rendering before touching any crawl file.
- Existing docs already solve the machine-readable layer:
  reuse them and only add `llms.txt` or crawl fixes if still needed.
- Private, gated, or regulated content is mixed with public content:
  define the allowed public surface before proposing mirrors or index files.
- Legacy mixed mirror conventions already exist:
  document the live pattern and avoid renaming unless the user accepts a migration.
- The site has visibility goals but weak page quality:
  do not compensate with crawler files alone. Call out the content or architecture gap.
- A crawler policy and the business intent disagree:
  surface the conflict and make the user choose per use case.

## Output Rules

- Be explicit about what exists now, what should be added, and what should be preserved.
- State the expected effect of each file honestly, including when that effect is "no measurable citation gain".
- Prefer concrete structures, checklists, and implementation guidance over hype.
- Separate machine-readable infrastructure from marketing copy.
- If the task includes a redesign or rebuild, state which invisible files or behaviors must not regress.
- If Search Console or DNS work is required, prepare the user-facing steps instead of pretending those actions can be completed automatically.
- End with a short validation checklist covering rendering, crawl signals, agent readability, `llms.txt` and markdown when applicable, and any manual operator steps.

## Output Contracts

Match the response shape to the task:

- Audit:
  return current state, gaps, top fixes ordered by retrieval impact, preservation risks, and what will not help.
- `llms.txt` task:
  return either a draft file or a correction list against the spec, plus who will actually read it.
- Markdown task:
  return the delivery decision, page set, URL or negotiation pattern, exclusions, and validation steps.
- Crawl task:
  return file-level changes plus any manual operator actions.
- AI crawler policy task:
  return the policy per use case, the files touched, and the tradeoffs.
- Redesign preservation task:
  return keep/replace/remove guidance for every invisible infrastructure layer.

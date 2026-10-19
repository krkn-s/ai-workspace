---
description: "Create, convert, or maintain a minimal BRAND.md brand-identity card: pure Markdown, no frontmatter, one intro line (brand, tagline, date, status), five sections (Positioning, Voice with a Forbidden list, Look, Facts, Journal with date-only entries). Converts an existing full BRAND.md to the minimal card after confirmation. Use when the user asks for a brand card, brand book, charte de marque, or brand identity source of truth, or to compress/convert an existing BRAND.md."
argument-hint: "[brand notes | path to existing BRAND.md]"
---

# Minimal BRAND.md

Produce a minimal brand-identity card: pure Markdown, machine-friendly by heading, no YAML frontmatter.

## The card format

Five sections, nothing else. Target ~40 lines.

```
# <Brand> — BRAND.md

<Brand> — « <tagline> ». <YYYY-MM-DD> · <status: draft|settled>. What is missing = `Open question`; never invent a proof, number, or testimonial.

## Positioning
For <target> who <need>, <brand> is a <category> that <benefit>.
(1-3 audience bullets when they change the wording)

## Voice
<One sentence of actual voice rationale a human reads>
- **<Adjective>** — <behavioral definition>
(2-4 adjectives max)
Forbidden:
- <term> → <what to say instead>
(2-4 entries, always including: no invented statistics, reviews, or testimonials, ever)

## Look
- **<Color>** — `<hex>` — <role>
(4-6 colors, hex extractable per line)
<One line typography: face for display + face for details>
<One line photography direction>

## Facts (use as-is, never complete them)
address, hours, phone, email, socials, real offers with real prices — one per line

## Journal
- <YYYY-MM-DD> — <one-line what changed and why>
```

Rules:

- **Capture, don't invent.** Only decided facts go in. Anything undecided stays `Open question` on its own line — never plausible filler.
- **No frontmatter, no version numbers.** The intro line's date and the Journal are the only freshness markers.
- **No tables.** Lists only (compact rule). H2/H3 only.
- **Facts are copied verbatim.** Never complete, correct, or beautify a contact line.
- **Forbidden list is the highest-yield section.** Push the user: what will agents wrongly write about this brand?

## Behaviors

| Invocation | Do |
|---|---|
| `/brand-md <notes>` | Build the card from what was decided in the notes or the conversation; ask at most one batch of questions if a load-bearing fact (audience, offer, contact) is missing; deliver, list `Open question`s, suggest the AGENTS.md pointer. |
| `/brand-md <path to a full BRAND.md>` | **Confirm first**: "Found an existing BRAND.md — compress it to the minimal card?" After yes: keep every decided fact and Open question, drop personas detail, long stories, governance/legal/asset sections into the Journal line as "deferred", keep the same date if available, bump nothing (no versions). After no: stop. |
| `/brand-md` (fresh) | Ask the batch: subject? audience? one action? voice in 3 words? palette or free? contact facts? Then build. |

## Agent consumption (tell the user)

When the card lands in a project: agents read it before writing copy for that brand, respect the Forbidden list literally, copy Facts verbatim, and never invent proofs. A pointer line in the project's `AGENTS.md` is how this happens without prompting — propose adding:

```
# Brand
Read BRAND.md at the project root before writing any public copy. Facts are verbatim; the Forbidden list is binding.
```

## Quality bar

- Cold-agent test: what would a brand-new agent still ask after reading the card alone? Those are the real gaps — surfaced at the end, honestly, not patched with invention.
- The card is a floor, not a ceiling: when a client becomes multi-channel (team, sub-brands, legal marks), the card grows by section, and the Journal dates each addition.
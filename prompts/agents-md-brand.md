---
description: "Create, convert, or maintain a brand-identity section inside a project's AGENTS.md: a minimal '## Brand' block (intro line, Positioning, Voice with a Forbidden list, Look, Facts), pure Markdown, no versions. When a standalone BRAND.md exists, convert it into this section (after explicit confirmation) and delete the source file. Use when the user asks for a brand card, brand book, brand identity source of truth, or to compress/convert an existing BRAND.md."
argument-hint: "[brand notes | path to existing BRAND.md]"
---

# Brand section in AGENTS.md

Request:
<user_input>

$@

</user_input>

You own exactly one section of the project's AGENTS.md: `## Brand`. Read the whole file first, report what exists, touch only your section: every other byte stays identical. Appends land after existing content. Collisions surface to the user, never absorbed. The brand lives inside AGENTS.md; never create a standalone BRAND.md.

## Section format

Placeholders only below; every rule that governs them is in the Rules list, never in the section itself.

```markdown
## Brand

<Brand>: « <tagline> ». Updated <YYYY-MM-DD> · status: <draft|settled>. Open questions are gaps, not license to invent.

### Positioning
For <target> who <need>, <brand> is a <category> that <benefit>.

### Voice
<One sentence of voice rationale>
- **<Adjective>**: <behavioral definition>
Forbidden:
- <term> → <what to say instead>

### Look
- **<Color>** `<hex>` (<role>)
<One line typography: display face + detail face>
<One line photography direction>

### Facts (use as-is, never complete them)
<address, hours, phone, email, socials, real offers with real prices, one per line>

Brand section updated <YYYY-MM-DD> (<one-line change summary>).
```

## Rules

- **Hard ceiling: 40 lines total, target 30.** Over the ceiling, cut content (less decided material, fewer adjectives or colors), never compress style or drop a structure line.
- Quotas: 1-3 positioning bullets only when they change the wording; 2-4 voice adjectives; 2-4 forbidden entries; 4-6 colors.
- The Forbidden list always includes: no invented statistics, reviews, or testimonials, ever.
- **Capture, don't invent.** Only decided facts go in; anything undecided is an `Open question` line, never plausible filler. Facts are copied verbatim.
- Dates are the only freshness markers; no version numbers. Lists only, no tables.
- Push the user on the Forbidden list: what would agents wrongly write about this brand?
- End every write by listing remaining `Open question`s, then run the cold-agent test: what would a fresh agent still ask? Surface that list.

## Behaviors

- `/agents-md-brand <notes>`: compose from what is decided; if a load-bearing fact (audience, offer, contact) is missing, ask one batch of questions, then write. Insert or replace only the `## Brand` section, after showing placement; no AGENTS.md means create a minimal one holding the section.
- `/agents-md-brand <path to BRAND.md>`: two confirmations first: (1) convert into a `## Brand` section in AGENTS.md? (2) delete the source file afterward? (destructive; a no stops the flow). Keep every decided fact and `Open question`; compress personas, long stories, governance/legal/asset content into the update line as `dropped: <what>`; copy the freshest date.
- `/agents-md-brand` with the section already present: audit first, never rewrite from guesswork.

## Audit mode

1. **Observe**: read the section, then the whole repo for contradicting or confirming evidence (README, docs, commits, package.json, live site if a URL is known); spot `Open question`s the repo has since answered.
2. **Classify** each fact: *Verified* (say so, move on), *Drifted* (show section value vs observed value and where), *Stale* (Open question answered or forbidden term now in content; cite files and lines), *Unverifiable* (brand feel: hand to user as questions, never decide).
3. **Propose** extras beyond drift, each = what + evidence + one-line why.
4. Present drifts and proposals as one compact batch; apply only what is confirmed; rewrite only the section; update the trailing date line.

No finding without evidence (file, URL, commit) or explicit user statement. Drifts never silently overwrite. Unverifiable claims stay verbatim.

## Tell the user

Agents read AGENTS.md in every session, so the section applies to all brand-adjacent output automatically. `Open question`s are honest gaps, not tasks to fill by invention. The section is a floor, not a ceiling: multi-channel needs (team, sub-brands, legal marks) grow it by subsection, within the 40-line ceiling.
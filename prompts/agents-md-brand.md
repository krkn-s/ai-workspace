---
description: "Create, convert, or maintain the project's `## Brand` section in AGENTS.md: a minimal brand block (positioning, voice with a Forbidden list, look, identity). Converts a standalone BRAND.md after confirmation, audits an existing section against the repo, never invents a fact."
argument-hint: "[brand notes | path to BRAND.md]"
---

# Brand section in AGENTS.md

Request:
<user_input>

$@

</user_input>

You own exactly one section of the project's AGENTS.md: `## Brand`. Read the whole file first and report what exists. Touch only your section: every other byte stays identical, appends land after existing content, collisions surface to the user instead of being absorbed. Never create a standalone BRAND.md.

Test every line: **does removing it change what an agent writes about this brand?** If not, delete it. Write only decided facts; anything undecided becomes an `Open question` line, never plausible filler. Push on the Forbidden list: ask what agents would get wrong about this brand, and name it there.

## Section

```markdown
## Brand

<Brand>: « <tagline> ».
<Legal name> · <address> · <contact>

### Positioning
- <who it is for, and the need it answers>
- <what it is, in the brand's own words>
- <the benefit that matters>

### Voice
<One sentence of voice rationale>
Register: <fr-FR>, <tu|vous>, <one precision>
- **<Adjective>**: <behavioral definition>
Forbidden:
- <term> → <what to say instead>
- <claim never to make: unproven superlative, health or result promise>

### Look
- **<Color>** `<hex>` (<role>)
<Display face + detail face, one line>
```

## Modes

- `<notes>`: compose from what is decided; one batch of questions only if a load-bearing fact is missing (audience, offer, contact), then write.
- `<path to BRAND.md>`: confirm twice before touching anything, first the conversion into the section, then the deletion of the source (a no stops the flow).
- When converting: keep every decided fact and open question; compress personas, stories, and legal or asset content into a `dropped: <what>` line so nothing vanishes silently.
- section already present: audit before writing. Read the repo for evidence (README, docs, commits, live site). Classify each fact **Verified** (say so, move on), **Drifted** (current vs observed value, and where), **Stale** (open question now answered, or forbidden term now in use; cite file and line), **Unverifiable** (brand feel: hand it back as a question, never decide). No finding without evidence or explicit user statement.

## Apply

One compact batch of findings and proposals, apply only what is confirmed, rewrite only the section, then show `git diff --stat`. Never commit.

Close by listing the remaining `Open question`s: what would a fresh agent still ask?

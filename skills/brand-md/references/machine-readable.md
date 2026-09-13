# Machine-Readable BRAND.md

Rules for making a `BRAND.md` consumable by agents and other prompts without warping it into a system prompt. The skeleton in `structure.md` already carries the machine layer; this file defines how it behaves and how it is consumed.

## Prose for humans, facts for agents

A file written only for humans forces every agent to re-interpret prose and hallucinate when no stable answer exists. A file written only for agents is a system prompt no human maintains. Keep both in the same section, visibly separated:

```markdown
## 3. Verbal identity

We sound like a calm, precise mechanic: confident about the craft, never
condescending about the customer's lack of expertise.

### Voice
- **Precise** — we name the specific thing, not a vague category
### Forbidden lexicon
- **solution** — overused; describe what the product does instead
```

The opening paragraph is the rationale a designer reads; the `###` lists are the facts an agent consumes. Neither replaces the other.

- Never bury a fact in prose ("we lean into a confident red, around `#E63946`") — it belongs in the palette table.
- Never state a rule only in prose — if "we never say solution", it goes in the forbidden list.
- Never duplicate a fact in two wordings — agents will treat both as authoritative.

## Stable section anchors

Agents find content by header. Keep the numbered section names from `structure.md` verbatim:

- One concept per header; do not bury two palettes under one heading.
- Never rename a header between versions unless deliberately migrating — and log it in the evolution journal.
- Declarative names only. A question header ("What is our voice?") reads as an open issue to an agent.

## Extractable rule lists

Rules are the fields agents consume most. Predictable shape: **term** — reason, with the alternative when relevant. The reason lets an agent explain a substitution instead of silently editing.

```markdown
### Forbidden lexicon
- **cheap** — reads as low quality; use "accessible" instead
- **[CompetitorName]** — trademark; never use for our category
```

Same pattern for voice adjectives (adjective → behavioral definition), logo misuses (misuse → why refused), tone by channel (channel → allowed shift), forbidden usages (misuse → reason). Keep each list short — a 30-item forbidden lexicon will not be respected by an agent; prioritize the terms that actually cause drift.

## How downstream prompts consume the file

1. Read the frontmatter first: identity facts, palette, classes, `version`, `status`.
2. Jump to the named section for the task — voice for copy, palette for assets, governance for approvals, journal for "why is it like this".
3. Respect forbidden lists literally. If deviation is unavoidable, surface it to the user with the reason from the list — never silently substitute.
4. Never trust a file whose `status` is not `canonical` for production output; treat `draft` as advisory and say so.

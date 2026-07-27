# Machine-Readable BRAND.md

How to make a `BRAND.md` consumable by LLM-based agents and other prompts, without warping the whole file into a system prompt. This is what separates a BRAND.md from a PDF charte graphique by another name.

## Table of Contents

1. Why dual-audience matters
2. The frontmatter block
3. Stable section anchors
4. Extractable rule lists
5. Prose vs data boundary
6. How other prompts should consume it

---

## 1. Why dual-audience matters

A `BRAND.md` has two readers:

- **Humans** read the rationale, the founding story, the tone explanations. They want prose and context.
- **Agents and other prompts** need extractable facts: the HEX codes, the forbidden terms, the legal classes, the current tagline, the voice adjectives. They want stable, greppable, predictable structure.

A file written only for humans forces every agent to re-read and re-interpret the whole document each time, and to hallucinate when it cannot find a stable answer. A file written only for agents becomes a system prompt that no human wants to maintain. The skill produces a file that serves both, by keeping prose for humans and adding a thin, predictable machine layer.

The goal is not to maximize the machine layer. It is to make the facts that agents actually need cheap to find and hard to misread.

## 2. The frontmatter block

Put a YAML frontmatter block at the very top of the file. It is the single place an agent can look for the core identity facts without parsing the body. Keep it to fields that are genuinely shared, stable, and commonly consumed.

```yaml
---
brand: Acme
legal_name: Acme SAS
tagline: The road, reimagined.
primary_palette:
  - name: Acme Red
    hex: "#E63946"
  - name: Ink
    hex: "#1D1D1D"
typography:
  primary: Söhne
  web_fallback: Inter
nice_classes: [12, 35, 42]
version: 1.3.0
last_updated: 2025-11-12
status: canonical
---
```

Rules for the frontmatter:

- Include only fields that are decided and stable. If a field is undecided, omit it; do not put `null` or a guess.
- Use scalar values, short lists, or one level of nesting. Deep nested structures defeat the "cheap to grep" goal.
- `version`, `last_updated`, and `status` are mandatory: they let other prompts detect staleness and avoid trusting a draft.
- Keep the palette as a list of objects so the order is meaningful and the hex is always in the same place.
- Avoid colons inside unquoted values; YAML breaks on `key: value: extra`.

The frontmatter is not the whole brand. It is the fast-path index. The body still carries the rationale.

## 3. Stable section anchors

Agents and other prompts find content by header. Keep section titles predictable across versions and across companies, so a prompt that says "read the Verbal identity section of BRAND.md" works regardless of who wrote the file.

Use the section names from `references/structure.md` verbatim as headers:

- `## 1. Strategic foundations`
- `## 3. Verbal identity`
- `## 4. Visual identity`
- `## 7. Legal`
- `## 10. Evolution journal`

The leading number makes anchors unique and stable even if a section is renamed, and lets a prompt jump by number ("section 3") or by name.

Rules:

- One concept per header. Do not bury two palettes under one heading.
- Do not rename headers between versions unless you are deliberately migrating, and if you do, log it in the evolution journal.
- Avoid headers that are questions ("What is our voice?"). Use declarative names. Questions read as open issues to an agent.

## 4. Extractable rule lists

The fields agents consume most are rules: do this, never do that. Encode them as lists with a predictable shape, so a prompt can grep `Forbidden` or parse every line under a `### Forbidden lexicon` header.

Favor this shape:

```markdown
### Forbidden lexicon
- **cheap** — reads as low quality; use "accessible" instead
- **solution** — overused; describe what the product does instead
- **[CompetitorName]** — trademark; never use to describe our category
```

Each entry: the term in bold, an em dash, a one-line reason (and alternative when relevant). The reason matters: it lets an agent explain a substitution to the user instead of silently editing.

Apply the same pattern to:

- Voice adjectives (adjective → behavioral definition)
- Logo misuses (specific misuse → why it is refused)
- Tone variations by channel (channel → allowed tone shift)
- Forbidden brand usages (misuse → reason)

Keep each list short. A 30-item forbidden lexicon will not be respected by an agent that cannot hold it in working memory. Prioritize the terms that actually cause drift.

## 5. Prose vs data boundary

Keep human prose and machine-parsable data visibly separate within a section, so a reader knows where to look and an agent knows what to trust.

A good section pattern:

```markdown
## 3. Verbal identity

We sound like a calm, precise mechanic: confident about the craft, never
condescending about the customer's lack of expertise. We explain trade-offs
instead of hiding them.

### Voice
- **Precise** — we name the specific thing, not a vague category
- **Warm** — we assume the reader is competent, not helpless
- **Plain** — one idea per sentence, no stacked clauses

### Forbidden lexicon
- **solution** — overused; describe what the product does instead
```

The opening paragraph is the rationale a designer or new hire reads. The `### Voice` and `### Forbidden lexicon` lists are the facts an agent consumes. Both live in the same section; neither replaces the other.

Avoid:

- burying a HEX code inside a paragraph ("we lean into a confident red, somewhere around `#E63946`") — put it in the palette table instead
- stating a rule only in prose ("we never use the word solution") without also listing it under the relevant forbidden list
- duplicating facts in two places with slightly different wording; an agent will treat both as authoritative and get confused

## 6. How other prompts should consume it

When this file feeds another agent or prompt template, recommend a predictable consumption pattern:

1. Read the frontmatter first for identity facts, palette, classes, version, and staleness.
2. Jump to the named section for the task: voice rules for copy tasks, palette and typography for asset tasks, governance for approval questions, evolution journal for "why is it like this" questions.
3. Respect the forbidden lists literally. If an agent must deviate, surface the deviation to the user with the reason from the list, rather than silently substituting.
4. Never trust a file whose `status` is not `canonical` for production output. Treat `draft` and `proposed` as advisory and say so.

Documenting this consumption pattern inside the BRAND.md (a short `## How to use this file` note near the top) helps every downstream agent behave consistently without each prompt reinventing the rules.

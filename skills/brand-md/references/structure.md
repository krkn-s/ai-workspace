# BRAND.md Structure

The canonical section model, the phase scoping table, and the skeleton template — machine layer included. This is the backbone of the file itself.

## The section model

Ten areas. Sections 1-4 are the operational core that humans and agents consume daily; 5-10 scale with the company. Fields are extractable by design: when a value can be machine-parsed (a code, a class, a rule), it lives on its own line, in a list, or in a table.

1. **Strategic foundations** — purpose, mission, vision (one sentence each); 3-5 values, each with a one-line operational meaning, not an adjective; short factual founding story.
2. **Market and audience** — primary and secondary targets; 2-3 personas (role, goal, friction — not demographics alone); named competitors with one-line differentiation; a defensible UVP; a positioning statement ("for [target] who [need], [brand] is [category] that [benefit]").
3. **Verbal identity** — 3-5 voice adjectives, each defined behaviorally; tone variations by channel; 3-5 key messages; taglines current and retired with dates; preferred and forbidden lexicon (term — reason — alternative).
4. **Visual identity** — logo variants, clear-space rule, minimum size, misuses; palette table (name, HEX, RGB, CMYK, PMS); typography with web fallbacks; iconography style; photography direction.
5. **Asset kit** — logo file inventory (variant, format, location), social/presentation/email templates, access rules.
6. **Brand governance** — approval matrix (decision → owner → reviewers), new-asset process, licensing terms, forbidden usages.
7. **Legal** — registered marks (jurisdiction, number, status), Nice classes, watch and enforcement, international coverage. Human-action items: never fabricate registration data.
8. **Culture and people** — internal values if distinct, employer value proposition, onboarding touchpoints, internal vs external tone.
9. **Extensions** — brand architecture type (monolithic, endorsed, house of brands), sub-brand naming convention, co-branding and endorsement rules.
10. **Evolution journal** — version, date, one-line change summary, rationale paragraph, author.

## Phase scoping

Scope the file to the company's phase; let the user override. `core` = include; `opt` = include when material exists; `defer` = leave out (an honest `Open question` beats plausible filler).

| # | Section | Pre-revenue / solo | Early (first hires, customers) | Growth / scale-up | Diversified / multi-brand |
|---|---|---|---|---|---|
| 1 | Strategic foundations | core | core | core | core |
| 2 | Market and audience | positioning only | core | core | core |
| 3 | Verbal identity | core | core | core | core |
| 4 | Visual identity | core (partial ok) | core | core | core |
| 5 | Asset kit | defer | opt | core | core |
| 6 | Governance | defer | light | core | core |
| 7 | Legal | defer (flag human-action) | opt (as filed) | core | core |
| 8 | Culture and people | defer | core | core | core |
| 9 | Extensions | defer | defer | opt (if diversifying) | core |
| 10 | Evolution journal | core | core | core | core |

The failure mode at scale-up is multi-channel inconsistency: governance and legal become non-optional. In a diversified group, the journal and governance are load-bearing — they prevent drift across business units and agencies.

## The canonical skeleton

Copy verbatim; the machine layer (frontmatter, numbered anchors, extractable lists) is built in. Populate only decided fields; keep open questions visible.

```markdown
---
brand: [Brand name]
legal_name: [Legal entity name]
tagline: [Current tagline]
primary_palette:
  - name: [color]
    hex: "#......"
nice_classes: []
version: 0.1.0
last_updated: [YYYY-MM-DD]
status: draft
---

# [Brand name] — BRAND.md

Read this file in two passes: frontmatter for identity facts, then the named
section for the task. Respect forbidden lists literally; surface deviations.

## 1. Strategic foundations
### Purpose
[one sentence, or: Open question]
### Values
- **[Value]** — [operational meaning in one line]

## 2. Market and audience
### Positioning
For [target] who [need], [brand] is [category] that [benefit].

## 3. Verbal identity
We sound like [rationale paragraph a designer reads].
### Voice
- **[Adjective]** — [behavioral definition]
### Forbidden lexicon
- **[term]** — [reason; use "[alternative]" instead]

## 4. Visual identity
### Primary palette
| Name | HEX | RGB | CMYK | PMS |
|---|---|---|---|---|
| [color] | [#......] | [r, g, b] | [c, m, y, k] | [PMS ...] |

## 10. Evolution journal
- **0.1.0** — [YYYY-MM-DD] — File created. [one-line rationale].
```

Frontmatter rules:

- Only decided, stable fields — omit anything undecided; no `null`, no guesses.
- Scalars, short lists, one level of nesting at most. Deep structures defeat grep-ability.
- `version`, `last_updated`, `status` (`draft` → `canonical`) are mandatory: downstream prompts detect staleness with them.
- No `: ` inside unquoted YAML values.

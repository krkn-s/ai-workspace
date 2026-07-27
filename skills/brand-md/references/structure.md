# BRAND.md Structure

Canonical section model for a `BRAND.md`, with the fields each section should contain, and how to scope the file to the company's phase. This is the backbone of the file itself.

## Table of Contents

1. The section model
2. Fields inside each section
3. Phase scoping
4. Skeleton template

---

## 1. The section model

A complete `BRAND.md` covers ten areas. Not every company needs every area at every stage. The model below is the full set; phase scoping further down tells you which to require, make optional, or defer.

1. Strategic foundations — purpose, mission, vision, values, founding story.
2. Market and audience — targets, personas, competitive landscape, unique value proposition, positioning.
3. Verbal identity — voice and tone, key messaging, taglines, storytelling, forbidden and preferred lexicon.
4. Visual identity (brand book) — logo and variants, color palette, typography, iconography, photography.
5. Asset kit — ready-to-use logo files, social templates, email signatures, presentation templates.
6. Brand governance — who approves what, approval process, licensing rules, forbidden usages.
7. Legal — trademark filings, Nice classes, trademark watch, international protection.
8. Culture and people — internal values, employer branding, onboarding, internal vs external tone.
9. Extensions — co-branding rules, sub-brands, brand architecture (monolithic, endorsed, house of brands).
10. Evolution journal — version changelog, historical decisions, reasons for pivots.

Sections 1 to 4 are the operational core that most agents and humans consume. Sections 5 to 10 scale with the company: a solo founder can defer most of them, a diversified group cannot function without them.

## 2. Fields inside each section

Each section should answer specific, extractable questions rather than contain free prose only. When a field can be machine-parsed (a code, a class, a yes/no rule), keep it on its own line or in a list so agents and other prompts can grep it.

### 1. Strategic foundations
- Purpose (one sentence)
- Mission (one sentence)
- Vision (one sentence)
- Values (3 to 5, each with a one-line operational meaning, not an adjective)
- Founding story (short, factual)

### 2. Market and audience
- Primary target (one line)
- Secondary target (one line)
- Personas (2 to 3, with role, goal, friction — not demographics alone)
- Competitors (named, with one-line differentiation each)
- Unique value proposition (one sentence, defensible)
- Positioning statement (one sentence, in the form "for [target] who [need], [brand] is [category] that [benefit]")

### 3. Verbal identity
- Voice (3 to 5 adjectives, each defined behaviorally)
- Tone variations by channel (web, social, support, legal, error states)
- Key messages (3 to 5)
- Tagline(s) — current and retired, with dates
- Storytelling pillars (recurring narrative themes)
- Preferred lexicon (allowed terms)
- Forbidden lexicon (terms to never use, with reason — e.g. competitor trademark, dated, off-brand)

### 4. Visual identity
- Logo: variants (primary, horizontal, mark, mono), clear-space rule, minimum size, misuses to avoid
- Primary palette: name, HEX, RGB, CMYK, PMS (Pantone) per color
- Secondary and neutral palettes: same fields
- Typography: primary and secondary typefaces, weights, fallback web fonts, pairing rule
- Iconography: style, grid, stroke
- Photography: subject direction, lighting, mood, what to avoid
- Motion (if applicable): easing, duration, when motion is allowed

### 5. Asset kit
- Logo file inventory (variant, format, filename, location)
- Social templates (platform, aspect ratio, location)
- Email signature template (location)
- Presentation template (location)
- Access rules (who can download, who can request)

### 6. Brand governance
- Approval matrix (decision type → owner → reviewers → turnaround)
- Process for new assets
- Licensing rules (what third parties may use, under which terms)
- Forbidden usages (specific misuses to refuse)

### 7. Legal
- Registered marks (mark, jurisdiction, registration number, status)
- Nice classes (class numbers and covered goods/services)
- Watch and enforcement (who monitors, what triggers action)
- International protection (jurisdictions covered, pending)

### 8. Culture and people
- Internal values (if different from the public ones)
- Employer value proposition
- Onboarding brand touchpoints
- Internal vs external tone differences
- Recruitment do/don't

### 9. Extensions
- Brand architecture type (monolithic, endorsed, house of brands)
- Sub-brand naming convention
- Co-branding rules
- Endorsement rules

### 10. Evolution journal
- Version (semantic, e.g. 1.2.0)
- Date
- Change summary (one line)
- Decision rationale (one paragraph)
- Author / owner

## 3. Phase scoping

Scope the file to the company's phase. Shipping a thinner correct file is always better than shipping a thick speculative one. Use these as defaults, and let the user override.

### Pre-revenue / solo founder
- Required: 1 (strategic foundations), 3 (verbal identity), 4 (visual identity — even partial), 10 (journal, even if it just records the file was created).
- Optional: 2 (only positioning, skip personas if undecided).
- Defer: 5, 6, 7 (flag legal as a human-action item), 8, 9.

### Early stage (small team, first hires, first paying customers)
- Required: 1, 2, 3, 4, 8 (employer brand starts mattering), 10.
- Optional: 5 (as templates are produced), 7 (as the trademark is filed).
- Defer: 6 (light version only), 9.

### Growth / scale-up
- Required: all of 1 to 8.
- Optional: 9 (only if diversification is starting).
- Governance (6) and legal (7) become non-optional. Multi-channel consistency is the failure mode at this phase.

### Diversified / multi-brand group
- Required: all ten sections, including 9 with a real architecture decision.
- The evolution journal (10) and governance (6) are load-bearing: they are what prevent drift across business units and agencies.

When a required section is genuinely undecided, mark it explicitly as "Open question" with a one-line note, rather than inventing content. An honest gap is more useful than plausible filler.

## 4. Skeleton template

A minimal scaffold for a phase-1 file. Replace the bracketed fields with confirmed material; keep any open question visible.

```markdown
---
brand: [Brand name]
legal_name: [Legal entity name]
tagline: [Current tagline]
version: 0.1.0
last_updated: [YYYY-MM-DD]
status: draft
---

# [Brand name] — BRAND.md

## 1. Strategic foundations
### Purpose
[one sentence, or: Open question]

### Mission
[one sentence]

### Vision
[one sentence]

### Values
- **[Value]** — [operational meaning in one line]

## 2. Market and audience
### Positioning
For [target] who [need], [brand] is [category] that [benefit].

## 3. Verbal identity
### Voice
- **[Adjective]** — [behavioral definition]
### Forbidden lexicon
- [term] — [reason]

## 4. Visual identity
### Primary palette
| Name | HEX | RGB | CMYK | PMS |
|---|---|---|---|---|
| [color] | [#......] | [.., .., ..] | [.., .., .., ..] | [Pantone ..] |

## 10. Evolution journal
- **0.1.0** — [YYYY-MM-DD] — File created. [one-line rationale].
```

The frontmatter block at the top is the machine-readable entry point. See `references/machine-readable.md` for how to design it and how other prompts should consume it.

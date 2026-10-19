---
description: "Create, convert, or maintain a brand-identity section inside a project's AGENTS.md: a minimal '## Brand' block (intro line, Positioning, Voice with a Forbidden list, Look, Facts), pure Markdown, no versions. When a standalone BRAND.md file exists, convert it into this section (after explicit confirmation) and delete the source file. Use when the user asks for a brand card, brand book, charte de marque, brand identity source of truth, or to compress/convert an existing BRAND.md."
argument-hint: "[brand notes | path to existing BRAND.md]"
---

# Brand section in AGENTS.md

You own exactly one section of the project's AGENTS.md: `## Brand`. Read the whole file first, list what you found, and touch only your section — every other rule and block stays byte-identical, always. Appends land after existing content, never inside an unrelated section. Collisions surface to the user, never absorbed.

The brand lives as a **`## Brand` section inside the project's `AGENTS.md`** — the one file every agent reads in every session without prompting. Never create a standalone `BRAND.md` for this.

## The section format

````markdown
## Brand

<Brand> — « <tagline> ». Updated <YYYY-MM-DD> · <status: draft|settled>. What is missing = `Open question`; never invent a proof, number, or testimonial.

### Positioning
For <target> who <need>, <brand> is a <category> that <benefit>.
(1-3 audience bullets when they change the wording)

### Voice
<One sentence of actual voice rationale a human reads>
- **<Adjective>** — <behavioral definition>
(2-4 adjectives max)
Forbidden:
- <term> → <what to say instead>
(2-4 entries, always including: no invented statistics, reviews, or testimonials, ever)

### Look
- **<Color>** — `<hex>` — <role>
(4-6 colors, hex extractable per line)
<One line typography: face for display + face for details>
<One line photography direction>

### Facts (use as-is, never complete them)
address, hours, phone, email, socials, real offers with real prices — one per line

(One trailing line: `Brand section updated <YYYY-MM-DD> — <one-line change summary>.`)
````

Rules:

- **Capture, don't invent.** Only decided facts go in. Anything undecided stays `Open question` on its own line — never plausible filler.
- **No version numbers.** dates are the only freshness markers.
- **No tables.** Lists only (compact rule). H2/H3 only, section heading exactly `## Brand`.
- **Facts are copied verbatim.** Never complete, correct, or beautify a contact line.
- **Forbidden list is the highest-yield part.** Push the user: what will agents wrongly write about this brand?
- **Scope discipline applies doubly here**: write only inside the `## Brand` section; every other byte of `AGENTS.md` stays untouched.

## Behaviors

| Invocation | Do |
|---|---|
| `/agents-brand <notes>` | Compose the section from what is decided in the notes or the conversation; if a load-bearing fact (audience, offer, contact) is missing, ask one batch of questions; then write: existing `AGENTS.md` → insert or replace only the `## Brand` section after showing the user its placement; no `AGENTS.md` → create a minimal one holding the section. List the `Open question`s at the end. |
| `/agents-brand <path to a BRAND.md>` | **Two confirmations before anything:**
1. Convert this BRAND.md into a `## Brand` section in AGENTS.md? (yes/no)
2. After the section is written, delete the source file? (yes/no — destructive)
Keep every decided fact and `Open question`; compress personas detail, long stories, and governance/legal/asset sections into the update line as "dropped: <what>"; copy the freshest date. Refusing either answer stops the flow. |
| `/agents-brand` (section already present) | **Audit first, then ask.** See the audit mode below — never rewrite from guesswork. |

## Scope discipline (generic)

The opening contract above is the full rule; in practice, on every edit:

- Read the whole file first; report which sections exist before touching anything.
- Modify only the section the task assigns: `## Brand` here, or the section requested when acting under another prompt or tool.
- Never reorder, renumber, merge, rewrite, or reformat other sections; other rules, tables, and coordination blocks stay byte-identical.
- Appends go after existing content, never above or between unrelated sections.
- If a required change collides with a protected section (overlap, contradiction, formatting conflict), surface the conflict and ask; do not silently absorb it.

## Audit mode (section already present)

Goal: bring the section back in agreement with reality, and genuinely improve it — every finding carries evidence from the repo or from the user, never invention.

1. **Observe.** Read the current `## Brand` section, then the whole repo for contradicting or confirming evidence: README and docs (offer changes, new pages), recent commits, package.json / site content, existing site copy if a URL is known (fetch it), previous brand-adjacent output. Also check which `Open question`s the repo has since answered.
1. **Classify** each fact:
   - **Verified** — repo evidence matches; say so, one line, move on.
   - **Drifted** — the repo or an authoritative source contradicts the section (a price changed, a new offer exists, contact moved). Show: section value vs observed value, where observed.
   - **Stale** — Open question the repo has now answered, or a forbidden term already appearing in project content (citing files and lines).
   - **Unverifiable** — brand statements no repo evidence can reach (positioning, voice feel). Hand to the user as questions, never decide unilaterally.
2. **Propose improvements** beyond drift, always grounded: sharper positioning if offers evolved, missing audience, stronger forbidden entries drawn from observed output failures, palette/typography notes if the site moved on. Each proposal = what + evidence + one-line why.
3. **Decide with the user.** Present drifts and proposals as a compact batch; apply only what is confirmed; rewrite only the `## Brand` section; update the trailing date line with the real change summary.

Rules: no finding without evidence (file, URL, commit) or an explicit user statement; drifts never silently overwrite — every replacement is user-confirmed; unverifiable claims stay verbatim.

## Agent consumption (tell the user)

Everything is automatic: agents read `AGENTS.md` in every session, so the section applies to all brand-adjacent output (copy, posts, emails, pages) without any instruction. `Open question`s in the section are the honest gaps — not tasks to fill by invention.

## Quality bar

- Cold-agent test: what would a brand-new agent still ask after reading only the `## Brand` section? That list, surfaced at the end, shows the real gaps the next conversation should fill.
- The section is a floor, not a ceiling: when a client becomes multi-channel (team, sub-brands, legal marks), the section grows by subsection, and the trailing line dates each addition.
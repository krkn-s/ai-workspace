# Artifacts & Heading Taxonomy

The content rules and copy-ready templates for every artifact. The heading hierarchy is **strict on purpose**: `rg -n '^#' -g '*.md' specs/` is the project's dashboard, so predictable headings make the whole tree navigable without an index file.

## The taxonomy at a glance

| Artifact | Top heading | Greppable signal |
|---|---|---|
| Current spec | `# <Domain> — spec` | `fd 'spec\.md$'` |
| Delta | `# Delta: <domain>` | `fd 'delta\.md$'` |
| Proposal | `# Proposal: <slug>` | `rg '^# Proposal:'` |
| Design | `# Design: <slug>` | `rg '^# Design:'` |
| Tasks | `# Tasks: <slug>` | `rg '^# Tasks:'` |
| ADR | `# ADR NNNN: <title>` | `rg '^# ADR '` |

Shared content signals (same across specs and deltas):

| Content | Heading | Greppable signal |
|---|---|---|
| Requirement | `### Requirement: <name>` | `rg '^### Requirement:'` |
| Scenario | `#### Scenario: <name>` | `rg '^#### Scenario:'` |
| Design decision | `### Decision: <name>` | `rg '^### Decision:'` |
| Open task | `- [ ]` under a numbered group | `rg '^- \[ \]'` |

## Behavior-first writing

Specs and deltas describe **observable behavior**, not implementation.

Good spec content:

- behavior a user or downstream system relies on
- inputs, outputs, and error conditions
- external constraints (security, privacy, reliability, compatibility)
- scenarios that can be tested or explicitly validated

Avoid in specs:

- internal class/function names
- library or framework choices (those go in `design.md`)
- step-by-step implementation details (those go in `tasks.md`)
- execution plans

Quick test: if the implementation can change without changing externally visible behavior, it does not belong in the spec.

Use RFC 2119 keywords deliberately:

- **MUST / SHALL** — absolute requirement
- **SHOULD** — recommended, exceptions allowed
- **MAY** — optional

## Requirement & Scenario format

```markdown
### Requirement: Theme selection
The app SHALL let users switch between light and dark themes,
defaulting to the system preference when no choice is saved.

#### Scenario: User toggles dark mode
- GIVEN the user is on the settings page
- WHEN the user clicks the theme toggle
- THEN the app switches to dark mode
- AND the choice is persisted across refreshes

#### Scenario: No saved preference
- GIVEN a first-time visitor with no saved choice
- WHEN the app loads
- THEN the theme matches the OS preference
```

Good scenarios:

- testable (you could write an automated check or a manual step for them)
- cover the happy path **and** at least one edge case
- use `GIVEN` / `WHEN` / `THEN` / `AND`

## Delta format

A delta describes **what changes** relative to the current spec, not the whole spec restated. One file per affected domain.

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator setup
- AND activation completes only after a verified code

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes — tightened for security.)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users re-authenticate each session.)
```

| Section | Meaning | What happens on archive |
|---|---|---|
| `## ADDED Requirements` | new behavior | appended to the current spec |
| `## MODIFIED Requirements` | changed behavior | replaces the existing requirement (note the previous value) |
| `## REMOVED Requirements` | deprecated behavior | deleted from the current spec (record why) |

Omit a section if it has no entries. A delta that only adds behavior has only `## ADDED Requirements`.

Why deltas: a reviewer sees exactly what changes, two changes can touch the same spec without conflict (as long as different requirements), and the model fits brownfield work where most changes modify existing behavior.

## Templates

Copy these verbatim into the target project and fill them in. Keep the headings exactly as shown.

### current/`<domain>`.spec.md

```markdown
---
id: ui
type: spec
domain: ui
updated: 2026-01-16
---

# UI — spec

## Purpose
Describe what this capability is for, in one or two sentences.

## Requirements

### Requirement: <name>
The system SHALL <observable behavior>.

#### Scenario: <name>
- GIVEN <precondition>
- WHEN <action>
- THEN <observable outcome>
```

### `<change>/specs/`<domain>`.delta.md`

```markdown
---
id: 2026-01-15-add-dark-mode
type: delta
domain: ui
origin: spec-driven
created: 2026-01-15
updated: 2026-01-15
---

# Delta: ui

## ADDED Requirements

### Requirement: <name>
The system SHALL <observable behavior>.

#### Scenario: <name>
- GIVEN <precondition>
- WHEN <action>
- THEN <observable outcome>

## MODIFIED Requirements

### Requirement: <existing name>
<new behavior>
(Previously: <old behavior>.)

## REMOVED Requirements

### Requirement: <existing name>
(<reason for removal.>)
```

### `<change>/proposal.md`

```markdown
---
id: 2026-01-15-add-dark-mode
type: proposal
domain: ui
origin: spec-driven
created: 2026-01-15
updated: 2026-01-15
depends_on: []
provides: []
requires: []
---

# Proposal: add-dark-mode

## Intent
Why we are doing this. The user/problem it serves.

## Scope

### In scope
- <bullet>

### Out of scope
- <bullet>

## Approach
One short paragraph on the intended direction. Details live in design.md.

## Links
- decisions: 0001-css-variables
- depends_on: <change id or none>
```

### `<change>/design.md`

```markdown
---
id: 2026-01-15-add-dark-mode
type: design
domain: ui
origin: spec-driven
created: 2026-01-15
updated: 2026-01-15
---

# Design: add-dark-mode

## Approach
The technical approach. Keep behavior out of here; this is how, not what.

## Decisions

### Decision: <name>
<choice> — because <reason>. Tradeoff: <cost>.

## Data flow
<diagram in text, or mermaid>

## File changes
- `path/to/file` (new | modified | removed)

## Risks
- <risk and mitigation>
```

### `<change>/tasks.md`

```markdown
---
id: 2026-01-15-add-dark-mode
type: tasks
domain: ui
origin: spec-driven
created: 2026-01-15
updated: 2026-01-16
---

# Tasks: add-dark-mode

## 1. <group>
- [ ] 1.1 <step>
- [ ] 1.2 <step>

## 2. <group>
- [ ] 2.1 <step>

## Verification
- [ ] all scenarios in specs/ui.delta.md pass
- [ ] no regression in existing tests
```

Task best practices:

- group related steps under a numbered heading
- hierarchical numbering (`1.1`, `1.2`)
- each task small enough to finish in one session
- a final `## Verification` group that maps back to the delta's scenarios

### decisions/`NNNN-`<slug>`.md`

```markdown
---
id: 0001-css-variables
type: adr
domain: ui
status: accepted
created: 2026-01-15
---

# ADR 0001: Use CSS custom properties for theming

## Status
accepted

## Context
Why this decision is needed. The forces at play.

## Decision
What we decided.

## Consequences
What follows from the decision (positive and negative).

## Alternatives considered
- <option> — rejected because <reason>.
```

When an ADR is superseded, do not delete it. Add a `Supersedes`/`Superseded by` line and flip `status: superseded`, then write the replacement ADR.

## Reverse-path note

When generating artifacts from vibe-coded work (`origin: vibe`), the templates are identical — only the provenance differs. Reverse-engineer the spec from **what was observably built**, mark anything uncertain as `Open question` in the proposal, and validate with the user before advancing past `0-draft/`.

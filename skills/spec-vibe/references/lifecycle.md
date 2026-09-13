# Lifecycle & Structure

Physical layout, naming, frontmatter, state machine, verify gate, and archive procedure. Read this before creating any file or moving a change between states.

## The tree

```text
specs/
├── current/                 # source of truth — behavior today
│   ├── auth.spec.md
│   ├── payments.spec.md
│   └── ui.spec.md
├── changes/
│   ├── 0-draft/             # being specified / reverse-spec in progress
│   │   └── 2026-01-15-add-dark-mode/
│   │       ├── proposal.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── specs/
│   │           └── ui.delta.md
│   ├── 1-wip/               # implementation in progress
│   ├── 2-done/              # implemented, pending verify + archive
│   └── 3-archive/           # merged into current/, preserved for history
└── decisions/               # ADRs: NNNN-<slug>.md
    ├── 0001-css-variables.md
    └── 0002-local-storage-prefs.md
```

## Status is the folder

A change's status is **which state folder it sits in** — there is no `status` frontmatter field.

| Folder | What happens here | Exit gate |
|---|---|---|
| `0-draft/` | Spec/proposal/design/tasks written. Forward: plan approved before code. Reverse: spec validated via Q&A. | Approval or validation |
| `1-wip/` | Implementation against `tasks.md`; artifacts updated as you learn. | All tasks checked, scenarios pass |
| `2-done/` | Complete, pending verify + archive. | Verify gate passed |
| `3-archive/` | Deltas merged into `current/`. Terminal. | — |

Advancing a change is a `git mv` of the whole folder — content never changes on a transition, so Git records a rename and history stays clean. The numeric prefix makes `ls changes/` read in lifecycle order.

```bash
git mv specs/changes/0-draft/<id> specs/changes/1-wip/
git mv specs/changes/1-wip/<id>   specs/changes/2-done/
git mv specs/changes/2-done/<id>  specs/changes/3-archive/   # after verify + merge
```

Update each artifact's `updated:` date on transition; nothing else changes. A sub-status the folders cannot express (e.g. "blocked") is a one-line note at the top of `tasks.md`, not a new folder.

## ID model

Every change has a stable ID `YYYY-MM-DD-<slug>` (e.g. `2026-01-15-add-dark-mode`):

- The ID **is** the folder name, the frontmatter `id`, and the single token for every cross-reference.
- It **never changes**, even when the folder moves between states. Reference by ID, never by path.
- The date gives chronological ordering; the slug is kebab-case and describes the change, not the file type.

```yaml
# in proposal.md frontmatter
depends_on:
  - 2025-12-01-add-oauth      # an ID, not a path
```

```bash
rg '2025-12-01-add-oauth' specs/   # the change + every reference to it, any state
```

## File naming & domains

| Artifact | Pattern | Example |
|---|---|---|
| Current spec | `current/<domain>.spec.md` | `current/auth.spec.md` |
| Delta spec | `<change>/specs/<domain>.delta.md` | `…/specs/auth.delta.md` |
| Proposal / Design / Tasks | fixed names | `proposal.md`, `design.md`, `tasks.md` |
| ADR | `decisions/NNNN-<slug>.md` | `decisions/0001-css-variables.md` |

- The `.spec.md` / `.delta.md` double extensions are greppable (`fd 'spec\.md$'`, `fd 'delta\.md$'`); fixed artifact names make `rg '^# Proposal:'` work across every state; zero-padded ADR numbers sort chronologically.
- A **domain** is a short kebab slug for a capability area (`auth`, `payments`, `ui`). The same domain on both sides (current spec / delta) makes the archive merge unambiguous. Put `domain:` in every frontmatter so `rg '^domain: ui' specs/` returns the whole surface.

## Frontmatter schema

Changes:

```yaml
---
id: 2026-01-15-add-dark-mode      # change id (stable)
type: change                       # change | spec | delta | proposal | design | tasks | adr
domain: ui
origin: spec-driven                 # spec-driven | vibe   (provenance)
created: 2026-01-15
updated: 2026-01-16
depends_on: []                     # change ids that must land first
provides: []                       # capability markers exposed
requires: []                       # capability markers needed
---
```

Current specs use a lighter block (`id: ui`, `type: spec`, `domain: ui`, `updated:`). ADRs add the one legal `status` field — `proposed | accepted | deprecated | superseded` — because they evolve in place instead of moving between folders.

- `depends_on` is the source of truth for archive ordering. `provides`/`requires` are visibility markers; they do **not** create implicit edges.
- `origin` records provenance: `spec-driven` (spec led the code) or `vibe` (code led, spec reconstructed).
- YAML pitfalls: never `: ` inside an unquoted value; dates as `YYYY-MM-DD`.

## Scaffolding a fresh tree

No `specs/` yet? Create the empty spine — `current/`, `changes/0-draft..3-archive/`, `decisions/` — and add a one-line pointer in `AGENTS.md` (ask before creating or editing a project-level `AGENTS.md`):

```markdown
## Specs
Spec-driven workflow lives in `specs/`. See `current/` for current behavior,
`changes/` for in-flight changes, and `decisions/` for decisions.
```

## Forward workflow (default)

1. **Read** — existing behavior, ADRs, and in-flight work for the domain.
2. **Scaffold** `0-draft/<id>/` with the four artifacts from `artifacts.md`.
3. **Specify** — behavior-first requirements + scenarios in the delta; non-goals in the proposal.
4. **Plan** — approach + decisions in design; numbered checklist ending in `## Verification` in tasks.
5. **Approve** — present the plan; explicit approval before any code.
6. **Implement** — `git mv` to `1-wip/`; work through tasks; update artifacts as you learn.
7. **Finish** — `git mv` to `2-done/`.
8. **Verify** — run the verify gate.
9. **Archive** — merge + `git mv` to `3-archive/`.

## Reverse workflow (vibe → spec)

Detection in `triggers.md`. Scaffold `0-draft/<id>/` with `origin: vibe`, reverse-engineer the four artifacts from what was observably built, mark uncertainty `Open question`, validate via Q&A — then the lifecycle is identical (→ `1-wip/` → `2-done/` → verify → archive).

## Verify gate (before archive)

A lightweight, human-in-control gate: it reports gaps, it does not auto-fix.

1. **Diff spec ↔ code.** For each `### Requirement:` and `#### Scenario:` in the delta, check the code satisfies it.
2. **Classify gaps** — spec says X, code does not (missing) / code does X, spec does not say (delta gap) / they disagree (contradiction).
3. **Ask** — fix code, fix spec, or accept the gap (recorded as a known limitation in the proposal).
4. **Do not archive until the user confirms.** With real gaps, sending the change back to `1-wip/` is a valid outcome.

## Archive procedure (merge + move)

1. **Confirm dependencies** — every `depends_on` entry is already in `3-archive/`, else stop and sequence.
2. **Run the verify gate** — never merge a spec that lies about the code.
3. **Apply the delta** to `current/<domain>.spec.md`: `ADDED` → append under `## Requirements`; `MODIFIED` → replace in place; `REMOVED` → delete (record why); update `updated:`.
4. **Move** — `git mv specs/changes/2-done/<id> specs/changes/3-archive/`. Never delete; the archive is the audit trail.
5. **Summarize** — one line on what the source of truth now says.

Multiple domains → apply each `<domain>.delta.md` to its own spec. Brand-new capability → create `current/<domain>.spec.md` from the delta's `## ADDED Requirements`, seeded with a `## Purpose` from the proposal.

## Failure modes

- **Dependency not archived yet** → archive the predecessor first, or fix the `depends_on` if wrong.
- **Verify gate found real gaps** → back to `1-wip/` or update the spec, then re-verify.
- **`MODIFIED`/`REMOVED` targets a requirement missing from `current/`** → the delta or the spec is stale; surface it, do not guess.
- **Two changes touch the same requirement** → sequence via `depends_on`; if both are in flight, surface the overlap and let the user order them.
- **A change grew too large** → split into a parent with `depends_on` children, each archivable on its own.

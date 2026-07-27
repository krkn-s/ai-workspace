# Structure & Naming

The physical layout of the `specs/` tree, the file-naming rules, the ID model, the frontmatter schema, and the status-as-folder convention. Read this before creating any file.

## Full tree

```text
specs/
├── current/                         # source of truth — current behavior
│   ├── auth.spec.md
│   ├── payments.spec.md
│   └── ui.spec.md
├── changes/
│   ├── 0-draft/                     # being specified / reverse-spec in progress
│   │   └── 2026-01-15-add-dark-mode/
│   │       ├── proposal.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── specs/
│   │           └── ui.delta.md
│   ├── 1-wip/                       # implementation in progress
│   ├── 2-done/                      # implemented, pending verify + archive
│   └── 3-archive/                   # merged into current/, preserved for history
│       └── 2025-12-01-add-oauth/
│           ├── proposal.md
│           ├── design.md
│           ├── tasks.md
│           └── specs/auth.delta.md
└── decisions/                       # ADRs
    ├── 0001-css-variables.md
    └── 0002-local-storage-prefs.md
```

## Status is the folder

There are four state folders under `changes/`. A change's status is **which folder it sits in** — there is no `status` frontmatter field.

| Folder | Meaning |
|---|---|
| `0-draft/` | Spec being written, or reverse-spec reconstruction in progress. No code yet on the forward path. |
| `1-wip/` | Implementation in progress. |
| `2-done/` | Implementation complete; pending verify + archive. |
| `3-archive/` | Deltas merged into `current/`; folder preserved for history. Terminal state. |

The numeric prefix makes `ls changes/` read in lifecycle order. To advance a change:

```bash
git mv specs/changes/0-draft/2026-01-15-add-dark-mode specs/changes/1-wip/
```

The folder's **content does not change** on a transition — only its location. Git tracks this as a rename, so history is preserved. This is why status lives in the path, not in a field: one source of truth, zero drift.

If you need a sub-status that the four folders cannot express (e.g. "blocked inside wip"), use a one-line note at the top of `tasks.md` (`> blocked: waiting on ADR 0003`), not a new folder.

## ID model

Every change has a stable ID: `YYYY-MM-DD-<slug>`.

- `2026-01-15-add-dark-mode`
- `2025-12-01-add-oauth`

Rules:

- The ID **is** the folder name, the frontmatter `id`, and the single token used in every cross-reference.
- The ID **never changes**, even when the folder moves between states.
- The date prefix gives chronological `ls | sort` ordering and makes the ID self-describing.
- The slug is kebab-case, short, human-readable, and describes the *change* (`add-dark-mode`), not the file type.

Reference changes **by ID**, never by relative path. Paths shift across state folders; IDs do not.

```text
# in proposal.md frontmatter
depends_on:
  - 2025-12-01-add-oauth      # an ID, not a path

# find a change and every reference to it, regardless of state
rg '2025-12-01-add-oauth' specs/
```

## File naming

| Artifact | Pattern | Example |
|---|---|---|
| Current spec | `current/<domain>.spec.md` | `current/auth.spec.md` |
| Delta spec | `<change>/specs/<domain>.delta.md` | `…/specs/auth.delta.md` |
| Proposal | `<change>/proposal.md` | fixed name |
| Design | `<change>/design.md` | fixed name |
| Tasks | `<change>/tasks.md` | fixed name |
| ADR | `decisions/NNNN-<slug>.md` | `decisions/0001-css-variables.md` |

Why these patterns:

- The `.spec.md` / `.delta.md` double extension is greppable: `fd 'spec\.md$'` and `fd 'delta\.md$'` separate current truth from proposed changes instantly.
- Fixed artifact names (`proposal.md`, `design.md`, `tasks.md`) mean `rg '^# Proposal:' specs/changes` finds every proposal across every change regardless of state.
- ADRs are zero-padded (`0001`, `0002`) so `ls decisions/` sorts chronologically. Find the next number: `fd -e md . specs/decisions | sort | tail -1`.

## Domain

A domain is a short kebab slug for a capability area: `auth`, `payments`, `ui`, `search`, `notifications`. It groups requirements that change together.

- A current spec lives at `current/<domain>.spec.md`.
- A change's deltas live at `<change>/specs/<domain>.delta.md`.
- The domain is the same on both sides, so the archive merge knows exactly which spec a delta applies to.
- Put the domain in every artifact's frontmatter (`domain: ui`) so `rg '^domain: ui' specs/` returns the whole surface for a capability.

Pick domains by feature area (`auth`, `payments`), by component (`api`, `frontend`), or by bounded context (`ordering`, `fulfillment`). Whatever you choose, stay consistent within a project.

## Frontmatter schema

Every artifact starts with a YAML block. Fields in English; prose in the project's working language.

```yaml
---
id: 2026-01-15-add-dark-mode      # change id (stable); for current specs, use the domain
type: change                       # change | spec | delta | proposal | design | tasks | adr
domain: ui                         # capability area
origin: spec-driven                 # spec-driven | vibe   (provenance only)
created: 2026-01-15
updated: 2026-01-16
depends_on: []                     # change ids that must land first
provides: []                       # capability markers this change exposes
requires: []                       # capability markers this change needs
---
```

Field notes:

- **`type`** lets `rg '^type: adr' specs/` aggregate across filenames. It is stable — an artifact's type never changes.
- **`origin`** records provenance: `spec-driven` (spec led the code) or `vibe` (code led, spec reconstructed). This is the reverse-path marker.
- **`depends_on` / `provides` / `requires`** model stacking, lifted from OpenSpec. `depends_on` is the source of truth for archive ordering (archive predecessors first). `provides`/`requires` are capability contracts for planning visibility; they do **not** create implicit edges — declare ordering explicitly via `depends_on`.
- There is **no `status` field**. Status is the folder. Do not add one.

Current specs use a lighter block:

```yaml
---
id: ui                             # the domain itself
type: spec
domain: ui
updated: 2026-01-16
---
```

ADRs:

```yaml
---
id: 0001-css-variables
type: adr
domain: ui
status: accepted                   # proposed | accepted | deprecated | superseded
created: 2026-01-15
---
```

ADRs are the one place `status` is a field, because an ADR does not move between state folders — it evolves in place (`accepted` → `superseded` by a later ADR).

### YAML pitfalls

- Never put `: ` (colon + space) inside an unquoted value. Quote it (`title: "Auth: v2"`) or rephrase.
- Lists (`depends_on: []`) use the `[a, b]` flow form or the block form with `- ` items.
- Keep dates as `YYYY-MM-DD` so they sort lexicographically.

## Scaffolding a fresh tree

When a project has no `specs/` yet, create the empty spine and a one-line pointer in `AGENTS.md`:

```text
specs/
├── current/
├── changes/
│   ├── 0-draft/
│   ├── 1-wip/
│   ├── 2-done/
│   └── 3-archive/
└── decisions/
```

Then ensure `AGENTS.md` points at it (ask before creating or editing a project-level `AGENTS.md`):

```markdown
## Specs
Spec-driven workflow lives in `specs/`. See `specs/` for current behavior (`current/`),
in-flight changes (`changes/`), and decisions (`decisions/`).
```

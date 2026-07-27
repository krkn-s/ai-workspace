---
name: spec-vibe
description: Run a CLI-free, Markdown-only spec-driven workflow over a specs/ tree — propose changes, write behavior-first specs and deltas, design, implement, then archive by merging deltas into the source of truth. Bidirectional workflow with a forward path (spec first) and a reverse path (vibe-code first, then retroactively generate and validate specs). Use whenever building, modifying, or refactoring a feature, behavior, API, schema, or contract; when code changes without an associated spec; when the user mentions specs, proposals, deltas, ADRs, acceptance criteria, living specs, or a spec-driven / vibe-coding workflow; or when auditing a repo for spec drift. Déclenche aussi en français, par exemple créer ou rédiger une spec, une proposition, un delta ou un ADR, formaliser une fonctionnalité, générer des specs depuis du code existant, auditer la dérive specs/code, workflow spec-driven ou vibe coding sans CLI ni base de données.
---

# Spec Vibe

A CLI-free, Markdown-only spec-driven development skill. It lands a versioned `specs/` tree that humans read and coding agents consume, with no database, no generator, and no extra tooling beyond `rg`/`fd`/`git`.

The dual goal: keep specs as the durable memory of *what the system does* (the source of truth), and keep every change traceable from intent → spec → design → tasks → code → archive.

## What this skill produces

A `specs/` tree at the project root (or wherever the project keeps it):

```text
specs/
├── current/                 # source of truth — how the system behaves TODAY
│   └── <domain>.spec.md
├── changes/
│   ├── 0-draft/             # spec/proposal being written (or reverse-spec in progress)
│   ├── 1-wip/               # implementation in progress
│   ├── 2-done/              # implemented, pending verify + archive
│   └── 3-archive/           # merged & preserved for history
│       └── <id>/            # id = YYYY-MM-DD-<slug>
│           ├── proposal.md
│           ├── design.md
│           ├── tasks.md
│           └── specs/<domain>.delta.md
└── decisions/               # ADRs
    └── NNNN-<slug>.md
```

Status is the **folder**, not a field. Moving a change forward is a `git mv` between state folders; the change's content never changes on a transition, so history stays clean.

There is intentionally **no `INDEX.md` to maintain**. The dashboard is generated on demand:

```bash
rg -n '^#' -g '*.md' specs/        # full outline of every spec, change, decision
rg -n '^#' -g '*.md' specs/changes/1-wip/   # what is in progress right now
```

This only works because the heading taxonomy is strict — see `references/artifacts.md`.

## When to use this skill

Use it when the work changes **behavior a user or downstream system relies on**:

- building, modifying, or refactoring a feature, capability, or user-facing behavior
- changing an API, data schema, contract, protocol, or config that other code consumes
- a bug fix that alters an observable contract (not a pure typo fix)
- the user asks to "spec", "propose", "write requirements", "add an ADR", or "formalize" something
- code is already being changed and no spec/change folder exists for it (the **reverse path** — see below)
- auditing a repo for drift between code and specs

Do **not** use it for:

- prose, docs, marketing copy, or content creation with no behavior change
- formatting, renaming, comments, import sorting
- throwaway experiments the user explicitly marks as throwaway
- config tweaks with no contract impact

When in doubt about whether work is spec-worthy, ask — see the Stop-and-Ask checkpoints.

## Entry points

Four prompt templates load this skill and follow its workflow:

- `/spec <idea>` — propose and scaffold a new change (forward path).
- `/spec-audit` — find spec drift: code changed without a spec, or specs without code; the entry point for the reverse path.
- `/spec-verify [id]` — check spec↔code alignment for a change before archive.
- `/spec-archive <id>` — run the verify gate, merge deltas into `current/`, move the change to `3-archive/`.

The skill also triggers contextually when none of these commands is used.

## Task matrix

Route to the right reference before producing output:

| Task | Load first | Output |
|---|---|---|
| Create a change (forward) | `references/structure.md`, `references/artifacts.md` | A `0-draft/<id>/` folder with proposal + delta + design + tasks |
| Reverse-spec from existing code | `references/triggers.md`, `references/artifacts.md` | A `0-draft/<id>/` folder with `origin: vibe`, validated by Q&A |
| Audit spec drift | `references/triggers.md`, `references/unix-queries.md` | A drift report: code without spec, spec without code, stale deltas |
| Verify before archive | `references/workflow.md` | A gap list (spec ↔ code), questions for the user |
| Archive a change | `references/workflow.md` | Merged `current/<domain>.spec.md`, folder moved to `3-archive/` |
| Write an ADR | `references/artifacts.md` | A `decisions/NNNN-<slug>.md` linked from the relevant proposal/design |

Do not load every reference by default. Load only what the task needs.

## Reference loading

- **`references/structure.md`** — the full folder tree, file-naming rules, the ID model (stable, path-independent), the frontmatter schema, and the status-as-folder convention. Read this before creating any file.
- **`references/artifacts.md`** — the strict heading taxonomy that makes `rg '^#'` a real dashboard, plus copy-ready templates for proposal, design, tasks, delta, spec, and ADR. Read this before writing any artifact.
- **`references/triggers.md`** — the full trigger matrix (forward, reverse, non-triggers), the reverse-detection signals, and the exact procedure for retroactively generating a spec from vibe-coded work. Read this for any audit or reverse-path task.
- **`references/workflow.md`** — the state machine (`0-draft → 1-wip → 2-done → 3-archive`), `git mv` transitions, the archive merge procedure, and the verify gate. Read this for verify/archive tasks.
- **`references/unix-queries.md`** — the `rg`/`fd` cookbook: the dashboard queries, per-state listings, cross-references by ID, requirement/scenario/task extraction. Read this to answer "what is the state of X" without an index file.

## Core workflow

The virtuous cycle, mirroring OpenSpec's mental model but without its CLI:

1. **Specify** — capture intent, scope, and acceptance as behavior-first requirements + scenarios.
2. **Plan** — keep the technical approach in `design.md`, the steps in `tasks.md`; keep behavior out of them.
3. **Implement** — work through `tasks.md`, checking items off; update artifacts as you learn.
4. **Verify** — confirm the implementation matches the spec; surface gaps; let the human decide.
5. **Archive** — merge the delta (`ADDED`/`MODIFIED`/`REMOVED`) into `current/<domain>.spec.md`, move the folder to `3-archive/`.
6. **Repeat** — the next change builds on the updated source of truth.

Specs describe **what** (observable behavior). Design describes **how** (approach, decisions). Tasks describe **steps**. Never leak implementation detail into a spec — if the implementation can change without changing externally visible behavior, it does not belong in the spec.

## The two paths

This skill is **bidirectional**. Most work is forward; some is reverse.

**Forward path (default — spec-driven).** Intent first. Create `0-draft/<id>/`, write proposal → delta → design → tasks, get the plan approved, then implement. This is the default because it prevents requirements drift and keeps a reviewable contract between human intent and agent output.

**Reverse path (vibe → spec).** Sometimes code is written or explored first without a spec. That is allowed. The skill's triggers detect this (see `references/triggers.md`) and the agent then:

1. Creates `0-draft/<id>/` with `origin: vibe`.
2. Reverse-engineers proposal + delta + design + tasks from what was already built.
3. Validates the reconstructed spec with the user via Q&A — never silently invent requirements.
4. Once approved, advances normally toward archive, so `current/` ends up truthful.

Provenance is recorded in the frontmatter `origin` field (`spec-driven` or `vibe`) so a future reader knows whether a spec led the code or followed it.

The reverse path is intelligent about scope: it fires for behavior/contract changes, and stays silent for pure content/docs work that carries no behavior change.

## Folder, status, and ID model (essentials)

- **ID** = `YYYY-MM-DD-<slug>`, e.g. `2026-01-15-add-dark-mode`. It is the folder name, the frontmatter `id`, and the single token used in every cross-reference. It **never** changes, even when the folder moves between states. Reference by ID, never by relative path — paths shift across state folders.
- **Status** = the state folder (`0-draft` / `1-wip` / `2-done` / `3-archive`). There is no `status` frontmatter field on purpose: a single source of truth, no drift. To advance a change, `git mv` its folder; content is unchanged, so Git tracks it as a rename.
- **Domain** = a short kebab slug (`auth`, `payments`, `ui`). Specs are `current/<domain>.spec.md`; deltas are `<change>/specs/<domain>.delta.md`. Same domain on both sides makes the archive merge unambiguous.
- **ADRs** = `decisions/NNNN-<slug>.md`, zero-padded for chronological `ls`. Reference them from `proposal.md` and `design.md` by their ID.

Full rules and edge cases live in `references/structure.md`.

## Decision order

Apply this order to avoid wasted work and invented content:

1. **Read before writing.** Check `current/` for the domain's existing spec, `decisions/` for prior ADRs, and `changes/` for in-flight work touching the same area. `rg '<domain>' specs/` and `rg '^### Requirement:' specs/current/<domain>.spec.md` are the fastest entries.
2. **Reuse existing decisions.** Do not re-litigate an architecture choice that an ADR already settled; link it.
3. **Specify behavior, not implementation.** Land requirements + scenarios first; push "how" to design.
4. **Scope tightly.** State explicit non-goals. A thin correct change beats a thick speculative one. Defer with `Open question` rather than inventing.
5. **Capture decisions as ADRs** when a choice is durable and non-obvious — during design, not after.
6. **Get approval before code** on the forward path; reconstruct + validate on the reverse path.

## Stop-and-Ask checkpoints

Pause and confirm with the user before:

- inventing requirements, constraints, or acceptance criteria the user has not stated — ask instead of filling gaps; mark undecided items `Open question`
- silently picking one version of the truth when conflicting material exists (two behaviors, two contracts) — surface the conflict
- promoting reverse-path work: always validate the reconstructed spec via Q&A before recording it
- creating, editing, or correcting a project-level `AGENTS.md` to point at `specs/` — ask whether the change is critical before applying it
- archiving a change whose verify gate surfaced real gaps — let the human decide whether to fix code, fix spec, or accept the gap
- exposing sensitive material (secrets, unreleased names, internal-only context) in a file that may be shared or fed to third-party agents

If none of these apply, proceed with the conservative option that preserves existing truth and defers undecided items.

## Default rules

- `current/` is the source of truth. Everything else (`changes/`, `archive/`, `decisions/`) is context that either proposes, records, or explains.
- Reference by **ID**, never by relative path. Paths move; IDs do not.
- Status is the folder. Do not add a `status` field; do not rename a folder to encode status — the state folder already does.
- Keep the heading taxonomy strict. `rg '^#'` is the dashboard; loose headings break it for everyone.
- Separate behavior (spec) from approach (design) from steps (tasks). A spec that names internal functions or libraries has leaked.
- Use RFC 2119 keywords deliberately: `MUST`/`SHALL` (absolute), `SHOULD` (recommended), `MAY` (optional).
- One change = one folder. Keep changes small enough to archive independently.
- Preserve history: archive, never delete. The archive is the audit trail.
- Keep `AGENTS.md` pointing at `specs/` so other agents find it.

## Failure modes

Handle these explicitly instead of improvising:

- **No `specs/` tree exists yet.** Propose scaffolding it (`current/`, `changes/0-draft..3-archive/`, `decisions/`) and adding a one-line pointer in `AGENTS.md`. Ask before creating a project-level `AGENTS.md`.
- **Two changes touch the same requirement.** Sequence them with `depends_on`; if both are already in flight, surface the overlap and let the user order them.
- **Spec and code have drifted apart.** Run `/spec-audit`; do not silently rewrite either side. Present the drift, let the user pick which is canonical, and record the choice (an ADR if it is architectural).
- **Reverse-path work is ambiguous.** Generate the most conservative spec that matches what was observably built; mark assumptions `Open question` and validate via Q&A.
- **A change has grown too large.** Split it: parent change with `depends_on` children, each archivable on its own.
- **An ADR contradicts a new proposal.** Flag it explicitly; either supersede the ADR (new ADR referencing the old) or align the proposal — never ignore the contradiction.

## Output contracts

Match the response shape to the task:

- **Create (forward):** a `0-draft/<id>/` folder with proposal + delta + design + tasks, a short list of fields to confirm, and any `Open question` items.
- **Reverse-spec:** the same folder with `origin: vibe`, plus the Q&A used to validate it, plus the list of assumptions that need confirmation.
- **Audit:** a drift report — code without spec, spec without code, stale requirements, contradicting ADRs — not a rewrite.
- **Verify:** a gap list (spec ↔ code) with severity, and the questions the human must answer before archive.
- **Archive:** the merged `current/<domain>.spec.md` diff, the `git mv` to `3-archive/`, and a one-line summary of what the source of truth now says.

Always end with the cold-agent test: list the questions a brand-new agent would still need to ask after reading only `current/`. Those are the source of truth's remaining gaps.

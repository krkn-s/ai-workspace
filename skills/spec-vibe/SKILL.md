---
name: spec-vibe
description: "Run a Markdown-only spec workflow over a specs/ tree: propose, spec, design, implement, then merge deltas into the source of truth. Works forward from a spec or backward from existing code. Use for any feature, API, contract, ADR, or acceptance criteria."
---

# Spec Vibe

CLI-free, Markdown-only spec-driven development. It lands a versioned `specs/` tree that humans read and coding agents consume — no database, no generator, nothing beyond `rg`/`fd`/`git`. Specs are the durable memory of *what the system does*; every change stays traceable from intent → spec → design → tasks → code → archive.

## The model

```text
specs/
├── current/                 # source of truth — behavior today: <domain>.spec.md
├── changes/
│   ├── 0-draft/             # being specified (or reverse-spec in progress)
│   ├── 1-wip/               # implementation in progress
│   └── 2-archive/           # verified + merged, preserved for history
│       └── <id>/            # YYYY-MM-DD-<slug>: proposal + delta (+ design, tasks in Standard)
└── decisions/               # ADRs: NNNN-<slug>.md
```

- **Status is the folder.** Advancing a change is a `git mv`; content never changes on a transition, so Git records a rename and history stays clean. No `status` field, no `INDEX.md`.
- **ID** = `YYYY-MM-DD-<slug>`, stable for life. Reference by ID, never by path.
- **Domain** (`auth`, `ui`, …) pairs `current/<domain>.spec.md` with each change's `<domain>.delta.md`, making the archive merge unambiguous.
- The dashboard is `rg -n '^#' -g '*.md' specs/` — it only works because the heading taxonomy is strict.
- No tree yet? Scaffold the spine and add a one-line `AGENTS.md` pointer (ask first). See `references/lifecycle.md`.

## Two tiers

**Lite (default)** — one requirement, one domain, no architectural choice, one session: the folder ships the delta and a short proposal. **Standard** — multi-requirement, architectural decision, or multi-session: all four artifacts. Promotion adds files to the same folder; nothing renames. When in doubt, start Lite.

## Two paths

**Forward (default)** — intent first: `0-draft/<id>/` with proposal → delta → design → tasks, plan approved by the user, then code.

**Reverse (vibe → spec)** — code first is allowed; the artifacts are then reconstructed from what was observably built (`origin: vibe`) and validated via Q&A before advancing. Detection signals and procedure: `references/triggers.md`.

## Task routing

This skill triggers contextually whenever a spec-driven feature, spec, delta, or audit task appears, and can also be forced explicitly. Load only the references the task needs:

| Task | Read | Output |
|---|---|---|
| Plan a change (forward) | `references/lifecycle.md`, `references/artifacts.md` | `0-draft/<id>/` folder at the right tier + open questions |
| Reverse-spec vibe-coded work | `references/triggers.md`, `references/artifacts.md` | Same folder with `origin: vibe`, validated by Q&A |
| Audit drift | `references/triggers.md`, `references/unix-queries.md` | Drift report — never a rewrite |
| Verify (exit of 1-wip) | `references/lifecycle.md` | Gap list + questions for the user |
| Archive | `references/lifecycle.md` | Merged `current/`, folder in `2-archive/`, one-line summary |
| Write an ADR | `references/artifacts.md` | `decisions/NNNN-<slug>.md`, linked from proposal/design |

## Non-negotiables

1. **Read before writing** — check `current/`, `decisions/`, and in-flight changes for the domain. Never re-litigate an ADR; link it.
2. **Specs say what, design says how, tasks say steps.** A spec naming internal functions has leaked.
3. **A thin correct change beats a thick speculative one.** Explicit non-goals; defer with `Open question` instead of inventing.
4. **Approval gates the code** — forward: explicit plan approval. Reverse: Q&A validation of the reconstructed spec.
5. **Archive, never delete.** `depends_on` orders archives: predecessors first.
6. **Keep the heading taxonomy strict** — loose headings break the dashboard for everyone.

## Stop and ask

- inventing requirements the user has not stated — mark `Open question` instead
- two versions of the truth conflict — surface the conflict, let the user pick
- archiving with real gaps from the verify gate — fix code, fix spec, or accept: the human decides
- creating or editing a project-level `AGENTS.md`

## Output contracts

- **Plan:** the `0-draft/<id>/` folder (Lite or Standard), fields to confirm, open questions.
- **Reverse:** same folder with `origin: vibe`, the Q&A, assumptions to confirm.
- **Audit:** a drift report — code without spec, spec without code, contradicting ADRs.
- **Verify:** a gap list with severity + the questions to answer before merge.
- **Archive:** the merged `current/`, the `git mv`, a one-line summary of the new truth.

End **plan, reverse, and audit** tasks with the cold-agent test: the questions a brand-new agent would still need to ask after reading only `current/` — those are the source of truth's remaining gaps. In verify, the gap list is the test.

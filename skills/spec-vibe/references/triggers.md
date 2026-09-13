# Triggers & the Reverse Path

What fires this skill, what stays silent, and how to reconstruct a spec from vibe-coded work.

```text
FIRE — the work changes behavior a user or downstream system relies on:
  new feature / capability / user-facing behavior
  API, schema, contract, protocol, or config other code consumes
  bug fix changing an observable contract (not a typo fix)
  refactor with an externally visible effect
  security / privacy / reliability / compatibility change

STAY SILENT — no behavior change, no spec:
  prose, docs, marketing, content creation
  formatting, renaming, comments, import sorting
  throwaway experiments explicitly marked as such
  config tweaks and dependency bumps with no contract impact

REVERSE SIGNALS — code changing with no spec/change folder for it:
  diff touches files unmapped to any current requirement
  a fix introduces a regression; work lands in production
  scope creeps well beyond the initial ask
  a new behavior, endpoint, or schema field appears with no change folder
```

The test is **behavior change**, not file edits or effort: editing a markdown doc is not spec-worthy; editing a route handler usually is.

## Reverse procedure (vibe → spec)

1. **Detect and surface.** Tell the user plainly: this changes behavior with no spec yet — offer to reconstruct one. Never silently invent requirements.
2. **Scaffold** `0-draft/<id>/` with `origin: vibe`.
3. **Reverse-engineer** from what was observably built (diff, code, conversation): proposal, delta, design, tasks — templates in `artifacts.md`. Promote significant decisions to ADRs.
4. **Mark uncertainty.** Anything not verifiable from code or conversation becomes `Open question` — never a silent assumption.
5. **Validate via Q&A.** Walk the user through the reconstructed spec; confirm or correct each requirement and open question; record the answers.
6. **Advance** through the normal lifecycle (see `lifecycle.md`). At archive, the delta merges into `current/` and the source of truth becomes truthful.

## Audit (drift)

An audit is the batch form of the reverse path. It reports three directions — **code without spec**, **spec without code**, **contradicting decisions** — proposes the smallest fix for each (add a spec, update a spec, file a change, supersede an ADR), and never rewrites. The queries that power it live in `unix-queries.md`.

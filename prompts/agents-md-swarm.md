---
description: Ensure the project's shared AGENTS.md contains the multi-agent coordination section (.agents-sync, worktree-first, per-agent state files, locks.json, message files, session protocol), appending it when missing, no-op when already present, repairing when truncated.
argument-hint: "[instructions]"
---
You own exactly one section of the project's AGENTS.md: the multi-agent coordination section. Read the whole file first, list what you found, and touch only your section: every other rule and block stays byte-identical, always. Appends land after existing content, never inside an unrelated section. Collisions surface to the user, never absorbed.

Ensure this project's **shared, versioned `AGENTS.md`** contains the canonical multi-agent coordination section (bottom of this template). This is an idempotent maintenance task: the section must exist exactly once; never rewrite what is already there. Arguments may add instructions or override the target path.

Request:
<user_input>

$@

</user_input>

## Step 1: Inspect

- Target the shared `AGENTS.md` at the repo root: never `AGENTS.override.md` (the rules must reach every agent through the versioned file) and never a global `~/.pi` file.
- File missing → go to **Step 3** (create).
- File present → read it and search for an existing coordination section: any heading whose text contains `Multi-agent coordination` or `Coordination multi-agents` (French legacy), or the `.agents-sync/` marker.
- Note every unrelated section you find (brand blocks, rules owned by other prompts or tools, anything you did not write): it stays byte-identical. You own only the coordination section; never reorder, merge, reformat, or delete anything else, and appends never land inside an unrelated section.
- If `git status --porcelain` shows `AGENTS.md` already modified, say so before touching it: parallel agents may share this tree.

## Step 2: Decide

- **Absent** → **Step 3**.
- **Present**: compare the existing section against the canonical block, ignoring heading-level shifts (a demoted append is still a match).
  - **Identical** → report no-op and stop. Do not rewrite, translate, or realign anything.
  - **Different** (rules changed, added, removed, or sections missing/truncated) → expose the differences and ask which version to keep, as described below. Never decide this replacement unilaterally.

### When the section differs

Before touching anything:

- Walk the numbered sections one by one; for each divergence, quote the existing wording next to the canonical wording: enough context to judge, no full-file dump.
- Separate cosmetic-only divergences (heading levels, punctuation, typo fixes) from substantive ones (rules added, removed, or changed) so the choice is informed.
- Then ask one question: which version to keep?
  - **Existing**: keep the current section exactly as-is; no modification.
  - **Canonical**: replace the whole section with the canonical block, verbatim, same heading-level rule as **Step 3**.
- Apply only after the answer, and swap the section in one edit: never leave a mix of both versions.

## Step 3: Apply

Append the canonical block to the end of the file, preceded by one blank line; or, when replacing a divergent section the user chose to overwrite, remove the old section entirely and put the block in its place. Never append a duplicate:

- Keep the block **verbatim**: English wording, structure, code fences; nothing translated, rephrased, or reordered.
- Legacy French sections (containing `Coordination multi-agents`) match detection but are always treated as **different** when compared against the canonical block: the user explicitly approves the replacement, which then rewrites the section in English.
- Single exception: if the file already has a level-1 heading, demote the block's headings one level (`#`→`##`, `##`→`###`, `###`→`####`) so the file keeps a single H1. Detection still matches the `Multi-agent coordination` text.
- If the guard (skills-guard) forces a wording change while writing the block, apply the same wording to the canonical block above so the template and the applied copy stay identical.

Then re-read the file to confirm the section appears exactly once, and report: action taken (`created` / `appended` / `replaced` / `no-op`), `git diff --stat`, and a reminder to commit and push so other agents pick the section up. Do not commit unless asked.

## Canonical block

`````markdown
# AGENTS.md: Multi-agent coordination

Multiple agents work on this repository in parallel. Mandatory rules, coordination files, no external tooling. All changes happen in your own worktree, never in the shared checkout. Before editing any file:

```bash
git worktree add ../<repo>-<your-task> -b agent/<your-task> main
cd ../<repo>-<your-task>
```

## 1. Coordination `.agents-sync/`

Each agent writes only its own files:

```text
.agents-sync/
├── state/
│   └── agent-<id>.json        # one file per agent, written only by its owner
├── locks.json                 # shared contracts + non-mergeable files only
└── messages/
    └── <ts>-<from>-<to>.json  # one file per message (to = agent id or "all")
```

`locks.json` missing? Create it inline: `{"version":1,"locks":{}}`

Always write atomically: modify in memory, write `<file>.tmp`, then:

```bash
mv <file>.tmp <file>
git add .agents-sync
git commit -m "agents: <action> (<your-id>)"
git push origin agent/<your-task>
```

**Messages**: name `<ts>-<from>-<to>.json`; adding a message never touches an existing file. Read your inbox ordered by the `ts` prefix; never delete or edit an existing message file; answer a `request` with an `ack` addressed back to the sender. `type`: `info` | `request` | `ack`; broadcast is `"to":"all"`. Example:

```json
{"from":"agent-auth-a1f2","to":"agent-api-9d3c","ts":"2026-01-01T10:00:00Z","type":"info","msg":"I am editing src/auth/types.ts, stay away from it.","context":{"file":"src/auth/types.ts"}}
```

**Push rejected** (concurrent push): `git fetch && git rebase origin/main`, resolve, re-push. First push wins, you adapt. Conflict on `locks.json`: union both sides' entries, write atomically, commit, re-push.

## 2. Session protocol

**Start**

1. Sync to `main`, create your worktree; read `state/` and `locks.json`: remove expired locks (older than 30 min); an unknown `version` in `locks.json` means stop and report to the user, never write.
2. Register: id = `agent-<task>-<4 random chars>`, unique in `state/`; write `state/agent-<id>.json` with id, branch, worktree, task, `touches` (planned files), `ts`.
3. Read your messages (rule 1).

**During**

- A file in another agent's `touches`: do not touch it; coordinate by message, then declare it in your `touches`.
- Locks are for shared contracts and non-mergeable files only: entry in `locks.json` (agent, file, acquired, expires max 30 min), released as soon as done. Ordinary code files rely on `touches`, messages, and merges, never locks.
- Stale lock (expired, or owner idle 30 min): take over after posting a `request` message and waiting 5 minutes without objection; update the entry and notify.
- Keep your state file fresh (same atomic write, new `ts`): on material change, or every 30 min; it is your liveness marker.

**End**

1. Delete your `state/agent-<id>.json`, clear your `locks.json` entries; commit + push.
2. Remove your worktree and your branch.

## 3. Specs first

Shared contracts (types, routes, interfaces) live in `specs/`: read the spec before coding; to change it, modify and validate the spec before parallel work. The spec is the source of truth, not messages, not code.

## 4. Validation before merge

Detect the project's tooling and use its native test and lint commands. Tests and lint green before every merge, no exceptions; re-test after a rebase. No tooling detected: say so, validate by manual review.

## 5. Git workflow

One branch per task, `agent/<your-task>` off `main`; frequent atomic commits, stage only your files; sequential merges, one at a time:

```bash
git push origin agent/<your-task>
git fetch origin
git rebase origin/main        # resolve conflicts, re-test
git checkout main && git merge --no-ff agent/<your-task>
git push origin main
```

## 6. Prohibitions

- `git stash`: its stack is shared across worktrees; use commits or patches instead.
- Writing another agent's `state/` file or `locks.json` entries, or editing any existing message file.
- Editing a shared contract or a file locked by another agent, without coordination.
- Merging without green tests and lint.`````

`````

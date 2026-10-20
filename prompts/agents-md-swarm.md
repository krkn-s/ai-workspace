---
description: "Ensure the project's shared AGENTS.md contains the multi-agent coordination section (worktree-first, per-agent state files in the clone's shared .git agents-sync directory, locks.json, message files, session protocol), appending it when missing, no-op when already present, repairing or migrating when divergent."
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
- File present → read it and search for an existing coordination section: any heading whose text contains `Multi-agent coordination` or `Coordination multi-agents` (French legacy), a legacy `.agents-sync/` directory reference, or the current state-in-`.git` mechanism (`git rev-parse --path-format=absolute --git-common-dir`).
- Note every unrelated section you find (brand blocks, rules owned by other prompts or tools, anything you did not write): it stays byte-identical. You own only the coordination section; never reorder, merge, reformat, or delete anything else, and appends never land inside an unrelated section.
- If `git status --porcelain` shows `AGENTS.md` already modified, say so before touching it: parallel agents may share this tree.

## Step 2: Decide

- **Absent** → **Step 3**.
- **Present**: compare the existing section against the canonical block, ignoring heading-level shifts (a demoted append is still a match).
  - **Identical** → report no-op and stop. Do not rewrite, translate, or realign anything.
  - **Different** (rules changed, added, removed, or sections missing/truncated; a legacy git-transport section carrying a `.agents-sync/` directory) → expose the differences and ask which version to keep, as described below. Never decide this replacement unilaterally.

### When the section differs

Before touching anything:

- Walk the numbered sections one by one; for each divergence, quote the existing wording next to the canonical wording: enough context to judge, no full-file dump. Name the design change plainly when the whole mechanism differs (legacy: state committed into the repo and carried by git pushes, races resolved by rebase; current: state in the clone's shared `.git` directory, no commits or races).
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

### When replacing a legacy section: migrate the live data

A legacy git-protocol leaves a real `.agents-sync/` data directory in the repo tree (state files, `locks.json`, messages, likely tracked and gitignored). Replacing the AGENTS.md section alone would orphan it, so after the user approved the canonical replacement, ask one question: migrate the live data?
- **Migrate** (default suggestion): copy `state/`, `messages/`, and `locks.json` from `.agents-sync/` into `$STATE` (the shared `.git` directory), remove `.agents-sync/` from the tree (`git rm -r` if tracked, plain delete otherwise) and drop its `.gitignore` entry. Report any expired state or lock skipped during the copy.
- **Fresh start**: delete `.agents-sync/` the same way; in-flight locks and unread messages are lost, say so before the deletion.
- Both options touch tracked files: never run them unilaterally.

## Canonical block

`````markdown
# AGENTS.md: Multi-agent coordination

Multiple agents work on this repository in parallel, each in its own git worktree, never in a shared checkout. Coordination state lives in this clone's shared `.git` directory, so it is visible to every worktree with no commit, push, or merge of state files ever needed. Scope: single machine, agents sandboxed under this repo's tree. Before any edit:

```bash
git worktree add ../<repo>-<your-task> -b agent/<your-task> main
cd ../<repo>-<your-task>
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
mkdir -p "$STATE/state" "$STATE/messages"
```

## 1. Coordination files (in `$STATE`, plain filesystem)

```text
$STATE/
├── state/agent-<id>.json           # one file per agent, written only by its owner
├── locks.json                      # shared contracts + non-mergeable files only
└── messages/<ts>-<from>-<to>.json  # one file per message
```

- Always write atomically (`mv <file>.tmp <file>`); `locks.json` missing: create `{"locks":{}}`.
- State file: id, branch, worktree, task, `touches` (planned files), `ts`; refresh on material change or every 30 min (your liveness marker).
- Messages: `type`: `info` | `request` | `ack`; broadcast `"to":"all"`; read your inbox by `ts` prefix; never edit or delete an existing message file; answer a `request` with an `ack` back to the sender.

## 2. Session protocol

**Start**: pick id = `agent-<task>-<4 chars>`, unique in `$STATE/state`; write your state file; read your inbox.

**During**
- A file in another agent's `touches` or under an active lock: do not touch it; coordinate by message, then declare it in your `touches`.
- Locks for shared contracts and non-mergeable files only, `expires` max 30 min, released as soon as done; ordinary code files rely on `touches` and messages, never locks.
- Stale lock (expired, owner idle 30 min): take over after posting a `request` and waiting 5 min without objection; update the entry and notify.

**End**: delete your state file, clear your lock entries, then merge, one agent at a time:

```bash
# in your worktree: tests and lint green, re-tested after rebase
git fetch origin && git rebase origin/main
# in the primary checkout (holds main), only when it has no uncommitted changes
git merge --no-ff agent/<your-task>
git push origin main    # rejected: fetch, re-rebase in your worktree, retry
```

## 3. Specs first

Shared contracts (types, routes, interfaces) live in `specs/`: the spec is the source of truth; validate a spec change before parallel work depends on it.

## 4. Prohibitions

- `git stash`: shared across every worktree of this clone; use commits or patches.
- Writing another agent's `state/` file or lock entries, editing any existing message file.
- Editing a shared contract or a locked file without coordination; merging without green tests and lint.
`````
---
name: agent-swarm
description: "Coordinate parallel agents, pi or any CLI, on one clone with wt (worktrunk): claim a branch, place its worktree, declare contracts, exchange messages and acks, take the merge lock, merge, handle stale claims. Use before creating a worktree, touching shared contracts, or merging with other agents."
---

# Agent Swarm

Coordinate several agents working in parallel on one clone. Identity is the branch: each agent owns one branch and its worktree. `wt` (worktrunk) does the worktree mechanics and the merge pipeline; pi-worktrunk moves pi sessions between worktrees; this skill carries the coordination protocol on top.

## When to use this skill

- Before creating a worktree or branch for a task in a multi-agent clone.
- Before editing a shared contract or lockfile another agent declared.
- Before merging in a clone where other agents hold claims.
- When a claim, a lock or a worktree looks stale.

## Model

- State lives in the shared git dir under `agents-sync/`. Every worktree of the clone sees it, nothing there is ever committed, and any agent or human can read it.
- Variables do not persist between tool calls; every recipe below re-derives what it needs.
- Identity is the branch. Name task branches `agent/<slug>`. Claim before your first edit, release after the merge. A claim is one directory per branch, written only by its owner: `state/<branch>/` holds `branch`, `task`, `worktree`, `ts`, and an append-only `contracts`.
- Messages are one file each, never edited or deleted. An ack is one empty file. Locks are directories taken with `mkdir`, atomic by nature.
- What the tools already guarantee, do not rebuild: `wt` creates and removes worktrees, runs the merge pipeline (commit, squash, rebase, pre-merge checks, fast-forward, cleanup) and refuses non-fast-forward merges. `git worktree list` is the only liveness signal, trust it over timestamps. pi-worktrunk follows wt directory changes and recovers a session whose worktree vanished.
- When the session sits inside the clone, enter your worktree before editing. pi: call the `worktrunk` tool with `{"command": "switch", "args": ["--create", "agent/<slug>"]}` or run `/wt switch --create agent/<slug>`. Any other agent: `wt switch --create agent/<slug>` from the primary worktree. A branch whose worktree disappeared: `wt switch agent/<slug>` recreates the worktree.
- `wt switch` in a pi bash tool shell never moves the session: shell integration is inactive there, the command prints `Cannot change directory`, creates the worktree, and leaves you in the primary one. You then edit `main` while believing you are on your branch. Inside the clone, switch in pi with the `worktrunk` tool or `/wt` only, and check `git branch --show-current` before your first edit.
- The `worktrunk` tool answers `queued` for `switch` and `merge`: the command runs after your turn. End the turn, do not retry, do not touch files in between.
- The sandbox follows the session, not the clone: after a switch, the primary worktree and its parent are outside the working directory, and so are `~/.config/worktrunk` and `~/.pi/agent`. One literal absolute path aborts the whole bash call. Derive shared paths with `git rev-parse`, keep the rest relative.

## Session above the clone

A project folder often keeps the clone in a subdirectory, so the session starts above it. pi follows worktree moves only inside the repository of its own working directory.

- Resolve the clone before anything: `REPO="$(git -C <dir> rev-parse --show-toplevel)"`. Pass it to every command, with `-C "$REPO"` or by working inside the worktree. From a folder above the clone, a bare `git` reads and writes the parent repository instead.
- Above the clone, every switch destination gets rejected and the session stays where it is. That is the intended setup there, not an error: keep the project-wide view, edit through absolute paths under the worktree.
- Place the worktree inside the clone, so it stays under the project folder and inside the sandbox: `wt switch -C <clone> --create agent/<slug> --path .worktrees/<slug> --no-cd`, with `.worktrees/` gitignored. `--path` resolves from the clone named by `-C`, so the worktree lands inside it. A sibling path such as `../<clone>.<slug>` sits outside both the clone and the sandbox, and nothing can read it.
- `--no-cd` keeps `wt` from announcing a directory change it cannot perform. Run that switch in bash: through the `worktrunk` tool it queues a turn for a move that cannot happen.
- Never fill a worktree with `wt step copy-ignored`, which copied 420 MiB of ignored files in practice. Link `vendor` and `node_modules`, or declare them in the project `wt.toml`.

## Recipes

Run each block as one bash call. Every block re-derives what it needs.

### Claim a branch

Run from inside your worktree, before your first edit. Refuses the default branch and any path collision, and stays idempotent: claiming again refreshes the fields.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
MAIN="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||')"; MAIN="${MAIN:-main}"
[ -n "$BR" ] && [ "$BR" != "$MAIN" ] || { echo "refusing to claim: run this from your task worktree, not $BR" >&2; exit 1; }
mkdir -p "$STATE/state/$BR" "$STATE/messages" "$STATE/acks" "$STATE/locks" || exit 1
printf '%s\n' "$BR" > "$STATE/state/$BR/branch"
printf '%s\n' "<one-line task description>" > "$STATE/state/$BR/task"
printf '%s\n' "$(pwd)" > "$STATE/state/$BR/worktree"
printf '%s\n' "$(date -u +%FT%TZ)" > "$STATE/state/$BR/ts"
```

### Declare a contract

One line per contract, append only, before your first edit to it.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
printf '%s\n' "<contract: file or format, and what must not break>" >> "$STATE/state/$(git branch --show-current)/contracts"
```

Before editing a contract another agent declared, post a request to that branch and wait for the ack. The merge recipe enforces the same rule.

### Read your inbox

Read at start, before your first edit, and before any merge.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
for m in "$STATE/messages"/*.msg; do
  [ -e "$m" ] || continue
  to="$(sed -n 's|^To: ||p' "$m" | head -1)"
  case "$to" in "$BR"|"all") ;; *) continue ;; esac
  id="$(basename "$m" .msg)"
  [ -e "$STATE/acks/$id/$BR" ] && continue
  echo "== $id"
  sed '1,/^$/d' "$m"
done
```

### Ack a message

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
mkdir -p "$(dirname "$STATE/acks/<message-id>/$BR")"
touch "$STATE/acks/<message-id>/$BR"
```

### Post a message

The body is a quoted heredoc: `$` and backticks stay literal. Answer a request with an ack, never by editing the message.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
ID="$(date -u +%s%N)-$(printf '%s' "$BR" | tr '/' '-')"
{ printf 'From: %s\nTo: %s\nType: %s\nDate: %s\n\n' \
    "$BR" "<branch or all>" "info|request" "$(date -u +%FT%TZ)"
  cat <<'EOF'
<body, literal: no shell expansion>
EOF
} > "$STATE/messages/$ID.msg"
echo "posted $ID"
```

### Take the merge lock

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
if mkdir "$STATE/locks/merge" 2>/dev/null; then
  printf '%s %s\n' "$(git branch --show-current)" "$(date -u +%FT%TZ)" > "$STATE/locks/merge/owner"
  echo "merge lock taken"
else
  echo "merge lock held by:"; cat "$STATE/locks/merge/owner"
fi
```

### Release a lock

Only your own. Never steal.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
if [ -f "$STATE/locks/merge/owner" ] && [ "$(cut -d' ' -f1 "$STATE/locks/merge/owner")" = "$BR" ]; then
  rm -rf "$STATE/locks/merge"
else
  echo "merge lock is not yours to release" >&2; exit 1
fi
```

### Status of the clone

One line per claim, then held locks. `GONE` means the worktree vanished from `git worktree list`.

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
find "$STATE/state" -name branch -type f | sort | while read -r f; do
  d="$(dirname "$f")"; br="$(cat "$f")"
  wt="$(cat "$d/worktree" 2>/dev/null)"
  if git worktree list --porcelain | grep -q "^worktree $wt$"; then alive=alive; else alive=GONE; fi
  n=0
  for m in "$STATE/messages"/*.msg; do
    [ -e "$m" ] || continue
    to="$(sed -n 's|^To: ||p' "$m" | head -1)"
    case "$to" in "$br"|"all") ;; *) continue ;; esac
    [ -e "$STATE/acks/$(basename "$m" .msg)/$br" ] || n=$((n+1))
  done
  printf '%s\t%s\tunread:%s\t%s\n' "$br" "$alive" "$n" "$(cat "$d/task" 2>/dev/null)"
done
for l in "$STATE/locks"/*/; do
  [ -f "$l/owner" ] && printf 'lock %s\theld by %s\n' "$(basename "$l")" "$(cat "$l/owner")"
done
```

### Merge recipe

All preconditions, or do not merge: checks green and the tree committable, diff inside your claimed task, every shared contract you touched has an ack, no other merge in progress, and the branch carries its commits already, since `wt` falls back to `Changes to N files` when nothing is committed. Take the lock and fetch:

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
BR="$(git branch --show-current)"
mkdir "$STATE/locks/merge" 2>/dev/null || { echo "merge lock held by:"; cat "$STATE/locks/merge/owner"; exit 1; }
printf '%s %s\n' "$BR" "$(date -u +%FT%TZ)" > "$STATE/locks/merge/owner"
git fetch origin
```

Then run the merge itself.

- Session inside the clone, pi: call the `worktrunk` tool with `{"command": "merge"}` and end your turn; the merge runs, your session lands in the target worktree, and you continue there. Any other agent: `wt merge` from your worktree.
- Session above the clone: `wt merge <target> --branch <slug>` in bash, from the primary worktree. It emits no directory directive, so no move is attempted and no destination gets rejected. Never run `wt merge` from inside the task worktree there: it asks the session to follow to the target, the move is rejected, and the invocation returns exit -1 after the merge already succeeded.
- `failed` or `Rejected Worktrunk destination` after a merge is not proof of failure. Read `git -C <clone> log --oneline -1` before deciding, and never replay the merge.

`wt merge` commits, squashes, rebases, runs the pre-merge checks, fast-forwards the target, removes your source worktree, and never fetches or pushes. Finish in the target worktree:

```sh
git push
rm -rf "$STATE/locks/merge"
rm -rf "$STATE/state/$BR"
```

Failure paths:

- Rebase conflict: resolve it or `git rebase --abort`, retry once. Still stuck: keep your branch, release the lock, push your branch, post a request.
- Red checks: fix them, or release the lock, push your branch, post a request.
- Rejected push: `git fetch origin`, rebase onto the updated target, retest, push again. Give the lock back between attempts if someone waits.
- Out-of-scope diff or un-acked contract: do not merge. Push your branch and post a request.

### Take over a stale claim

A claim is stale when its worktree is gone from `git worktree list`, never because its timestamp aged.

```sh
STALE="<branch>"
WT="$(cat "$STATE/state/$STALE/worktree" 2>/dev/null)"
git worktree list --porcelain | grep -q "^worktree $WT$" && { echo "still alive: do not take over" >&2; exit 1; }
```

Post a request to that branch, wait five minutes for an objection, then:

```sh
rm -rf "$STATE/state/$STALE"
wt switch "$STALE"
```

And claim the branch as yours. Never take over a held lock, and never prune another agent's worktree to force staleness.

### Release

```sh
STATE="$(git rev-parse --path-format=absolute --git-common-dir)/agents-sync"
if grep -q "^$(git branch --show-current) " "$STATE/locks"/*/owner 2>/dev/null; then
  echo "release your locks first" >&2; exit 1
fi
rm -rf "$STATE/state/$(git branch --show-current)"
```

## Failure modes

- Orphan lock: read `locks/<name>/owner`, post a request, wait. Never steal.
- Rejected destination: pi follows a worktree only inside the repository of its working directory. Above the clone, switch with `--no-cd` in bash, and after a merge that landed anyway, verify and continue.
- Wrong directory: check `pwd` before your first edit. A claim made from the wrong worktree points everyone at the wrong path.
- Skill not loaded: the global `AGENTS.md` names this skill before the first edit, for a reason. If you skipped it, read it now.
- Unanswered request: one reminder, then an objection posted to `all`.
- A branch with slashes nests its claim path. A claim that collides with an existing file fails loudly. Keep it that way, it is the fail-closed guard.

## Scaling

Four to eight agents: the limit is review and machine resources, not coordination. Ports, caches, merge queue depth and rebase costs are in `references/scaling.md`; formats, lock semantics and takeover rules are in `references/protocol.md`.
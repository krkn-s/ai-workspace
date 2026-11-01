# Coordination protocol

Formats, semantics and failure modes of the `agents-sync/` state. The skill carries the recipes; this file carries the rules behind them.

## Location and scope

- State lives at `<git-common-dir>/agents-sync/`, shared by every worktree of the clone, never committed. Any agent or human can read it. A new clone starts with no state until an agent claims.
- One machine, one clone. No synchronization across machines or remotes.
- The bash sandbox confines an agent to its worktree, but scripts run from inside the clone can write to the shared git dir. That asymmetry is what makes the protocol work. Never store secrets there.

## Claim state

- One directory per branch: `state/<branch>/`.
- Fields are one file each, holding the raw value on a single line, no key prefix: `branch`, `task`, `worktree`, `ts` (UTC RFC 3339). `contracts` is append-only, one line per contract.
- The owner is the only writer. Claiming again refreshes fields; it never duplicates state.
- A slash in the branch name nests the directory. A claim whose path collides with an existing file fails loudly on `mkdir`: that is the fail-closed guard, do not work around it.
- Liveness comes from `git worktree list` only. Timestamps are display data, never proof. A worktree whose directory moved is not stale; one that left `git worktree list` is.

## Messages and acks

- One file per message: `messages/<epoch-ns>-<from>.msg`, where `<from>` is the sending branch with slashes replaced by hyphens. The nanosecond prefix makes the name unique even for two posts in the same second.
- Format: header lines `From`, `To` (a branch or `all`), `Type`, `Date`, then one blank line, then the body. Types are `info` and `request`. Messages are never edited or deleted.
- An ack is one empty file: `acks/<message-id>/<branch>`. The branch keeps its slashes and nests the path; create the parent directories before the file. A request is answered by an ack from its `To` branch, or by a reply message. An ack silences the request for that branch only.
- The inbox of a branch is every message whose `To` is the branch or `all`, minus the ones it acked.
- Answering late is fine. Answering by editing a message is not possible by design.

## Locks

- A lock is a directory: `locks/<name>/`, taken with `mkdir`, which is atomic: exactly one taker, all others fail.
- The taker writes `locks/<name>/owner` with `<branch> <utc-timestamp>` on one line.
- Release is `rm -rf` of the lock directory, by the owner only. Never steal a lock: report the holder, post a request, wait.
- There is no expiry and no lease. An orphan lock is a lock whose owner branch is gone from `git worktree list` and from the state dir: report it, post a request, and let a human decide. Locks are cheap to wait for, mistakes are not.

## Takeover

- A claim is stale when its worktree is gone from `git worktree list`.
- Recipe: verify staleness, post a request to the branch, wait five minutes for an objection, remove the state dir, `wt switch <branch>` to recreate the worktree, claim the branch as yours.
- Never force staleness by pruning another agent's worktree. Never take over a claim whose worktree is alive, whatever its age.

## Merge order and autonomy policy

- One merge at a time, under `locks/merge`. Checks green, diff inside the claimed task, no un-acked contract edit: merge without asking.
- Conflict, red checks, or a diff beyond the claimed task: do not merge. Push the branch, post a request, and let the owner of the touched contract decide.
- A rejected push means the target moved: fetch, rebase onto the updated target, retest, retry. Release the lock between attempts if another agent is waiting.

## Compatibility

- No version field: the state is disposable by design. When a format changes, delete `agents-sync/` and let agents claim again. Claims describe intent, not history, so losing them costs nothing but re-announcing.
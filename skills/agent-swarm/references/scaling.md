# Scaling to 4 to 8 agents

The coordination protocol does not get slower with more agents: every operation is one directory, one file append, or one `mkdir`. What scales badly is everything around it: review load, rebase cost, machine resources and merge serialization. Plan for those, not for the protocol.

## Merge queue

- Merges serialize on `locks/merge`. At 8 agents the queue is the bottleneck: keep tasks small so each merge is quick, and release the lock the moment it is not needed.
- Rebase cost grows with queue depth. If three merges land while you work, your rebase is against all three. Rebase onto the target branch after every fetch that shows movement, not only at merge time.
- Small diffs merge without conflict even on shared files most of the time. Big diffs almost never do. Split work so that two agents are unlikely to edit the same region: one task per coherent concern.

## Ports

- Running services: give each worktree its own port. `wt` templates expose `hash_port`, a stable unique port per worktree; declare the port in your claim `task` line so others can reach or avoid it.
- Two agents on the same port are the most common cross-agent breakage on a single machine. Declared ports make it visible before it happens.

## Caches and dependencies

- `wt` can carry ignored directories (dependency caches, build dirs) into new worktrees. On APFS, btrfs and XFS the copy is reflinked and nearly free.
- On ext4 there are no reflinks: every worktree copies in full. Budget disk for 8 worktrees, each with its own `node_modules`, `target/` or equivalent. Prepare dependencies with wt `post-start` hooks so the cost is paid once per worktree, not per agent attempt.

## Review and autonomy

- The autonomy policy from `references/protocol.md` keeps humans out of the loop only when merges are green, in-scope and conflict-free. Everything else becomes a pushed branch plus a request.
- Requests pile up at the end of a batch. Batch your acks and objections: read the inbox at fixed points (start, before each edit on a shared contract, before merge) instead of continuously.
- The real limit at 8 agents is attention: review, arbitration and takeover decisions. If requests wait hours, the bottleneck is people, not the protocol.

## Machine resources

- 8 agents means 8 test suites and possibly 8 dev servers. Stagger heavy runs, or the machine becomes the flaky test.
- `wt list` shows markers per worktree, and the status recipe shows claims, unread messages and locks. Watch both, not the filesystem.

## Cleanup

- Release claims and worktrees promptly after merges. A clone with 8 live worktrees and 12 stale claims is where mistakes start.
- The `GONE` line in the status recipe is the takeover queue: sweep it at the start of a session, not the end.
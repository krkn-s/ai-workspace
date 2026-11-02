# ai-workspace

Personal catalog of installable pi extensions, skills, and prompt templates. 

`README.md` lists every extension, skill, and prompt: keep it in sync when adding or removing one.

## Extensions

- Each extension documents itself in its own `README.md`; the root `README.md` lists one-liners only.

## Skills

- `description` in the frontmatter is a router, not a summary: English, 150 to 300 characters, naming the situations and artifacts that should load the skill. 
- Keep `SKILL.md` under 400 lines; push depth into `references/` subfolder.
- Third-party skills: copy verbatim, add a note at the top of the body crediting repo, author, and license, and keep the license file in the skill folder.

## Prompts

- One prompt per file, directly in `prompts/`: discovery is non-recursive. English body and frontmatter.

## Frontmatter

- Avoid `: ` in an unquoted value: it breaks parsing. Re-check the frontmatter after editing a `SKILL.md` or a prompt.

## Multi-agent coordination

Several agents may work in this clone at once, one branch and one worktree per task, managed with `wt` (worktrunk). Read the `agent-swarm` skill before claiming a branch, editing shared contracts, or merging.

- Identity is the branch. Claim it under `agents-sync/` in the shared git dir before your first edit, release after the merge. Nothing there is ever committed.
- Enter your worktree before editing: pi uses the `worktrunk` tool or `/wt switch --create`; other agents run `wt switch --create`. `wt switch` in a pi bash shell creates the worktree but never moves the session.
- Declare shared contracts and lockfiles, not files: each worktree has its own copy. Before touching another agent's declared contract, post a message and wait for the ack.
- One merge at a time: take the merge lock, `git fetch`, run the merge recipe from the skill, `git push`, release. A rejected push means fetch, rebase, retest, retry.
- Never remove or prune another agent's worktree. A stale claim whose worktree is gone from `git worktree list` follows the takeover recipe: request, wait, take.
- If `wt` or the `worktrunk` tool is missing, say so and stop: the owner installs them. Do not improvise a replacement protocol.

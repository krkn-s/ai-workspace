---
description: "Update the repo's `AGENTS.md` from the finished Pi sessions of that repo: extract the durable facts a future session should know, keep only the ones evidence backs, and get each addition approved one at a time before writing it."
argument-hint: "[session count | time range | subdirectory]"
---
Mine the finished Pi sessions of the current repo for durable facts a future session should know, then update the root `AGENTS.md`. Write only facts those sessions prove. Touch no other file, commit nothing.

Denied access to the sessions does not stop the mission: apply section 1.

The request sits inside `<user_input>`.

<user_input>

$@

</user_input>

Start by checking session access (section 1), then report the number of sessions found and the period they cover.

## 1. Check session access

Before any analysis, test that the session folder can be read, for example with `ls ~/.pi/agent/sessions` or `head -1 ~/.pi/agent/sessions/*/*.jsonl`. Three cases.

- Read allowed: the source is `~/.pi/agent/sessions/`, continue.
- Read denied by the permission policy (`external_directory_read`, `bash` included): do not give up and do not ask me for an authorization. Print the command below adapted to the real path, say it must be run by me in my terminal because the policy also blocks `cp` on the Pi side, then wait for my confirmation. The source becomes `tmp/sessions/`, to pass in `SESSIONS` for the section 3 commands.
- `tmp/sessions/` already holds a copy: use it as is, copy nothing again.

```bash
mkdir -p tmp/sessions && cp -r ~/.pi/agent/sessions/--$(pwd | sed 's|^/||; s|/|-|g')--/. tmp/sessions/
```

The folder name is the flattened `cwd`, described in section 3. Copy only that repo's folder, never all of `~/.pi/agent/sessions`. `tmp/` stays untracked by git: offer to delete `tmp/sessions/` at the end and note it in the report.

## 2. Scope

- Target: `AGENTS.md` at the repo root, created when missing. If only a `CLAUDE.md` exists, update that one and tell me.
- Default: the 40 most recent sessions whose header `cwd` is the repo root or a directory below it.
- Arguments: `60` = 60 sessions, `30d` = last 30 days, `src/api` = that subtree. Combine them when several are given.
- Skip sessions from other repos and sessions with fewer than three messages.

## 3. Find and read the sessions

Shape: `~/.pi/agent/sessions/--<flattened path>--/<timestamp>_<id>.jsonl`, where the `cwd` loses its leading `/` and has its `/` replaced by `-`. The fallback copy keeps the same files, flat in `tmp/sessions/`. Each file is JSONL in an `id`/`parentId` tree, with a first line like `{"type":"session","cwd":...}`.

```bash
# 1) sessions of the current repo, newest first
SESSIONS="$HOME/.pi/agent/sessions"   # tmp/sessions after the section 1 fallback
for f in "$SESSIONS"/*.jsonl "$SESSIONS"/*/*.jsonl; do
  [ -f "$f" ] || continue
  cwd=$(head -1 "$f" | jq -r '.cwd // empty')
  case "$cwd" in "$PWD"|"$PWD"/*) printf '%s\t%s\n' "$(stat -c %Y "$f")" "$f" ;; esac
done | sort -rn | head -40 | cut -f2

# 2) inside a session: commands run and their outcome
jq -r 'select(.type=="message") | .message
  | if .role=="assistant" then (.content[]? | select(.type=="toolCall")
      | "CALL\t" + .name + "\t" + (.arguments.command // .arguments.path // ""))
    elif .role=="toolResult" then "RESULT\t" + .toolName + "\t" + (if .isError then "ERROR" else "ok" end)
    elif .role=="bashExecution" then "SHELL\t" + (.exitCode|tostring) + "\t" + .command
    else empty end' "$f"

# 3) files touched, by frequency
jq -r 'select(.type=="message" and .message.role=="assistant") | .message.content[]?
  | select(.type=="toolCall" and (.name=="edit" or .name=="write")) | .arguments.path' "$f" \
  | sort | uniq -c | sort -rn
```

Ignore `system` role messages, which carry prompts and tool definitions: bulky and worthless here. Read in batches and stop as soon as facts repeat. When direct access is denied, apply section 1 before continuing: without the files, no fact is provable.

## 4. What counts as a retained fact

A verifiable piece of information that changes how one works in this repo:

- the command that works where the obvious one fails (`python -m pytest` instead of `pytest`);
- a prerequisite: service to start, environment variable, tool version, build step before a test;
- a non-guessable location: generated files, migrations, local config, fixtures;
- a convention actually applied in the code: naming, test structure, error handling;
- a recurring trap: file not to touch, flaky test, known workaround.

Reject generalities, advice a good model already applies, the detail of a one-off task, the history of corrections, and my personal preferences unrelated to the repo.

## 5. Evidence bar

- Keep a fact seen in at least two sessions, explicitly confirmed by me, or verified by yourself now.
- Check the fact still holds today when cheap: path exists, command present, config readable. A stale fact is worse than a missing one.
- Fix or delete an existing fact a session contradicts, and report it.
- Never guess the cause of an error. With no established cause, keep no workaround.

## 6. Get each addition approved, one at a time

Present the facts one at a time, never as a batch, and wait for my answer before writing.

For each candidate addition:

1. show the exact text you would write, complete bullet, with the target section;
2. explain why: the evidence (sessions involved, command, output) and what it concretely saves a future session;
3. ask for my agreement with an `ask_user_question` call dedicated to that single fact, with two options: `Yes, add it` and `No, drop it`. Without that tool, ask in text and wait.

As soon as I accept, write the bullet into `AGENTS.md` before moving to the next fact. What is approved stays acquired if I interrupt the conversation. If I refuse, never propose it again.

Same treatment for a modification or a deletion, one at a time: current text, proposed text, reason, then my decision. Never rewrite an existing passage without my explicit agreement.

If I answer anything other than yes or no (rephrasing, another section, "to be checked"), apply my answer and note it in the report.

When the loop is over, list the candidates you dropped yourself, with the reason: evidence too weak, fact already obvious, fact already present in the file.

## 7. Writing

- Follow the existing file's structure and language. When absent or empty, start from `# <repo name>` followed by short `##` sections: Commands, Prerequisites, Structure, Conventions, Traps. No empty section.
- Short bullets, one piece of information per bullet. No table, no emoji, no HTML.
- Never copy a secret found in a session (key, token, password, email, private IP). Name the variable, never its value.
- No absolute path specific to my machine: paths relative to the repo.
- Do not repeat what `~/.pi/agent/AGENTS.md` says. The repo does not recopy the global rules.
- Target: under 120 lines. Beyond that, propose a cut.
- Small targeted changes, never a full rewrite.

## 8. Final report

- The source used (`~/.pi/agent/sessions/` or the `tmp/sessions/` copy) and the number of sessions read.
- The modified file, with the number of lines added and removed.
- A table of retained facts and their evidence.
- The facts I refused.
- The facts you dropped yourself, and why.
- What you could not verify.
- The date of the next useful review.

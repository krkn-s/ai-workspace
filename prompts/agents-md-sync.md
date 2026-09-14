---
description: Verify this project's AGENTS.md against ~/.pi/agent/AGENTS.md policies and ~/.pi/agent/APPEND_SYSTEM.md execution principles — flag conflicts, duplication, stale or ungrounded rules, then realign the file in lean compact Markdown. Déclenche aussi en français — vérifier ou réaligner l'AGENTS.md d'un projet par rapport aux règles globales et aux principes d'exécution, détecter contradictions, doublons et règles obsolètes.
argument-hint: "[focus or instructions]"
---
Verify that this project's agent instruction file agrees with the global rules — `~/.pi/agent/AGENTS.md` and `~/.pi/agent/APPEND_SYSTEM.md` only, not the full directory cascade — then realign it when it does not. Arguments may scope the audit to a section or add instructions.

Request:
<user_input>

$@

</user_input>

## Step 1 — Load the baseline

- The global baseline is already in context — `~/.pi/agent/AGENTS.md` (tool preferences, Git workflow, language policy) and `~/.pi/agent/APPEND_SYSTEM.md` (execution principles — act directly, change boundaries, verification honesty, concise responses). Re-read both files if in doubt.
- Read the project file — `AGENTS.override.md` if present, else `AGENTS.md`. If neither exists, propose creating a lean one grounded in the repo and the global rules, then stop.
- Inspect the repo to ground every judgment — stack, lockfiles, scripts, CI, conventions the code actually follows. Never invent commands or paths.
- If `git status --porcelain` shows the target file already modified, say so before touching it — parallel agents may share this working tree.

## Step 2 — Audit every rule

Classify each existing rule and each missing area:

- **Conflict** — contradicts the global AGENTS.md or an APPEND_SYSTEM.md principle (permission-asking rules, mandatory plans or status reports, blanket full-suite runs, tooling or language drift). Default realignment is toward the global baseline.
- **Duplicate** — restates a global rule verbatim or near-verbatim. Remove it — pi already loads the global files, repetition only costs tokens — unless the file must stand alone for other tools; ask when unclear.
- **Stale** — references commands, paths, scripts, or conventions the repo does not actually have.
- **Gap** — a global policy domain (Git workflow including multi-agent worktree rules, tool preferences, language) that matters for this repo but has no project-specific instantiation, for example the docs-only direct-commit exception or a CI-sensitive push rule. Add only when it prevents a real mistake.
- **Style** — compact Markdown violations — multiple H1s, H4+, decorative HTML or emoji, unlabeled code fences, bloat.

## Step 3 — Report, propose, realign

Reply with:

### Findings
Grouped by class above — for each, the rule, why it fails, and the action (realign / remove / instantiate / keep as explicit override).

### Proposed file
The complete realigned replacement in one Markdown code block — one H1, H2/H3 sections, short bullets, every remaining rule passing the lean bar (prevents a recurring or costly failure, not inferable from the repo or its tools, universal for the file's scope, clearly stated).

### Questions
Only when a real decision exists — keep a divergence as an explicit override (`Overrides global X because Y`) versus realign, standalone-file requirement, scope cuts. One concise question per decision; skip when the answer is obvious.

### Rationale
At most five bullets — main tradeoffs and deliberate omissions.

Apply the replacement only after confirmation. Compact while rewriting — never drop facts or meaning.

## Step 4 — Verify

- Re-check the applied file against the global rules — no contradiction, no duplication, explicit overrides only.
- Confirm every rule is grounded in the repo and the file renders as plain GFM.
- Show `git diff --stat` for the change. Do not commit unless asked — other agents may be working in this tree.

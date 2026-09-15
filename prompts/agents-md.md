---
description: Create, improve, or realign the project's agent instruction file — AGENTS.md by default, any other instruction file (CLAUDE.md, system prompt, rules or skill instructions) when named. Creation is always aligned with the global baseline (~/.pi/agent/AGENTS.md + APPEND_SYSTEM.md), existing files are audited for conflicts, duplication, stale rules, and gaps, every real decision or conflict goes back to the user, and the output always follows the compact skill's Markdown style. Déclenche aussi en français — créer, optimiser ou resynchroniser l'AGENTS.md d'un projet avec les règles globales, exposer les conflits et demander à l'utilisateur, format compact obligatoire.
argument-hint: "[instruction, focus, or file]"
---
One prompt, three outcomes, routed automatically — **create** the file when missing, **improve** it when it exists but underperforms, **realign** it when it disagrees with the global baseline. Optimization and synchronization are a single audit pass. In every mode the global files in `~/.pi/agent/` are the reference, real decisions go back to the user, and the result always follows the compact skill's Markdown style (loaded alongside this prompt).

Request:
<user_input>

$@

</user_input>

## Step 1 — Locate and ground

- A specific file is named (CLAUDE.md, system prompt, rules file, skill instructions) → target that file. Otherwise read `AGENTS.override.md` if present, else `AGENTS.md` at the project root.
- No file found → go to **Create**.
- Inspect the repo to ground every judgment — languages and frameworks, lockfiles and package manager, scripts, linters/formatters, test and CI setup, conventions the code actually follows. Never invent commands, paths, or conventions.
- If `git status --porcelain` shows the target file already modified, say so before touching it — parallel agents may share this tree.

## Step 2 — Load the baseline

- The global baseline is already in context — `~/.pi/agent/AGENTS.md` (tool preferences, Git workflow including multi-agent worktree rules, language policy) and `~/.pi/agent/APPEND_SYSTEM.md` (execution principles — act directly, change boundaries, verification honesty, concise responses). Re-read both files if in doubt.
- Every mode answers to this baseline — created files must agree with it from the first draft; existing files are audited against it.

## Step 3 — Audit every rule (one pass — quality and alignment)

Classify each existing rule and each missing area:

- **Conflict** — contradicts the global baseline or another rule of the file (permission-asking rules, mandatory plans or status reports, blanket full-suite runs, tooling or language drift). Default realignment is toward the baseline.
- **Duplicate** — restates a global rule verbatim or near-verbatim; remove it — repetition only costs tokens — unless the file must stand alone for other tools (ask).
- **Stale** — references commands, paths, scripts, or conventions the repo does not actually have.
- **Gap** — a global policy domain that matters for this repo but has no project-specific instantiation (for example a CI-sensitive push rule or the docs-only direct-commit exception). Add only when it prevents a real mistake.
- **Lean failures** — rules that ask permission for ordinary changes, impose global naming or style over local conventions, invite unrelated cleanup, duplicate what linters or CI already enforce, or use vague language ("be smart", "ensure quality"). Merge or remove — every kept rule must prevent a recurring or costly failure, give info the agent cannot infer, be universal for the file's scope, and be clearly stated.
- **Style** — compact-markdown violations — multiple H1s, H4+, decorative HTML or emoji, unlabeled code fences, bloated paragraphs.

## Step 4 — Report, ask, propose

Reply with:

### Findings
Grouped by class above — for each, the rule, why it fails, and the recommended action.

### Decisions
Conflicts and judgment calls go back to the user, never resolved unilaterally — a divergence kept as explicit override versus realigned, a duplicate removed versus kept for standalone use, scope cuts, rules that contradict each other inside the file. Present concrete options with the tradeoff in one line; one question per decision; skip only when the answer is obvious.

### Proposed file
The complete file in one Markdown code block — created or rewritten, whichever this run called for — already integrating the user's answers, in compact format.

### Rationale
At most five bullets — main tradeoffs and deliberate omissions.

Apply the replacement only after the user confirms.

## Create (file missing)

Draft the leanest file that agrees with the global baseline from the start:

- **Stack & tooling** — frameworks, package manager, exact build/run/test/lint commands that are not obvious from lockfiles and scripts.
- **Conventions** — patterns the codebase follows that a stranger would get wrong.
- **Boundaries** — irreversible or risky operations that need confirmation, scoped to real risk.

Drop any section that would say nothing; never restate global rules — agreement means no contradiction, not a copy. Prefer concrete ("use `bun test`") over blanket ("always run the full suite before committing").

## Format — compact, always

The compact skill is loaded alongside this prompt in every project — apply its recipe and checklist to the proposed file: exactly one H1, H2/H3 outline, short bullets, sparing bold, language-tagged code fences, simple tables, no decorative HTML or emoji. Never drop facts or meaning while compacting. When the file follows a deliberate house style that conflicts with compact (tooling expecting deeper headings), preserve the intent and note the deviation instead of silently breaking tooling.

## Rules for this task

- Ground everything in the actual file and repo; cite real commands and paths.
- Prefer the smallest file that covers the genuine gaps; if it grows long, move directory- or task-specific rules closer to where they apply.
- After applying, show `git diff --stat`. Do not commit unless asked — other agents may be working in this tree.

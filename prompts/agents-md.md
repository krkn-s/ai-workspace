---
description: "Create, improve, or realign the project's agent instruction file: AGENTS.md by default, any other instruction file (CLAUDE.md, system prompt, rules or skill instructions) when named. Creation is always aligned with the global baseline (~/.pi/agent/AGENTS.md + APPEND_SYSTEM.md), existing files are audited for conflicts, duplication, stale rules, and gaps, every real decision or conflict goes back to the user, and the output always follows the compact skill's Markdown style."
argument-hint: "[instruction, focus, or file]"
---
One prompt, three outcomes, routed automatically: **create** the file when missing, **improve** it when it exists but underperforms, **realign** it when it disagrees with the global baseline. Audit and synchronization run as three passes: remove dead rules first, audit the quality of what survives, then align with the baseline. Every real decision goes back to the user, and the result follows the compact skill's Markdown style (loaded alongside this prompt).

Request:
<user_input>

$@

</user_input>

## Step 1: Locate and ground

- A specific file is named (CLAUDE.md, system prompt, rules file, skill instructions) → target that file. Otherwise read `AGENTS.override.md` if present, else `AGENTS.md` at the project root.
- No file found → go to **Create**.
- Inspect the repo to ground every judgment: languages and frameworks, lockfiles and package manager, scripts, linters/formatters, test and CI setup, conventions the code actually follows. Never invent commands, paths, or conventions.
- No language, framework, lockfile, or build script in evidence, or the user explicitly asks which stack to pick → run **Stack proposal** before drafting.
- A project that already has code is audited as-is, even without a lockfile (plain PHP, a scripts folder): record what it uses, never push to re-stack it.
- If `git status --porcelain` shows the target file already modified, say so before touching it: parallel agents may share this tree.

## Step 2: Load the baseline

- The global baseline is already in context: `~/.pi/agent/AGENTS.md` (tool preferences, Git workflow including multi-agent worktree rules, language policy) and `~/.pi/agent/APPEND_SYSTEM.md` (execution principles: act directly, change boundaries, verification honesty, concise responses). Re-read both files if in doubt.
- Every mode answers to this baseline: created files agree with it from the first draft; existing files are audited against it.

## Step 3: Audit every rule (three passes: deletion, quality, alignment)

Classify each existing rule and each missing area:

- **Conflict**: contradicts the global baseline or another rule of the file (permission-asking rules, mandatory plans or status reports, blanket full-suite runs, tooling or language drift). Default realignment is toward the baseline.
- **Duplicate**: restates a global rule verbatim or near-verbatim; candidate for removal. Repetition can help adherence, but it is paid on every session, and the file may be read by tools that lack the global baseline: always ask before removing one.
- **Stale**: references commands, paths, scripts, or conventions the repo does not actually have.
- **Gap**: a global policy domain that matters for this repo but has no project-specific instantiation (a CI-sensitive push rule or the docs-only direct-commit exception). Add only when it prevents a real mistake.
- **Lean failures**: rules that ask permission for ordinary changes, impose global naming or style over local conventions, invite unrelated cleanup, duplicate what linters or CI already enforce, or use vague language ("be smart", "ensure quality"). Merge or remove: every kept rule must prevent a recurring or costly failure, give info the agent cannot infer, be universal for the file's scope, and be clearly stated.
- **Never generate**: a static codebase description, meaning an overview or directory listing (the agent discovers structure itself, and a description goes stale); code-style or naming rules (linters and formatters are deterministic and cheaper); and any instruction that only applies sometimes. Explicit architectural constraints (layering, imposed or forbidden patterns) do not fall under this: they are exactly what the agent cannot infer. This file loads in every session, so every line is paid on every task: keep the instruction count small.
- **Style**: compact-markdown violations; see **Format** for the rules.
- **Protected sections**: sections owned by another tool or prompt (for example `## Brand` written by `/agents-md-brand`, coordination blocks written by other tooling): leave byte-identical unless the user explicitly asks to touch them; merging or reformatting them is out of scope for this prompt. Report them as present, untouched.

## Step 4: Report, ask, propose

Reply with:

### Findings
Grouped by class above: for each, the rule, why it fails, and the recommended action.

### Decisions
Conflicts and judgment calls go back to the user, never resolved unilaterally: a divergence kept as explicit override versus realigned, a duplicate removed versus kept for standalone use, scope cuts, rules that contradict each other inside the file. Present concrete options with the tradeoff in one line; one question per decision; skip only when the answer is obvious.

### Proposed file
The complete file in one Markdown code block: created or rewritten, whichever this run called for, already integrating the user's answers, in compact format.

### Rationale
At most five bullets: main tradeoffs and deliberate omissions.

Apply the replacement only after the user confirms.

For an existing file, the passes run in order: deletion first (list every rule with its verdict, delete / merge / keep, and the reason; get the removals validated), then the quality audit on the slimmer file, then the baseline alignment.

## Stack proposal

Runs on a greenfield project, or when the user explicitly asks which stack to pick.

Ask in one batch, skip what the request already answers: what the project does and for whom; where it runs and is deployed (host, OS, container, local only); expected load and data sensitivity; who maintains it and for how long; constraints (licences, team skills, integrations).

Then propose 2-3 stacks, best fit first, one line of tradeoff each. Criteria, in this order: fewest dependencies for the most result; secure defaults; mainstream and well documented (fewer invented APIs); stable versions confirmed against the registry or official docs, never "latest".

Preferred defaults, as suggestions: web application = PHP 8.4 with Laravel 13+, Livewire 4+, AlpineJS 3+ and TailwindCSS 4+, plus Filament 5+ when an admin panel is needed (PHP 8.4 is the ceiling on O2switch shared hosting; drop Filament without a back office, drop Alpine when Livewire covers the interactivity). Anything else, services and CLIs included = Rust first, saying plainly when Rust is a poor fit (heavy GUI, prototype under deadline, thin crate coverage). Reject a stack that only survives by stacking libraries, and a version that is not yet stable.

Record the confirmed stack in the file under **Stack & tooling**, with versions.

## Dependency references (`.refs/`)

Read `vendor/`, `node_modules/`, and the Cargo registry first: the source of every dependency is already there. Clone into `.refs/` only the documentation a package does not ship, pinned to the lockfile version and shallow (`git clone --depth 1 --branch <tag> <url> .refs/<name>`), never `main`. Report any newer stable release instead of bumping on your own. Keep `.refs/` in `.gitignore`, and write the recreation commands into the generated file, so a fresh clone or CI can rebuild what the file claims to rely on.

## Create (file missing)

**Ground or ask.** A brand-new project may leave nothing to inspect: if the repo is empty or yields no real evidence (no code, no lockfile, no scripts), grounding fails; ask one batch of questions instead of drafting guesses: stack and frameworks (see **Stack proposal**), package manager, the real build/run/test/lint commands, working conventions wanted, and the risky operations that should require confirmation. Skip only what the user's request already answers. Once answered (or once the repo yields real evidence), draft.

Draft the leanest file that agrees with the global baseline from the start, in this order:

- **Purpose**: what the project does and for whom, one or two lines. Intent the code cannot state.
- **Stack & tooling**: frameworks with versions, package manager, and the exact build, run, test and lint commands that are not obvious from lockfiles and scripts.
- **Reference sources**: `.refs/` (see **Dependency references**), only when the project has vendored dependencies.
- **Conventions**: patterns the codebase follows that a stranger would get wrong.
- **Boundaries**: irreversible or risky operations that need confirmation, scoped to real risk.

Drop any section that would say nothing; never restate global rules: agreement means no contradiction, not a copy. Long or task-specific material goes to its own file, referenced here in one line. Prefer concrete ("use `bun test`") over blanket ("always run the full suite before committing").

## Format: compact, always

Load the compact skill before proposing the file; it is installed globally in this setup. If it is not available in the session, follow the conventions below: exactly one H1, H2/H3 outline, short bullets, sparing bold, language-tagged code fences, nested lists for comparisons (never tables), no decorative HTML or emoji. One line carries one rule or one pointer: prefer a pointer (`file:line`, a doc path) over a copied snippet that will go stale. Never drop facts or meaning while compacting. When the file follows a deliberate house style that conflicts with compact (tooling expecting deeper headings), preserve the intent and note the deviation instead of silently breaking tooling.

The rewrite never absorbs protected sections silently: they stay byte-identical, and anything ambiguous is shown to the user as a diff before the replacement.

## Rules for this task

- Ground everything in the actual file and repo; cite real commands and paths.
- Target the smallest file that does the job: one rule or pointer per line, cut rather than merge, and drop any rule that does not prevent a real, recurring mistake. The budget applies outside the sections owned by other prompts (`## Brand`, the coordination block). If the file still grows long, move directory- or task-specific rules closer to where they apply.
- Long user instructions usually arrive as a file path argument (multiline `$@` joins arguments with spaces): if the argument references a file, read it instead of trusting the joined string.
- After applying, show `git diff --stat`. Do not commit unless asked: other agents may be working in this tree.

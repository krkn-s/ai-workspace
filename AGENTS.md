# AGENTS.md

This repository is a **catalog of installable agent skills, pi prompt templates, and pi extensions**, not a software project. There is no build, test, or lint step: everything is Markdown.

## Layout

- `extensions/<name>/` (pi extension package; self-documenting in its own README)
- `skills/<name>/SKILL.md`: one skill per folder; `references/` holds deeper docs.
- `prompts/<name>.md`: pi prompt templates; the filename (without `.md`) becomes the `/name` command.
- `README.md`: three-section catalog list (`extensions`, `skills`, `prompts`). Keep it in sync when adding or removing items.

## Skill conventions

- Frontmatter: `name` and `description` only. `description` is the **primary trigger**: English only, 150 to 280 characters, naming the situations and artifacts that should load the skill. The model routes on meaning, so a French request matches an English description; no French clause, no second trigger enumeration, no cross-skill routing.
- Body detail is free, trigger detail is not: workflow steps, feature lists, and "route X to Y" belong in the body, which loads on demand. `1024` characters is the tooling limit, not a budget.
- Keep `SKILL.md` under ~500 lines; push detail into `references/`.
- **Imported third-party skills**: copy verbatim, keep the original code untouched, and add a note at the top of the body crediting the source repo, original author, and license, with the third-party license file kept inside the skill folder (see `skills/browser-tools`).

## Prompt conventions

- Follow the pi prompt-template format (see pi's docs: `docs/prompt-templates.md` for frontmatter fields, argument syntax, and loading rules).
- One prompt per file, directly in `prompts/` (discovery is non-recursive).
- 100% English: bodies AND frontmatter descriptions.
- Multiline user instructions are lossy with `$@` (arguments join with spaces); prompts that take long instructions should accept a file path argument.

## YAML pitfall

Avoid `: ` (colon + space) inside unquoted frontmatter values: it breaks parsing. Re-check the frontmatter after editing any `SKILL.md` or prompt.

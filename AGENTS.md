# ai-workspace

Personal catalog of installable pi extensions, skills, and prompt templates.

`README.md` lists every extension, skill, and prompt: keep it in sync when adding or removing one.

## Setup and checks

- No build step: pi installs the repo from git and loads extensions from source; `bun test` at the root runs every suite, each one next to the source it covers.

## Extensions

- Each extension documents itself in its own `README.md`; the root `README.md` lists one-liners only.

## Skills

- `description` in the frontmatter is a router, not a summary: English, 150 to 300 characters, naming the situations and artifacts that should load the skill.
- Keep `SKILL.md` under 400 lines; push depth into a `references/` subfolder.
- Third-party skills: copy them verbatim, add a note at the top of the body crediting repo, author, and license, and keep the license file in the skill folder.

## Prompts

- One prompt per file, directly in `prompts/`: discovery is non-recursive. English body and frontmatter.

## Frontmatter

- Quote any value that contains `: `; unquoted, it breaks parsing.

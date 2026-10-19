# skills-guard

Deterministic enforcement of the mechanical rules of the `prose` and `compact` skills. It scans every `write`, `edit`, and `bash` call and **blocks the call** until the model fixes the violations. Skill guidance is judgment; this extension is the gate.

## Enforced rules — prose skill

- Em dash `U+2014` (—), any spacing — banned as pause/aside
- Typographic ellipsis `U+2026` (…) — converts to three dots
- Zero-width spaces, joiners, BOM, soft hyphen (`U+200B U+200C U+200D U+FEFF U+00AD`) — never legitimate
- En dash `U+2013` used as a pause — blocked when **both** neighbours are non-digits; numeric ranges like `10–18` pass

## Enforced rules — compact skill

- **Never a Markdown table** — a nested list instead (parent = row key, children = values)
- **No H4-H6 headings** — flatten to H2/H3 or a list
- **No lists nested 4+ levels deep** — split into sections
- Code fences are excluded from these three checks (a table inside a fenced block is documentation, not a violation)

## What is deliberately not scanned

- Path arguments (a flag named `path`/`file_path`): identifiers, not prose
- Smart quotes, NBSP, guillemets — legitimate French typography, left to the skill's judgment
- Words to watch, banned openers, decorative emoji — judgment rules, they stay in the skill

## Behaviour

On `tool_call` for `write`/`edit`/`bash`: walk every string value in the input (skipping path keys), count violations per rule, include line numbers, hint the model to load the matching skill (`prose`, `compact` when their rules fired), and return `{ block: true, reason }`. The model reads the full SKILL.md from its available-skills list and retries compliant.

## Limitations

- Only reaches writes performed through the `write`/`edit`/`bash` tools. Prose typed by the user, existing files, and externally written files are not scanned.
- Structure checks ignore fenced code blocks but not indented (4-space) code blocks.

## History

Starts as `prose-guard` (prose-character gate), renamed `skills-guard` when the compact rules were added.
Run `pi reload` after editing this file.
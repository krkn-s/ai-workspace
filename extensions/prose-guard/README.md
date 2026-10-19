# prose-guard

Deterministic enforcement of the mechanical rules of the `prose` skill (formerly `human-prose`): it scans every `write` and `edit` tool call for characters the skill bans and **blocks the call** until the model rewrites them. Skill guidance is judgment; this extension is the gate.

## What is blocked (hard)

- Em dash `U+2014` (—), any spacing — banned as pause/aside by the skill
- Typographic ellipsis `U+2026` (…) — skill converts to three dots
- Zero-width spaces, joiners, BOM, soft hyphen (`U+200B U+200C U+200D U+FEFF U+00AD`) — never legitimate
- En dash `U+2013` used as a pause — blocked when **both** neighbours are non-digits; numeric ranges like `10–18` pass

## What is deliberately not scanned

- Path arguments (a flag named `path`/`file_path`): identifiers, not prose
- Smart quotes, NBSP, guillemets — legitimate French typography, left to the skill's judgment
- Words to watch, banned openers — judgment rules, they stay in the skill

## Behaviour

On `tool_call` for `write`/`edit`: walk every string value in the input (skipping path keys), count violations per character class, report line numbers inside large texts, and return `{ block: true, reason }` with the list. The model sees the reason and must fix and retry.

## Limitations

- Only reaches file writes performed through the `write`/`edit` tools. Prose typed by the user, existing files, and `bash`-written files are not scanned.
- Run `pi reload` after editing this file.
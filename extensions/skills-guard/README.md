# skills-guard

Deterministic enforcement of the mechanical rules of the `prose` and `compact` skills. It scans every `write` and `edit` call, plus bash heredocs explicitly redirected to a file. It blocks the call until the model fixes the violations. Skill guidance is judgment; this extension is the gate.

## Enforced rules: prose skill

- Em dash `U+2014`, any spacing: banned as pause or aside
- Typographic ellipsis `U+2026`: converts to three dots
- Zero-width spaces, joiners, BOM, soft hyphen (`U+200B U+200C U+200D U+FEFF U+00AD`): never legitimate
- En dash `U+2013` used as a pause: blocked when both neighbours are non-digits; numeric ranges like `10–18` pass

## Enforced rules: compact skill

These checks apply only when the target path ends in `.md`:

- Never a Markdown table: use a nested list instead, with the parent as row key and children as values
- No H4-H6 headings: flatten to H2/H3 or a list
- No lists nested 4+ levels deep: split into sections
- Code fences are excluded, and their contents do not shift diagnostic line numbers

## What is deliberately not scanned

- Path arguments (a flag named `path` or `file_path`): identifiers, not prose
- Writes targeting `skills/prose/`: that folder documents the banned characters, so it has to show them
- Text being removed by `edit` (`oldText`): the character disappears, it is never produced
- Smart quotes, NBSP, guillemets: intentional typography, left unchanged by `prose`
- Words to watch, banned openers, decorative emoji: judgment rules, they stay in the skill

## Behaviour

On `tool_call` for `write` and `edit`: walk every string value in the input, skipping path keys and `oldText`. Apply compact checks only to Markdown targets. Count violations per rule, include line numbers, and hint the model to load the matching skill. Return `{ block: true, reason }` when a rule fires.

On `tool_call` for `bash`: inspect only heredoc bodies with an explicit output redirection, such as `cat > notes.md <<'EOF'`. Use the redirection target to decide whether compact rules apply. Read-only commands and heredocs that only feed standard input are ignored.

## Limitations

- Only literal content passed through `write`, `edit`, or a redirected bash heredoc is scanned. Other shell write constructs are not parsed.
- Existing files and externally written files are not scanned.
- Structure checks ignore fenced code blocks but not indented (4-space) code blocks.
- The heredoc reader covers common single-heredoc redirections, not arbitrary shell grammar.

## Testing

```bash
bun test extensions/skills-guard/index.test.ts
```

## History

Starts as `prose-guard` (prose-character gate), renamed `skills-guard` when the compact rules were added.
Run `pi reload` after editing this file.

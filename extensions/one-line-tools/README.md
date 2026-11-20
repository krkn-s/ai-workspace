# one-line-tools

Collapsed tool rows take one line. The result stays hidden until the row expands.

## Behavior

- Collapsed: one line per tool call, truncated with an ellipsis at the terminal width.
- Bash and PowerShell keep their prompt: `$ git status`, `PS> Get-Date`.
- Read, write and edit keep the path; read keeps its line range.
- Other tools show `key=value` pairs, capped at 120 characters.
- An error prefixes the line with a red cross and still takes one line.
- Expanded, with `Ctrl+O` (`app.tools.expand`) or a click on the row, shows pi's own rendering: full output, diffs, syntax highlighting.
- Applies to every tool: built-ins, MCP servers, and extension tools.

## Limits

- A tool that returns an image still shows the image under its line, because the image is drawn outside the renderer.
- A tool without its own renderer shows plain text when expanded, without syntax highlighting.
- The default shell is forced, so an expanded `edit` loses its full-bleed header background and gains one column of padding.

## Testing

```bash
bun test extensions/one-line-tools/index.test.ts
```

Run `/reload` after editing.

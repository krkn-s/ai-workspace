# pi workspace

Skills, prompts and extensions for pi. One install command, no build step.

## Extensions

- [`nvidia-live`](extensions/nvidia-live): Swap pi's static NVIDIA list for the live free-tier catalog, with per-model metadata; `/nvidia-refresh` refetches it.
- [`one-line-tools`](extensions/one-line-tools): Collapsed tool rows take one line, so a long session still reads as a list of steps; `Ctrl+O` opens the full output.
- [`skills-guard`](extensions/skills-guard): Block a `write` or `edit` that breaks the `prose` and `compact` rules, and hold it until the model fixes it.

## Skills

- [`agent-swarm`](skills/agent-swarm): Run several agents on one clone with `wt`: claims, contracts, messages, merge lock.
- [`ai-visibility-stack`](skills/ai-visibility-stack): Get a site read and cited by crawlers and answer engines: `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`.
- [`compact`](skills/compact): Keep a Markdown file short, flat and legible to a model: one H1, a real outline, no decoration.
- [`copy-angle`](skills/copy-angle): Pick the lead before drafting it: Schwartz awareness levels and market sophistication set the promise and the length.
- [`image-prompt-crafter`](skills/image-prompt-crafter): Write image prompts that hold up in the model: GPT Image, Nano Banana, Seedream.
- [`prose`](skills/prose): Strip the AI tells from any text a human will read, in French or English.
- [`reveal-slides`](skills/reveal-slides): Build a deck as one HTML file with reveal.js, then export it to a clean one-slide-per-page PDF.
- [`seo-aeo-content`](skills/seo-aeo-content): Plan content that ranks and gets cited: briefs, outlines, audits, editorial calendars.
- [`web-design`](skills/web-design): Judge a page on hierarchy, color, type and CTA, then fix what costs conversions.
- [`weasyprint-pdf`](skills/weasyprint-pdf): Print HTML and CSS as a real PDF: margins, running headers, TOC, bookmarks, CMYK.

## Prompts

- [`agents-md`](prompts/agents-md.md): Cut AGENTS.md down to the rules that change agent behavior, and keep the ones other prompts own untouched.
- [`agents-md-brand`](prompts/agents-md-brand.md): Add or maintain the `## Brand` block in AGENTS.md without inventing a fact.
- [`challenge`](prompts/challenge.md): Get the counter-argument instead of agreement, before you ship a claim.
- [`cp`](prompts/cp.md): One line: merge if needed, commit, push.
- [`ship`](prompts/ship.md): Plan, execute with verification, commit, then stop and ask before anything reaches a server.
- [`stack-audit`](prompts/stack-audit.md): Audit a stack read-only and get one ordered table of what to cut, replace, add or fix, each with proof.
- [`stack-refs`](prompts/stack-refs.md): Vendor third-party source and docs into `.refs/` at the version you actually run, so the agent reads facts instead of guesses.

## Installation

```bash
pi install https://github.com/krkn-s/ai-workspace       # global
pi install -l https://github.com/krkn-s/ai-workspace    # project
pi config -l                                            # toggle resources
```

## License

[MIT](LICENSE).

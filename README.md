# pi workspace

Skills, prompts and extensions for pi. One install command, no build step.

## Extensions

- [`nvidia-live`](extensions/nvidia-live): Swap pi's static NVIDIA list for the live free-tier catalog, with per-model metadata; `/nvidia-refresh` refetches it.
- [`one-line-tools`](extensions/one-line-tools): Collapsed tool rows take one line, so a long session still reads as a list of steps; `Ctrl+O` opens the full output.

## Skills

- [`ai-visibility-stack`](skills/ai-visibility-stack): Get a site read and cited by crawlers and answer engines: `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`.
- [`image-prompt-crafter`](skills/image-prompt-crafter): Write image prompts that hold up in the model: GPT Image, Nano Banana, Seedream.
- [`seo-aeo-content`](skills/seo-aeo-content): Plan content that ranks and gets cited: briefs, outlines, audits, editorial calendars.
- [`web-design`](skills/web-design): Judge a page on hierarchy, color, type and CTA, then fix what costs conversions.

## Prompts

- [`challenge`](prompts/challenge.md): Get the counter-argument instead of agreement, before you ship a claim.

## Installation

```bash
pi install https://github.com/krkn-s/ai-workspace       # global
pi install -l https://github.com/krkn-s/ai-workspace    # project
pi config -l                                            # toggle resources
```

## License

[MIT](LICENSE).

# KRKN's AI Workspace

A personal AI workspace with installable skills, pi prompt templates, and pi extensions.

- **extensions**
  - [`pi-nvidia-live`](extensions/pi-nvidia-live) : Live NVIDIA NIM catalog for pi — replaces the built-in `nvidia` provider's model list with the free-tier `/v1/models` catalog, enriches per-model metadata from NVIDIA's own sources (`.md` records, `-infer` OpenAPI schemas, family fallbacks), commands `/nvidia-refresh` and `/nvidia-models`.
  - [`skills-guard`](extensions/skills-guard) : Deterministic gate for the `prose` and `compact` skills' mechanical rules — blocks any `write`/`edit`/`bash` call containing em dashes, pause en dashes, typographic ellipsis, invisible characters, Markdown tables, H4+ headings, or 4+ level nested lists, hints the model at the matching skill, and loops until it rewrites. Enforces systematically without skill invocation.
- **skills**
  - [`image-prompt-crafter`](skills/image-prompt-crafter) : Craft production-grade prompts for conversational image generators (GPT Image 2, Nano Banana 2/Pro, Seedream 5 Pro) — hybrid clarification, model-specific English variants, settings, and iteration plans.
  - [`seo-aeo-content`](skills/seo-aeo-content) : SEO and AEO content strategy for briefs, audits, page structures, and editorial plans.
  - [`ai-visibility-stack`](skills/ai-visibility-stack) : AI visibility infrastructure covering `llms.txt`, markdown mirrors, `sitemap.xml`, `robots.txt`, and AI crawler policy.
  - [`prose`](skills/prose) : Write and rewrite prose so it reads like a real person, without AI tells, in French or English.
  - [`spec-vibe`](skills/spec-vibe) : CLI-free, Markdown-only spec-driven development over a `specs/` tree — forward (spec first) and reverse (vibe-code first, then generate specs) paths, with ADRs and `rg`/`fd`-queryable structure.
  - [`weasyprint-pdf`](skills/weasyprint-pdf) : Generate print-ready PDF documents (brochures, flyers, cards, business cards, slides, invoices, books) from HTML and CSS using WeasyPrint — `@page` paged media, page breaks, TOC, bookmarks, custom fonts, bleed/CMYK/PDF-X.
  - [`reveal-slides`](skills/reveal-slides) : Build single-file HTML presentation decks with reveal.js (Markdown, code highlight, speaker notes, fragments) and export a clean one-slide-per-page vector PDF via html2realpdf — both pinned to jsDelivr CDN URLs.
  - [`compact`](skills/compact) : Compact, LLM-friendly Markdown styling — single H1, H2/H3 outline, short bullets, sparing bold, language-tagged code fences, simple tables, no decorative HTML or emoji; write new docs or restyle bloated `.md` files for humans and agents.
  - [`browser-tools`](skills/browser-tools) : Interactive browser automation via Chrome DevTools Protocol (Chrome on `:9222`) — navigate, evaluate JS, screenshot, cookies, pick elements; imported from [badlogic/pi-skills](https://github.com/badlogic/pi-skills/tree/main/browser-tools) by Mario Zechner (MIT).
- **prompts**
  - [`ship`](prompts/ship.md) : Explore, plan (through `specs/` when present, else `PLAN-<date>.md` for complex tasks), then execute step-by-step with verification, commit & push, and server update commands.
  - [`agents-md`](prompts/agents-md.md) : One prompt to create, improve, or realign any agent instruction file (AGENTS.md, CLAUDE.md, rules files, skill instructions) — creation grounded in the repo and aligned with the global baseline (`~/.pi/agent/`), one audit pass for conflicts, duplication, stale rules, lean failures, and gaps, every real decision surfaced to the user, output always in compact Markdown (compact skill).
  - [`agents-md-swarm`](prompts/agents-md-swarm.md) : Ensure a project's shared `AGENTS.md` contains the multi-agent coordination section (worktree-first, `.agents-sync/` with per-agent state files, `locks.json`, message files, session protocol, merge rules) — append when missing, no-op when identical, expose divergences and ask which version to keep when it differs.
  - [`challenge`](prompts/challenge.md) : Adopt a critical intellectual partner that stress-tests your claims for truth over agreement.
  - [`agents-mark`](prompts/agents-mark.md) : Create, convert, or maintain a `## Brand` identity section inside the project's AGENTS.md — intro line, Positioning, Voice with a Forbidden list, Look, Facts; when a standalone BRAND.md file exists, converts it into this section and deletes the source file after explicit confirmations. Scope-disciplined: touches only its own section.

## Installation

This repo doubles as a **pi package**: it exposes `skills/` and `prompts/` at the root, so a single source can install both skills and prompt templates together. The `skills` CLI only handles skills, not prompts.

### Via `pi install` (skills + prompts together)

Install everything from this repo into your global config:

```bash
pi install https://github.com/krkn-s/ai-workspace
```

Or install into the current project instead (`-l` writes to `.pi/settings.json`):

```bash
pi install -l https://github.com/krkn-s/ai-workspace
```

### Install only a subset (filtering)

To pull just selected skills and prompts, declare the package with the object form in `.pi/settings.json`. Skill paths point at the skill directory; prompt paths point at the file:

```json
{
  "packages": [
    {
      "source": "https://github.com/krkn-s/ai-workspace",
      "skills": [],
      "prompts": [
        "prompts/agents-mark.md",
        "prompts/challenge.md"
      ]
    }
  ]
}
```

- Omit a key to load **all** of that type; use `[]` to load **none**.
- `!pattern` excludes, `+path` force-includes, `-path` force-excludes (exact paths relative to the repo root).

### Toggle resources

List and toggle individual resources interactively:

```bash
pi config -l
```

(Tab switches between global and project scope.)

## License

This repository uses the MIT License. It is intentionally permissive so these skills can be reused, adapted, forked, and installed in personal, commercial, or open source workflows.

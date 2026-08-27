---
name: image-prompt-crafter
description: Craft, improve, and adapt prompts for conversational AI image generators — GPT Image 2 (OpenAI), Nano Banana 2 and Nano Banana Pro (Gemini), Seedream 5 Pro (ByteDance). Use when the user asks to write, rewrite, improve, translate, or compare an image prompt, or before sending any visual request to an image generator — e.g. 'write a prompt for Nano Banana', 'make this image prompt better', 'un prompt pour générer un visuel produit', 'écris le prompt d'une affiche avec du texte'. Covers posters, logos, product shots, photorealistic scenes, illustrations, UI mockups, text-in-image layouts, and image-editing instructions with reference photos. Expands vague ideas with a few targeted questions, then delivers model-specific English prompt variants with settings (aspect ratio, resolution, quality), constraint clauses, and iteration advice. Déclenche aussi en français — améliorer un prompt d'image, générer un prompt pour Nano Banana, GPT Image ou Seedream, préparer un visuel IA.
---

# Image Prompt Crafter

Turn rough visual ideas into production-grade prompts for conversational image generators: **GPT Image 2** (OpenAI), **Nano Banana 2 / Nano Banana Pro** (Gemini), and **Seedream 5 Pro** (ByteDance).

These models are built on multimodal LLMs, not classic diffusion. They parse natural language, reason about instructions, and plan compositions. Tag soup (`masterpiece, best quality, trending on ArtStation`), weighted syntax, and comma-separated keyword lists do not help and often hurt. Write prompts as directed, layered natural language.

Deep per-model grammar lives in [`references/models.md`](references/models.md); a vocabulary bank for styles, camera, lighting, and text lives in [`references/lexicon.md`](references/lexicon.md). Read the model file before writing a variant you have not written recently.

## Workflow

### 1. Classify the request

Pick one (or a combination):

- **Generation** (text → image): the default case.
- **Editing** (image + instruction → image): retouch, restyle, remove, relight.
- **Compositing / fusion** (multiple images → one): blend references, try-on, product placement.
- **Text-in-image**: poster, ad, cover, infographic, packaging, localization.
- **Conversion**: user brings a prompt written for another model (Midjourney, SD, Flux) — strip parameters and weights, rebuild as natural language.

### 2. Clarification gate (hybrid)

**Ask questions only when information is missing.** If the brief is already detailed, skip straight to step 3 and state your assumptions in one line.

Ask (max 5, grouped in one round) when unknown:

1. **Usage / destination** — Instagram, print poster, web hero, slides, marketplace? Drives ratio, resolution, polish level.
2. **Medium / style** — photograph (candid vs studio vs editorial), illustration, 3D render, flat design?
3. **Exact in-image text** — word for word. Never invent brand copy, names, or numbers; use `[PLACEHOLDER]` or ask.
4. **Mood / palette** — only if the brief is creatively vague.
5. **Constraints** — brand colors, must-include or forbidden elements, reference images available?

If the user says "just do it", proceed with sensible defaults and say what you assumed.

### 3. Build the creative brief skeleton

Assemble internally, in this order — this layering works on all three model families:

| Layer | Content |
|---|---|
| **Format** | Deliverable and orientation ("fashion editorial magazine cover, portrait 3:4", "mobile app UI mockup", "packshot on white") |
| **Subject** | Who/what, with concrete wardrobe, materials, age, details |
| **Action / pose** | What is happening, gaze direction, hands, interactions |
| **Setting** | Location, time of day, season, background elements |
| **Composition** | Framing, camera angle, lens, depth of field, placement callouts |
| **Lighting** | Quality, direction, mood (golden hour, softbox, chiaroscuro…) |
| **In-image text** | Exact copy in quotes + font style + placement |
| **Style** | Medium, era, film stock or render style, color grading, quality cues |
| **Constraints** | Exclusions and invariants (see below) |

Pull precise wording from [`references/lexicon.md`](references/lexicon.md) instead of inventing vague adjectives.

### 4. Produce model-specific variants

Default: deliver the **three variants** (GPT Image 2, Nano Banana 2 or Pro, Seedream 5 Pro) unless the user named a single target model or platform. Follow each model's grammar in [`references/models.md`](references/models.md):

- **GPT Image 2** — scene → subject → details → constraints; literal "photorealistic" for photos; explicit exclusion lists; sizes in pixels (multiples of 16).
- **Nano Banana 2 / Pro** — flowing natural sentences, positive framing only ("empty street", never "no cars"); every text element in its own quotes; start with a strong verb.
- **Seedream 5 Pro** — layered directive clauses, format named first, under ~600 words; pin clauses when editing.

One scene, three prompts — do not write one generic prompt and relabel it. The differences are real: framing syntax, text rules, constraint style, and settings all differ.

### 5. Deliver

Use this layout, in the conversation language (prompts themselves always in English):

```
## GPT Image 2 (OpenAI) — best for <one-line why>
Settings: 3:4 · 1024×1536 · quality: medium

< Paste-ready prompt in a fenced code block >

## Nano Banana 2 (Gemini)
Settings: 3:4 · 2K

< prompt >

## Seedream 5 Pro (ByteDance)
Settings: 3:4 portrait · 1152×1536 (1.5K tier for iteration)

< prompt >

Iterate (one change at a time): "make the lighting warmer" · "remove the second cup" · "restore the original background"
```

Then add, only when useful: an **edit variant** (if the user will iterate on a reference image), a **transparent-background variant** (GPT Image 2 only, PNG/WebP), or a **model-choice recommendation** with one line of rationale.

## Non-negotiable rules

- **Prompts in English**, always. Text meant to appear *inside* the image stays in its display language (e.g. a French tagline stays French, quoted).
- **Quote literal in-image text** — every separate element in its own double quotes, with font style and placement.
- **Never invent** proper nouns, brand names, prices, dates, statistics. Ask or use `[PLACEHOLDER]`.
- **Show, don't grade.** Concrete materials, light, lens, and era beat "beautiful, stunning, 8K, masterpiece" on every model in scope.
- **Edits: one change at a time**, and always name what must not change. Restate invariants on every iteration round — that is what prevents drift.
- **Respect each model's framing grammar.** Positive framing is mandatory for Nano Banana; exclusion lists are fine (and encouraged) for GPT Image 2 and Seedream.
- **Match the format to the destination.** Choose ratio and resolution from the deliverable (9:16 story, 3:4 poster, 1:1 packshot, 16:9 hero), not by habit.

## Model selection cheat sheet

| Need | Pick |
|---|---|
| Maximum fidelity, dense in-image text, infographics, transparent PNG assets | GPT Image 2 |
| Fast iteration, best multilingual typography, real-world/current subjects (web grounding) | Nano Banana 2 |
| Studio-grade creative control, 4K print, complex reasoning-heavy scenes | Nano Banana Pro |
| Brand/product variants locked to reference packshots, extreme aspect ratios (1:8…8:1) | Seedream 5 Pro |
| Legacy GPT Image 1/1.5 or Seedream 4.x prompt | Same grammar as their successors (see models.md) |
| Imagen | Retired (shut down Aug 17, 2026) — steer to Nano Banana |

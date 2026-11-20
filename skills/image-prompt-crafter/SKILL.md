---
name: image-prompt-crafter
description: "Write, improve, translate, or compare image prompts for GPT Image, Nano Banana, and Seedream. Use before any visual request: posters, logos, product shots, photorealistic scenes, illustrations, UI mockups, text in image, and edits from reference photos."
---

# Image Prompt Crafter

Turn rough visual ideas into production-grade prompts for conversational image generators: **GPT Image** (OpenAI), **Nano Banana** (Google Gemini), and **Seedream** (ByteDance). The current model of each family, its grammar, and the date of the last check live in [`references/models.md`](references/models.md). Read that file before writing a variant you have not written recently, and read [`references/lexicon.md`](references/lexicon.md) for vocabulary.

These models are built on multimodal LLMs, not classic diffusion. They parse natural language, reason about instructions, and plan compositions. Tag soup (`masterpiece, best quality, trending on ArtStation`), weighted syntax, and comma-separated keyword lists do not help and often hurt. Write prompts as directed, layered natural language.

## Workflow

### 1. Classify the request

Pick one (or a combination):

- **Generation** (text to image): the default case.
- **Editing** (image plus instruction): retouch, restyle, remove, relight.
- **Compositing** (several images to one): blend references, try-on, product placement.
- **Text in image**: poster, ad, cover, infographic, packaging, localization.
- **Conversion**: user brings a prompt written for another model (Midjourney, SD, Flux). Strip parameters and weights, rebuild as natural language.

### 2. Clarification gate

**Ask questions only when information is missing.** If the brief is detailed, skip to step 3 and state your assumptions in one line. Ask at most five, grouped in one round:

1. **Usage and destination**: Instagram, print poster, web hero, slides, marketplace? Drives ratio, resolution, polish level.
2. **Medium and style**: photograph (candid, studio, editorial), illustration, 3D render, flat design?
3. **Exact in-image text**: word for word. Never invent brand copy, names, or numbers; use `[PLACEHOLDER]` or ask.
4. **Mood and palette**: only if the brief is creatively vague.
5. **Constraints**: brand colors, must-include or forbidden elements, reference images available?

If the user says "just do it", proceed with sensible defaults and say what you assumed.

### 3. Build the creative brief

Assemble internally, in this order. The same nine layers work on all three families:

- **Format**: deliverable and orientation ("fashion editorial magazine cover, portrait 3:4", "mobile app UI mockup", "packshot on white").
- **Subject**: who or what, with wardrobe, materials, age, distinguishing details.
- **Action and pose**: what is happening, gaze direction, hands, interactions.
- **Setting**: location, time of day, season, background elements.
- **Composition**: framing, angle, lens, depth of field, placement callouts, reserved empty space.
- **Lighting**: quality, direction, mood (golden hour, softbox, chiaroscuro).
- **In-image text**: exact copy in quotes, font style, placement, size.
- **Style**: medium, era, film stock or render style, color grade, texture.
- **Constraints**: exclusions and invariants.

Pull precise wording from [`references/lexicon.md`](references/lexicon.md) instead of inventing vague adjectives. Materials and named light sources beat adjectives on every model in scope.

### 4. Produce model variants

Default: deliver **three variants** (GPT Image, Nano Banana, Seedream) unless the user named a single target model or platform. One scene, three prompts: do not write one generic prompt and relabel it. Framing grammar, text rules, and reference handling differ, and [`references/models.md`](references/models.md) documents each.

- **GPT Image 2.6**: name the intended use first, then scene, subject, details, constraints. Labeled sections for complex requests. The literal word "photorealistic" for photos. Explicit exclusion list. For motion, describe the loop and whether the camera moves; for vector output, ask for flat shapes, clean geometry, and a simple silhouette.
- **Nano Banana 2.1**: flowing natural sentences, strong verb to open, positive framing only ("empty street", never "no cars"). Every text element in its own quotes, three to five elements. Assign a role to each reference image.
- **Seedream 5.5**: open with the deliverable, then one clause each for subject, setting, light, camera, style, and close on the exclusions. Keep it under about 600 English words. Quote each line of copy with position, type style, and color, and end with "no other text".

### 5. Deliver

Use this layout, with headings in the conversation language and prompts always in English:

```
## GPT Image 2.6 Sunburst: best for <one-line why>
Format: 3:4 portrait

< paste-ready prompt in a fenced code block >

## Nano Banana 2.1 (Gemini)
Format: 3:4 portrait

< prompt >

## Seedream 5.5 (ByteDance)
Format: 3:4 portrait

< prompt >

Iterate one change at a time: "make the lighting warmer" · "remove the second cup" · "restore the original background"
```

The header line carries the format only: ratio and orientation belong to the creative direction, everything else belongs to the prompt.

When the user named a model, deliver **one** variant, already adapted to that model, and skip the others.

Then add, only when useful: an **edit variant** (if the user will iterate on a reference image), a **transparent-background variant** (isolated subject, clean alpha edges, no backdrop), or a **one-line model recommendation** with its rationale.

## Rules

- **Prompts in English**, always. Text meant to appear *inside* the image stays in its display language, quoted.
- **Quote literal in-image text**: each element in its own double quotes, with font style and placement.
- **Never invent** proper nouns, brand names, prices, dates, statistics. Ask or use `[PLACEHOLDER]`.
- **Show, don't grade.** Concrete materials, light, lens, and era beat "beautiful, stunning, 8K, masterpiece" on every model in scope.
- **Reserve space in words**: "open sky on the left", "top third empty for the headline". Layout is prompted, not cropped afterwards.
- **Edits: one change at a time**, and always name what must not change. Restate the invariants on every round; that is what prevents drift.
- **Respect each model's framing grammar.** Positive framing is mandatory for Nano Banana; explicit exclusions help GPT Image and Seedream.
- **Address references by role**, then by index or description, matching the model's convention.
- **Match the format to the destination.** Choose ratio and resolution from the deliverable (9:16 story, 3:4 poster, 1:1 packshot, 16:9 hero), not by habit.

## Model choice

- **Dense in-image text, infographics, layout accuracy, transparent or vector assets**
  - **Pick**: GPT Image 2.6 Sunburst
- **Fast iteration and high volume**
  - **Pick**: GPT Image 2.6 Flare, or Nano Banana 2 Lite when cost dominates
- **Multilingual typography, real-world and current subjects, web grounding**
  - **Pick**: Nano Banana 2.1
- **Studio-grade control, 4K print, complex reasoned scenes**
  - **Pick**: Nano Banana Pro
- **Brief-driven realism, fixed-slot layouts, many-round edits that must not drift**
  - **Pick**: Seedream 5.5
- **Other current models** (Microsoft MAI Image 2.7, MiniMax H3-Image, FLUX.3 Image Klein)
  - **Pick**: the closest grammar above; see the adjacent-models section of [`references/models.md`](references/models.md)
- **Legacy GPT Image 1 or 1.5, Seedream 4.x**
  - **Pick**: same grammar as their successors
- **Imagen**
  - **Pick**: retired on 17 August 2026, so steer to Nano Banana

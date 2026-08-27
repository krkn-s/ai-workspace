# Model Playbooks — GPT Image 2, Nano Banana 2 / Pro, Seedream 5 Pro

Last verified: August 2026. Sources listed at the bottom. Check the official guides when a model version changes — these grammars are version-specific.

---

## GPT Image 2 (OpenAI) — `gpt-image-2`

Current OpenAI flagship. Strongest overall quality, robust identity preservation, reliable text rendering, transparent-background support (preview).

### Prompt grammar

Write in a consistent order: **scene/background → subject → key details → constraints**, and state the intended use ("ad", "UI mockup", "infographic", "pitch-deck slide") — it sets the mode and polish level. Short labeled segments or line beats beat one long paragraph for complex requests. Minimal prompts, JSON-like structures, and instruction-style prompts all work; prefer a skimmable template.

- **Photorealism**: include the word "photorealistic" literally — it strongly engages photoreal mode. Prompt as if a real photo is being captured: lens, framing, lighting ("shot like a 35mm film photograph, medium close-up at eye level, 50mm lens, soft coastal daylight, subtle film grain"). Ask for real texture (pores, wrinkles, fabric wear, imperfections) and avoid studio-polish vocabulary when the target look is candid ("The image should feel honest and unposed… No glamorization, no heavy retouching"). Detailed camera specs are interpreted loosely — use them for look, not physics.
- **People**: specify scale, framing, gaze, and interactions: "full body visible, feet included", "child-sized relative to the table", "looking down at the open book, not at the camera", "hands naturally gripping the handlebars".
- **Composition**: framing + viewpoint + angle + lighting/mood; call out placement when layout matters ("logo top-right", "subject centered with negative space on left"). Wide, cinematic, low-light, rain, and neon scenes need extra atmosphere and scale detail, or the model trades mood for surface realism.
- **Text in image**: literal copy in **quotes** (or ALL CAPS), typography details as constraints (font style, size, color, placement). Spell tricky words letter-by-letter: `S-T-R-A-V-I-N-S-K-Y`. Render-once rule: "Render the tagline exactly once, clearly and legibly". Use quality `medium`/`high` for small or dense text.
- **Constraints**: exclusions are welcome and effective: "No watermarks, no logos, no extra text, no trademarks". For edits: "change only X" + "keep everything else the same" — restate the preserve list on every iteration (identity, geometry, layout, camera angle, brand elements).
- **Multi-image inputs**: reference each by index and role: "Image 1: product photo. Image 2: style reference. Apply Image 2's style to Image 1." Say explicitly what moves where when compositing.
- **Iterate**: clean base prompt + small single-change follow-ups ("make lighting warmer", "remove the extra tree"). Re-specify critical details when they drift.

### Settings

| Parameter | Values / notes |
|---|---|
| `size` | Any resolution where: both edges multiple of 16, max edge < 3840px, long/short ratio ≤ 3:1, total pixels 655,360–8,294,400. Common: 1024×1024, 1024×1536, 1536×1024, 2560×1440 (2K recommended ceiling), 3840×2160 experimental |
| `quality` | `low` (fast, high-volume, drafts) / `medium` (default) / `high` (dense text, infographics, close-up portraits, identity-sensitive edits) |
| `background` | `transparent` (preview) → pair with `output_format` `png` or `webp`; describe "isolated subject on a fully transparent background, no scenery, no solid backdrop, no checkerboard, no shadows" |
| `input_fidelity` | Not applicable to gpt-image-2 (high fidelity by default) |
| `n` | Number of variations (useful for logo/ideation rounds) |

### Ready-made prompt shapes

Transparent cutout: "Extract the product from the input image and isolate it on a fully transparent background. Crisp silhouette, no halos/fringing. Preserve product geometry and label legibility exactly. Do not restyle the product; no solid backdrop, checkerboard, scenery, or shadow."

Ad creative (write it like a creative brief, not a spec): brand + positioning + audience + scene + exact quoted tagline + "No extra text, no watermarks, no unrelated logos."

Character consistency pipeline: 1) generate a **character anchor** prompt (outfit, palette, proportions, personality, constraints), 2) continue scenes as edits with "Character Consistency: same …, do not redesign the character".

---

## Nano Banana 2 (Gemini 3.1 Flash Image) and Nano Banana Pro (Gemini 3 Pro Image)

Not diffusion models — Gemini-family multimodal LLMs that generate images autoregressively. They parse intent holistically, reason about spatial relationships, and plan compositions.

### Prompt grammar

**Natural narrative language only.** Forget tag lists, quality boosters, and weighted syntax — they actively hurt. Start with a strong verb that states the primary operation ("Create…", "Transform…", "Remove…").

Core formula (Google's guidance):

> **Subject + Action + Location/context + Composition + Style**

- 1–3 descriptive sentences for simple images; longer structured prompts with explicit layout instructions for posters, infographics, slides.
- **Positive framing is mandatory**: describe what IS there. "Empty street", not "no cars". "Polished concrete floor", not "no carpet".
- **Camera direction**: "low-angle shot with shallow depth of field (f/1.8)", "wide-angle lens", "macro lens", camera bodies change visual DNA ("shot on a GoPro" = immersive distortion; "Fujifilm" = color science; "cheap disposable camera" = raw flash nostalgia).
- **Lighting design**: "three-point softbox setup", "chiaroscuro lighting with harsh, high contrast", "golden hour backlighting creating long shadows".
- **Color grading / film stock**: "as if on 1980s color film, slightly grainy", "cinematic color grading with muted teal tones".
- **Materiality**: name physical makeup — "navy blue tweed", "ornate elven plate armor etched with silver leaf patterns", "minimalist ceramic coffee mug".
- **Real-world subjects**: Nano Banana 2 can ground generation in web search (real buildings, landmarks, products, current events) — prompt it to retrieve then visualize. Instruct explicitly: "[Search for current weather in San Francisco] + [if raining, make it look grey and rainy] + [visualize as a miniature city-in-a-cup in a smartphone UI]".

### Text rendering (their headline strength)

- Every text element in its **own double quotes**, with its own style: `"GRAND OPENING" in bold sans-serif at the top, "Now serving fresh coffee & pastries" in italic script centered below`.
- Name the font or describe it: "bold, white, sans-serif", "Century Gothic 12px", "tall condensed serif".
- Keep to **3–5 text elements per image**; bigger is better (small text blurs at 1K); short phrases over paragraphs.
- **Text-first hack**: for critical copy, first converse with the model to settle the text concepts, then ask for the image with that exact text.
- Multilingual rendering and in-image translation/localization work well (10+ languages): write the prompt in one language, specify the target language for the text.

### Editing and references

- Describe the edit in plain language; semantic masking is implicit ("Remove the man from the photo", "change the tie to green").
- **Explicitly say what to keep**: "Keep the person's pose and clothing identical."
- **One change at a time** in complex scenes — stacked edits get dropped.
- Up to **14 reference images**. Assign each a role: "Use Image A for the character's pose, Image B for the art style, Image C for the background environment." Give distinct descriptions ("the person in the first image", "the car in the second image").
- Fills: "Remove the cup of coffee. Fill in the background naturally."

### Settings

| Parameter | Nano Banana 2 | Nano Banana Pro |
|---|---|---|
| Resolutions | 0.5K, 1K, 2K, 4K | 1K, 2K, 4K |
| Aspect ratios | 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, plus 1:4, 4:1, 1:8, 8:1; `auto` picks from the prompt | same list without the extreme ratios |
| Reference images | up to 14 | up to 14 (6–14 depending on surface) |
| Web-search grounding | yes (use for real-world subjects only) | yes |

Known limits: small text and fine detail fidelity, factual accuracy of data-driven visuals (verify diagrams), translation grammar, occasional artifacts in complex blends, character consistency varies across many edits.

---

## Seedream 5 Pro (ByteDance)

Flagship control-oriented model: direct control over what changes and what stays. Text-to-image, reference-guided editing, multi-image fusion.

### Prompt grammar

**Layered directive clauses** — the model treats each clause as an instruction, not decoration. Order:

> **Format → Subject → Composition → Lighting → In-image text → Style**

- **Name the format FIRST**: "a fashion editorial magazine cover in portrait 3:4 orientation" reserves masthead space and switches composition logic. Dropping this layer yields a pretty portrait that doesn't read as a cover.
- Keep prompts **under ~600 English words** (hard cap 3000 chars). Past that, attention scatters and clauses drop out. Tighten ambiguous clauses instead of adding more.
- Example skeleton: "a cinematic streaming series poster in portrait orientation. A lone detective at the edge of a moonlit apple orchard, back-lit by an approaching flashlight. Title MIDNIGHT ORCHARD in tall condensed serif type."
- Style anchor at the end: "Editorial photorealism, natural skin texture, matte magazine paper aesthetic."

### Reference-guided editing

- **Pin what must not change, by name**: "Keep the exact silhouette, the exact camera angle, the exact backdrop, and the exact studio lighting." Without the pin clause, every unmentioned element drifts.
- Change exactly one thing per round ("one edit, the colourway").
- Up to **10 reference images**; identity and brand assets should come from references, not prose — a packshot locks geometry, materials, logos better than any description. Prefer packshots over lifestyle shots for fusion.
- **Address references by content, not index**: "the tan leather-bound journal", not "the first reference".
- Multi-image fusion: prompt only names the composition (where each element sits) and the lighting environment; references carry identity.

### Settings

| Parameter | Values / notes |
|---|---|
| Prompt | ≤ 3000 chars, aim < 600 words |
| Dimensions | Required for t2i. Pixel budget 1,048,576–4,194,304 (≈1024×1024 to 2048×2048; 16:9 tops out 2752×1536) |
| Aspect ratios | 1:16 to 16:1 — match to deliverable: 3:4 magazine covers and posters, 9:16 streaming key art, 4:3 editorial still-life, 1:1 packshots |
| References | ≤ 10 images; dimensions optional when present |
| Tiers | ≤ 2.36 MP = "1.5K" (iterate here) / above = "2K" (finals) |

---

## Legacy and adjacent models

- **GPT Image 1.5 / gpt-image-1** — same grammar as GPT Image 2; sizes fixed to 1024×1024 / 1024×1536 / 1536×1024; use `input_fidelity: high` for identity-preserving edits. Treat a gpt-image-2 prompt as a drop-in upgrade.
- **Seedream 4.0–4.5** — same layered-clause grammar as 5 Pro; fewer extreme ratios, weaker pin-clause discipline.
- **Imagen 4** — retired (service shut down August 17, 2026). Steer any Imagen request to Nano Banana. Old Imagen habits worth keeping: subject/context/style core, ≤ 25 characters per text element, ≤ 3 text phrases, lens tables (portraits 24–35mm, macro 60–105mm, action 100–400mm, landscape 10–24mm).
- **Midjourney / Stable Diffusion / Flux prompts** (out of scope for variants, but conversion requests happen): strip `--ar`, `--v`, weights (`word::2`, `(word:1.3)`), and booster tags; rewrite the remainder as natural language per the target model's grammar above.

## Sources

- OpenAI Cookbook — GPT Image Generation Models Prompting Guide (gpt-image-2): https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- Google Cloud — Ultimate prompting guide for Nano Banana (Nano Banana 2 & Pro): https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana
- Google blog — Nano Banana Pro prompt tips: https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/
- fal.ai — How to use Nano Banana 2: https://fal.ai/learn/tools/how-to-use-nano-banana-2
- Runware — Prompting Seedream 5.0 Pro: https://runware.ai/docs/models/bytedance-seedream-5-0-pro/guides/prompting
- Gemini API docs — Imagen guide (deprecation notice, prompt writing): https://ai.google.dev/gemini-api/docs/imagen

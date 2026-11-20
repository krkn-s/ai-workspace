# Model Playbooks: GPT Image, Nano Banana, Seedream

Last verified: 20 November 2026. Sources listed at the bottom. These grammars are version-specific: when a family ships a new flagship, re-check this file before trusting it.

## Versions at a glance

- **OpenAI `gpt-image-2.6-sunburst`**: flagship, 4 November 2026
  - **Prompt note**: detail, layout, and edit accuracy. It plans before rendering, so labeled sections pay off.
- **OpenAI `gpt-image-2.6-flare`**: fast tier, 4 November 2026
  - **Prompt note**: same grammar, tuned for latency. Use it for drafts and volume.
- **Google `gemini-nano-banana-2.1`**: the workhorse
  - **Prompt note**: better text, multi-turn consistency, and search grounding than Nano Banana 2.
- **Google `gemini-3.1-flash-lite-image`**: Nano Banana 2 Lite
  - **Prompt note**: fastest and cheapest, weakest on multiple references and long edit chains.
- **Google Gemini 3 Pro Image**: Nano Banana Pro, November 2025
  - **Prompt note**: studio control, 1K to 4K, best multilingual typography.
- **ByteDance `seedream-5-5`**: 9 November 2026
  - **Prompt note**: brief-ordered grammar, stable across long edit chains.
- **ByteDance Seedream 5.0 Pro and 5.0 Flash**: 8 July 2026, still served
  - **Prompt note**: same grammar, less disciplined at holding a pin clause.
- **Microsoft `mai-image-2-7` and `-flash`**: public preview, 17 November 2026
  - **Prompt note**: one to five references, 2K. Same brief style as Seedream.

Retired: every Imagen model shut down on 17 August 2026. Steer any Imagen request to Nano Banana.

## GPT Image 2.6 (OpenAI)

Strongest overall quality, reliable text rendering, transparent backgrounds, and, since 2.6, planned generation, markup-guided edits, animated GIF, and SVG output.

### Prompt grammar

Order: **intended use and scene, then subject, then key details, then constraints**. State the use ("ad", "UI mockup", "infographic", "pitch-deck slide"): it sets the mode and the polish level.

- **Complex requests**: organize as scene, subject, details, and constraints, in labeled sections. Short prompts, paragraphs, JSON-like structures, and instructions all work; pick whatever stays editable, not what looks technical.
- **Photorealism**: include the word "photorealistic" literally, then prompt as if a real photo is being taken: lens, framing, light, texture. "Shot like a 35mm film photograph, medium close-up at eye level, 50mm lens, soft coastal daylight, subtle film grain." Ask for pores, wrinkles, fabric wear, and imperfections. Camera specs are read loosely: use them for look, not physics.
- **People**: specify scale, framing, gaze, and interactions: "full body visible, feet included", "child-sized relative to the table", "looking down at the open book, not at the camera".
- **Composition**: framing, viewpoint, angle, lighting, mood. Call out placement when layout matters: "logo top-right", "subject centered with negative space on the left". Wide, cinematic, low-light, rain, and neon scenes need extra atmosphere, or the model trades mood for surface realism.
- **Constraints**: exclusions are welcome and effective: "No watermarks, no logos, no extra text, no trademarks". For edits: "change only X" plus "keep everything else the same", and restate the preserve list every round.

### Text in image

Literal copy in quotes, once per element, with a count and a placement: "Render the tagline exactly once, clearly and legibly". Typography details go in the constraints: font style, size, color, position. Spell tricky words letter by letter: `S-T-R-A-V-I-N-S-K-Y`.

### Motion and vector output

- **GIF**: describe subject, motion, and the loop. Give the subject a starting pose to return to, and say whether the camera moves: "lifts the lantern, looks up, blinks, lowers it back to the starting pose, camera still, loop smoothly."
- **SVG**: ask for flat design, clean vector-like shapes, a strong silhouette, and balanced negative space. Favor simplicity over detail so the mark reads at small and large sizes. Edits do not accept SVG.

### References and edits

Reference each input by index and role: "Image 1: product photo. Image 2: style reference. Apply Image 2's style to Image 1." Say explicitly what moves where when compositing. On repeated edits, details drift: restate the invariants, and composite the approved result into the original when a region must stay pixel-identical.

### Ready-made shapes

Transparent cutout: "Extract the product from the input image and isolate it on a fully transparent background. Crisp silhouette, no halos or fringing. Preserve product geometry and label legibility exactly. Do not restyle the product; no solid backdrop, checkerboard, scenery, or shadow."

Ad creative: write a brief, not a spec. Brand, audience, scene, exact quoted tagline, then "no extra text, no watermarks, no unrelated logos".

Character consistency: 1) generate a character anchor (outfit, palette, proportions, constraints), 2) continue scenes as edits with "same character, do not redesign the character".

## Nano Banana 2.1 and Nano Banana Pro (Google)

Gemini-family multimodal LLMs that generate images autoregressively. They parse intent holistically, reason about space, and plan compositions.

### Prompt grammar

**Natural narrative language only.** Tag lists, quality boosters, and weighted syntax actively hurt. Open with a strong verb that states the operation: "Create", "Transform", "Remove".

Google's formula: **subject + action + location or context + composition + style**.

- One to three sentences for simple images; structured prompts with explicit layout instructions for posters, infographics, and slides.
- **Positive framing is mandatory**: describe what is there. "Empty street", not "no cars". "Polished concrete floor", not "no carpet".
- **Camera direction** changes the visual DNA: "low-angle shot with shallow depth of field (f/1.8)", "shot on a GoPro" for immersive distortion, "Fujifilm" for color science, "cheap disposable camera" for raw flash nostalgia.
- **Lighting design**: "three-point softbox setup", "chiaroscuro lighting with harsh high contrast", "golden hour backlighting with long shadows".
- **Materiality**: name the physical makeup: "navy blue tweed", "ornate elven plate armor etched with silver leaf patterns".
- **Real-world subjects**: prompt it to search, then visualize: "[Search for current weather in San Francisco] + [if raining, make it grey and rainy] + [visualize as a miniature city in a cup]".

### Text rendering

- Every element in its **own double quotes** with its own style: `"GRAND OPENING" in bold sans-serif at the top, "Now serving fresh coffee" in italic script centered below`.
- Name the font or describe it. Keep to **three to five elements per image**, bigger rather than smaller; small text blurs at 1K.
- **Text-first hack**: settle the copy in conversation, then request the image with that exact text.
- Multilingual rendering over ten languages works: write the prompt in one language, name the target language for the text.

### Editing and references

- Describe the edit in plain language; masking is implicit ("Remove the man from the photo", "change the tie to green").
- Say what to keep: "Keep the person's pose and clothing identical."
- One change at a time in complex scenes; stacked edits get dropped.
- Up to 14 reference images. Assign each a role and a distinct description: "Use Image A for the pose, Image B for the art style, Image C for the environment."
- Name the fill: "Remove the cup of coffee. Fill in the background naturally."

Known limits: small text and fine detail, factual accuracy of data-driven visuals, translation grammar, artifacts in complex blends, character drift across many edits.

## Seedream 5.5 (ByteDance)

Brief-driven realism with region-level control: text-to-image, reference-guided editing, multi-image fusion, and stable editing across long chains.

### Prompt grammar

Write it **as a brief**: deliverable, subject, setting, light, camera, style, then what to leave out. Each clause is a decision taken away from the model.

> **Deliverable, Subject, Setting, Lighting, Camera, Style, Exclusions**

- **Open with the deliverable**: "A product hero photo for a home appliance store", "A hardcover book cover for a literary thriller, portrait 2:3". It names the use before any detail and sets the register for every clause that follows.
- **Name the orientation in the prompt**: "wide 16:9", "vertical", "square". When the request only sets a resolution tier, the prompt decides the shape.
- **Describe the product in materials and parts**: "brushed steel base, curved handle in glossy cream plastic, small round temperature dial" gives the model three surfaces to render, where a color gives it one.
- **Close on the exclusions**: "No text, no logos", "no other text".
- Keep prompts **under about 600 English words**. Past that, clauses drop out. Tighten ambiguous clauses instead of adding more.
- Example: "A wide editorial lifestyle photograph for a city bike-share campaign. A woman in a mustard rain jacket rides a mint-green bicycle across a steel truss bridge at sunrise, rim-lit from the left. Shot at eye level with a 50mm lens at f/2.8, she rides on the right third, open sky to the left. Natural skin texture, editorial campaign photography, no text, no logos."

### Text in image

Each line in double quotes, with a position, a type style, and a color: `"THE SALT ROAD" in large, tall, condensed serif capitals in off-white, widely letter-spaced`. The order of the lines is the hierarchy. End with "no other text" so no tagline or publisher mark appears.

### Editing and references

- **Pin what must not change**: "Keep the exact silhouette, the exact camera angle, the exact backdrop, and the exact studio lighting." Unmentioned elements drift.
- One change per round: "one edit, the colourway".
- Up to ten reference images; identity and brand assets belong in references, not prose. A packshot locks geometry, materials, and logos better than any description. Prefer packshots over lifestyle shots for fusion.
- **Address references by content**: "the tan leather-bound journal", not "the first reference".
- Multi-image fusion: the prompt names only the composition and the lighting; references carry identity.

## Adjacent and legacy models

- **Microsoft MAI Image 2.7** (November 2026, preview): brief style close to Seedream, one to five references, 2K. Use the Seedream grammar, minus the ten-reference fusion advice.
- **MiniMax H3-Image** (November 2026, open weights): 4K and up to sixteen references. Use the Nano Banana grammar; describe each reference by role.
- **FLUX.3 Image Klein** (November 2026, open weights): layout control, so reserve space in words and name where each element sits.
- **GPT Image 1 and 1.5**: same grammar as 2.6. A 2.6 prompt is a drop-in upgrade.
- **Seedream 4.0 to 5.0**: same layered-clause grammar, less reliable pin clauses.
- **Midjourney, Stable Diffusion, Flux prompts** (conversion requests): strip `--ar`, `--v`, weights (`word::2`, `(word:1.3)`), and booster tags; rewrite the remainder as natural language per the target grammar.

## Sources

- OpenAI, image prompting guide: https://developers.openai.com/api/docs/guides/image-prompting
- OpenAI, image generation guide: https://developers.openai.com/api/docs/guides/image-generation
- Google Cloud, prompting guide for Nano Banana: https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana
- Gemini API, Nano Banana image generation: https://aistudio.google.com/docs/image-generation
- ByteDance Seed, Seedream 5.5: https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5/
- Runware, prompting Seedream 5.5: https://runware.ai/docs/models/bytedance-seedream-5-5/guides/prompting
- Microsoft AI, MAI Image 2.7: https://microsoft.ai/news/introducing-mai-image-2-7/
- MiniMax, H3-Image: https://www.minimax.io/blog/minimax-h3-image

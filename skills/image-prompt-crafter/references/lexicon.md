# Visual Lexicon — Word Bank for Image Prompts

Concrete vocabulary beats vague adjectives on every model in scope. Pull from these banks instead of writing "beautiful", "stunning", "high quality". Combine 1–2 choices per layer, not all of them.

## Composition and framing

- **Shot size**: extreme close-up, close-up, medium close-up, medium shot, medium-full shot, full body (feet included), wide shot, extreme wide / establishing shot.
- **Angle**: eye-level, low-angle (heroic), high-angle (vulnerable), top-down / flat lay, bird's-eye, aerial / drone view, over-the-shoulder, Dutch tilt (unease).
- **Depth**: shallow depth of field (f/1.8), deep focus, bokeh background, foreground framing element, negative space on the left/right, centered symmetry, rule-of-thirds placement.
- **Placement callouts** (for layout-sensitive work): "subject centered with generous padding", "logo top-right", "text block lower third", "product on the left, copy on the right".

## Camera and lens (photorealism)

- **Lens**: 24–35mm portraits with context, 50mm natural/neutral, 85mm portrait compression, macro 60–105mm (food, objects, textures, insects), telephoto 100–400mm (sports, wildlife, compression), wide-angle 10–24mm (landscapes, architecture, scale).
- **Camera character**: shot on medium-format analog film (editorial luxury), 35mm film photograph (honest, grainy), Fujifilm (distinct color science), GoPro (immersive distortion), cheap disposable camera with flash (raw, nostalgic), iPhone photo (casual authenticity).
- **Motion/time**: fast shutter speed with movement tracking, motion blur, long exposure with smooth water/clouds, light trails.

## Lighting

- **Natural**: golden hour backlighting with long shadows, blue hour, overcast soft diffuse light, harsh midday sun, window light with soft falloff, dappled light through leaves, candlelight, neon signage glow.
- **Studio**: three-point softbox setup, single hard key light, soft even beauty light with catchlight in the eyes, rim light separating subject from background, high-key (bright, airy), low-key (dark, moody).
- **Dramatic**: chiaroscuro with harsh contrast, split lighting, silhouette against bright background, volumetric light rays through fog/dust, practical lights in frame.

## Color and grade

- Muted teal-and-amber cinematic grade, desaturated earth tones, warm nostalgic Kodak-Portra palette, high-saturation editorial pop, monochrome with a single accent color, pastel matte, sepia, duotone (name both colors), period-accurate 1980s film grain.
- Say the *emotional* register once: intimate, serene, tense, exuberant, melancholic, premium, playful — then let light/grade carry it.

## Medium and style anchors

- **Photo genres**: candid documentary photograph, editorial fashion spread, commercial product photography, street photography movie still, architectural photography, photojournalism, glamour studio portrait.
- **Illustration**: hand-painted watercolor with soft outlines, flat vector illustration, ink linocut, gouache children's book art (slightly oversized head, expressive face), risograph print, halftone comic panels, ligne claire.
- **3D / render**: isometric 3D render, claymation look, glossy Pixar-style character render, low-poly, photoreal CGI with ray-traced reflections, product CAD render on infinite white.
- **Design artifacts**: minimalist movie poster, Swiss/international typographic poster, infographic handout, mobile app UI mockup in an iPhone frame, pitch-deck slide, blister-pack toy packaging, billboard mockup in situ.

## Materiality (use for any subject)

Brushed stainless steel, frosted glass, unglazed ceramic, navy blue tweed, worn oiled leather, raw linen, condensation-beaded glass, patinated brass, chipped enamel, hand-thrown clay, etched silver leaf, matte soft-touch plastic. Materials read more strongly than adjectives.

## In-image text patterns

- Quote each element separately, then style + place it:
  - `"GLOW" in a flowing elegant brush script across the top`
  - `"10% OFF" in heavy blocky Impact font centered below`
  - `"Your First Order" in thin minimalist Century Gothic at the bottom`
- Font vocabulary: bold condensed sans-serif, tall condensed serif, geometric sans-serif, small caps, handwritten script, slab serif, monospace.
- Placement vocabulary: masthead across the top, centered mid-frame, lower-third banner, bottom-left corner, running down the right edge.
- Discipline rules: 3–5 text elements max (Nano Banana), render exactly once, spell difficult words letter-by-letter (GPT Image), ≤25 characters per element if targeting anything Imagen-derived.

## Constraint and exclusion clauses

Pick what applies; drop the rest:

- "No watermark, no logos, no extra text, no trademarks."
- "Render the tagline exactly once, clearly and legibly."
- "Isolated subject on a fully transparent background — no scenery, no solid backdrop, no checkerboard, no shadows." (GPT Image 2 transparent PNG)
- "Original design only, no copyrighted characters."
- "Plain background to clearly showcase the character."
- "Avoid cinematic lighting, dramatic color grading, or stylized composition." (when grounded realism is wanted)

Positive-framing equivalents (mandatory for Nano Banana, good hygiene elsewhere): "empty street" (not "no cars"), "polished bare walls" (not "no decorations"), "clean minimal background" (not "no clutter").

## Editing clause bank

- Surgical change: "Change only X. Keep everything else the same — same camera angle, same lighting, same framing, same surrounding objects."
- Identity lock: "Do not change the face, facial features, skin tone, body shape, pose, or expression. Preserve exact likeness and proportions."
- Outfit swap: "Replace only the clothing, fitted naturally to the existing pose with realistic fabric behavior. Match lighting, shadows, and color temperature to the original photo."
- Removal + fill: "Remove X. Fill in the background naturally."
- Relight / restage: "Make it look like a winter evening with snowfall. Preserve identity, geometry, camera angle, and object placement."
- Style transfer: "Recreate this exact scene in the style of [reference/style]. Keep composition and content unchanged."
- Character continuity: "Same character as before — same outfit, same palette, same proportions. Do not redesign the character."
- Pin clauses (Seedream): "Keep the exact silhouette, camera angle, backdrop, and studio lighting from the reference."

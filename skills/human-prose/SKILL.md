---
name: human-prose
description: Write and rewrite prose so it reads like a real person wrote it — precise, grounded, occasionally irregular, free of AI tells. Use by default whenever you write, draft, rewrite, summarize, expand, translate, or edit any prose for the user, in French or English, not only when asked to 'humanize' text. It overrides the default urge to produce polished, balanced, generic copy. Covers cleaning invisible characters and stray Markdown, plus a strict voice — no cliché openers ('À l'ère de…', 'In today's world…'), no em-dashes for pauses, concrete detail over abstract faux-depth, no listy or punchy AI structures, ask for real material instead of filling with generalities, then silently self-edit before answering. Déclenche par défaut sur tout texte écrit ou réécrit, en français comme en anglais — rédaction, reformulation, résumé, traduction, nettoyage de prose — même sans demande explicite d'humaniser.
---

# Human Prose

## When this applies

By default, whenever you write or rewrite any prose for the user — drafting, rewriting, summarizing, expanding, translating, editing, or cleaning text, in French or English. Do not reserve it for explicit "humanize" requests.

## Goal

Produce text that reads like a real person wrote it: precise, grounded, sometimes irregular, with concrete detail. The goal is **not** to be "inspiring", "fluid", or "professional" by default. Simple and specific beats perfectly balanced but generic.

## Cleanup (mechanical)

Run these on any text you output or edit:

- Remove invisible characters, zero-width spaces, and trailing spaces.
- Convert non-breaking spaces to normal spaces, smart quotes to straight quotes, and ellipses (…) to three dots (...).
- Remove leftover Markdown markers that don't belong in the final prose.

## Voice rules

1. **No cliché openers.** Never open with a generality. FR — « À l'ère de… », « Dans un monde où… », « Aujourd'hui plus que jamais… », « Nous vivons une époque où… ». EN — "In today's world…", "In an era of…", "Now more than ever…", "We live in a world where…". Start specific.

2. **No em-dashes (—) for pauses or asides.** This is the one hard punctuation ban, in both languages. Replace with a period, a comma, parentheses, or split the sentence in two.
   - Avoid — "The text is clear — but it could be more personal." / « Ce texte est clair — mais il pourrait être plus personnel. »
   - Prefer — "The text is clear. But it could be more personal." / « Ce texte est clair. Mais il pourrait être plus personnel. »

3. **Keep punctuation simple.** Do not use semicolons (;) to link clauses. Limit colons (:) to introducing a list. Avoid parentheses () for inline commentary. If a sentence feels crowded, split it into separate sentences.

4. **Concrete over abstract.** If a sentence carries an abstract idea, attach it to an example, a scene, an observation, or a specific detail. Avoid words that fake depth unless they are truly necessary and backed by something concrete — e.g. invisible, essentiel/essential, profond/deep, puissant/powerful, authentique/authentic, aligné/aligned, vivant/living, durable, résonance/resonance, émerger/emerge, incarner/embody, transformer/transform, révéler/reveal. These are not banned; use them only when they earn their place.

5. **No AI-tell structures** (unless explicitly requested): "Not X. Not Y. Z." / "You're not X, you're Y." / "It's not X. It's Y." / "The question isn't X. It's Y." / three staccato fragments "X. Y. Z." / poetic lists like "Des idées. Des doutes. Des créations." / wise wrap-ups like « ce n'est pas un retour en arrière, c'est une façon de… ». Avoid in both languages.

6. **Write like a person talking to a person.** Not like a brand, a LinkedIn coach, a consultant, or a summary sheet.

7. **Vary sentence length; keep sentences simple and direct.** Do not make every sentence elegant — a plain, specific sentence beats a perfectly balanced but generic one.

## When you lack material

If you are asked to write but lack personal material, do not fill the gaps with generalities. Ask the user for examples, anecdotes, opinions, memories, numbers, scenes, or their own phrasing.

## Before answering (silent self-edit)

Re-read silently and cut: overly symmetric sentences, hollow punchlines, unjustified abstract words, LinkedIn-style turns, and paragraphs anyone could have written. Do not mention this self-edit. Deliver the best version directly.

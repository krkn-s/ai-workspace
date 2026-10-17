// Enrichment cascade: NVIDIA's own sources, newest-authoritative first.
//   1. build.nvidia.com/<org>/<model>.md          public record with Specifications/Capabilities
//   2. docs.api.nvidia.com/nim/reference/<m>-infer  ReadMe page embedding the per-model OpenAPI
//   3. family table (families.ts)                  last resort, flagged partial
// The /v1/models list stays the catalog source of truth; enrichment only fills
// metadata for an ID. Everything is best-effort: a failed layer never fails the
// refresh, it only degrades provenance.

import { familyFor, type FamilyThinking } from "./families";
import { messageOf } from "./discovery";

export const BUILD_MD_URL = "https://build.nvidia.com";
export const INFER_URL = "https://docs.api.nvidia.com/nim/reference";

export type Provenance = "nvidia-md" | "nvidia-infer" | "family";

export interface InferredMetadata {
	contextWindow?: number;
	maxTokens?: number;
	input?: Array<"text" | "image">;
	reasoning?: boolean;
	thinking?: FamilyThinking;
	provenance: Provenance;
	partial: boolean;
}

/** "deepseek-ai/deepseek-v4.1-flash" -> "deepseek-ai-deepseek-v4-1-flash-infer" */
export function inferSlug(id: string): string {
	return `${id.replace(/[.\/]/g, "-")}-infer`;
}

function unescapeText(text: string): string {
	return text
		.replace(/<([a-zA-Z0-9]+)[^>]*>|<\/[^>]*>/g, " ")
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
}

// --- Layer 1: build.nvidia.com/<org>/<model>.md -----------------------------

function bullet(md: string, label: string): string | undefined {
	// - **Context Length:** 1,048,576 tokens  (also ISL variant at line 48)
	const re = new RegExp(`-\\s*\\*\\*${label}\\*?\\*?:?\\*?\\*?\\s*([^\\n]+)`, "i");
	const match = md.match(re);
	if (match) return match[1].trim();
	// Fallback: prose occurrences like "**Input Context Length (ISL):** 1 million tokens"
	const prose = md.match(new RegExp(`\\*\\*[^\\n]*${label}[^\\n]*:\\*\\*\\s*([^\\n]+)`, "i"));
	return prose ? prose[1].trim() : undefined;
}

function parseTokens(text: string): number | undefined {
	const numeric = text.match(/([\d][\d,]{2,})\s*tokens?/i) ?? text.match(/^([\d][\d,]{2,})$/);
	if (numeric) return Number(numeric[1].replace(/,/g, ""));
	// "1 million tokens" style
	if (/1\s*million/i.test(text)) return 1_000_000;
	const short = text.match(/^(\d+)m\b/i);
	if (short) return Number(short[1]) * 1_000_000;
	const k = text.match(/^(\d+)k\b/i);
	if (k) return Number(k[1]) * 1_000;
	return undefined;
}

function parseInput(text: string): Array<"text" | "image"> {
	const input: Array<"text" | "image"> = ["text"];
	if (/image|multimodal/i.test(text)) input.push("image");
	return input;
}

export function parseModelRecord(md: string): Partial<InferredMetadata> {
	const specs = md.slice(md.indexOf("## Specifications"));
	const capabilities = md.indexOf("## Capabilities") >= 0 ? md.slice(md.indexOf("## Capabilities")) : "";

	const out: Partial<InferredMetadata> = {};

	const contextText = bullet(specs, "Context Length") ?? bullet(md, "Context Length");
	if (contextText) {
		const context = parseTokens(contextText);
		if (context) out.contextWindow = context;
	}

	const outputText = bullet(specs, "Output");
	const maxOutput = /(\d[\d,]*)\s*tokens?/i.exec(outputText ?? "");
	if (maxOutput) out.maxTokens = Number(maxOutput[1].replace(/,/g, ""));

	const inputText = bullet(specs, "Input");
	if (inputText) out.input = parseInput(inputText);

	if (/\*\*Reasoning:\*\* Supported/i.test(capabilities)) out.reasoning = true;

	return out;
}

// --- Layer 2: docs.api.nvidia.com/nim/reference/<slug>-infer -----------------

function paramSection(html: string, param: string): string | undefined {
	// id="body-params-max_tokens" starts the parameter card; the next card ends it.
	const anchor = `id="body-params-${param}`;
	const start = html.indexOf(anchor);
	if (start < 0) return undefined;
	let next = html.indexOf('id="body-params-', start + anchor.length);
	if (next < 0) next = Math.min(html.length, start + 60_000);
	return html.slice(start, next);
}

export function parseInferReference(html: string): Partial<InferredMetadata> {
	const out: Partial<InferredMetadata> = {};

	const maxTokenText = paramSection(html, "max_tokens");
	if (maxTokenText) {
		const range = /(\d[\d,]*)\s+to\s+([\d,]+)/.exec(unescapeText(maxTokenText));
		if (range) out.maxTokens = Number(range[2].replace(/,/g, ""));
	}

	const kwargs = paramSection(html, "chat_template_kwargs");
	if (kwargs) out.thinking = thinkingFromHint(unescapeText(kwargs));

	const effort = paramSection(html, "reasoning_effort");
	if (effort) {
		const text = unescapeText(effort);
		const base = out.thinking ?? {};
		const ladder = effortLadderFromHint(text);
		if (ladder) {
			out.thinking = { ...base, effortLadder: ladder };
		} else if (!out.thinking) {
			// Documented effort control without a parseable ladder: keep it off
			// rather than sending an undocumented level (400 risk).
			out.reasoning = true;
		}
	}

	if (paramSection(html, "reasoning_budget")) {
		out.thinking = { ...out.thinking, effortBudgetField: "reasoning_budget" } as FamilyThinking;
	}

	return out;
}

const enabled = { $var: "thinking.enabled" } as const;

// Map one -infer hint sentence to pi-native thinking compat. Keywords verified
// against live pages: MiniMax thinking_mode, qwen/gemma enable_thinking,
// glm enable_thinking/clear_thinking, kimi/deepseek-v3 {"thinking": true},
// nemotron reasoning_effort (none/medium/high).
export function thinkingFromHint(hint: string): FamilyThinking | undefined {
	const t: FamilyThinking = {};
	if (/thinking_mode/i.test(hint)) {
		t.levelKwarg = {
			key: "thinking_mode",
			map: {
				off: "disabled", minimal: "adaptive", low: "adaptive", medium: "adaptive",
				high: "enabled", xhigh: "enabled", max: "enabled",
			},
		};
	}
	if (/enable_thinking/i.test(hint)) {
		t.chatKwargs = /clear_thinking/i.test(hint)
			? { enable_thinking: enabled, clear_thinking: false }
			: { enable_thinking: enabled };
	}
	if (!t.levelKwarg && !t.chatKwargs && /\{"?thinking"?[:\s]+true/i.test(hint)) {
		t.chatKwargs = { thinking: enabled };
	}
	return Object.keys(t).length > 0 ? t : undefined;
}

function effortLadderFromHint(text: string): Record<string, string | null> | undefined {
	// Nemotron-Ultra style: none / medium / high modes.
	if (!/none/i.test(text) || !/high/i.test(text)) return undefined;
	return { off: "none", minimal: null, low: null, medium: "medium", high: "high", xhigh: "high", max: "high" };
}

// --- Cascade -----------------------------------------------------------------

async function fetchText(url: string, signal: AbortSignal, timeoutMs: number): Promise<string | undefined> {
	const res = await fetch(url, {
		headers: { Accept: "text/markdown, application/json, text/html" },
		signal: AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]),
	});
	return res.ok ? res.text() : undefined;
}

export async function enrichModel(id: string, signal: AbortSignal): Promise<InferredMetadata> {
	const meta: InferredMetadata = { provenance: "family", partial: true };
	const family = familyFor(id);
	meta.contextWindow = family.contextWindow;
	meta.maxTokens = family.maxTokens;
	meta.input = [...family.input];
	if (family.thinking) meta.thinking = family.thinking;

	// 1. Model record (.md)
	try {
		const md = await fetchText(`${BUILD_MD_URL}/${id}.md`, signal, 15_000);
		if (md) {
			const parsed = parseModelRecord(md);
			if (parsed.contextWindow) { meta.contextWindow = parsed.contextWindow; meta.partial = false; meta.maxTokens ??= family.maxTokens; }
			if (parsed.maxTokens) { meta.maxTokens = parsed.maxTokens; meta.partial = false; }
			if (parsed.input) { meta.input = parsed.input; }
			if (parsed.reasoning !== undefined) { meta.reasoning = parsed.reasoning; }
			if (parsed.contextWindow || parsed.maxTokens) meta.provenance = "nvidia-md";
		}
	} catch (error) {
		if (!signal.aborted) console.warn(`pi-nvidia-live: .md enrich failed for ${id}: ${messageOf(error)}`);
	}

	// 2. Per-model -infer reference (1-2 MB page; parsed locally, cheap regex)
	try {
		const html = await fetchText(`${INFER_URL}/${inferSlug(id)}`, signal, 20_000);
		if (html) {
			const parsed = parseInferReference(html);
			if (parsed.maxTokens) { meta.maxTokens = parsed.maxTokens; meta.partial = false; }
			if (parsed.thinking && !meta.thinking) meta.thinking = parsed.thinking;
			if (!meta.reasoning && (parsed.thinking || parsed.reasoning)) meta.reasoning = true;
			if (meta.provenance !== "nvidia-md") meta.provenance = "nvidia-infer";
		}
	} catch (error) {
		if (!signal.aborted) console.warn(`pi-nvidia-live: -infer enrich failed for ${id}: ${messageOf(error)}`);
	}

	// Model record missing max output? keep family value and stay partial.
	if (meta.partial && meta.provenance === "family") meta.thinking = family.thinking;
	return meta;
}
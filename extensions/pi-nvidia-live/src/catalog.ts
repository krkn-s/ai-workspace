// Catalog assembly: built-in defs (via the same-ID defaults pi resolves) + the
// discovered free-tier IDs enriched from NVIDIA sources. Registered as an
// models-only override so baseUrl, auth ($NVIDIA_API_KEY / auth.json) and the
// openai-completions streamer stay owned by pi's built-in nvidia provider.

import { NVIDIA_MODELS } from "@earendil-works/pi-ai/providers/nvidia.models";
import { NIM_BASE_URL, NIM_BASE_COMPAT, NIM_HEADERS, familyFor } from "./families";
import type { CacheShape, CachedModel } from "./cache";
import type { Provenance } from "./enrich";

const BASE_FALLBACK = Object.values(NVIDIA_MODELS)[0];

export interface ChatDef {
	id: string;
	name: string;
	api: "openai-completions";
	provider: "nvidia";
	baseUrl: string;
	input: Array<"text" | "image">;
	cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
	contextWindow: number;
	maxTokens: number;
	reasoning: boolean;
	headers?: Record<string, string>;
	compat?: Record<string, unknown>;
	thinkingLevelMap?: Record<string, string | null>;
}

// A missing built-in fallback means a broken local pi install: the merge then
// cannot resolve a baseUrl for new models and registerProvider would throw.
// Keep the throw loud at registration time instead.
if (!BASE_FALLBACK) {
	throw new Error("pi-nvidia-live: built-in nvidia catalog is empty; update pi.");
}

export function builtinChatDefs(): ChatDef[] {
	return Object.values(NVIDIA_MODELS).map((model) => ({
		id: model.id,
		name: model.name,
		api: "openai-completions",
		provider: "nvidia",
		baseUrl: model.baseUrl ?? NIM_BASE_URL,
		input: [...model.input] as Array<"text" | "image">,
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, ...model.cost },
		contextWindow: model.contextWindow,
		maxTokens: model.maxTokens,
		reasoning: model.reasoning,
		// applyExtension forces headers: undefined on extension definitions, so
		// the built-in long-poll header must be restated or the 20 built-ins
		// would lose it.
		headers: { ...NIM_HEADERS, ...(model.headers ?? {}) },
		compat: { ...NIM_BASE_COMPAT, ...(model.compat as Record<string, unknown> | undefined) },
		thinkingLevelMap: model.thinkingLevelMap ? { ...model.thinkingLevelMap } : undefined,
	}));
}

export function prettyName(id: string): string {
	const tail = id.split("/").pop() ?? id;
	return tail
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function defFromCached(
	id: string,
	cached: CachedModel | undefined,
	provenance: Provenance = "family",
): ChatDef {
	if (cached) return cachedToDef(id, cached);

	const family = familyFor(id);
	const def: ChatDef = {
		id,
		name: prettyName(id),
		api: "openai-completions",
		provider: "nvidia",
		baseUrl: NIM_BASE_URL,
		input: [...family.input],
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
		contextWindow: family.contextWindow,
		maxTokens: family.maxTokens,
		reasoning: Boolean(family.thinking),
		headers: NIM_HEADERS,
		compat: compatFor(family.thinking),
	};
	applyThinking(def, family.thinking);
	return def;
}

function cachedToDef(id: string, cached: CachedModel): ChatDef {
	const def: ChatDef = {
		id,
		name: prettyName(id),
		api: "openai-completions",
		provider: "nvidia",
		baseUrl: NIM_BASE_URL,
		input: [...cached.input],
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
		contextWindow: cached.contextWindow,
		maxTokens: cached.maxTokens,
		reasoning: cached.reasoning,
		headers: NIM_HEADERS,
		compat: compatFor(),
	};
	applyThinking(def, cached.thinking);
	return def;
}

function compatFor(): Record<string, unknown> {
	return { ...NIM_BASE_COMPAT };
}

// Translate family/infer thinking rules into pi-native compat fields.
// pi sends chat_template_kwargs itself when compat.thinkingFormat is
// "chat-template" and compat.chatTemplateKwargs is set ($var interpolation
// resolves against the pi thinking level; see pi-ai openai-completions).
function applyThinking(def: ChatDef, thinking: Record<string, unknown> | undefined): void {
	if (!thinking) return;

	if (thinking.nativeFormat === "deepseek") {
		def.compat = { ...def.compat, thinkingFormat: "deepseek" };
		def.reasoning = true;
		return;
	}

	const ladder = thinking.effortLadder as Record<string, string | null> | undefined;
	if (ladder) {
		def.compat = { ...def.compat, supportsReasoningEffort: true };
		def.thinkingLevelMap = ladder;
		def.reasoning = true;
		if (thinking.effortBudgetField) {
			def.compat = {
				...def.compat,
				thinkingTokenBudgetField: thinking.effortBudgetField,
				supportsThinkingTokenBudget: true,
			};
		}
		return;
	}

	const kwargs: Record<string, unknown> = thinking.chatKwargs
		? (structuredClone(thinking.chatKwargs) as Record<string, unknown>)
		: {};
	if (thinking.levelKwarg) {
		kwargs[thinking.levelKwarg.key] = { $var: "thinking.effort" };
		def.thinkingLevelMap = thinking.levelKwarg.map;
	}
	if (Object.keys(kwargs).length > 0) {
		def.compat = { ...def.compat, thinkingFormat: "chat-template", chatTemplateKwargs: kwargs };
		def.reasoning = true;
	}
}

export function mergeCatalog(
	builtinDefs: ChatDef[],
	liveIds: string[],
	cache: CacheShape,
	provenances: Record<string, Provenance>,
): ChatDef[] {
	const defs = [...builtinDefs];
	const seen = new Set(defs.map((def) => def.id));
	for (const id of liveIds) {
		if (seen.has(id)) continue;
		seen.add(id);
		defs.push(defFromCached(id, cache.models[id], provenances[id] ?? "family"));
	}
	// IDs retired from the live list keep their definition only in defs they
	// came from the built-in catalog; discovered-only IDs that vanish from
	// /v1/models are dropped (diff is the source of truth).
	return defs;
}
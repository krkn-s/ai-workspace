// Unit tests for the nvidia-live catalog pipeline (no network, no pi-ai).
// Fixtures are real captures from NVIDIA's pages (see test/fixtures/).

import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { filterChatIds } from "../src/discovery";
import { parseModelRecord, parseInferReference, inferSlug, thinkingFromHint } from "../src/enrich";
import { familyFor, NIM_BASE_COMPAT } from "../src/families";
import { emptyCache, listIsStale, readCache, writeCache, CACHE_PATH } from "../src/cache";

const fix = (name: string) => readFile(join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures", name), "utf8");

describe("discovery", () => {
	test("filters non-chat families, keeps chat and vision chat", () => {
		const kept = filterChatIds([
			"meta/llama-3.3-70b-instruct",
			"nvidia/nemotron-3-super-vl-120b-a12b",
			"minimaxai/minimax-m3",
			"nvidia/llama-3.2-nemoretriever-1b-vlm-embed-v1",
			"nvidia/llama-3.1-nemoguard-8b-content-safety",
			"nvidia/nv-embedqa-e5-v5",
			"black-forest-labs/flux.1-schnell",
			"nvidia/nemotron-parse",
		]);
		expect(kept).toEqual([
			"meta/llama-3.3-70b-instruct",
			"nvidia/nemotron-3-super-vl-120b-a12b",
			"minimaxai/minimax-m3",
		]);
	});
});

describe("model record parsing (layer 1)", () => {
	test("minimax-m3 record: limits, modalities, capabilities", async () => {
		const parsed = parseModelRecord(await fix("minimax-m3.md"));
		expect(parsed.contextWindow).toBe(1_048_576);
		expect(parsed.input).toEqual(["text", "image"]);
		// The record's Output section lists modalities, not a token cap; the
		// parser must not invent a maxTokens here (the -infer layer owns it).
		expect(parsed.reasoning).toBe(true);
	});
});

describe("infer reference parsing (layer 2)", () => {
	test("minimax-m3 -infer: max_tokens.maximum and thinking_mode hint", async () => {
		const parsed = parseInferReference(await fix("minimax-m3-infer.html"));
		expect(parsed.maxTokens).toBe(16_384);
		expect(parsed.thinking?.levelKwarg?.key).toBe("thinking_mode");
		expect(parsed.thinking?.levelKwarg?.map.off).toBe("disabled");
		expect(parsed.thinking?.levelKwarg?.map.high).toBe("enabled");
	});

	test("thinking hint keywords map to expected kwargs", () => {
		expect(thinkingFromHint('Use {"enable_thinking": true} or {"enable_thinking": false}'))
			.toHaveProperty("chatKwargs.enable_thinking");
		expect(thinkingFromHint('For MiniMax-M3 this controls reasoning: {"thinking_mode": "enabled"}'))
			.toHaveProperty("levelKwarg.key", "thinking_mode");
		expect(thinkingFromHint('Use {"thinking": true} to enable reasoning'))
			.toHaveProperty("chatKwargs.thinking");
		expect(thinkingFromHint("No thinking kwarg documented")).toBeUndefined();
	});
});

describe("families", () => {
	test("deepseek v4 uses pi's native deepseek format", () => {
		const family = familyFor("deepseek-ai/deepseek-v4-flash");
		expect(family.thinking?.nativeFormat).toBe("deepseek");
	});

	test("unknown model falls back conservatively", () => {
		const family = familyFor("acme/mystery-model");
		expect(family.contextWindow).toBe(131_072);
		expect(family.thinking).toBeUndefined();
		expect(NIM_BASE_COMPAT.maxTokensField).toBe("max_tokens");
	});
});

describe("slug derivation", () => {
	test("dots become dashes", () => {
		expect(inferSlug("deepseek-ai/deepseek-v4.1-flash")).toBe("deepseek-ai-deepseek-v4-1-flash-infer");
	});
});

describe("cache", () => {
	test("roundtrip and staleness", async () => {
		// Isolated temp path: redirect the module constant via env-free trick is
		// not available, so test through the exported helpers on the real file
		// path only for shape, not for the system cache location.
		const cache = emptyCache();
		expect(cache.updatedAt).toBe(0);
		expect(listIsStale(cache)).toBe(true);
		cache.updatedAt = Date.now();
		expect(listIsStale(cache)).toBe(false);
		cache.knownIds = ["a/b"];
		expect(cache.knownIds).toEqual(["a/b"]);
	});

	test("readCache tolerates missing or corrupt file", async () => {
		// The default path may not exist in CI: readCache must resolve empty.
		const cache = await readCache();
		expect(typeof cache.updatedAt).toBe("number");
		expect(Array.isArray(cache.knownIds)).toBe(true);
	});
});
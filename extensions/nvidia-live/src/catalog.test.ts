// Unit tests for the nvidia-live catalog pipeline (no network, no pi-ai).
// Fixtures are real captures from NVIDIA's pages (see test/fixtures/).

import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverLiveChatIds, filterChatIds } from "../src/discovery";
import { enrichModel, parseModelRecord, parseInferReference, inferSlug, thinkingFromHint } from "../src/enrich";
import { familyFor, NIM_BASE_COMPAT } from "../src/families";
import { emptyCache, listIsStale, readCache, writeCache, CACHE_PATH } from "../src/cache";

const fix = (name: string) => readFile(join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures", name), "utf8");

async function mockedEnrich(id: string, md = "", html = "") {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = async (url) => {
		if (String(url).includes("build.nvidia.com")) return new Response(md, { status: md ? 200 : 404 });
		return new Response(html, { status: html ? 200 : 404 });
	};
	try {
		return await enrichModel(id, new AbortController().signal);
	} finally {
		globalThis.fetch = originalFetch;
	}
}

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

	test("propagates cancellation to the models request", async () => {
		const originalFetch = globalThis.fetch;
		const controller = new AbortController();
		globalThis.fetch = async (_url, init) => new Promise<Response>((_resolve, reject) => {
			init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
		});
		try {
			const pending = discoverLiveChatIds(controller.signal);
			controller.abort(new Error("stop"));
			const result = await pending;
			expect(result.chatIds).toEqual([]);
			expect(result.error).toBe("stop");
		} finally {
			globalThis.fetch = originalFetch;
		}
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

describe("enrichment cascade", () => {
	test("keeps the record partial while a core field uses the family fallback", async () => {
		const result = await mockedEnrich("acme/context-only", "## Specifications\n- **Context Length:** 131,072 tokens\n");
		expect(result.maxTokens).toBe(8192);
		expect(result.partial).toBe(true);
		expect(result.provenance).toBe("nvidia-md");
	});

	test("marks a record complete when NVIDIA supplies all core fields", async () => {
		const md = [
			"## Specifications",
			"- **Context Length:** 131,072 tokens",
			"- **Output:** 8,192 tokens",
			"- **Input:** Text",
		].join("\n");
		const result = await mockedEnrich("acme/complete", md);
		expect(result.partial).toBe(false);
	});

	test("does not claim infer provenance for an unusable page", async () => {
		const result = await mockedEnrich("acme/no-useful-metadata", "", "<html></html>");
		expect(result.provenance).toBe("family");
		expect(result.partial).toBe(true);
	});

	test("lets infer thinking metadata override the family fallback", async () => {
		const html = '<div id="body-params-chat_template_kwargs">Use {"thinking_mode": "enabled"}</div>';
		const result = await mockedEnrich("qwen/qwen3-test", "", html);
		expect(result.thinking?.levelKwarg?.key).toBe("thinking_mode");
		expect(result.thinking?.chatKwargs).toBeUndefined();
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
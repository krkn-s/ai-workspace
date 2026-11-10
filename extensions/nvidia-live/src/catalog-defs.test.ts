import { afterAll, describe, expect, mock, test } from "bun:test";

const builtinModel = {
	id: "nvidia/builtin",
	name: "Builtin",
	api: "openai-completions",
	provider: "nvidia",
	baseUrl: "https://integrate.api.nvidia.com/v1",
	input: ["text"],
	cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
	contextWindow: 32_768,
	maxTokens: 4096,
	reasoning: false,
	headers: { "X-Builtin": "yes" },
};

mock.module("@earendil-works/pi-ai/providers/all", () => ({
	getBuiltinModels: () => [builtinModel],
}));

const { builtinChatDefs, defFromCached, mergeCatalog, prettyName } = await import("./catalog");
const { emptyCache } = await import("./cache");

afterAll(() => mock.restore());

describe("catalog definitions", () => {
	test("builtins retain their headers and base compatibility", () => {
		const [def] = builtinChatDefs();
		expect(def.headers).toEqual({ "NVCF-POLL-SECONDS": "3600", "X-Builtin": "yes" });
		expect(def.compat).toMatchObject({ supportsStore: false, maxTokensField: "max_tokens" });
	});

	test("cached chat kwargs become native pi compatibility", () => {
		const def = defFromCached("acme/reasoning", {
			contextWindow: 8192,
			maxTokens: 1024,
			input: ["text"],
			reasoning: true,
			thinking: { chatKwargs: { enable_thinking: { $var: "thinking.enabled" } } },
			provenance: "nvidia-md",
			partial: false,
		});
		expect(def.compat).toMatchObject({
			thinkingFormat: "chat-template",
			chatTemplateKwargs: { enable_thinking: { $var: "thinking.enabled" } },
		});
		expect(def.reasoning).toBe(true);
	});

	test("effort ladders and budgets are preserved", () => {
		const def = defFromCached("acme/effort", {
			contextWindow: 8192,
			maxTokens: 1024,
			input: ["text"],
			reasoning: true,
			thinking: {
				effortLadder: { off: "none", high: "high" },
				effortBudgetField: "reasoning_budget",
			},
			provenance: "nvidia-infer",
			partial: true,
		});
		expect(def.compat).toMatchObject({
			supportsReasoningEffort: true,
			supportsThinkingTokenBudget: true,
			thinkingTokenBudgetField: "reasoning_budget",
		});
		expect(def.thinkingLevelMap).toEqual({ off: "none", high: "high" });
	});

	test("merge keeps builtins and adds each live discovered ID once", () => {
		const cache = emptyCache();
		cache.models["acme/live"] = {
			contextWindow: 8192,
			maxTokens: 1024,
			input: ["text"],
			reasoning: false,
			provenance: "nvidia-md",
			partial: false,
		};
		cache.models["acme/retired"] = { ...cache.models["acme/live"] };
		const defs = mergeCatalog(
			builtinChatDefs(),
			["nvidia/builtin", "acme/live", "acme/live"],
			cache,
			{},
		);
		expect(defs.map((def) => def.id)).toEqual(["nvidia/builtin", "acme/live"]);
	});

	test("generated display names use the model tail", () => {
		expect(prettyName("minimaxai/minimax-m3")).toBe("Minimax M3");
	});
});

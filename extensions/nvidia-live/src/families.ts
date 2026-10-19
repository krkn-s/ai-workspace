// Conservative family fallbacks for NVIDIA NIM model IDs.
//
// Sourced from NVIDIA's own per-model reference hints
// (docs.api.nvidia.com/nim/reference/<model>-infer) and the MIT-licensed
// family table of Diegovisk/pi-nvidia-nim (credited per repository policy).
// Values are fallbacks only: NVIDIA's own .md record or -infer schema wins when
// available. A model that matches no family and has no NVIDIA metadata gets
// flagged `partial` upstream rather than silently invented here.

export interface FamilyThinking {
	/** pi-ai native thinkingFormat ("deepseek") handled by pi's openai-completions streamer. */
	nativeFormat?: "deepseek";
	/** chat_template_kwargs entries. {$var:"thinking.enabled"} resolves to true/false by level. */
	chatKwargs?: Record<string, unknown>;
	/** pi thinking level -> top-level NIM reasoning_effort value. null hides the pi level. */
	effortLadder?: Record<string, string | null>;
	/** chat_template_kwargs entry whose value follows a pi-level map (e.g. minimax thinking_mode). */
	levelKwarg?: { key: string; map: Record<string, string | null> };
	/** Top-level reasoning budget field name (e.g. nemotron reasoning_budget). */
	effortBudgetField?: string;
}

export interface Family {
	contextWindow: number;
	maxTokens: number;
	input: Array<"text" | "image">;
	thinking?: FamilyThinking;
}

export const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";

// Mirrors the compat flags pi itself ships for its 20 built-in nvidia models.
export const NIM_BASE_COMPAT: Record<string, unknown> = {
	supportsStore: false,
	supportsDeveloperRole: false,
	supportsReasoningEffort: false,
	maxTokensField: "max_tokens",
	supportsStrictMode: false,
};

// ReadMe-hosted reference pages poll; without the header long completions may
// be cut off by proxy timeouts. pi sets the same header on built-in models.
export const NIM_HEADERS: Record<string, string> = { "NVCF-POLL-SECONDS": "3600" };

// Conservative struct for models without a rule or NVIDIA metadata.
const CHAT_FALLBACK: Family = { contextWindow: 131_072, maxTokens: 8192, input: ["text"] };

const enabled = { $var: "thinking.enabled" } as const;

// Seven pi levels with four minimax stop-points (off -> disabled, ... -> enabled).
const ladder2 = (...modes: string[]): Record<string, string | null> => {
	const keys = ["off", "minimal", "low", "medium", "high", "xhigh", "max"] as const;
	const out: Record<string, string | null> = {};
	for (const [i, key] of keys.entries()) out[key] = modes[Math.min(i, modes.length - 1)];
	return out;
};

// Ordered: first match wins. Keep vendor-prefixed ids before bare-name hints.
const RULES: Array<{ match: RegExp; family: Family }> = [
	// DeepSeek V4+ accepts pi's native "deepseek" thinking format (verified by
	// pi's own built-in catalog entry for deepseek-v4.1-flash).
	{
		match: /deepseek-v4/i,
		family: { contextWindow: 1_048_576, maxTokens: 262_144, input: ["text", "image"], thinking: { nativeFormat: "deepseek" } },
	},
	// DeepSeek V3.x and R1 distills toggle thinking via chat_template_kwargs {"thinking": true}.
	{
		match: /deepseek-v3|r1-distill|deepseek-r1/i,
		family: { contextWindow: 131_072, maxTokens: 65_536, input: ["text"], thinking: { chatKwargs: { thinking: enabled } } },
	},
	{
		match: /qwen|qwq/i,
		family: { contextWindow: 262_144, maxTokens: 16_384, input: ["text"], thinking: { chatKwargs: { enable_thinking: enabled } } },
	},
	{
		match: /z-ai\/glm|glm-?\d/i,
		family: { contextWindow: 1_000_000, maxTokens: 131_072, input: ["text"], thinking: { chatKwargs: { enable_thinking: enabled, clear_thinking: false } } },
	},
	{
		match: /moonshotai\/kimi/i,
		family: { contextWindow: 262_144, maxTokens: 16_384, input: ["text"], thinking: { chatKwargs: { thinking: enabled } } },
	},
	// MiniMax M3: discrete disabled/adaptive/enabled modes via thinking_mode.
	{
		match: /minimax/i,
		family: {
			contextWindow: 1_000_000,
			maxTokens: 16_384,
			input: ["text", "image"],
			thinking: { levelKwarg: { key: "thinking_mode", map: ladder2("disabled", "adaptive", "adaptive", "enabled") } },
		},
	},
	// Nemotron 3: top-level reasoning_effort with the documented none/medium/high.
	{
		match: /nemotron/i,
		family: {
			contextWindow: 131_072,
			maxTokens: 131_072,
			input: ["text"],
			thinking: { effortLadder: { off: "none", minimal: null, low: null, medium: "medium", high: "high", xhigh: "high", max: "high" } },
		},
	},
	// Gemma 4: enable_thinking hint on the -infer pages.
	{
		match: /gemma/i,
		family: { contextWindow: 131_072, maxTokens: 32_768, input: ["text", "image"], thinking: { chatKwargs: { enable_thinking: enabled } } },
	},
];

export function familyFor(id: string): Family {
	for (const rule of RULES) {
		if (rule.match.test(id)) return rule.family;
	}
	return CHAT_FALLBACK;
}
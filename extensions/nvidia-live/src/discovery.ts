// Discovery: NVIDIA's shared free endpoint IS the free tier; everything it
// lists is callable with a free key, so no extra "free" filter exists or is
// needed. GET /v1/models answers without auth (verified 2026); Bearer is sent
// when a key resolves, which NVIDIA treats slightly more leniently.

const NIM_MODELS_URL = "https://integrate.api.nvidia.com/v1/models";

// Non-chat families served by the shared endpoint: embeddings, retrievers,
// parsers, speech, safety, rewards, clip, image-gen. Vision chat models
// (llama-3.2-vision, minimax-m3, nemotron-*-vl, diffusiongemma) stay in.
const NON_CHAT = /embed|rerank|retriever|nemotron-parse|parakeet|conformer|riva|asr|tts|whisper|transcribe|voice|starcoder|arctic-embed|shield|guard|content-safety|jailbreak|pii-safety|reward|nvclip|deplot|kosmos-2|fuyu|neva|vila|flux|stable-diffusion|sdxl/i;

export interface DiscoveryResult {
	chatIds: string[];
	error?: string;
}

function isChatModel(id: string): boolean {
	return !NON_CHAT.test(id);
}

export function filterChatIds(ids: string[]): string[] {
	return ids.filter(isChatModel);
}

export async function discoverLiveChatIds(signal: AbortSignal, apiKey?: string): Promise<DiscoveryResult> {
	try {
		const headers: Record<string, string> = { Accept: "application/json" };
		if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
		const res = await fetch(NIM_MODELS_URL, { headers, signal });
		if (!res.ok) return { chatIds: [], error: `HTTP ${res.status}` };
		const payload = (await res.json()) as { data?: Array<{ id?: unknown }> };
		if (!Array.isArray(payload.data)) return { chatIds: [], error: "unexpected /models payload" };
		const ids = payload.data
			.map((entry) => entry.id)
			.filter((id): id is string => typeof id === "string" && id.length > 0)
			.filter(filtered);
		return { chatIds: ids };
	} catch (error) {
		return { chatIds: [], error: messageOf(error) };
	}
}

// Guard against a /models listing that already contains non-chat rows.
function filtered(id: string): boolean {
	return isChatModel(id);
}

export function messageOf(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
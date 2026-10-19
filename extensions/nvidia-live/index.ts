// nvidia-live: replaces the model list of pi's built-in nvidia provider with
// the live free-tier catalog from integrate.api.nvidia.com/v1/models, with
// per-model metadata enriched from NVIDIA's own sources:
//   1. build.nvidia.com/<org>/<model>.md  (Specifications / Capabilities)
//   2. docs.api.nvidia.com/nim/reference/<model>-infer (OpenAPI, thinking kwargs)
//   3. family fallbacks (flagged `partial` in /nvidia-models)
//
// The override passes `models` only, so pi keeps owning the provider's baseUrl,
// auth (/login nvidia, $NVIDIA_API_KEY) and the openai-completions streamer.
// Unregistering the extension restores the built-in 20-model catalog verbatim.

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { discoverLiveChatIds } from "./src/discovery";
import { enrichModel, type Provenance } from "./src/enrich";
import { listIsStale, readCache, writeCache, type CacheShape } from "./src/cache";
import { builtinChatDefs, mergeCatalog, type ChatDef } from "./src/catalog";

const PROVIDER_ID = "nvidia";

// Concurrency cap for the per-model .md/-infer enrichment fetches.
const ENRICH_CONCURRENCY = 3;

async function fetchWithEnrichment(
	force: boolean,
	signal: AbortSignal,
): Promise<{ defs: ChatDef[]; changed: boolean; note?: string }> {
	const cache = await readCache();

	if (!force && !listIsStale(cache)) {
		return {
			defs: mergeCatalog(
				builtinChatDefs(),
				cache.knownIds,
				cache,
				Object.fromEntries(cache.knownIds.map((id) => [id, (cache.models[id]?.provenance ?? "family") as Provenance])),
			),
			changed: false,
		};
	}

	const { chatIds, error } = await discoverLiveChatIds(signal);
	if (error && chatIds.length === 0) {
		// Degraded: keep cached list, then built-ins; never an empty catalog.
		return {
			defs: mergeCatalog(builtinChatDefs(), cache.knownIds, cache, {}),
			changed: false,
			note: `discovery failed (${error}); keeping cached catalog`,
		};
	}

	const next: CacheShape = { ...cache, updatedAt: Date.now(), knownIds: chatIds, models: { ...cache.models } };
	// Retired IDs are dropped: the live list is the source of truth.
	for (const id of Object.keys(next.models)) {
		if (!chatIds.includes(id)) delete next.models[id];
	}

	const provenances: Record<string, Provenance> = {};
	const newIds = chatIds.filter((id) => !(id in cache.models));
	for (let i = 0; i < newIds.length; i += ENRICH_CONCURRENCY) {
		const batch = newIds.slice(i, i + ENRICH_CONCURRENCY);
		await Promise.all(
			batch.map(async (id) => {
				const meta = await enrichModel(id, signal);
				next.models[id] = {
					contextWindow: meta.contextWindow!,
					maxTokens: meta.maxTokens!,
					input: meta.input!,
					reasoning: meta.reasoning ?? Boolean(meta.thinking),
					thinking: meta.thinking,
					provenance: meta.provenance,
					partial: meta.partial,
				};
			}),
		);
	}
	for (const id of chatIds) {
		provenances[id] = (next.models[id]?.provenance ?? "family") as Provenance;
	}

	const defs = mergeCatalog(builtinChatDefs(), chatIds, next, provenances);
	await writeCache(next);
	return { defs, changed: newIds.length > 0, note: newIds.length > 0 ? `${newIds.length} new model(s)` : undefined };
}

export default function (pi: ExtensionAPI) {
	// Static baseline (built-in 20) registered synchronously in the factory:
	// no network on the extension load path, per pi's lifecycle contract.
	pi.registerProvider(PROVIDER_ID, { models: builtinChatDefs() as never });

	let inFlight: Promise<unknown> | undefined;

	async function refreshCatalog(force: boolean, ctx: ExtensionContext): Promise<void> {
		if (inFlight) return inFlight;
		inFlight = (async () => {
			try {
				const { defs, changed, note } = await fetchWithEnrichment(force, new AbortController().signal);
				// Re-registration takes effect immediately (pi contract).
				pi.registerProvider(PROVIDER_ID, { models: defs as never });
				if (changed || (note?.startsWith("discovery failed"))) {
					await ctx.ui.notify(`nvidia-live: ${note ?? `catalog refreshed (${defs.length} models)`}`, "info");
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				if (ctx.hasUI) await ctx.ui.notify(`nvidia-live: refresh failed (${message})`, "warning");
				else console.warn("nvidia-live: refresh failed:", message);
			} finally {
				inFlight = undefined;
			}
		})();
		return inFlight;
	}

	pi.on("session_start", (_event, ctx) => {
		// Fire-and-forget: slow enrichment batches must not delay the session.
		void refreshCatalog(false, ctx);
	});

	pi.registerCommand("nvidia-refresh", {
		description: "Force refresh of the live NVIDIA NIM catalog (discovery + metadata enrichment)",
		handler: async (_args, ctx) => refreshCatalog(true, ctx),
	});

	pi.registerCommand("nvidia-models", {
		description: "Show the live NVIDIA NIM catalog (limits, provenance, partial metadata flags)",
		handler: async (_args, ctx) => {
			const cache = await readCache();
			const lines = [
				`nvidia-live: ${cache.knownIds.length} live chat models (cache ${listIsStale(cache) ? "stale" : "fresh"})`,
				"",
			];
			for (const id of [...cache.knownIds].sort()) {
				const m = cache.models[id];
				if (!m) {
					lines.push(`${id}  [family fallback]`);
					continue;
				}
				const limits = `${Math.round(m.contextWindow / 1024)}k/${Math.round(m.maxTokens / 1024)}k`;
				const flags = [
					m.partial ? "partial" : m.provenance,
					m.reasoning ? "reasoning" : "",
					m.input.includes("image") ? "vision" : "",
				].filter(Boolean);
				lines.push(`${id}  ${limits}  [${flags.join(", ")}]`);
			}
			const text = lines.join("\n");
			if (ctx.hasUI) await ctx.ui.notify(text, "info");
			else console.log(text);
		},
	});
}
// Local metadata cache. pi persists refreshed model lists itself (ModelsStore)
// but only through explicit publication; we keep the enrichment state (limits,
// thinking compat, provenance, partial flags) in one JSON file so the offline
// startup phase and degraded runs keep the last good catalog.
//
// File: ~/.pi/nvidia-live-cache.json

import { homedir } from "node:os";
import { join } from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

export const CACHE_PATH = join(homedir(), ".pi", "nvidia-live-cache.json");

// How long a /v1/models discovery result is reused before re-fetching. The
// fetch is cheap; enrichment pages are only hit for genuinely new IDs.
export const LIST_TTL_MS = 60 * 60 * 1000;

export interface CachedModel {
	contextWindow: number;
	maxTokens: number;
	input: Array<"text" | "image">;
	reasoning: boolean;
	thinking?: Record<string, unknown>;
	provenance: string;
	partial: boolean;
}

export interface CacheShape {
	updatedAt: number;
	knownIds: string[];
	models: Record<string, CachedModel>;
}

export function emptyCache(): CacheShape {
	return { updatedAt: 0, knownIds: [], models: {} };
}

export async function readCache(): Promise<CacheShape> {
	try {
		const raw = JSON.parse(await readFile(CACHE_PATH, "utf8")) as Partial<CacheShape>;
		return {
			updatedAt: raw.updatedAt ?? 0,
			knownIds: Array.isArray(raw.knownIds) ? raw.knownIds : [],
			models: raw.models && typeof raw.models === "object" ? raw.models : {},
		};
	} catch {
		return emptyCache();
	}
}

export async function writeCache(cache: CacheShape): Promise<void> {
	await mkdir(join(CACHE_PATH, ".."), { recursive: true });
	const tmp = `${CACHE_PATH}.tmp`;
	try {
		await writeFile(tmp, JSON.stringify(cache, null, 2));
		await rename(tmp, CACHE_PATH).catch(async () => writeFile(CACHE_PATH, JSON.stringify(cache, null, 2)));
	} catch {
		// Cache write failure is never fatal: the extension still works in-memory.
	}
}

export function listIsStale(cache: CacheShape, ttlMs: number = LIST_TTL_MS): boolean {
	return Date.now() - cache.updatedAt > ttlMs;
}
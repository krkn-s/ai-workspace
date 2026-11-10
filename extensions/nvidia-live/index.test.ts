import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const discoveryPath = join(here, "src", "discovery.ts");
const enrichPath = join(here, "src", "enrich.ts");
const cachePath = join(here, "src", "cache.ts");
// Bun rewrites module namespaces in place. Snapshot real exports for the other test files.
const actualDiscovery = { ...await import("./src/discovery") };
const actualEnrich = { ...await import("./src/enrich") };
const actualCache = { ...await import("./src/cache") };
const emptyCache = () => ({ updatedAt: 0, knownIds: [] as string[], models: {} });
const discoverLiveChatIds = mock(async () => ({ chatIds: ["acme/live"] }));
const enrichModel = mock(async () => ({
	contextWindow: 8192,
	maxTokens: 1024,
	input: ["text"] as Array<"text" | "image">,
	reasoning: false,
	provenance: "nvidia-md",
	partial: false,
}));
const readCache = mock(async () => emptyCache());
const writeCache = mock(async () => {});
const listIsStale = mock(() => false);

mock.module("@earendil-works/pi-ai/providers/all", () => ({
	getBuiltinModels: () => [{
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
	}],
}));
mock.module(discoveryPath, () => ({ discoverLiveChatIds }));
mock.module(enrichPath, () => ({ enrichModel }));
mock.module(cachePath, () => ({ listIsStale, readCache, writeCache }));

const extension = (await import("./index")).default;

type Handler = (...args: any[]) => any;

function loadExtension() {
	const events = new Map<string, Handler>();
	const commands = new Map<string, { handler: Handler }>();
	const registrations: Array<{ id: string; config: { models: Array<{ id: string }> } }> = [];
	const pi = {
		registerProvider: (id: string, config: { models: Array<{ id: string }> }) => registrations.push({ id, config }),
		on: (name: string, handler: Handler) => events.set(name, handler),
		registerCommand: (name: string, definition: { handler: Handler }) => commands.set(name, definition),
	};
	extension(pi as never);
	return { events, commands, registrations };
}

const context = () => ({
	hasUI: true,
	ui: { notify: mock(async () => {}) },
});

async function flush(): Promise<void> {
	for (let i = 0; i < 10; i++) await Promise.resolve();
}

beforeEach(() => {
	discoverLiveChatIds.mockClear();
	discoverLiveChatIds.mockResolvedValue({ chatIds: ["acme/live"] });
	enrichModel.mockClear();
	readCache.mockClear();
	readCache.mockResolvedValue(emptyCache());
	writeCache.mockClear();
	listIsStale.mockClear();
});

afterAll(() => {
	mock.restore();
	mock.module(discoveryPath, () => actualDiscovery);
	mock.module(enrichPath, () => actualEnrich);
	mock.module(cachePath, () => actualCache);
});

describe("extension refresh lifecycle", () => {
	test("refresh enriches new models, publishes them and writes the cache", async () => {
		const { commands, registrations } = loadExtension();
		expect(registrations).toHaveLength(1);
		await commands.get("nvidia-refresh")!.handler("", context());
		expect(registrations).toHaveLength(2);
		expect(registrations[1].config.models.map((model) => model.id)).toEqual([
			"nvidia/builtin",
			"acme/live",
		]);
		expect(enrichModel).toHaveBeenCalledTimes(1);
		expect(writeCache).toHaveBeenCalledTimes(1);
	});

	test("session shutdown prevents catalog publication and cache writes", async () => {
		let resolveDiscovery: ((value: { chatIds: string[]; error?: string }) => void) | undefined;
		discoverLiveChatIds.mockImplementationOnce(() => new Promise((resolve) => {
			resolveDiscovery = resolve;
		}));
		const { commands, events, registrations } = loadExtension();
		const pending = commands.get("nvidia-refresh")!.handler("", context());
		await flush();
		expect(resolveDiscovery).toBeDefined();
		events.get("session_shutdown")!({}, context());
		resolveDiscovery!({ chatIds: [], error: "aborted" });
		await pending;
		expect(registrations).toHaveLength(1);
		expect(writeCache).not.toHaveBeenCalled();
	});

	test("a fresh cache starts without network discovery", async () => {
		const cached = emptyCache();
		cached.knownIds = ["acme/live"];
		readCache.mockResolvedValue(cached);
		const { events, registrations } = loadExtension();
		events.get("session_start")!({}, context());
		await flush();
		expect(discoverLiveChatIds).not.toHaveBeenCalled();
		expect(registrations).toHaveLength(2);
		expect(registrations[1].config.models.map((model) => model.id)).toContain("acme/live");
	});
});

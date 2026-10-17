# pi-nvidia-live

Live NVIDIA NIM model catalog for [pi](https://pi.dev). Replaces the model list of pi's
built-in `nvidia` provider with the free-tier catalog from
`integrate.api.nvidia.com/v1/models` and fills per-model metadata from NVIDIA's own sources.

## Why

pi ships 20 built-in NVIDIA models. NVIDIA's free endpoint serves ~57 chat models
(and grows/shrinks over time), and NVIDIA's `/v1/models` exposes no metadata. This extension:

- discovers the live free-tier catalog (the endpoint itself defines the free tier)
- enriches each model with NVIDIA-authored data:
  1. `build.nvidia.com/<org>/<model>.md` (Specifications / Capabilities)
  2. `docs.api.nvidia.com/nim/reference/<model>-infer` (OpenAPI: max output, thinking kwargs)
  3. conservative family fallbacks, flagged `partial`
- registers pi-native compat (`thinkingFormat`, `chatTemplateKwargs`), no custom streaming
  and no custom retry: pi's `settings.retry` handles 429s

Auth is untouched: use `/login nvidia` or `$NVIDIA_API_KEY`, as for the built-in provider.

## Install

```bash
pi install ./extensions/pi-nvidia-live   # from this repository, or an absolute path
# or load for one session:
pi -e ./extensions/pi-nvidia-live
```

## Commands

| Command | Effect |
|---------|--------|
| `/nvidia-refresh` | Force re-fetch of the live list + metadata for unknown models |
| `/nvidia-models` | Show limits, provenance (`nvidia-md` / `nvidia-infer` / `family`, `partial` flag) |

Discovery also runs on `session_start` (list TTL 1 h; `.md`/`-infer` pages are fetched
only for unknown model IDs).

## Cache

`~/.pi/nvidia-live-cache.json`. Written atomically; a failed fetch keeps the cached
catalog, then the built-in 20. Removing the file re-runs full enrichment.

## Scope

- Chat models only (embeddings, retrieval, safety, speech, image generation are filtered
  out); pi's built-in image/classifier catalogs are untouched (the built-in `nvidia`
  provider has none).
- No router, no image generation, no custom retry engine by design.
- Unloading the extension restores pi's built-in catalog verbatim (pi's
  `unregisterProvider` contract).

## Testing

```bash
bun test
```

Fixtures under `test/fixtures/` are real captures from NVIDIA's pages; tests never
touch the network.

License: MIT. The family table (`src/families.ts`) is adapted from
[Diegovisk/pi-nvidia-nim](https://github.com/Diegovisk/pi-nvidia-nim) (MIT, © Diegovisk),
which itself builds on [Tibbee/pi-nvidia-nim-provider](https://github.com/Tibbee/pi-nvidia-nim-provider).
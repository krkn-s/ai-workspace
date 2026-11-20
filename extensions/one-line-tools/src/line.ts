// Pure formatting for the collapsed tool row. No pi imports, so the tests run
// without the host packages.

const PATH_KEYS = ["path", "file_path", "filePath"];
const VALUE_CHARS = 60;
const ARGS_CHARS = 120;
const CONTINUATION = "...";

export interface CallLine {
	label: string;
	detail: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

function oneLine(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

function clip(text: string, max: number): string {
	const flat = oneLine(text);
	return flat.length > max ? `${flat.slice(0, max - CONTINUATION.length)}${CONTINUATION}` : flat;
}

function formatValue(value: unknown): string {
	if (typeof value === "string") return JSON.stringify(clip(value, VALUE_CHARS));
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
		return String(value);
	}
	if (value === null) return "null";
	const json = JSON.stringify(value);
	return clip(json ?? String(value), VALUE_CHARS);
}

// Shell-style key=value pairs, capped so a wide payload never builds a long line.
export function summarizeArgs(args: unknown): string {
	const record = asRecord(args);
	if (!record) return args === undefined || args === null ? "" : formatValue(args);
	const parts: string[] = [];
	let used = 0;
	for (const [key, value] of Object.entries(record)) {
		const part = `${key}=${formatValue(value)}`;
		const length = used + (parts.length > 0 ? 1 : 0) + part.length;
		if (length > ARGS_CHARS) {
			parts.push(CONTINUATION);
			break;
		}
		parts.push(part);
		used = length;
	}
	return parts.join(" ");
}

function stringArgument(record: Record<string, unknown> | undefined, key: string): string | undefined {
	const value = record?.[key];
	return typeof value === "string" ? value : undefined;
}

function pathArgument(record: Record<string, unknown> | undefined): string {
	for (const key of PATH_KEYS) {
		const value = stringArgument(record, key);
		if (value) return value;
	}
	return CONTINUATION;
}

function numberArgument(record: Record<string, unknown> | undefined, key: string): number | undefined {
	const value = record?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function lineRange(record: Record<string, unknown> | undefined): string {
	const offset = numberArgument(record, "offset");
	const limit = numberArgument(record, "limit");
	if (offset === undefined && limit === undefined) return "";
	const start = offset ?? 1;
	return limit === undefined ? `:${start}` : `:${start}-${start + limit - 1}`;
}

// The familiar pi header for built-ins, key=value for everything else.
export function callLine(tool: string, args: unknown): CallLine {
	const record = asRecord(args);
	if (tool === "bash") return { label: "$", detail: oneLine(stringArgument(record, "command") ?? CONTINUATION) };
	if (tool === "powershell") {
		return { label: "PS>", detail: oneLine(stringArgument(record, "command") ?? CONTINUATION) };
	}
	if (tool === "read") return { label: "read", detail: `${pathArgument(record)}${lineRange(record)}` };
	if (tool === "write" || tool === "edit") return { label: tool, detail: pathArgument(record) };
	return { label: tool, detail: summarizeArgs(args) };
}

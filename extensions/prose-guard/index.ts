import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Skipped keys: identifiers, not prose.
const SKIP_KEYS = new Set(["path", "file_path"]);

export type Violation = { label: string; count: number; sample?: string };

function scanText(text: string): Violation[] {
	const violations: Violation[] = [];
	const push = (label: string, matches: number, sample?: string) => {
		if (matches > 0) violations.push({ label, count: matches, sample });
	};
	const lines = text.split("\n");

	// Em dash — banned as pause/aside (any spacing).
	const emLines = lines
		.map((l, i) => (l.includes("\u2014") ? i + 1 : -1))
		.filter((n) => n >= 0);
	push("em dash (U+2014)", (text.match(/\u2014/g) || []).length, emLines.length <= 5 ? `lines ${emLines.join(", ")}` : `first lines ${emLines.slice(0, 5).join(", ")}, ...`);

	// Ellipsis … → three dots per the prose skill.
	const ellLines = lines
		.map((l, i) => (l.includes("\u2026") ? i + 1 : -1))
		.filter((n) => n >= 0);
	push("typographic ellipsis \u2026", (text.match(/\u2026/g) || []).length, ellLines.length <= 5 ? `lines ${ellLines.join(", ")}` : `${ellLines.length} occurrences`);

	// En dash used as pause: blocked when both neighbours are non-digits (numeric ranges pass).
	const enMatches = text.match(/(?<!\d)\u2013(?!\d)/g);
	if (enMatches) {
		const enLines: number[] = [];
		lines.forEach((l, i) => {
			if (/(?<!\d)\u2013(?!\d)/.test(l)) enLines.push(i + 1);
		});
		push("en dash used as pause (U+2013)", enMatches.length, enLines.length <= 5 ? `lines ${enLines.join(", ")}` : `${enLines.length} lines`);
	}

	// Invisible characters: zero-width, joiners, BOM, soft hyphen.
	const invisible = text.match(/[\u200B-\u200D\uFEFF\u00AD]/g);
	push("invisible character (zero-width/BOM/soft hyphen)", (invisible || []).length);

	return violations;
}

function walk(value: unknown, keyHint: string, out: { text: string; where: string }[]) {
	if (typeof value === "string") {
		if (!SKIP_KEYS.has(keyHint.toLowerCase())) out.push({ text: value, where: keyHint });
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((v, i) => walk(v, `${keyHint}[${i}]`, out));
		return;
	}
	if (value && typeof value === "object") {
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) walk(v, k, out);
	}
}

export function scanInput(input: unknown): string[] {
	const strings: { text: string; where: string }[] = [];
	walk(input, "input", strings);
	const findings: string[] = [];
	for (const { text, where } of strings) {
		for (const v of scanText(text)) {
			findings.push(`${v.label} \u00d7${v.count} (${where}${v.sample ? `, ${v.sample}` : ""})`);
		}
	}
	return findings;
}

export default function proseGuard(pi: ExtensionAPI) {
	const TOOL_NAMES = new Set(["write", "edit", "bash"]);
	pi.on("tool_call", async (event) => {
		if (!TOOL_NAMES.has(event.toolName)) return;
		const findings = scanInput(event.input);
		if (findings.length === 0) return;
		const prefix =
			event.toolName === "bash"
				? "prose-guard: your bash command contains banned characters that would land in a file \u2014"
				: `prose-guard: the text you are trying to ${event.toolName} contains banned characters \u2014`;
		return {
			block: true,
			reason:
				`${prefix} ${findings.join("; ")}. ` +
				`Rewrite without them (em dash \u2192 period, comma, parentheses, or split the sentence; ellipsis \u2192 "...") and retry the call. Do not work around this gate \u2014 it applies to every file you produce.`,
		};
	});
}
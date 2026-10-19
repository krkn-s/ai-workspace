import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Skipped keys: identifiers, not prose.
const SKIP_KEYS = new Set(["path", "file_path"]);

export type Violation = { label: string; count: number; sample?: string };
const PROSE = "prose";
const COMPACT = "compact-type";

function scanText(text: string): { prose: Violation[]; compactish: Violation[] } {
	const prose: Violation[] = [];
	const compactish: Violation[] = [];

	const lines = text.split("\n");

	// === prose skill: banned characters ===
	const push = (target: Violation[], label: string, matches: number, sample?: string) => {
		if (matches > 0) target.push({ label, count: matches, sample });
	};

	// Em dash — banned as pause/aside (any spacing).
	const emLines = lines.map((l, i) => (l.includes("\u2014") ? i + 1 : -1)).filter((n) => n >= 0);
	push(prose, "em dash (U+2014)", (text.match(/\u2014/g) || []).length, emLines.length <= 5 ? `lines ${emLines.join(", ")}` : `first lines ${emLines.slice(0, 5).join(", ")}, ...`);

	// Ellipsis … → three dots per the prose skill.
	const ellLines = lines.map((l, i) => (l.includes("\u2026") ? i + 1 : -1)).filter((n) => n >= 0);
	push(prose, "typographic ellipsis \u2026", (text.match(/\u2026/g) || []).length, ellLines.length <= 5 ? `lines ${ellLines.join(", ")}` : `${ellLines.length} occurrences`);

	// En dash used as pause: blocked when both neighbours are non-digits (numeric ranges pass).
	const enMatches = text.match(/(?<!\d)\u2013(?!\d)/g);
	if (enMatches) {
		const enLines: number[] = [];
		lines.forEach((l, i) => {
			if (/(?<!\d)\u2013(?!\d)/.test(l)) enLines.push(i + 1);
		});
		push(prose, "en dash used as pause (U+2013)", enMatches.length, enLines.length <= 5 ? `lines ${enLines.join(", ")}` : `${enLines.length} lines`);
	}

	// Invisible characters: zero-width, joiners, BOM, soft hyphen.
	const invisible = text.match(/[\u200B-\u200D\uFEFF\u00AD]/g);
	push(prose, "invisible character (zero-width/BOM/soft hyphen)", (invisible || []).length);

	// === compact skill: structure rules (code fences excluded) ===
	const fenced = /(?:(?:```|~~~)[^\n]*\n)[\s\S]*?(?:\n```|~~~)|(?:(?:```|~~~)[^\n]*\n)[\s\S]*$/g;
	const bare = text.replace(fenced, "");
	const bareLines = bare.split("\n");

	// Markdown tables: a header row of cells followed by a separator row.
	let tableLines: number[] = [];
	for (let i = 0; i < bareLines.length - 1; i++) {
		if (
			/^\s*\|.*\|\s*$/.test(bareLines[i]) &&
			/^\s*\|?\s*:?-{1,}:?\s*\|/.test(bareLines[i + 1])
		) {
			tableLines.push(i + 1);
			i++; // skip separator
		}
	}
	push(compactish, "Markdown table \u2014 compact skill: use a nested list (parent = row key, children = values)", tableLines.length, tableLines.length ? `around lines ${tableLines.join(", ")}` : undefined);

	// H4-H6 headings — compact skill: flatten to H2/H3 or a list.
	const deepHeads = bareLines.map((l, i) => (/^#{4,6}\s/.test(l) ? i + 1 : -1)).filter((n) => n >= 0);
	push(compactish, "H4+ heading \u2014 compact skill: flatten to H2/H3 or a list", deepHeads.length, deepHeads.length <= 5 ? `lines ${deepHeads.join(", ")}` : `${deepHeads.length} occurrences`);

	// Lists nested 4+ levels deep (>= 8 leading spaces before a list marker).
	const deepLists = bareLines.map((l, i) => (/^ {8,}(?:[-*+] |\d+\. )/.test(l) ? i + 1 : -1)).filter((n) => n >= 0);
	push(compactish, "list nested 4+ levels \u2014 compact skill: split into sections or sub-lists", deepLists.length, deepLists.length <= 5 ? `lines ${deepLists.join(", ")}` : `${deepLists.length} occurrences`);

	return { prose, compactish };
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

function findingsToMessages(findings: Violation[]): string[] {
	return findings.map(
		(v) => `${v.label} \u00d7${v.count}(${v.sample ? `, ${v.sample}` : ""})`
	);
}

export function scanInput(input: unknown): {
	prose: string[];
	compact: string[];
} {
	const strings: { text: string; where: string }[] = [];
	walk(input, "input", strings);
	const prose: string[] = [];
	const compact: string[] = [];
	for (const { text, where } of strings) {
		const { prose: p, compactish: c } = scanText(text);
		prose.push(...findingsToMessages(p).map((f) => `${f} \u2014 ${where}`));
		compact.push(...findingsToMessages(c).map((f) => `${f} \u2014 ${where}`));
	}
	return { prose, compact };
}

// Resolve sibling skills so block reasons can point the model at them.
// Works in this repo's checkout and in the globally installed clone: extensions/skills-guard -> ../skills/<name>.
function skillHint(name: string): string {
	try {
		const skillPath = join(dirname(new URL(import.meta.url).pathname), "..", "..", "skills", name, "SKILL.md");
		return existsSync(skillPath)
			? `Load the "${name}" skill \u2014 read its SKILL.md from your available skills \u2014 and apply its full rules before retrying.`
			: "";
	} catch {
		return "";
	}
}

export default function skillsGuard(pi: ExtensionAPI) {
	const TOOLS = new Set(["write", "edit", "bash"]);
	pi.on("tool_call", async (event) => {
		if (!TOOLS.has(event.toolName)) return;
		const { prose, compact } = scanInput(event.input);
		const compactHint = compact.length ? skillHint("compact") : "";
		const proseHint = prose.length ? skillHint("prose") : "";
		const problems = [...compact, ...prose];
		if (problems.length === 0) return;
		const prefix =
			event.toolName === "bash"
				? "skills-guard: your bash command would write content that violates skill rules \u2014"
				: `skills-guard: the text you are trying to ${event.toolName} violates skill rules \u2014`;
		return {
			block: true,
			reason:
				`${prefix} ${problems.join("; ")}. ` +
				(proseHint ? `${proseHint} ` : "") +
				(compactHint ? `${compactHint} ` : "") +
				`Fix the listed issues and retry. Do not work around this gate; it applies to every file you produce.`,
		};
	});
}
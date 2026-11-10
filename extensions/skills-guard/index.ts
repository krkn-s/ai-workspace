import { existsSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Skipped keys: identifiers, not prose, plus edit.oldText (removed, never written).
const SKIP_KEYS = new Set(["path", "file_path", "oldtext"]);

export type Violation = { label: string; count: number; sample?: string };
export type Findings = { prose: string[]; compact: string[] };
const PROSE = "prose";
const COMPACT = "compact-type";

// The prose skill documents the banned characters themselves: its SKILL.md states
// the rule and references/ shows before/after examples. Writes there are rule
// documentation, not prose that breaks the rule.
const PROSE_DOC = /(?:^|[/\\])skills[/\\]prose[/\\]/;

function isProseDoc(path: string | undefined): boolean {
	if (typeof path !== "string") return false;
	// Normalize first: "skills/prose/../../docs/x.md" resolves outside the folder.
	return PROSE_DOC.test(posix.normalize(path.replace(/\\/g, "/")));
}

function isMarkdownDoc(path: string | undefined): path is string {
	return typeof path === "string" && /\.md$/i.test(path);
}

function maskLine(line: string): string {
	return line.replace(/[^\n]/g, " ");
}

// Mask fenced code while preserving every line number for diagnostics.
function maskFencedCode(text: string): string {
	let fence: { marker: string; length: number } | undefined;
	return text.split(/(?<=\n)/).map((line) => {
		const candidate = line.replace(/\r?\n$/, "");
		if (fence) {
			const close = candidate.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
			const masked = maskLine(line);
			if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = undefined;
			return masked;
		}
		const open = candidate.match(/^ {0,3}(`{3,}|~{3,})/);
		if (!open) return line;
		fence = { marker: open[1][0], length: open[1].length };
		return maskLine(line);
	}).join("");
}

function tableCells(line: string): string[] | undefined {
	if (!/^ {0,3}\S/.test(line) || !/(?<!\\)\|/.test(line)) return undefined;
	let trimmed = line.trim();
	if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
	if (/(?<!\\)\|$/.test(trimmed)) trimmed = trimmed.slice(0, -1);
	return trimmed.split(/(?<!\\)\|/).map((cell) => cell.trim());
}

function isDelimiterRow(cells: string[] | undefined): boolean {
	return Boolean(cells?.length && cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function scanText(text: string, checkCompact: boolean): { prose: Violation[]; compactish: Violation[] } {
	const prose: Violation[] = [];
	const compactish: Violation[] = [];

	const lines = text.split("\n");

	// === prose skill: banned characters ===
	const push = (target: Violation[], label: string, matches: number, sample?: string) => {
		if (matches > 0) target.push({ label, count: matches, sample });
	};

	// Em dash: banned as pause/aside (any spacing).
	const emLines = lines.map((l, i) => (l.includes("\u2014") ? i + 1 : -1)).filter((n) => n >= 0);
	push(prose, "em dash (U+2014)", (text.match(/\u2014/g) || []).length, emLines.length <= 5 ? `lines ${emLines.join(", ")}` : `first lines ${emLines.slice(0, 5).join(", ")}, ...`);

	// Ellipsis: convert to three dots per the prose skill.
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

	if (!checkCompact) return { prose, compactish };

	// === compact skill: structure rules for Markdown files only ===
	const bareLines = maskFencedCode(text).split("\n");

	// Markdown tables: a header row of cells followed by a separator row.
	const tableLines: number[] = [];
	for (let i = 0; i < bareLines.length - 1; i++) {
		const header = tableCells(bareLines[i]);
		const delimiter = tableCells(bareLines[i + 1]);
		if (header && delimiter && header.length === delimiter.length && isDelimiterRow(delimiter)) {
			tableLines.push(i + 1);
			i++;
		}
	}
	push(compactish, "Markdown table \u2014 compact skill: use a nested list (parent = row key, children = values)", tableLines.length, tableLines.length ? `around lines ${tableLines.join(", ")}` : undefined);

	// H4-H6 headings: compact skill flattens them to H2/H3 or a list.
	const deepHeads = bareLines.map((l, i) => (/^ {0,3}#{4,6}\s/.test(l) ? i + 1 : -1)).filter((n) => n >= 0);
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

export function scanInput(input: unknown, targetPath?: string): Findings {
	if (isProseDoc(targetPath)) return { prose: [], compact: [] };
	const strings: { text: string; where: string }[] = [];
	walk(input, "input", strings);
	const prose: string[] = [];
	const compact: string[] = [];
	for (const { text, where } of strings) {
		const { prose: p, compactish: c } = scanText(text, isMarkdownDoc(targetPath));
		prose.push(...findingsToMessages(p).map((f) => `${f} \u2014 ${where}`));
		compact.push(...findingsToMessages(c).map((f) => `${f} \u2014 ${where}`));
	}
	return { prose, compact };
}

function redirectionTarget(line: string): string | undefined {
	const match = line.match(/(?<![0-9])>>?\s*(?:"([^"]+)"|'([^']+)'|([^\s;|]+))/);
	const target = match?.[1] ?? match?.[2] ?? match?.[3];
	return target?.startsWith("&") ? undefined : target;
}

// Scan heredocs explicitly redirected to a file. Other bash commands, including
// read-only searches and arbitrary shell write constructs, are not inspected.
export function scanBashInput(input: unknown): Findings {
	const command = (input as { command?: unknown } | undefined)?.command;
	const findings: Findings = { prose: [], compact: [] };
	if (typeof command !== "string" || !command.includes("<<")) return findings;

	const lines = command.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const open = lines[i].match(/<<(-?)\s*(["']?)([A-Za-z_][A-Za-z0-9_]*)\2/);
		if (!open) continue;
		const target = redirectionTarget(lines[i]);
		const delimiter = open[3];
		const stripTabs = Boolean(open[1]);
		const body: string[] = [];
		let closed = false;
		for (i += 1; i < lines.length; i++) {
			const candidate = stripTabs ? lines[i].replace(/^\t+/, "") : lines[i];
			if (candidate === delimiter) {
				closed = true;
				break;
			}
			body.push(candidate);
		}
		if (closed && target) {
			const next = scanInput({ content: body.join("\n") }, target);
			findings.prose.push(...next.prose);
			findings.compact.push(...next.compact);
		}
		if (!closed) break;
	}
	return findings;
}

export function scanToolInput(toolName: string, input: unknown): Findings {
	if (toolName === "bash") return scanBashInput(input);
	const target = (input as { path?: unknown } | undefined)?.path;
	return scanInput(input, typeof target === "string" ? target : undefined);
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
		const { prose, compact } = scanToolInput(event.toolName, event.input);
		const compactHint = compact.length ? skillHint("compact") : "";
		const proseHint = prose.length ? skillHint("prose") : "";
		const problems = [...compact, ...prose];
		if (problems.length === 0) return;
		const prefix =
			event.toolName === "bash"
				? "skills-guard: the heredoc content in your bash command violates skill rules \u2014"
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

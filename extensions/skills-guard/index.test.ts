import { describe, expect, test } from "bun:test";
import { scanBashInput, scanInput, scanToolInput } from "./index";

const EM = "\u2014";
const ELLIPSIS = "\u2026";

describe("prose rules", () => {
	test("applies to every written file type", () => {
		const result = scanInput({ content: `hello ${EM} world` }, "deck.html");
		expect(result.prose).toHaveLength(1);
		expect(result.compact).toHaveLength(0);
	});

	test("ignores removed edit text", () => {
		const result = scanInput({ edits: [{ oldText: EM, newText: "plain" }] }, "README.md");
		expect(result.prose).toHaveLength(0);
	});

	test("keeps the prose documentation exemption", () => {
		const result = scanInput({ content: `${EM} ${ELLIPSIS}` }, "skills/prose/SKILL.md");
		expect(result).toEqual({ prose: [], compact: [] });
	});
});

describe("compact rules", () => {
	test("detects tables with and without outer pipes", () => {
		for (const content of ["| A |\n| --- |\n| x |", "A | B\n--- | ---\nx | y"]) {
			const result = scanInput({ content }, "README.md");
			expect(result.compact).toHaveLength(1);
		}
	});

	test("detects an H4 with up to three leading spaces", () => {
		const result = scanInput({ content: "   #### Title" }, "README.md");
		expect(result.compact).toHaveLength(1);
	});

	test("does not apply Markdown structure to HTML", () => {
		const result = scanInput({ content: "          - Bullet one" }, "deck.html");
		expect(result.compact).toHaveLength(0);
	});

	test("ignores fenced code and preserves diagnostic line numbers", () => {
		const fence = "```";
		const content = [
			"Before",
			"",
			`${fence}md`,
			"| A |",
			"| --- |",
			fence,
			"",
			"After",
			"| A |",
			"| --- |",
		].join("\n");
		const result = scanInput({ content }, "README.md");
		expect(result.compact).toHaveLength(1);
		expect(result.compact[0]).toContain("around lines 9");
	});
});

describe("bash scope", () => {
	test("ignores read-only commands", () => {
		const result = scanBashInput({ command: `rg '${EM} ${ELLIPSIS}' README.md` });
		expect(result).toEqual({ prose: [], compact: [] });
	});

	test("scans a heredoc redirected to a Markdown file", () => {
		const command = `cat > notes.md <<'EOF'\nA | B\n--- | ---\nhello ${EM}\nEOF`;
		const result = scanToolInput("bash", { command });
		expect(result.prose).toHaveLength(1);
		expect(result.compact).toHaveLength(1);
	});

	test("ignores a heredoc that only feeds standard input", () => {
		const command = `python - <<'EOF'\nprint('${EM}')\nEOF`;
		expect(scanBashInput({ command })).toEqual({ prose: [], compact: [] });
	});

	test("does not apply compact rules to a heredoc targeting HTML", () => {
		const command = `cat > deck.html <<'EOF'\n          - Bullet one\nEOF`;
		const result = scanBashInput({ command });
		expect(result).toEqual({ prose: [], compact: [] });
	});
});

import { describe, expect, test } from "bun:test";
import { callLine, summarizeArgs } from "./src/line";

describe("shell calls", () => {
	test("bash shows the prompt and the command", () => {
		expect(callLine("bash", { command: "git status" })).toEqual({ label: "$", detail: "git status" });
	});

	test("a multi-line command collapses to one line", () => {
		expect(callLine("bash", { command: "for f in *.ts\ndo\n  echo $f\ndone" }).detail).toBe(
			"for f in *.ts do echo $f done",
		);
	});

	test("powershell uses its own prompt", () => {
		expect(callLine("powershell", { command: "Get-Date" }).label).toBe("PS>");
	});

	test("a missing command still renders", () => {
		expect(callLine("bash", {}).detail).toBe("...");
	});
});

describe("file calls", () => {
	test("read keeps the path and the line range", () => {
		expect(callLine("read", { path: "src/index.ts", offset: 10, limit: 5 })).toEqual({
			label: "read",
			detail: "src/index.ts:10-14",
		});
	});

	test("read accepts file_path and no range", () => {
		expect(callLine("read", { file_path: "AGENTS.md" }).detail).toBe("AGENTS.md");
	});

	test("write and edit keep the path", () => {
		expect(callLine("write", { path: "a.ts", content: "x".repeat(500) }).detail).toBe("a.ts");
		expect(callLine("edit", { file_path: "b.ts", edits: [] }).detail).toBe("b.ts");
	});

	test("a missing path is marked", () => {
		expect(callLine("read", {}).detail).toBe("...");
	});
});

describe("generic calls", () => {
	test("renders key=value pairs", () => {
		expect(callLine("grep", { pattern: "TODO", path: "src" }).detail).toBe('pattern="TODO" path="src"');
	});

	test("truncates long values", () => {
		const detail = summarizeArgs({ q: "x".repeat(200) });
		expect(detail.endsWith('..."')).toBe(true);
		expect(detail.length).toBeLessThan(80);
	});

	test("stops after the argument budget", () => {
		const detail = summarizeArgs({ a: "1".repeat(55), b: "2".repeat(55), c: "3".repeat(55) });
		expect(detail.endsWith("...")).toBe(true);
		expect(detail.length).toBeLessThan(130);
	});

	test("keeps scalar values readable", () => {
		expect(summarizeArgs({ limit: 5, all: true, none: null })).toBe("limit=5 all=true none=null");
	});

	test("empty arguments stay empty", () => {
		expect(summarizeArgs(undefined)).toBe("");
		expect(summarizeArgs({})).toBe("");
	});

	test("a bare string argument is quoted", () => {
		expect(summarizeArgs("hello world")).toBe('"hello world"');
	});
});

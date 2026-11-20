// one-line-tools: every tool row takes one line while collapsed. The result
// stays hidden until the row expands with Ctrl+O (app.tools.expand) or a click.
// Expanded rows delegate to pi's own renderers, untouched.

import type { ExtensionAPI, ToolRenderers } from "@earendil-works/pi-coding-agent";
import { Text, truncateToWidth, type Component } from "@earendil-works/pi-tui";
import { callLine } from "./src/line";

const ELLIPSIS = "\u2026";
const CROSS = "\u2717";
const EMPTY = new Text("", 0, 0);

// One physical line: truncateToWidth cuts at the terminal width and keeps ANSI.
class OneLine implements Component {
	constructor(private readonly text: string) {}

	render(width: number): readonly string[] {
		return [truncateToWidth(this.text, width, ELLIPSIS)];
	}

	invalidate(): void {}
}

export default function oneLineTools(pi: ExtensionAPI): void {
	pi.registerToolRenderer((toolName, next) => {
		const base = next();
		// Force the default shell. A self-rendered row applies its own padding and
		// background, so a collapsed edit would not line up with the other rows.
		const rest: ToolRenderers = { ...base };
		delete rest.renderShell;

		return {
			...rest,

			renderCall(args, theme, context) {
				if (context.expanded) {
					if (!base?.renderCall) {
						const title = theme.fg("toolTitle", theme.bold(toolName));
						const json = args === undefined || args === null ? "" : (JSON.stringify(args, null, 2) ?? "");
						return new Text(json ? `${title}\n\n${json}` : title, 0, 0);
					}
					// The base renderer expects its own component as lastComponent, not
					// the collapsed one, so keep it in the row-local state.
					const last = context.state.baseCall as Component | undefined;
					const component = base.renderCall(args, theme, { ...context, lastComponent: last });
					context.state.baseCall = component;
					return component;
				}

				const { label, detail } = callLine(toolName, args);
				const title = theme.fg("toolTitle", theme.bold(label));
				const body = detail ? `${title} ${theme.fg("muted", detail)}` : title;
				return new OneLine(context.isError ? `${theme.fg("error", CROSS)} ${body}` : body);
			},

			renderResult(result, options, theme, context) {
				if (!options.expanded) return EMPTY;
				if (base?.renderResult) {
					const last = context.state.baseResult as Component | undefined;
					const component = base.renderResult(result, options, theme, { ...context, lastComponent: last });
					context.state.baseResult = component;
					return component;
				}
				const output = result.content
					.flatMap((block) => (block.type === "text" && block.text ? [block.text] : []))
					.join("\n");
				return new Text(output ? `\n${output}` : "", 0, 0);
			},
		};
	});
}

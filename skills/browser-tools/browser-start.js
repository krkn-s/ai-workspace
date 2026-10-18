#!/usr/bin/env node

import { spawn, execSync } from "node:child_process";
import { existsSync, openSync } from "node:fs";
import puppeteer from "puppeteer-core";

const useProfile = process.argv[2] === "--profile";

if (process.argv[2] && process.argv[2] !== "--profile") {
	console.log("Usage: browser-start.js [--profile]");
	console.log("\nOptions:");
	console.log("  --profile  Copy your default Chrome profile (cookies, logins)");
	process.exit(1);
}

// Linux snap Chromium cannot access top-level hidden dirs (e.g. ~/.cache); use its own writable area there
const SCRAPING_DIR =
	process.platform === "darwin"
		? `${process.env.HOME}/.cache/browser-tools`
		: `${process.env.HOME}/snap/chromium/common/browser-tools`;

// Check if already running on :9222
try {
	const browser = await puppeteer.connect({
		browserURL: "http://localhost:9222",
		defaultViewport: null,
	});
	await browser.disconnect();
	console.log("✓ Chrome already running on :9222");
	process.exit(0);
} catch {}

// Find a Chrome/Chromium executable across platforms (CHROME_BIN wins)
const chromeBin = process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN) ? process.env.CHROME_BIN
	: [
		"google-chrome-stable",
		"google-chrome",
		"chromium-browser",
		"chromium",
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	]
		.map((c) => { try { return execSync(`command -v ${JSON.stringify(c)}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return null; } })
		.find(Boolean);
if (!chromeBin) {
	console.error("✗ No Chrome/Chromium found (set CHROME_BIN to override)");
	process.exit(1);
}

// Setup profile directory
execSync(`mkdir -p "${SCRAPING_DIR}"`, { stdio: "ignore" });

// Remove SingletonLock to allow new instance
try {
	execSync(`rm -f "${SCRAPING_DIR}/SingletonLock" "${SCRAPING_DIR}/SingletonSocket" "${SCRAPING_DIR}/SingletonCookie"`, { stdio: "ignore" });
} catch {}

if (useProfile) {
	console.log("Syncing profile...");
	// Default profile dir per platform (Linux path assumes Google Chrome build; chromium uses ~/.config/chromium)
	const profileSrc = process.platform === "darwin"
		? `${process.env.HOME}/Library/Application Support/Google/Chrome`
		: `${process.env.HOME}/.config/google-chrome`;
	if (!existsSync(profileSrc)) {
		console.error(`✗ No default Chrome profile at ${profileSrc}`);
		process.exit(1);
	}
	execSync(
		`rsync -a --delete \
		--exclude='SingletonLock' \
		--exclude='SingletonSocket' \
		--exclude='SingletonCookie' \
		--exclude='*/Sessions/*' \
		--exclude='*/Current Session' \
		--exclude='*/Current Tabs' \
		--exclude='*/Last Session' \
		--exclude='*/Last Tabs' \
		"${profileSrc}/" "${SCRAPING_DIR}/"`,
		{ stdio: "pipe" },
	);
}

// Headless when no display (servers); visible browser otherwise
const headless = process.env.DISPLAY || process.env.WAYLAND_DISPLAY || process.platform === "darwin" ? [] : ["--headless=new"];

// Chromium sandbox breaks under root; disable only there
const sandbox = typeof process.getuid === "function" && process.getuid() === 0 ? ["--no-sandbox"] : [];

// Start Chrome with flags to force new instance
// NB: stdio:'ignore' on all three fds breaks snap Chromium (exits silently); pipe them to /dev/null instead
const devnull = openSync("/dev/null", "w");
const child = spawn(
	chromeBin,
	[
		"--remote-debugging-port=9222",
		`--user-data-dir=${SCRAPING_DIR}`,
		"--no-first-run",
		"--no-default-browser-check",
		// avoid crashpad handler contention under snap packaging
		"--disable-crash-reporter",
		...sandbox,
		...headless,
	],
	{ detached: true, stdio: ["ignore", devnull, devnull] },
);
child.unref();
child.on("error", (e) => console.error("✗ spawn error:", e.message));
child.on("exit", (code, signal) => code !== null && code !== 0 && console.error(`✗ chrome exited with code ${code}`));

// Wait for Chrome to be ready
let connected = false;
for (let i = 0; i < 30; i++) {
	try {
		const browser = await puppeteer.connect({
			browserURL: "http://localhost:9222",
			defaultViewport: null,
		});
		await browser.disconnect();
		connected = true;
		break;
	} catch {
		await new Promise((r) => setTimeout(r, 500));
	}
}

if (!connected) {
	console.error("✗ Failed to connect to Chrome");
	process.exit(1);
}

console.log(`✓ Chrome started on :9222${useProfile ? " with your profile" : ""}`);
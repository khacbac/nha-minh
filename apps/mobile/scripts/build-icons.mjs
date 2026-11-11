// Renders assets/brand/logo.svg into the app icon, the Android adaptive foreground and the splash
// mark (pnpm mobile:icons). Uses a local Chrome/Edge in headless mode, so no image library is
// needed. Colours follow tokens.js; keep logo.svg in step if the palette changes.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(appRoot, "assets/brand/logo.svg"), "utf8");
const out = join(appRoot, "assets/images");

const MOSS = "#3F6B57";
const PAPER = "#FAF8F4";

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) throw new Error("No Chrome/Edge found; set CHROME_PATH.");

/** Swap colours and drop the background as each output needs. */
function variant({ background, markScale, invert }) {
  let s = svg;
  if (invert) {
    s = s.replaceAll(PAPER, "__PAPER__").replaceAll(MOSS, PAPER).replaceAll("__PAPER__", MOSS);
  }
  if (!background) s = s.replace(/<rect id="bg"[^>]*\/>/, "");
  const t = (1 - markScale) * 512;
  return s.replace(
    '<g id="mark">',
    `<g id="mark" transform="translate(${t} ${t}) scale(${markScale})">`,
  );
}

const work = mkdtempSync(join(tmpdir(), "nhaminh-icons-"));
function render(name, options) {
  const html = join(work, `${name}.html`);
  writeFileSync(
    html,
    `<!doctype html><html><body style="margin:0;background:transparent">${variant(options)}</body></html>`,
  );
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--default-background-color=00000000",
    "--force-device-scale-factor=1",
    "--window-size=1024,1024",
    `--screenshot=${join(out, name)}`,
    pathToFileURL(html).href,
  ]);
  console.log(`wrote ${join(out, name)}`);
}

try {
  render("icon.png", { background: true, markScale: 1 });
  // Android crops the foreground into a circle/squircle inside the middle ~66%.
  render("android-icon-foreground.png", { background: false, markScale: 0.62 });
  render("splash-icon.png", { background: false, markScale: 1, invert: true });
} finally {
  rmSync(work, { recursive: true, force: true });
}

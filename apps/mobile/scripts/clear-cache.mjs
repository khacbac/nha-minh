// Clears the caches that can leave a stale NativeWind stylesheet in the dev
// bundle. NativeWind generates its CSS by running Tailwind and pipes the result
// into Metro's transform of `src/global.css`; Metro keys that transform on the
// CSS file's own content, NOT on your component files. So a *newly added*
// arbitrary utility (e.g. `h-[60px]`, `py-[7px]`) can fail to reach the app
// until the CSS is regenerated — the element then renders as if the class were
// missing (it collapses to content). Scale utilities like `py-2` and
// previously-seen arbitrary values are unaffected because they're already in
// the generated CSS. See CLAUDE.md → "NativeWind gotchas".
//
// Run this, then start with a reset cache. From the repo root:
//   pnpm mobile:fresh        (clears caches + `expo start --dev-client -c`)
// or manually:
//   pnpm --filter @bibo/mobile clear-cache && pnpm mobile -- -c
// Stop any running Metro first, and fully relaunch the dev-client app after
// (a JS reload alone can keep the old bundle).

import { existsSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(appRoot, "../..");

const targets = [
  resolve(repoRoot, "node_modules/.cache"),
  resolve(appRoot, "node_modules/.cache"),
  resolve(appRoot, ".expo/web/cache"),
];

// Metro's transform cache lives in the OS temp dir under names like
// `metro-cache` / `haste-map-*`; add every matching entry.
try {
  const tmp = tmpdir();
  for (const entry of readdirSync(tmp)) {
    if (entry.startsWith("metro-") || entry.startsWith("haste-map-")) {
      targets.push(resolve(tmp, entry));
    }
  }
} catch {
  // temp dir not readable — skip, the -c reset still handles Metro's cache.
}

let removed = 0;
for (const target of targets) {
  if (!existsSync(target)) continue;
  try {
    rmSync(target, { recursive: true, force: true });
    console.log(`removed  ${target}`);
    removed += 1;
  } catch (error) {
    console.warn(`skipped  ${target}  (${error.message})`);
  }
}

console.log(
  removed === 0 ? "no caches found — nothing to clear." : `cleared ${removed} cache location(s).`,
);
console.log("next: start with a reset cache, e.g. `pnpm mobile:fresh` or `pnpm mobile -- -c`.");

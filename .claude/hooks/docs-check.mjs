// Stop hook: if the working tree has code changes but no spec/design changes, ask Claude once
// to confirm the docs are current (.claude/rules/spec-design-first.md, step 4).
import { execSync } from "node:child_process";

const input = JSON.parse(
  await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data || "{}"));
  }),
);

// Block only once per stop, so "no doc change needed" can end the turn.
if (input.stop_hook_active) process.exit(0);

let status = "";
try {
  status = execSync("git status --porcelain --untracked-files=all", {
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    encoding: "utf8",
  });
} catch {
  process.exit(0);
}

const paths = status
  .split("\n")
  .filter(Boolean)
  .map((line) => line.slice(3).replace(/^"|"$/g, "").split(" -> ").pop());

const isCode = (p) =>
  /^(apps\/(mobile|server)|packages)\//.test(p) && !/\.(spec|test)\.ts$/.test(p);
const isDocs = (p) => /^dev\/(specs|design)\//.test(p);

if (paths.some(isCode) && !paths.some(isDocs)) {
  process.stdout.write(
    JSON.stringify({
      decision: "block",
      reason:
        "Code under apps/ or packages/ changed but nothing under dev/specs or dev/design did. " +
        "Per .claude/rules/spec-design-first.md step 4: if the change alters behaviour, copy, AI " +
        "or look, update the base spec, today's change note and the design now; otherwise say in " +
        "one line why no doc change is needed.",
    }),
  );
}

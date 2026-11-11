# Code Quality Laws

These rules apply to all TypeScript in this repo (mobile and packages). Same rules as the sister apps, minus everything about a server or an API: Nhà Mình has neither in the MVP.

## Type safety

- **No `any` in non-test code.** Use precise types, generics, or `unknown` + narrowing. `any` in a `.test.ts` file is tolerated but discouraged.
- **No `@ts-ignore`, `@ts-expect-error`, or `biome-ignore` comments** unless narrowly justified with a reason on the same line. Fix the type, don't silence it.
- **No non-null assertions (`!`) in risky paths** (data read back from MMKV, optional chains, array lookups). Handle the null case or prove it can't happen via types.
- Explicit parameter and return types on exported functions. Local inference inside function bodies is fine.

## Comments

- **No narrative comments.** Don't write comments that tell the story of a bug fix, refactor, or past incident. That belongs in the commit message.
- Default to no comment; write one only when the *why* is non-obvious to a reader with no context — a hidden constraint, subtle invariant, or workaround they'd otherwise undo. Spec-section references (e.g. `// spec §2.6`) qualify: they anchor code to `dev/specs/mvp.md`.
- Per-field JSDoc documenting non-obvious semantics (units, when it applies) is fine and encouraged.

## Layering

- **No business logic inside React components.** The rules (grouping by day, totals, amount parsing, draft → entry) live in pure files under `features/entries/` (with tests); state changes go through mutation atoms. Components read atoms and dispatch.
- New code follows local conventions. When existing code and a generic best practice disagree, match the local pattern (or raise it — don't mix styles).
- A category `id` is permanent: it is stored in every entry.

## Files & formatting

- All source filenames are **kebab-case lowercase** (exceptions: Expo Router dynamic segments `[id]`, tooling-required config files).
- Biome is the only formatter/linter (2-space indent, 100-char width). Never introduce Prettier or ESLint config.
- Never edit `apps/mobile/android/` or `apps/mobile/ios/` — they are gitignored and regenerated via `pnpm mobile:prebuild`. Native changes go through `app.config.ts` / config plugins.
- `*.generated.ts` files are written by scripts; never edit them by hand.

## Before committing

Run and pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

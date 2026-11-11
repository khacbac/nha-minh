# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Nhà Mình (repo and packages keep the first working name `so-nha` / `@sonha`): a small family diary app. Each entry has a category, a title (filled in from the category), an optional note and, for categories that involve money (đi chợ, hoá đơn, cúng rằm, thả cá…), an optional amount in đồng. The main screen lists a month's entries by day with the month's spending; entries can be viewed, edited and deleted; Thống kê shows totals by month, year or a picked range. Vietnamese only. The spec is `dev/specs/mvp.md`; read it before changing behaviour. No server in the MVP: entries live on the device in MMKV.

Status: **M0** scaffold, **M1** (journal, detail, new/edit form, delete) and **M2** (name + logo, Thống kê) coded 2026-11-11, Android build OK, not yet run on the test phone; plan in `dev/plans/mvp-build.md`. Next ideas are spec §5.

## Same stack as Request App / Offmute / Bibo

This repo mirrors the sister apps so switching between them needs no context change (local paths in `CLAUDE.local.md`). When unsure how to do something, look at how they do it and match that. Do not introduce a library they do not use without a reason recorded in the spec or the plan.

- **Mobile:** React Native 0.83 + Expo SDK 55, Expo Router, **dev build only**, NativeWind 4, Jotai, form-atoms + Zod, i18next, MMKV, Reanimated, react-native-svg (icons), `@react-native-community/datetimepicker`, expo-haptics, expo-font + `@expo-google-fonts/be-vietnam-pro`, `react-native-keyboard-controller` (the form stays above the keyboard on Android edge-to-edge, same as Request and Offmute)
- **Monorepo:** pnpm 10 + Turbo, Node ≥ 22.13; Biome for lint + format
- **Shared:** `packages/types` (`@sonha/types`): Zod schemas (`Entry`, `CategoryId`)

## Commands

```bash
pnpm mobile:android      # Prebuild + build + install the dev build on Android, then Metro
pnpm mobile              # Metro only, for a dev build already on the device
pnpm mobile:fresh        # Clear Metro/NativeWind caches, then Metro (a new Tailwind class not applying)
pnpm mobile:android:release  # Release build (JS bundled in, no Metro) installed on the device
pnpm mobile:build:ios:submit  # EAS cloud build (internal-test) → TestFlight; first run interactive, see dev/guides/release-ios.md
pnpm mobile:icons        # Render assets/brand/logo.svg into the app icon + splash PNGs (headless Chrome)
pnpm lint                # Biome lint
pnpm format              # Biome format + organize imports
pnpm typecheck           # turbo: tsc in every workspace
pnpm test                # turbo: vitest (pure rules in apps/mobile)
pnpm knip                # Unused files/deps (apps/mobile is ignored, as in Request)
```

Runbooks: `dev/guides/mobile-dev.md`, `dev/guides/release-ios.md`. Rules: `.claude/rules/coding-standards.md`, `.claude/rules/mobile-atomic-state.md`, `.claude/rules/spec-design-first.md`.

## Layout

```
apps/mobile/src/
  app/                    # Expo Router: index (Sổ), entry/new, entry/[id]/index (Chi tiết), entry/[id]/edit, stats
  features/<f>/           # _atoms/{queries,mutations,ui,forms}.ts, components/, pure rules + .test.ts
    categories/           # category-data.js (CommonJS, also read by dev/design) + catalog.ts typed view
    entries/              # money, day, timeline, draft rules; entry atoms; journal + form components
    stats/                # period + breakdown rules; stats atoms; period picker, totals, bars
  components/             # shared UI (text, button, chip, fab, icon, text-field, confirm-dialog, nav-header)
  lib/                    # i18n/, jotai/atom-with-mmkv.ts, theme/{tokens.js,icons.js} (read by dev/design), feedback.ts
packages/types/           # @sonha/types
dev/specs | plans | guides | design | research
```

## Conventions (same rules as the sister apps)

- Filenames are **kebab-case, lowercase** everywhere (exceptions: Expo Router segments, tooling configs).
- Mobile path alias `@/*` → `./src/*`.
- **No business logic in components.** Components read atoms and dispatch; the rules (grouping, totals, amount parsing, draft → entry) are pure files with tests under `features/entries/`.
- A category `id` is permanent: it is stored in every entry. Add new ids at the end of `CATEGORY_IDS`.
- Colours are classes (`bg-surface-card`, `text-ink-muted`…) from `tokens.js`; a prop that needs a value (icon colour, placeholder) takes it from `colors` in `@/lib/theme`. Text sizes are `<Text variant>` roles. Icons come from `icons.js` through `<Icon name>`; never inline an SVG in a screen.
- No `any`, no `@ts-ignore` / `biome-ignore` without a same-line reason.
- Comments explain a non-obvious *why*; spec references like `// spec §2.3` are welcome.
- Never edit `apps/mobile/android/` or `apps/mobile/ios/`; native config goes through `app.config.ts`.
- NativeWind: a brand-new arbitrary class (e.g. `h-[60px]`) can look broken until the CSS is regenerated; run `pnpm mobile:fresh` and relaunch the app instead of rewriting it as inline `style`.

## Docs

`dev/specs/` what the app does (`mvp.md` is the base spec), `dev/specs/changes/YYYY-MM-DD.md` change notes (that day's changes, before → after, which spec §; no code, no status), `dev/plans/` how to build a piece and its status, `dev/guides/` runbooks, `dev/design/` look and feel (start at its README), `dev/research/` evidence behind product and design decisions. Flat, named after the subject, never a dated folder.

## Workflow: spec → design → code

Every session that changes the app goes in this order, without being asked: (1) does the spec need to change? write it into the base spec section and today's change note; (2) does the design need to change? update `dev/design/` first; (3) only then code, with status in the plan; (4) before finishing, write back into spec/design anything the code decided along the way. Say the outcome of each step in one line, "không cần" included. Update the related specs and design yourself, without asking for permission; ask only when genuinely unsure. Full rule: `.claude/rules/spec-design-first.md`. A Stop hook (`.claude/hooks/docs-check.mjs`) reminds once when code changed but `dev/specs` and `dev/design` did not. Codex reads the same workflow from `AGENTS.md` and Cursor from `.cursor/rules/spec-design-first.mdc`; change all three together.

## Before committing

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Never commit or push unless explicitly asked.

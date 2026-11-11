# MVP build plan

How the MVP in `dev/specs/mvp.md` is built, and what is left. Status lives here, never in the spec.

## Milestones

| # | What | Status |
| --- | --- | --- |
| D0 | Design direction "Giấy & Mực", tokens, icons, category catalog | Done 2026-11-11 |
| D1 | Every screen and state in `dev/design/index.html` | Done 2026-11-11 |
| M0 | Scaffold: pnpm + Turbo, Expo SDK 55 dev build, NativeWind, Jotai, i18n (vi), Biome, vitest, AI workflow files | Done 2026-11-11 |
| M1 | Sổ (month, totals, filter, day list), Chi tiết, Ghi mới / Sửa, Xoá; MMKV storage | Coded 2026-11-11; run on the Android test phone 2026-11-11 (release APK): add with/without amount, title chips, quick amounts, filter chip, detail, edit opens saved values, delete with confirm |
| M3 | Shared family account (Supabase Auth, email + password) + diary on the server (`apps/server` Fastify, `public.entries`), spec §2.0, §3.3 | Coded 2026-11-11. Server: 13 tests (routes with in-memory stores, row mapping) and run end to end against local Supabase (sign in, save, edit, list, delete, 401, RLS blocks direct reads, Vietnamese round-trip). App: lint, typecheck, 49 tests, Android JS bundle builds. Migration pushed to production Supabase and the family account made 2026-11-11; run on the Android test phone the same day (dev build, local server, production Supabase): sign in, diary loads, new entry saved, owner checked OK. Railway deploy not made yet |
| M2 | Name **Nhà Mình** + logo (`assets/brand/logo.svg` → `pnpm mobile:icons`), package `com.bacho.nhaminh`; "Phước thiện"; Thống kê (Tháng / Năm / Tuỳ chọn, spec §2.4) | Coded 2026-11-11; tests for `features/stats/{period,breakdown}.ts`; run on the phone: Tháng, Năm (bars, tap), Tuỳ chọn (date dialog, future days locked). Fixes from that run: month title shrinks on 360dp, tile names shrink ("Phước thiện"), picked month amount moved next to the chart title, moss date dialogs, dialog scrim covers the nav bar, Lưu stays above the number pad (keyboard-controller), no gap under Lưu with the keyboard open, dialog scrim also over the nav bar and Back closes only the dialog; all re-checked on the phone 2026-11-11 14:15 |

## Decisions while building

1. **Storage:** since M3 the diary lives in Supabase `public.entries` (primary key `(user_id, id)`), reached only through `apps/server` with the secret key; RLS on, no policies. The app loads the whole diary in one `GET /entries` (a family logs tens of entries a month; the server reads up to 50 000 rows) and keeps it in memory (`entriesByIdAtom`); `PUT /entries/:id` saves a whole entry (last save wins), `DELETE /entries/:id` is idempotent. Rows are checked with `entrySchema` on both sides and a broken row is skipped (spec §3.3). If the diary grows large, load by month without changing the atoms' public shape. Before M3 it was one MMKV instance `entries`; that data is left on the test phone, not uploaded (owner's choice 2026-11-11).
2. **Categories:** `features/categories/category-data.js` (CommonJS, read by the HTML design) + `catalog.ts` (typed view). Ids are the Zod enum in `@sonha/types`; `catalog.test.ts` checks both lists match.
3. **Icons:** hand-drawn 24×24 stroke paths in `lib/theme/icons.js`, drawn by `<Icon>` (react-native-svg) and by the design kit. No icon library.
4. **Form:** form-atoms factory `createEntryForm(draft)`; the cross-field rules (title from category, quick amount chips) are write atoms returned by the factory, the rules themselves in `draft.ts` / `money.ts` with tests.
5. **Time:** stored as epoch ms; day/month keys use the phone's local time (`day.ts`).
6. **Navigation:** the form routes slide up with swipe-back off; Android back and ✕ ask before dropping a changed draft.
7. **Stats state:** `features/stats/_atoms/ui.ts` holds mode, month, year and the custom range; `openStatsAtom` re-seeds them from the journal's month each time the screen opens. Ranges are half-open `[start, end)` in local time; the average divides by days elapsed up to today.
8. **Charts:** plain Views, one hue (moss): bars by share and 12 month columns. No chart library; the list rows carry name, amount, count and share, so they are also the table view.
9. **Logo:** one SVG source, rendered to PNG with headless Chrome/Edge (`scripts/build-icons.mjs`), no image library.
10. **Keyboard:** the form uses `react-native-keyboard-controller` (`KeyboardProvider` at the root, `KeyboardAvoidingView` + `KeyboardAwareScrollView` in the form), as Request and Offmute do; React Native's own `KeyboardAvoidingView` left Lưu under the number pad on the test phone.
11. **Dialog:** `ConfirmDialog` is an overlay inside the screen (Reanimated fade, its own BackHandler), not a RN `Modal`: under edge-to-edge the Modal window left the navigation bar undimmed. Render it as the screen's last child.
12. **Metro port:** the Request App dev server often holds 8081 on this machine; run this app's Metro on 8082 and open the dev client with `nhaminh://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082` after `adb reverse tcp:8082 tcp:8082`.
13. **iOS:** EAS cloud builds (profile `internal-test`, project `@kbho/nha-minh`) → TestFlight internal group, as Offmute ships; iPhone only (`supportsTablet: false`). Runbook `dev/guides/release-ios.md`.
14. **Account:** one Supabase user for the whole family (owner's choice 2026-11-11), password sign-in because a code by email would only reach one inbox. The session sits in MMKV (`lib/supabase.ts`); `AuthListener` checks it at launch and the root `Stack.Protected` shows only `sign-in` until there is one. A 401 from the server signs out locally and clears the diary from memory.
15. **Server shape:** same as Offmute's server (Fastify, error body `{ status, code, message }`, `authenticate` preHandler calling `auth.getUser`, rate limit, Dockerfile from the repo root, Railway). Server port 3100, beside the sister apps. Runbook `dev/guides/backend.md`.
17. **One database:** only Supabase production, no local stack or staging (owner's choice 2026-11-11, small project). Local dev = local server (`pnpm server:dev`) + production Supabase, so dev writes go into the real diary. Migrations go straight to production with `pnpm db:push`; only additive changes, or deploy the server first.
16. **Online only:** no offline queue (owner's choice 2026-11-11). Save and delete wait for the server; failures leave the form / entry as it was with a one-button notice. The form can't be closed while a save is in flight, so a late success never pops the wrong screen.

## Left / next

- [ ] M3 on the phone, still to check: Không tải được (Wi-Fi off), save / delete failing without network, two phones on one account.
- [ ] M3 production: turn off sign-ups in Supabase (`backend.md` §1 step 3), Railway deploy (§2), env for release builds and EAS (§4).
- [ ] Owner run-through on the phone: change month, discard question, income entry, a full month of real use.
- [ ] iOS: config done 2026-11-11 (EAS project, `eas.json`, scripts); first `pnpm mobile:build:ios:submit` run by the owner in an interactive terminal (Apple login), then TestFlight install and the same phone checks as Android.
- [ ] Ideas in spec §5, in that order (search first).

# Mobile Atomic State Rules (Jotai)

Mobile follows the **atomic splitting strategy**: many small, focused Jotai atoms instead of monolithic hooks or stores, so re-rendering stays selective. Same principles as the sister apps. The diary comes from apps/server through `lib/api/api-client.ts`; atoms and screens never call `fetch`.

## Atomic file organization

Feature state lives in `features/<feature>/_atoms/`:

- **queries.ts** — read atoms: what the server last sent (held in memory; mutations load and write it) and derived read-only atoms over it and the category catalog. The API client checks every row with the Zod schema from `@sonha/types` and skips a broken one. MMKV holds only the Supabase session (`lib/supabase.ts`).
- **mutations.ts** — write-only atoms `atom(null, (get, set, arg) => { ... })`. They call the pure rule functions, write persisted atoms, and own the matching `ui.ts` state. They never throw to the component.
- **ui.ts** — transient state: the month being viewed, the category filter, and computed atoms.
- **effects.ts** *(optional)* — `jotai-effect` atoms replacing `useEffect` chains, when a feature needs them.
- **forms.ts** *(optional)* — `formAtom`/`fieldAtom` with `zodValidate`, when a form is shared across screens (the entry form: new and edit).

Pure rules sit next to `_atoms/` as plain `.ts` files with a `.test.ts` beside them (vitest; they must not import `react-native`).

## Atomic development patterns

1. **One concern per atom.** Each atom handles a single responsibility.
2. **Component per subscription.** A component subscribes only to the atoms it needs (`useAtomValue`, `useSetAtom`, `useAtom` directly — no hook-composition wrappers).
3. **Splitting over grouping.** A `useXManagement()` mega-hook is a violation.
4. **Mutations drive UI state.** The mutation atom moves the state machine and writes results; the component only renders it.
5. **Per-item state uses `atomFamily(id => atom(...))`** from `jotai-family`.
6. **Pure component-local state stays in `useState`.** An open date picker, a focused field — anything nobody else observes.
7. **Atoms run outside React.** Use the non-reactive `t` from `@/lib/i18n` (never `useT()`) inside atoms.
8. **Time comes in as an argument.** Rule functions take `now`; only mutations and screens opening a form read the clock, through `features/entries/day.ts` `now()`.

## Forms

Forms use **form-atoms + Zod** (`zodValidate`, `{ on: "change", when: "touched" }`). Never react-hook-form, never manual `useState` form state.

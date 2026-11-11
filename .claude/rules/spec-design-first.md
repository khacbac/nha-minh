# Spec → design → code, every session

The spec and the design are the source of truth for what Nhà Mình does and how it looks. Code follows them, never the other way round. Keep both current on every request without being asked; the owner should not have to remind you or manage the files.

**Act, don't ask.** Updating the related specs, the change note and the design is part of doing the request, not a separate step that needs approval. Never ask "có cần cập nhật spec/design không?": decide and do it, then report where it went. Ask only when you are genuinely unsure (Rule 4).

## The order, for every request that changes the app

Before touching `apps/` or `packages/`, go through these steps in order and say the outcome of each in one line (also when it is "không cần"):

1. **Spec.** Does the request change what the app does or says (flow, rules, copy, categories, limits, storage)? If yes, write it into the base spec first (Rule 1) and today's change note (Rule 2).
2. **Design.** Does it change what a screen looks like or add a screen or state? If yes, update `dev/design/` first (Rule 3).
3. **Code.** Only now change the code, matching the spec and the design you just wrote. Implementation status (done, left to do, not yet run on a device) goes into the matching plan in `dev/plans/`, not the spec.
4. **Check before finishing.** Re-read the diff: if the code ended up doing something the spec or design does not say (a decision made while coding, a limit, an error case, copy), write it back into the spec/design now. Code and docs never diverge at the end of a session.

Pure internal work that changes nothing a user can see (refactor, tests, tooling, a bug fix that restores what the spec already says) needs no spec or design edit; say so in one line ("Spec/design: không đổi, vì …").

## Rule 1 — Put every change into the right base spec

- Base spec: `dev/specs/mvp.md` (§2 screens, §3 data and categories, §4 out of scope, §5 next ideas). A big new feature (sync, backup, statistics) gets its own base spec; ask before creating one.
- Edit the section in place so it reads as the current truth; a reader must never need another file to know how a feature behaves. Bump the `Cập nhật:` line at the top.
- The category table in §3.1 and `apps/mobile/src/features/categories/category-data.js` change together, in the same step.
- Feedback pasted into the chat is input for the spec, never a file saved as it is.
- Specs never mention sister projects or local paths; those notes live in `CLAUDE.local.md`.

## Rule 2 — Keep today's change note up to date

In the same step as the spec edit, update `dev/specs/changes/<today YYYY-MM-DD>.md`:

- Create it if it does not exist; otherwise add to it. If an item already in today's note changes again, update that row instead of adding a second one, so the note shows the day's end result.
- One row per change that alters behaviour, content, copy or look. A pure rewording of the spec needs no row.
- Format: title `# Thay đổi YYYY-MM-DD`, one line saying the full content lives in the base spec, the base specs and design pages touched, then one table per area:

```markdown
| Thay đổi | Trước | Sau | Ở đâu |
| --- | --- | --- | --- |
| Chip cộng tiền nhanh | +10K … +500K | +10K … +1M | `mvp.md` §2.3 |
```

- Keep out of change notes: copies of the spec (point to the section instead), and anything about code (status, file paths in `apps/` or `packages/`, commands, library names).

## Rule 3 — Design before code for anything visible

- A new screen or state: draw it in `dev/design/pages/<screen>.js` (start from `_template.js`, add the `<script>` to `index.html`), each state with a `note` taken from the spec. Then code it.
- A changed layout, spacing or component: update the matching block in `dev/design/kit/ui.js` / `ui.css` (each block names the RN file it mirrors) and the frames that use it, in the same step as the RN change.
- Colours, type, icons and categories need nothing: the design reads `tokens.js`, `icons.js` and `category-data.js` live.
- A look-and-feel choice with a reason worth keeping goes into the **Quyết định** table in `dev/design/README.md`.

## Rule 4 — Ask only when unsure

The default is to update spec and design yourself. A request that changes behaviour is itself the decision: rewrite the spec to match, even when it replaces what the spec said before.

Stop and ask "Bạn có chắc …?", saying what you understood and what you would do, only when:

- it is unclear whether the request is meant to replace what the spec says, or it looks like a mistake against a deliberate decision recorded in the spec or the design README (with its reason);
- you cannot tell which spec, section or screen it belongs to, or it needs a new base spec;
- the owner explicitly asks to keep the change out of the spec or design.

Everything else: do it, and report it in the closing line.

## Reporting

End the reply with one line saying where things went, e.g. "Spec: `mvp.md` §2.3 + `changes/2026-11-12.md` · Design: `pages/entry-form.js` (Nhập tiền) · Plan: `mvp-build.md` M2".

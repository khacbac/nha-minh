# Nhà Mình — rules for every agent (Codex, Cursor, Claude Code)

Read `CLAUDE.md` first: stack, commands, layout and conventions apply to every agent, not only Claude Code.

## Workflow: spec → design → code

Every session that changes the app goes in this order, without being asked:

1. **Spec.** If the request changes what the app does or says, write it into the base spec section (`dev/specs/mvp.md`) and today's change note `dev/specs/changes/YYYY-MM-DD.md`.
2. **Design.** If it changes what a screen looks like, update `dev/design/` (pages, `kit/ui.*`) first.
3. **Code.** Only then change `apps/` / `packages/`; implementation status goes in `dev/plans/`, never in the spec.
4. **Check before finishing.** Write back into spec/design anything the code decided along the way, so code and docs never diverge.

Say the outcome of each step in one line, "không cần" included. Update the related specs and design yourself, without asking for permission; ask only when genuinely unsure (unclear whether it replaces a deliberate spec decision, unclear which spec/section/screen, or a new base spec needed). Full rule (base specs, change note format, design steps): `.claude/rules/spec-design-first.md`; read it before the first change in a session.

Never commit or push unless explicitly asked.

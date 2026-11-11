import { palette, semantic } from "./tokens";

/**
 * Colour tokens — the TypeScript view of `tokens.js` (which `tailwind.config.js` also reads, so
 * the hex table is written once). Use these when a class is impractical: icon colours,
 * placeholders, the category tint picked at run time.
 */

export { palette };

export const colors = {
  surface: semantic.surface,
  ink: semantic.ink,
  accent: semantic.accent,
  state: semantic.state,
  money: semantic.money,
  line: semantic.line,
  tint: semantic.tint,
};

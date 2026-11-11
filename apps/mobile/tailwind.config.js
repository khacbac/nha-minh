const { hairlineWidth } = require("nativewind/theme");
const { semantic, fontFamilies, typeScale, radius } = require("./src/lib/theme/tokens.js");

/**
 * Nhà Mình design system — Tailwind view of `src/lib/theme/tokens.js`. Colours, type and radii
 * live in that file; this config only maps them onto Tailwind names. Category tints are picked
 * at run time, so they go through `colors.tint` in `@/lib/theme`, not classes.
 */

// No fontWeight here: the weight comes from the family (see fontFamily below).
const fontSize = Object.fromEntries(
  Object.entries(typeScale).map(([name, { size, lineHeight }]) => [
    name,
    [`${size}px`, { lineHeight: `${lineHeight}px` }],
  ]),
);

const px = (values) =>
  Object.fromEntries(Object.entries(values).map(([name, value]) => [name, `${value}px`]));

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: semantic.surface,
        ink: semantic.ink,
        accent: semantic.accent,
        state: semantic.state,
        money: semantic.money,
        line: { DEFAULT: semantic.line.default },
        background: semantic.surface.app,
        foreground: semantic.ink.heading,
      },
      // RN picks the weight from the family name, so each weight is its own class. Prefixed
      // (`font-bvp-bold`) because `font-bold` etc. are Tailwind's fontWeight utilities: a weight
      // with no matching family makes Android fall back to Roboto.
      fontFamily: {
        sans: [fontFamilies.regular, "System"],
        bvp: [fontFamilies.regular, "System"],
        "bvp-medium": [fontFamilies.medium, "System"],
        "bvp-semibold": [fontFamilies.semiBold, "System"],
        "bvp-bold": [fontFamilies.bold, "System"],
      },
      fontSize,
      borderWidth: {
        hairline: hairlineWidth(),
      },
      borderRadius: {
        ...px(radius),
        pill: "999px",
      },
    },
  },
  plugins: [],
};

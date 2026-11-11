/**
 * Design tokens — the single source for colours, type and radii. `tailwind.config.js` maps
 * them onto Tailwind names, TypeScript reads them through `@/lib/theme`, and the HTML design
 * (dev/design) reads this file live. Direction "Giấy & Mực" (dev/design/README.md): warm paper,
 * ink text, one muted moss accent, soft category tints. Change values, not keys.
 */
const palette = {
  ink: {
    900: "#22201C",
    700: "#4A463F",
    500: "#857F74",
    300: "#BCB6AA",
  },
  paper: {
    50: "#FAF8F4",
    100: "#F3EFE8",
    200: "#E8E3DA",
  },
  moss: { 100: "#E6EEE8", 500: "#3F6B57", 600: "#30574A", 700: "#284A3C" },
  terracotta: { 100: "#F7E5DF", 500: "#B5523D" },
  white: "#FFFFFF",
};

const semantic = {
  surface: {
    app: palette.paper[50],
    card: palette.white,
    sunken: palette.paper[100],
  },
  ink: {
    heading: palette.ink[900],
    body: palette.ink[700],
    muted: palette.ink[500],
    faint: palette.ink[300],
  },
  accent: {
    primary: palette.moss[500],
    pressed: palette.moss[600],
    "on-primary": palette.white,
    soft: palette.moss[100],
    "on-soft": palette.moss[700],
  },
  state: {
    danger: palette.terracotta[500],
    "danger-soft": palette.terracotta[100],
  },
  /** Money: spending stays ink (no alarm red in a family diary), income is moss (spec §2.1). */
  money: {
    expense: palette.ink[900],
    income: palette.moss[500],
  },
  line: { default: palette.paper[200] },
  /**
   * Category tints: `bg` behind the icon, `fg` the icon and chip text. Low saturation on
   * purpose; a category picks one by key in the catalog (spec §3.1).
   */
  tint: {
    sage: { bg: "#E4EDE6", fg: "#4A6E56" },
    clay: { bg: "#F4E4DB", fg: "#9A5B44" },
    rose: { bg: "#F3E2E5", fg: "#94515F" },
    plum: { bg: "#ECE4F0", fg: "#6D5582" },
    sky: { bg: "#E1EAF2", fg: "#46677F" },
    olive: { bg: "#EBECDC", fg: "#666838" },
    slate: { bg: "#E7E8EA", fg: "#555C66" },
    amber: { bg: "#F5EAD2", fg: "#8A6820" },
    teal: { bg: "#DCECEA", fg: "#3C6C69" },
    sand: { bg: "#F1E9DC", fg: "#85683E" },
  },
};

const fontFamilies = {
  regular: "BeVietnamPro_400Regular",
  medium: "BeVietnamPro_500Medium",
  semiBold: "BeVietnamPro_600SemiBold",
  bold: "BeVietnamPro_700Bold",
};

/**
 * Type roles. RN picks the weight from the family name, so each role names its family;
 * `weight` is kept for the HTML design and Tailwind.
 */
const typeScale = {
  "amount-xl": { family: fontFamilies.bold, weight: "700", size: 34, lineHeight: 42 },
  "heading-lg": { family: fontFamilies.bold, weight: "700", size: 26, lineHeight: 34 },
  "heading-md": { family: fontFamilies.semiBold, weight: "600", size: 20, lineHeight: 28 },
  "heading-sm": { family: fontFamilies.semiBold, weight: "600", size: 17, lineHeight: 24 },
  "body-lg": { family: fontFamilies.regular, weight: "400", size: 16, lineHeight: 24 },
  "body-md": { family: fontFamilies.medium, weight: "500", size: 15, lineHeight: 22 },
  "ui-button": { family: fontFamilies.semiBold, weight: "600", size: 16, lineHeight: 22 },
  "ui-label": { family: fontFamilies.medium, weight: "500", size: 14, lineHeight: 20 },
  caption: { family: fontFamilies.regular, weight: "400", size: 13, lineHeight: 18 },
  meta: { family: fontFamilies.medium, weight: "500", size: 12, lineHeight: 16 },
};

/** Corner radii (dev/design/kit/ui.css). */
const radius = {
  chip: 12,
  button: 14,
  card: 18,
  sheet: 24,
};

module.exports = { palette, semantic, fontFamilies, typeScale, radius };

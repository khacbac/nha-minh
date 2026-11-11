import type { TextStyle } from "react-native";
import { fontFamilies, typeScale } from "./tokens";

/**
 * Typography styles — Be Vietnam Pro throughout. Derived from the same type scale
 * `tailwind.config.js` reads, so the sizes exist in one place.
 *
 * Prefer the `<Text variant="...">` component in src/components/text.tsx for markup. These
 * objects are exported for cases that need raw `style={...}` (animated text, measurement).
 */

export { fontFamilies };

export type TypographyVariant = keyof typeof typeScale;

export const typography = Object.fromEntries(
  Object.entries(typeScale).map(([name, spec]) => [
    name,
    { fontFamily: spec.family, fontSize: spec.size, lineHeight: spec.lineHeight },
  ]),
) as Record<TypographyVariant, TextStyle>;

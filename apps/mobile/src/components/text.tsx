import { forwardRef } from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { type TypographyVariant, typography } from "@/lib/theme";

export type TextVariant = TypographyVariant;

type TextTone =
  | "heading"
  | "body"
  | "muted"
  | "faint"
  | "accent"
  | "on-primary"
  | "on-soft"
  | "danger"
  | "income";

const toneClass: Record<TextTone, string> = {
  heading: "text-ink-heading",
  body: "text-ink-body",
  muted: "text-ink-muted",
  faint: "text-ink-faint",
  accent: "text-accent-primary",
  "on-primary": "text-accent-on-primary",
  "on-soft": "text-accent-on-soft",
  danger: "text-state-danger",
  income: "text-money-income",
};

// Default font weight per variant, applied as a className (not an inline
// style) so callers can override it with their own `font-*` class. fontFamily
// must NOT go through the inline `style` prop: in NativeWind inline styles win
// over className, which would silently turn every caller `font-*` class into a
// no-op. fontSize/lineHeight stay inline (callers rarely fight those).
const variantFontClass: Record<TextVariant, string> = {
  "amount-xl": "font-bvp-bold",
  "heading-lg": "font-bvp-bold",
  "heading-md": "font-bvp-semibold",
  "heading-sm": "font-bvp-semibold",
  "body-lg": "font-bvp",
  "body-md": "font-bvp-medium",
  "ui-button": "font-bvp-semibold",
  "ui-label": "font-bvp-medium",
  caption: "font-bvp",
  meta: "font-bvp-medium",
};

const defaultToneFor: Record<TextVariant, TextTone> = {
  "amount-xl": "heading",
  "heading-lg": "heading",
  "heading-md": "heading",
  "heading-sm": "heading",
  "body-lg": "body",
  "body-md": "body",
  "ui-button": "heading",
  "ui-label": "body",
  caption: "muted",
  meta: "muted",
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

export const Text = forwardRef<RNText, TextProps>(function Text(
  { variant = "body-md", tone, className, style, ...rest },
  ref,
) {
  const resolvedTone = tone ?? defaultToneFor[variant];
  // Drop fontFamily from the inline style — it's supplied via variantFontClass
  // so a caller `font-*` className can override it.
  const { fontFamily: _fontFamily, ...metrics } = typography[variant];
  return (
    <RNText
      ref={ref}
      style={[metrics, style]}
      // Two font-family classes on one node resolve by stylesheet order, not class order, so a
      // caller's `font-bvp*` replaces the variant's instead of joining it.
      className={`${className?.includes("font-bvp") ? "" : variantFontClass[variant]} ${
        toneClass[resolvedTone]
      } ${className ?? ""}`}
      {...rest}
    />
  );
});

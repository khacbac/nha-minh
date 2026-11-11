import { type ReactNode, forwardRef, useState } from "react";
import { TextInput, type TextInputProps, View } from "react-native";

import { colors, fontFamilies } from "@/lib/theme";

import { Text } from "./text";

/** dev/design/kit/ui.css `.field`: a 52-high box (taller when multiline), an error under it. */
export function FieldFrame({
  error,
  focused,
  multiline,
  children,
}: {
  error?: string;
  focused?: boolean;
  multiline?: boolean;
  children: ReactNode;
}) {
  const border = error ? "border-state-danger" : focused ? "border-accent-primary" : "border-line";
  return (
    <View className="gap-1.5">
      <View
        className={`flex-row rounded-button border-[1.5px] bg-surface-card px-3.5 ${border} ${
          multiline ? "min-h-[96px] items-start py-3" : "h-[52px] items-center"
        }`}
      >
        {children}
      </View>
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export type TextFieldProps = TextInputProps & { error?: string; trailing?: ReactNode };

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { error, trailing, multiline, onFocus, onBlur, ...input },
  ref,
) {
  // Pure view state: only the border reads it.
  const [focused, setFocused] = useState(false);
  return (
    <FieldFrame error={error} focused={focused} multiline={multiline}>
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={colors.ink.faint}
        cursorColor={colors.accent.primary}
        selectionColor={colors.accent.soft}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          flex: 1,
          fontFamily: fontFamilies.medium,
          fontSize: 16,
          lineHeight: multiline ? 22 : undefined,
          color: colors.ink.heading,
          minHeight: multiline ? 70 : undefined,
          // Android adds its own padding, which would push the text off the frame's edge.
          paddingHorizontal: 0,
          paddingVertical: 0,
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...input}
      />
      {trailing}
    </FieldFrame>
  );
});

import { useEffect } from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { colors, withAlpha } from "@/lib/theme";

import { Button } from "./button";
import { Text } from "./text";

// dev/design/kit/ui.css .scrim.
const SCRIM = withAlpha(colors.ink.heading, 0.4);

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  // Omit for an acknowledgement with one button.
  cancelLabel?: string;
  confirmLabel: string;
  confirmTone?: "primary" | "danger";
  // Still required with one button: the hardware back / scrim dismiss.
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Centered confirmation dialog in place of the native Alert, so it matches the design: delete an
 * entry (spec §2.2), discard a draft (spec §2.3).
 *
 * Drawn as an overlay inside the screen, not a RN `Modal`: under Android edge-to-edge a Modal is
 * its own window and leaves the navigation bar undimmed, while the screen itself already draws
 * behind it. So render it as the screen's last child, over everything else.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  confirmTone = "primary",
  onCancel,
  onConfirm,
}: Props) {
  // Android back closes the dialog first. Added after the screen's own handler, so it runs first.
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onCancel();
      return true;
    });
    return () => sub.remove();
  }, [visible, onCancel]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(120)}
      style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 100 }]}
      accessibilityViewIsModal
    >
      <Pressable
        accessible={false}
        onPress={onCancel}
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: SCRIM }}
      >
        {/* Swallows taps so pressing the card does not reach the scrim. */}
        <Pressable
          accessible={false}
          className="w-full max-w-[340px] gap-3 rounded-sheet bg-surface-card px-5 pb-5 pt-6"
        >
          <Text variant="heading-md" className="text-center">
            {title}
          </Text>
          {message ? (
            <Text variant="body-lg" className="text-center">
              {message}
            </Text>
          ) : null}
          {/* A destructive confirm goes second, under the safe choice (design: entry-detail "Hỏi xoá"). */}
          {confirmTone === "danger" ? (
            <View className="gap-2.5 pt-2">
              {cancelLabel ? <Button label={cancelLabel} onPress={onCancel} /> : null}
              <Button label={confirmLabel} onPress={onConfirm} variant="danger" />
            </View>
          ) : (
            <View className="gap-2.5 pt-2">
              <Button label={confirmLabel} onPress={onConfirm} />
              {cancelLabel ? (
                <Button label={cancelLabel} onPress={onCancel} variant="soft" />
              ) : null}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

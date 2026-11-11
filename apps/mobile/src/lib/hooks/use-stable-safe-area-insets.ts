import { useRef } from "react";
import { useWindowDimensions } from "react-native";
import { type EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

// Android reports zero insets to the app while a system dialog activity (a
// runtime permission prompt) sits on top of it, then the real ones once it
// closes — so a header padded by the safe area jumps under the status bar and
// back. Hold the largest insets while window dimensions stay the same; rotation
// and iPad multitasking start a new measurement.
export function useStableSafeAreaInsets(): EdgeInsets {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const held = useRef({ width, height, insets });
  if (held.current.width !== width || held.current.height !== height) {
    held.current = { width, height, insets };
  }
  const prev = held.current.insets;
  if (
    insets.top > prev.top ||
    insets.bottom > prev.bottom ||
    insets.left > prev.left ||
    insets.right > prev.right
  ) {
    held.current.insets = {
      top: Math.max(prev.top, insets.top),
      bottom: Math.max(prev.bottom, insets.bottom),
      left: Math.max(prev.left, insets.left),
      right: Math.max(prev.right, insets.right),
    };
  }
  return held.current.insets;
}

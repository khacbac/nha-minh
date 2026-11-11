import { useWindowDimensions } from "react-native";

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  // Use window width so iPad multitasking can return to a compact layout.
  const wide = width >= 700;
  return { width, height, wide, gutter: wide ? 32 : 20 };
}

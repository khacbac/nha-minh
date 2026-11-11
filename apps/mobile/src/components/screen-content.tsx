import { View, type ViewProps } from "react-native";

/** Keep forms readable on tablets while the screen background fills the window. */
export function ScreenContent({
  maxWidth = 680,
  style,
  ...props
}: ViewProps & { maxWidth?: number }) {
  return (
    <View {...props} style={[{ flex: 1, width: "100%", maxWidth, alignSelf: "center" }, style]} />
  );
}

import type { ViewStyle } from "react-native";

import { colors } from "./colors";

/** Under the floating "+ Ghi mới" button (dev/design/kit/ui.css `.fab`). */
export const accentShadow: ViewStyle = {
  shadowColor: colors.accent.primary,
  shadowOpacity: 0.3,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 8 },
  elevation: 5,
};

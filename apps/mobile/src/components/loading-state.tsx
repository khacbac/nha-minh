import { ActivityIndicator, View } from "react-native";

import { colors } from "@/lib/theme";

import { Text } from "./text";

/** dev/design/kit/ui.css `.spinner` in `.center`: a spinner and one line. */
export function LoadingState({ label }: { label: string }) {
  return (
    <View className="items-center gap-3 pt-24">
      <ActivityIndicator size="large" color={colors.accent.primary} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

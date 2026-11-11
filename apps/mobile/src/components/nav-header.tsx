import type { ReactNode } from "react";
import { View } from "react-native";

import { useT } from "@/lib/i18n";

import { IconButton } from "./icon-button";
import { Text } from "./text";

/** dev/design/kit/ui.css `.nav-header`: back or close, centred title, optional right slot. */
export function NavHeader({
  title,
  onBack,
  backIcon = "back",
  right,
}: {
  title?: string;
  onBack?: () => void;
  backIcon?: "back" | "close";
  right?: ReactNode;
}) {
  const t = useT();
  return (
    <View className="mb-2 min-h-11 flex-row items-center">
      <View className="w-11">
        {onBack ? (
          <IconButton
            icon={backIcon}
            accessibilityLabel={backIcon === "close" ? t("common.close") : t("common.back")}
            onPress={onBack}
          />
        ) : null}
      </View>
      <Text variant="heading-sm" className="flex-1 text-center" numberOfLines={1}>
        {title ?? ""}
      </Text>
      <View className="w-11 items-end">{right}</View>
    </View>
  );
}

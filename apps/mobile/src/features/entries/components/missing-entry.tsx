import { View } from "react-native";

import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { NavHeader } from "@/components/nav-header";
import { Text } from "@/components/text";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

/** The entry is gone (deleted elsewhere): say so and offer the way back (spec §2.2). */
export function MissingEntry({ onBack }: { onBack: () => void }) {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface-app px-5" style={{ paddingTop: insets.top + 8 }}>
      <NavHeader onBack={onBack} />
      <View className="flex-1 items-center justify-center gap-3 pb-20">
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-sunken">
          <Icon name="note" size={30} color={colors.ink.muted} />
        </View>
        <Text variant="heading-sm">{t("entry.missing")}</Text>
        <Button
          label={t("entry.backToJournal")}
          variant="soft"
          fullWidth={false}
          onPress={onBack}
        />
      </View>
    </View>
  );
}

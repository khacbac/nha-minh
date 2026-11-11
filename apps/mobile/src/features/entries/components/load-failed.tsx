import { useSetAtom } from "jotai";
import { View } from "react-native";

import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

import { loadEntriesAtom } from "../_atoms/mutations";

/** The first load did not reach the server: say so and offer Thử lại (spec §2.1). */
export function LoadFailed() {
  const t = useT();
  const load = useSetAtom(loadEntriesAtom);
  return (
    <View className="items-center gap-2.5 px-6 pt-16">
      <View className="mb-1.5 h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-sunken">
        <Icon name="book" size={32} color={colors.ink.muted} />
      </View>
      <Text variant="heading-sm" className="text-center">
        {t("journal.loadFailedTitle")}
      </Text>
      <Text variant="caption" className="text-center">
        {t("common.checkNetwork")}
      </Text>
      <View className="mt-2">
        <Button
          label={t("common.tryAgain")}
          variant="soft"
          fullWidth={false}
          onPress={() => void load()}
        />
      </View>
    </View>
  );
}

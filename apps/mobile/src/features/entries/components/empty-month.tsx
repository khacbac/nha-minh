import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { View } from "react-native";

import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

import { isCurrentMonthAtom } from "../_atoms/ui";

/** A month with nothing in it; the call to action only on the current month (spec §2.1). */
export function EmptyMonth() {
  const t = useT();
  const current = useAtomValue(isCurrentMonthAtom);
  return (
    <View className="items-center gap-2.5 px-6 pt-16">
      <View className="mb-1.5 h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-sunken">
        <Icon name="book" size={32} color={colors.ink.muted} />
      </View>
      <Text variant="heading-sm" className="text-center">
        {t("journal.emptyTitle")}
      </Text>
      <Text variant="caption" className="text-center">
        {t("journal.emptyBody")}
      </Text>
      {current ? (
        <View className="mt-2">
          <Button
            label={t("journal.emptyCta")}
            icon="plus"
            fullWidth={false}
            onPress={() => router.push("/entry/new")}
          />
        </View>
      ) : null}
    </View>
  );
}

import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { View } from "react-native";

import { IconButton } from "@/components/icon-button";
import { Text } from "@/components/text";
import { openStatsAtom } from "@/features/stats/_atoms/mutations";
import { useT } from "@/lib/i18n";

import { shiftMonthAtom } from "../_atoms/mutations";
import { isCurrentMonthAtom, viewedMonthAtom } from "../_atoms/ui";
import { parseMonth } from "../day";

/** dev/design/kit/ui.css `.month-header`: "Tháng 11, 2026" with Thống kê and ‹ › (spec §2.1). */
export function MonthHeader() {
  const t = useT();
  const { year, month } = parseMonth(useAtomValue(viewedMonthAtom));
  const atCurrent = useAtomValue(isCurrentMonthAtom);
  const shift = useSetAtom(shiftMonthAtom);
  const openStats = useSetAtom(openStatsAtom);
  return (
    <View className="mb-3.5 flex-row items-center justify-between">
      {/* Shrinks on narrow phones so the three buttons keep their room. */}
      <View className="mr-2 flex-1">
        <Text variant="meta">{t("journal.brand")}</Text>
        <Text variant="heading-lg" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          {t("journal.month", { month, year })}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <View className="mr-1">
          <IconButton
            icon="chart"
            accessibilityLabel={t("journal.stats")}
            onPress={() => {
              openStats();
              router.push("/stats");
            }}
          />
        </View>
        <IconButton
          icon="chevron-left"
          accessibilityLabel={t("journal.prevMonth")}
          onPress={() => shift(-1)}
        />
        <IconButton
          icon="chevron-right"
          accessibilityLabel={t("journal.nextMonth")}
          disabled={atCurrent}
          onPress={() => shift(1)}
        />
      </View>
    </View>
  );
}

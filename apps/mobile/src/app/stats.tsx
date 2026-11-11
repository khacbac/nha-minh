import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { ScrollView, View } from "react-native";

import { Icon } from "@/components/icon";
import { NavHeader } from "@/components/nav-header";
import { ScreenContent } from "@/components/screen-content";
import { Text } from "@/components/text";
import { statsBreakdownAtom, statsModeAtom, statsTotalsAtom } from "@/features/stats/_atoms/ui";
import { CategoryBars, PlainCounts } from "@/features/stats/components/category-bars";
import { PeriodPicker } from "@/features/stats/components/period-picker";
import { StatsTotals } from "@/features/stats/components/stats-totals";
import { YearBars } from "@/features/stats/components/year-bars";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

/** Thống kê: by month, year or a picked range (spec §2.4). */
export default function StatsScreen() {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface-app" style={{ paddingTop: insets.top + 8 }}>
      <ScreenContent>
        <View className="px-5">
          <NavHeader title={t("stats.title")} onBack={() => router.back()} />
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <PeriodPicker />
          <StatsBody />
        </ScrollView>
      </ScreenContent>
    </View>
  );
}

function StatsBody() {
  const t = useT();
  const mode = useAtomValue(statsModeAtom);
  const { count } = useAtomValue(statsTotalsAtom);
  const { expense, income, plain } = useAtomValue(statsBreakdownAtom);
  if (count === 0 && mode !== "year") {
    return (
      <View className="items-center gap-3 pt-16">
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-sunken">
          <Icon name="chart" size={30} color={colors.ink.muted} />
        </View>
        <Text variant="heading-sm" className="text-center">
          {t("stats.empty")}
        </Text>
      </View>
    );
  }
  return (
    <>
      <StatsTotals />
      {mode === "year" ? <YearBars /> : null}
      <CategoryBars title={t("stats.byCategory")} rows={expense} />
      <CategoryBars title={t("stats.incomeByCategory")} rows={income} />
      <PlainCounts rows={plain} />
    </>
  );
}

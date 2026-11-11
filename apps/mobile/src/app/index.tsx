import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { FlatList, View } from "react-native";

import { Fab } from "@/components/fab";
import { ScreenContent } from "@/components/screen-content";
import { daySectionsAtom } from "@/features/entries/_atoms/ui";
import { DayCard } from "@/features/entries/components/day-card";
import { EmptyMonth } from "@/features/entries/components/empty-month";
import { FilterChips } from "@/features/entries/components/filter-chips";
import { MonthHeader } from "@/features/entries/components/month-header";
import { MonthSummary } from "@/features/entries/components/month-summary";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";

/** Sổ: the month's entries by day (spec §2.1). */
export default function JournalScreen() {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  const sections = useAtomValue(daySectionsAtom);
  return (
    <View className="flex-1 bg-surface-app">
      <ScreenContent>
        <FlatList
          data={sections}
          keyExtractor={(s) => s.key}
          renderItem={({ item }) => <DayCard section={item} />}
          ListHeaderComponent={
            <View>
              <MonthHeader />
              <MonthSummary />
              <FilterChips />
            </View>
          }
          ListEmptyComponent={<EmptyMonth />}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            // Room under the last day for the floating button.
            paddingBottom: insets.bottom + 110,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScreenContent>
      <Fab
        label={t("journal.newEntry")}
        bottom={insets.bottom + 20}
        onPress={() => router.push("/entry/new")}
      />
    </View>
  );
}

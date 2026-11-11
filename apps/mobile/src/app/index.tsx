import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { Fab } from "@/components/fab";
import { LoadingState } from "@/components/loading-state";
import { ScreenContent } from "@/components/screen-content";
import { loadEntriesAtom } from "@/features/entries/_atoms/mutations";
import { entriesSyncAtom } from "@/features/entries/_atoms/queries";
import { daySectionsAtom } from "@/features/entries/_atoms/ui";
import { DayCard } from "@/features/entries/components/day-card";
import { DiaryLoader } from "@/features/entries/components/diary-loader";
import { EmptyMonth } from "@/features/entries/components/empty-month";
import { FilterChips } from "@/features/entries/components/filter-chips";
import { LoadFailed } from "@/features/entries/components/load-failed";
import { MonthHeader } from "@/features/entries/components/month-header";
import { MonthSummary } from "@/features/entries/components/month-summary";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

/** Sổ: the month's entries by day (spec §2.1), loaded from the server. */
export default function JournalScreen() {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  const sections = useAtomValue(daySectionsAtom);
  const sync = useAtomValue(entriesSyncAtom);
  const load = useSetAtom(loadEntriesAtom);
  // Pure view state: the pull spinner shows only for a pull, not a background reload.
  const [pulling, setPulling] = useState(false);

  const onRefresh = async () => {
    setPulling(true);
    await load();
    setPulling(false);
  };

  return (
    <View className="flex-1 bg-surface-app">
      <DiaryLoader />
      <ScreenContent>
        <FlatList
          data={sync.loaded ? sections : []}
          keyExtractor={(s) => s.key}
          renderItem={({ item }) => <DayCard section={item} />}
          ListHeaderComponent={
            <View>
              <MonthHeader />
              {sync.loaded ? (
                <>
                  <MonthSummary />
                  <FilterChips />
                </>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            sync.loaded ? (
              <EmptyMonth />
            ) : sync.failed && !sync.loading ? (
              <LoadFailed />
            ) : (
              <LoadingState label={t("journal.loading")} />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={pulling}
              onRefresh={() => void onRefresh()}
              enabled={sync.loaded}
              tintColor={colors.accent.primary}
              colors={[colors.accent.primary]}
              progressViewOffset={insets.top}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            // Room under the last day for the floating button.
            paddingBottom: insets.bottom + 110,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ScreenContent>
      {sync.loaded ? (
        <Fab
          label={t("journal.newEntry")}
          bottom={insets.bottom + 20}
          onPress={() => router.push("/entry/new")}
        />
      ) : null}
    </View>
  );
}

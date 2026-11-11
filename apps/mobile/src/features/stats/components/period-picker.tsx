import { useAtomValue, useSetAtom } from "jotai";
import { View } from "react-native";

import { DateBox } from "@/components/date-box";
import { IconButton } from "@/components/icon-button";
import { Segmented } from "@/components/segmented";
import { Text } from "@/components/text";
import { dayKey, now, parseMonth } from "@/features/entries/day";
import { useT } from "@/lib/i18n";

import { pickRangeEndAtom, setStatsModeAtom, shiftStatsPeriodAtom } from "../_atoms/mutations";
import {
  atCurrentPeriodAtom,
  statsFromAtom,
  statsModeAtom,
  statsMonthAtom,
  statsToAtom,
  statsYearAtom,
} from "../_atoms/ui";
import { dayStart } from "../period";

/** Tháng · Năm · Tuỳ chọn, then ‹ label › or the two date boxes (spec §2.4). */
export function PeriodPicker() {
  const t = useT();
  const mode = useAtomValue(statsModeAtom);
  const setMode = useSetAtom(setStatsModeAtom);
  return (
    <View>
      <Segmented
        options={[
          { key: "month", label: t("stats.month") },
          { key: "year", label: t("stats.year") },
          { key: "range", label: t("stats.range") },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === "range" ? <RangeBoxes /> : <PeriodNav />}
    </View>
  );
}

function PeriodNav() {
  const t = useT();
  const mode = useAtomValue(statsModeAtom);
  const monthKey = useAtomValue(statsMonthAtom);
  const year = useAtomValue(statsYearAtom);
  const atCurrent = useAtomValue(atCurrentPeriodAtom);
  const shift = useSetAtom(shiftStatsPeriodAtom);
  const { month, year: monthYear } = parseMonth(monthKey);
  const label =
    mode === "year"
      ? t("stats.yearLabel", { year })
      : t("journal.month", { month, year: monthYear });
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <IconButton
        icon="chevron-left"
        accessibilityLabel={t("stats.prev")}
        onPress={() => shift(-1)}
      />
      <Text variant="heading-sm">{label}</Text>
      <IconButton
        icon="chevron-right"
        accessibilityLabel={t("stats.next")}
        disabled={atCurrent}
        onPress={() => shift(1)}
      />
    </View>
  );
}

/** "2026-11-01" → "01/11/2026". */
const display = (key: string): string => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};

function RangeBoxes() {
  const t = useT();
  const from = useAtomValue(statsFromAtom);
  const to = useAtomValue(statsToAtom);
  const pick = useSetAtom(pickRangeEndAtom);
  const today = new Date(now());
  return (
    <View className="mb-3 flex-row gap-2.5">
      <DateBox
        label={t("stats.from")}
        display={display(from)}
        value={new Date(dayStart(from))}
        maximumDate={today}
        onPick={(d) => pick({ end: "from", day: dayKey(d.getTime()) })}
      />
      <DateBox
        label={t("stats.to")}
        display={display(to)}
        value={new Date(dayStart(to))}
        maximumDate={today}
        onPick={(d) => pick({ end: "to", day: dayKey(d.getTime()) })}
      />
    </View>
  );
}

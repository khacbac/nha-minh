import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, View } from "react-native";

import { Text } from "@/components/text";
import { monthKey, now } from "@/features/entries/day";
import { formatVnd } from "@/features/entries/money";
import { useT } from "@/lib/i18n";

import { tapYearBarAtom } from "../_atoms/mutations";
import { pickedBarAtom, statsYearAtom, yearBarsAtom } from "../_atoms/ui";

const PLOT_HEIGHT = 96;

/**
 * dev/design `UI.yearBars`: 12 single-hue columns of spending; the current month is the dark
 * step. The tapped month gets the darkest step and its amount next to the title, since a label
 * above a twelfth-width column does not fit (spec §2.4). Each column is the whole tap target.
 */
export function YearBars() {
  const t = useT();
  const bars = useAtomValue(yearBarsAtom);
  const year = useAtomValue(statsYearAtom);
  const picked = useAtomValue(pickedBarAtom);
  const tap = useSetAtom(tapYearBarAtom);
  const max = Math.max(1, ...bars.map((v) => v ?? 0));
  const current = monthKey(now());
  const pickedValue = picked === null ? null : (bars[picked] ?? null);
  return (
    <View className="mb-3.5">
      <View className="mb-2 flex-row justify-between">
        <Text variant="ui-label">{t("stats.byMonth")}</Text>
        {picked !== null && pickedValue !== null ? (
          <Text variant="ui-label" tone="heading" className="font-bvp-semibold">
            {t("stats.monthShort", { month: picked + 1 })} · {formatVnd(pickedValue)}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-end gap-1 rounded-card border border-line bg-surface-card px-2.5 pb-2 pt-4">
        {bars.map((value, i) => {
          const key = `${year}-${String(i + 1).padStart(2, "0")}`;
          const height =
            value == null || value === 0 ? 0 : Math.max((value / max) * PLOT_HEIGHT, 3);
          const fill =
            picked === i
              ? "bg-accent-pressed"
              : key === current
                ? "bg-accent-primary"
                : "bg-accent-soft";
          return (
            <Pressable
              key={key}
              disabled={value == null}
              onPress={() => tap(i)}
              accessibilityRole="button"
              accessibilityLabel={`${t("stats.monthShort", { month: i + 1 })}: ${formatVnd(value ?? 0)}`}
              className="flex-1 items-center gap-1"
            >
              <View className="w-full items-center justify-end" style={{ height: PLOT_HEIGHT }}>
                <View className={`w-[70%] rounded-t ${fill}`} style={{ height }} />
              </View>
              <Text variant="meta" tone={value == null ? "faint" : "muted"}>
                {t("stats.monthShort", { month: i + 1 })}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

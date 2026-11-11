import { useAtomValue } from "jotai";
import { View } from "react-native";

import { Text } from "@/components/text";
import { formatVnd } from "@/features/entries/money";
import { useT } from "@/lib/i18n";

import { statsTotalsAtom } from "../_atoms/ui";

/** dev/design `UI.statsTotals`: Đã chi, Thu / Còn lại, số ghi chép, TB mỗi ngày (spec §2.4). */
export function StatsTotals() {
  const t = useT();
  const { spent, earned, count, perDay } = useAtomValue(statsTotalsAtom);
  const left = earned - spent;
  return (
    <View className="mb-3.5 gap-0.5 rounded-card border border-line bg-surface-card px-[18px] py-4">
      <Text variant="meta">{t("stats.spent")}</Text>
      <Text variant="amount-xl" numberOfLines={1} adjustsFontSizeToFit>
        {formatVnd(spent)}
      </Text>
      {earned > 0 ? (
        <View className="mt-1.5 flex-row flex-wrap gap-x-3.5">
          <Text variant="caption">
            {t("journal.income")}{" "}
            <Text variant="caption" tone="income" className="font-bvp-semibold">
              +{formatVnd(earned)}
            </Text>
          </Text>
          <Text variant="caption">
            {t("stats.left")}{" "}
            <Text variant="caption" tone="heading" className="font-bvp-semibold">
              {left >= 0 ? "+" : "−"}
              {formatVnd(Math.abs(left))}
            </Text>
          </Text>
        </View>
      ) : null}
      <View className="mt-1.5 flex-row flex-wrap gap-x-3.5">
        <Text variant="caption">{t("journal.count", { count })}</Text>
        <Text variant="caption">
          {t("stats.perDay")}{" "}
          <Text variant="caption" tone="heading" className="font-bvp-semibold">
            {formatVnd(perDay)}
          </Text>
        </Text>
      </View>
    </View>
  );
}

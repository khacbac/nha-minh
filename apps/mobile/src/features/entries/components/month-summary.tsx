import { useAtomValue } from "jotai";
import { View } from "react-native";

import { Text } from "@/components/text";
import { categoryOf } from "@/features/categories/catalog";
import { useT } from "@/lib/i18n";

import { categoryFilterAtom, monthTotalsAtom } from "../_atoms/ui";
import { formatVnd } from "../money";

/** dev/design/kit/ui.css `.summary`: Đã chi, Thu, số ghi chép (spec §2.1). */
export function MonthSummary() {
  const t = useT();
  const { spent, earned, count } = useAtomValue(monthTotalsAtom);
  const filter = useAtomValue(categoryFilterAtom);
  return (
    <View className="mb-3.5 gap-0.5 rounded-card border border-line bg-surface-card px-[18px] py-4">
      <Text variant="meta">
        {filter
          ? t("journal.spentCategory", { name: categoryOf(filter).name })
          : t("journal.spent")}
      </Text>
      <Text variant="amount-xl" numberOfLines={1} adjustsFontSizeToFit>
        {formatVnd(spent)}
      </Text>
      <View className="mt-1.5 flex-row gap-3.5">
        {earned > 0 ? (
          <Text variant="caption">
            {t("journal.income")}{" "}
            <Text variant="caption" tone="income" className="font-bvp-semibold">
              +{formatVnd(earned)}
            </Text>
          </Text>
        ) : null}
        <Text variant="caption">{t("journal.count", { count })}</Text>
      </View>
    </View>
  );
}

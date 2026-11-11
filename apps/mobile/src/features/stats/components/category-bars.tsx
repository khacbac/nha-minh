import { View } from "react-native";

import { Text } from "@/components/text";
import { categoryOf } from "@/features/categories/catalog";
import { CategoryIcon } from "@/features/entries/components/category-icon";
import { formatVnd } from "@/features/entries/money";
import { useT } from "@/lib/i18n";

import type { CategoryAmount, CategoryCount } from "../breakdown";

/**
 * dev/design `UI.categoryBars`: one row per category, most first, with a single-hue bar by
 * share. Name and amount sit beside the bar, so the list doubles as the table (spec §2.4).
 */
export function CategoryBars({ title, rows }: { title: string; rows: CategoryAmount[] }) {
  const t = useT();
  if (rows.length === 0) return null;
  return (
    <View className="mb-3.5">
      <Text variant="ui-label" className="mb-2">
        {title}
      </Text>
      <View className="overflow-hidden rounded-card border border-line bg-surface-card">
        {rows.map((row, i) => (
          <View
            key={row.categoryId}
            className={`flex-row items-start gap-3 px-3.5 py-3 ${i === 0 ? "" : "border-t border-line"}`}
          >
            <CategoryIcon id={row.categoryId} size={36} />
            <View className="min-w-0 flex-1 gap-1">
              <View className="flex-row justify-between gap-2">
                <Text variant="body-md" tone="heading" numberOfLines={1} className="flex-1">
                  {categoryOf(row.categoryId).name}
                </Text>
                <Text variant="body-md" tone="heading" className="font-bvp-semibold">
                  {formatVnd(row.amount)}
                </Text>
              </View>
              <View className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                <View
                  className="h-full rounded-full bg-accent-primary"
                  style={{ width: `${Math.max(row.share, 2)}%` }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text variant="meta">{t("journal.count", { count: row.count })}</Text>
                <Text variant="meta">{row.share}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Việc không có tiền: "Việc nhà · 5 lần" (spec §2.4). */
export function PlainCounts({ rows }: { rows: CategoryCount[] }) {
  const t = useT();
  if (rows.length === 0) return null;
  return (
    <View className="mb-3.5">
      <Text variant="ui-label" className="mb-2">
        {t("stats.plain")}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {rows.map((row) => (
          <View
            key={row.categoryId}
            className="h-[34px] flex-row items-center rounded-chip bg-surface-sunken px-3"
          >
            <Text variant="ui-label">
              {t("stats.times", { name: categoryOf(row.categoryId).name, count: row.count })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

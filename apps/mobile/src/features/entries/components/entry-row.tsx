import type { Entry } from "@sonha/types";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/text";
import { categoryOf } from "@/features/categories/catalog";
import { colors } from "@/lib/theme";

import { timeLabel } from "../day";
import { formatVnd } from "../money";
import { CategoryIcon } from "./category-icon";

/**
 * dev/design/kit/ui.css `.entry-row`: icon, title, "Danh mục · 08:30 · note", amount. Spending
 * is ink, income moss with + (spec §2.1).
 */
export const EntryRow = memo(function EntryRow({
  entry,
  first,
}: {
  entry: Entry;
  first: boolean;
}) {
  const category = categoryOf(entry.categoryId);
  const sub = [category.name, timeLabel(entry.occurredAt), entry.note?.split("\n")[0]]
    .filter(Boolean)
    .join(" · ");
  const income = category.money === "income";
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/entry/[id]", params: { id: entry.id } })}
      accessibilityRole="button"
      android_ripple={{ color: colors.surface.sunken }}
      className={`flex-row items-center gap-3 px-3.5 py-3 ${first ? "" : "border-t border-line"}`}
    >
      <CategoryIcon id={entry.categoryId} />
      <View className="min-w-0 flex-1">
        <Text variant="body-md" tone="heading" numberOfLines={1}>
          {entry.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {sub}
        </Text>
      </View>
      {entry.amount !== undefined ? (
        <Text
          variant="body-md"
          tone={income ? "income" : "heading"}
          className="font-bvp-semibold"
          numberOfLines={1}
        >
          {income ? "+" : ""}
          {formatVnd(entry.amount)}
        </Text>
      ) : null}
    </Pressable>
  );
});

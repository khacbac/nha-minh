import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/icon-button";
import { NavHeader } from "@/components/nav-header";
import { ScreenContent } from "@/components/screen-content";
import { Text } from "@/components/text";
import { categoryOf } from "@/features/categories/catalog";
import { deleteEntryAtom } from "@/features/entries/_atoms/mutations";
import { entryAtomFamily } from "@/features/entries/_atoms/queries";
import { CategoryIcon } from "@/features/entries/components/category-icon";
import { MissingEntry } from "@/features/entries/components/missing-entry";
import { dayInfo, now } from "@/features/entries/day";
import { fullWhen } from "@/features/entries/day-label";
import { formatVnd } from "@/features/entries/money";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

/** Chi tiết: everything about one entry, with Sửa and Xoá (spec §2.2). */
export default function EntryDetailScreen() {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = useAtomValue(entryAtomFamily(id));
  const remove = useSetAtom(deleteEntryAtom);
  // Pure view state: only this screen shows the delete question.
  const [askDelete, setAskDelete] = useState(false);

  if (!entry) return <MissingEntry onBack={() => router.back()} />;

  const category = categoryOf(entry.categoryId);
  const income = category.money === "income";
  const edit = () => router.push({ pathname: "/entry/[id]/edit", params: { id } });

  return (
    <View
      className="flex-1 bg-surface-app"
      style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }}
    >
      <ScreenContent>
        <View className="px-5">
          <NavHeader
            onBack={() => router.back()}
            right={
              <IconButton icon="pencil" accessibilityLabel={t("common.edit")} onPress={edit} />
            }
          />
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-1.5 pt-3">
            <CategoryIcon id={entry.categoryId} size={64} />
            <Text variant="ui-label" tone="muted" className="mt-1.5">
              {category.name}
            </Text>
            <Text variant="heading-lg" className="text-center" selectable>
              {entry.title}
            </Text>
            {entry.amount !== undefined ? (
              <Text variant="amount-xl" tone={income ? "income" : "heading"} selectable>
                {income ? "+" : ""}
                {formatVnd(entry.amount)}
              </Text>
            ) : null}
            <View className="mt-1 flex-row items-center gap-1.5">
              <Icon name="calendar" size={16} color={colors.ink.muted} />
              <Text variant="caption">
                {fullWhen(dayInfo(entry.occurredAt, now()), entry.occurredAt, t)}
              </Text>
            </View>
          </View>
          {entry.note ? (
            <View className="mt-[18px] rounded-card border border-line bg-surface-card px-4 py-3.5">
              <Text variant="meta" className="mb-1">
                {t("entry.note")}
              </Text>
              <Text variant="body-lg" selectable>
                {entry.note}
              </Text>
            </View>
          ) : null}
        </ScrollView>
        <View className="flex-row gap-2.5 px-5 pt-3">
          <View className="flex-1">
            <Button label={t("common.edit")} variant="soft" icon="pencil" onPress={edit} />
          </View>
          <View className="flex-1">
            <Button
              label={t("common.delete")}
              variant="danger"
              icon="trash"
              onPress={() => setAskDelete(true)}
            />
          </View>
        </View>
      </ScreenContent>

      <ConfirmDialog
        visible={askDelete}
        title={t("entry.deleteTitle")}
        message={t("entry.deleteMessage")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        confirmTone="danger"
        onCancel={() => setAskDelete(false)}
        onConfirm={() => {
          setAskDelete(false);
          router.back();
          remove(id);
        }}
      />
    </View>
  );
}

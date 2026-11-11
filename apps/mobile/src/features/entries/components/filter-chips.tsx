import { useAtomValue, useSetAtom } from "jotai";
import { ScrollView } from "react-native";

import { Chip } from "@/components/chip";
import { categoryOf } from "@/features/categories/catalog";
import { useT } from "@/lib/i18n";

import { toggleFilterAtom } from "../_atoms/mutations";
import { categoryFilterAtom, filterChipsAtom } from "../_atoms/ui";

/** Tất cả + the categories used this month, scrolling sideways (spec §2.1). */
export function FilterChips() {
  const t = useT();
  const chips = useAtomValue(filterChipsAtom);
  const filter = useAtomValue(categoryFilterAtom);
  const toggle = useSetAtom(toggleFilterAtom);
  if (chips.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      style={{ marginHorizontal: -20, flexGrow: 0 }}
    >
      <Chip label={t("journal.all")} on={filter === null} onPress={() => toggle(null)} />
      {chips.map((id) => (
        <Chip key={id} label={categoryOf(id).name} on={filter === id} onPress={() => toggle(id)} />
      ))}
    </ScrollView>
  );
}

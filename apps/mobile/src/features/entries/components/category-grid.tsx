import type { CategoryId } from "@sonha/types";
import { useFieldValue } from "form-atoms";
import { useSetAtom } from "jotai";
import { View } from "react-native";

import { BouncablePress } from "@/components/bouncable-press";
import { Text } from "@/components/text";
import { CATEGORIES } from "@/features/categories/catalog";

import type { EntryForm } from "../_atoms/forms";
import { CategoryIcon } from "./category-icon";

/** dev/design/kit/ui.css `.cat-grid`: 4 columns, the picked one outlined in moss (spec §2.3). */
export function CategoryGrid({ form }: { form: EntryForm }) {
  const selected = useFieldValue(form.fields.categoryId);
  const pick = useSetAtom(form.pickCategoryAtom);
  return (
    <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
      {CATEGORIES.map((category) => (
        <Tile
          key={category.id}
          id={category.id}
          name={category.name}
          on={category.id === selected}
          onPress={pick}
        />
      ))}
    </View>
  );
}

function Tile({
  id,
  name,
  on,
  onPress,
}: {
  id: CategoryId;
  name: string;
  on: boolean;
  onPress: (id: CategoryId) => void;
}) {
  return (
    <View style={{ width: "25%", padding: 4 }}>
      <BouncablePress
        onPress={() => onPress(id)}
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        accessibilityLabel={name}
        className={`items-center gap-1.5 rounded-button border-[1.5px] px-0.5 pb-2 pt-2.5 ${
          on ? "border-accent-primary bg-accent-soft" : "border-transparent"
        }`}
      >
        <CategoryIcon id={id} />
        <Text
          variant="meta"
          tone={on ? "on-soft" : "body"}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {name}
        </Text>
      </BouncablePress>
    </View>
  );
}

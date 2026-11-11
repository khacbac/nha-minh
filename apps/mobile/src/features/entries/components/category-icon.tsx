import type { CategoryId } from "@sonha/types";
import { View } from "react-native";

import { Icon } from "@/components/icon";
import { categoryOf } from "@/features/categories/catalog";
import { colors } from "@/lib/theme";

/** dev/design/kit/ui.css `.cat-icon`: the category's icon on its tint, round. */
export function CategoryIcon({ id, size = 40 }: { id: CategoryId; size?: number }) {
  const category = categoryOf(id);
  const tint = colors.tint[category.tint];
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: tint.bg }}
    >
      <Icon name={category.icon} size={Math.round(size * 0.5)} color={tint.fg} />
    </View>
  );
}

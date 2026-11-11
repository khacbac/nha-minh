import { View } from "react-native";

import { BouncablePress } from "./bouncable-press";
import { Text } from "./text";

/** dev/design/kit/ui.css `.segmented`. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <View className="mb-3 flex-row gap-1 rounded-button bg-surface-sunken p-1">
      {options.map((option) => {
        const on = option.key === value;
        return (
          <BouncablePress
            key={option.key}
            onPress={() => onChange(option.key)}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            className={`flex-1 items-center rounded-[10px] py-2 ${on ? "bg-surface-card" : ""}`}
          >
            <Text variant="ui-label" tone={on ? "heading" : "muted"}>
              {option.label}
            </Text>
          </BouncablePress>
        );
      })}
    </View>
  );
}

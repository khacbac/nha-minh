import { accentShadow, colors } from "@/lib/theme";

import { BouncablePress } from "./bouncable-press";
import { Icon } from "./icon";
import { Text } from "./text";

/** dev/design/kit/ui.css `.fab`: the one main action, with its label (design README). */
export function Fab({
  label,
  onPress,
  bottom,
}: {
  label: string;
  onPress: () => void;
  bottom: number;
}) {
  return (
    <BouncablePress
      onPress={onPress}
      haptic="medium"
      accessibilityRole="button"
      accessibilityLabel={label}
      className="absolute right-5 h-[54px] flex-row items-center gap-2 rounded-pill bg-accent-primary pl-4 pr-5"
      style={[accentShadow, { bottom }]}
    >
      <Icon name="plus" size={22} color={colors.accent["on-primary"]} strokeWidth={2} />
      <Text variant="ui-button" tone="on-primary">
        {label}
      </Text>
    </BouncablePress>
  );
}

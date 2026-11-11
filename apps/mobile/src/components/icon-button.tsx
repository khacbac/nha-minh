import { colors } from "@/lib/theme";

import { BouncablePress } from "./bouncable-press";
import { Icon, type IconName } from "./icon";

/** dev/design/kit/ui.css `.icon-btn`: card (40, white, hairline border) or plain. */
type Variant = "card" | "plain";

type Props = {
  icon: IconName;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  accessibilityLabel: string;
};

export function IconButton({
  icon,
  onPress,
  disabled,
  variant = "card",
  accessibilityLabel,
}: Props) {
  return (
    <BouncablePress
      onPress={onPress}
      disabled={disabled}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      hitSlop={6}
      className={`h-10 w-10 items-center justify-center rounded-full ${
        variant === "card" ? "border border-line bg-surface-card" : ""
      } ${disabled ? "opacity-30" : ""}`}
    >
      <Icon name={icon} size={20} color={colors.ink.heading} />
    </BouncablePress>
  );
}

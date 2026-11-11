import { colors } from "@/lib/theme";

import { BouncablePress } from "./bouncable-press";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

/** dev/design/kit/ui.css `.btn-*`. */
type Variant = "primary" | "soft" | "ghost" | "danger";

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  icon?: IconName;
  fullWidth?: boolean;
};

const containerVariant: Record<Variant, string> = {
  primary: "bg-accent-primary",
  soft: "bg-accent-soft",
  ghost: "bg-surface-card border border-line",
  danger: "bg-state-danger-soft",
};

const tone = {
  primary: "on-primary",
  soft: "on-soft",
  ghost: "heading",
  danger: "danger",
} as const;

const iconColor: Record<Variant, string> = {
  primary: colors.accent["on-primary"],
  soft: colors.accent["on-soft"],
  ghost: colors.ink.heading,
  danger: colors.state.danger,
};

export function Button({
  label,
  onPress,
  disabled,
  variant = "primary",
  icon,
  fullWidth = true,
}: Props) {
  return (
    <BouncablePress
      onPress={onPress}
      haptic="light"
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`h-[52px] flex-row items-center justify-center gap-2 rounded-button px-5 ${
        containerVariant[variant]
      } ${disabled ? "opacity-40" : ""} ${fullWidth ? "w-full" : ""}`}
    >
      {icon ? <Icon name={icon} size={20} color={iconColor[variant]} /> : null}
      <Text variant="ui-button" tone={tone[variant]} numberOfLines={1}>
        {label}
      </Text>
    </BouncablePress>
  );
}

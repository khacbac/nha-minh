import { BouncablePress } from "./bouncable-press";
import { Text } from "./text";

/**
 * dev/design/kit/ui.css `.chip`: a filter (`on` = ink fill) or a suggestion (`soft` = sunken,
 * no border).
 */
export function Chip({
  label,
  on = false,
  soft = false,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  on?: boolean;
  soft?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const look = on
    ? "border-ink-heading bg-ink-heading"
    : soft
      ? "border-transparent bg-surface-sunken"
      : "border-line bg-surface-card";
  return (
    <BouncablePress
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={accessibilityLabel}
      className={`h-[34px] flex-row items-center rounded-chip border px-3 ${look}`}
    >
      <Text variant="ui-label" className={on ? "text-surface-card" : ""} numberOfLines={1}>
        {label}
      </Text>
    </BouncablePress>
  );
}

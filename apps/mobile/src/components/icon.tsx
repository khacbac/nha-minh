import { Path, Svg } from "react-native-svg";

import { icons } from "@/lib/theme/icons";

export type IconName = keyof typeof icons;

/** A line icon from `lib/theme/icons.js`, the same path the HTML design draws. */
export function Icon({
  name,
  size = 22,
  color,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  color: string;
  strokeWidth?: number;
}) {
  const d = (icons as Record<string, string>)[name];
  if (!d) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessible={false}>
      <Path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

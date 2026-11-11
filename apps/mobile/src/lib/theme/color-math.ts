function channels(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

/** `#RRGGBB` → `rgba(r,g,b,alpha)`, for the dialog scrim. */
export function withAlpha(hex: string, alpha: number): string {
  return `rgba(${channels(hex).join(",")},${alpha})`;
}

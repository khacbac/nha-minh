import type { TxKeyPath } from "@/lib/i18n";

import { type DayInfo, timeLabel } from "./day";

type Translate = (key: TxKeyPath, options?: Record<string, unknown>) => string;

/** "Hôm nay" / "Hôm qua" / "Thứ Hai, 9/11" (+ year when not this year), spec §2.1. */
export function dayHeading(info: DayInfo, todayYear: number, t: Translate): string {
  if (info.relative) return t(`day.${info.relative}`);
  const weekday = t(`weekday.${info.weekday}` as TxKeyPath);
  return info.year === todayYear
    ? t("day.short", { weekday, day: info.day, month: info.month })
    : t("day.shortYear", { weekday, day: info.day, month: info.month, year: info.year });
}

/** The date field: "Hôm nay, 11/11" or the heading for other days (spec §2.3). */
export function dateFieldLabel(info: DayInfo, todayYear: number, t: Translate): string {
  if (info.relative) {
    return t("day.relative", {
      relative: t(`day.${info.relative}`),
      day: info.day,
      month: info.month,
    });
  }
  return dayHeading(info, todayYear, t);
}

/** "Thứ Tư, 11/11/2026 · 08:30" on the detail screen (spec §2.2). */
export function fullWhen(info: DayInfo, ms: number, t: Translate): string {
  return t("day.full", {
    weekday: t(`weekday.${info.weekday}` as TxKeyPath),
    day: info.day,
    month: info.month,
    year: info.year,
    time: timeLabel(ms),
  });
}

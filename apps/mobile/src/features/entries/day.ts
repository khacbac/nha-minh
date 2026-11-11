/**
 * Days and months in the phone's local time (spec §3.2). Pure: every function takes the time
 * it needs; only `now()` reads the clock, and only mutations and screens opening a form call it.
 */

export function now(): number {
  return Date.now();
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" of a moment; strings compare in date order. */
export function dayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM" of a moment. */
export function monthKey(ms: number): string {
  return dayKey(ms).slice(0, 7);
}

/** "2026-11" → { year: 2026, month: 11 }. */
export function parseMonth(key: string): { year: number; month: number } {
  const [year = "1970", month = "1"] = key.split("-");
  return { year: Number(year), month: Number(month) };
}

/** "2026-01", -1 → "2025-12". */
export function shiftMonth(key: string, delta: number): string {
  const { year, month } = parseMonth(key);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export type DayInfo = {
  /** "today" / "yesterday" relative to `todayMs`, otherwise null. */
  relative: "today" | "yesterday" | null;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  day: number;
  month: number;
  year: number;
};

/** What a day header or date field needs to say about a moment (spec §2.1, §2.3). */
export function dayInfo(ms: number, todayMs: number): DayInfo {
  const d = new Date(ms);
  const today = dayKey(todayMs);
  const t = new Date(todayMs);
  const yesterday = dayKey(new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1).getTime());
  const key = dayKey(ms);
  return {
    relative: key === today ? "today" : key === yesterday ? "yesterday" : null,
    weekday: d.getDay(),
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}

/** "08:30". */
export function timeLabel(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `ms` moved to the calendar date of `dateMs`, keeping its time of day. */
export function withDate(ms: number, dateMs: number): number {
  const time = new Date(ms);
  const date = new Date(dateMs);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
  ).getTime();
}

/** `ms` with the hour and minute of `timeMs`, keeping its date. */
export function withTime(ms: number, timeMs: number): number {
  const date = new Date(ms);
  const time = new Date(timeMs);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
  ).getTime();
}

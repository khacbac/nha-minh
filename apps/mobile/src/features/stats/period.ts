import { dayKey, parseMonth } from "@/features/entries/day";

/** Half-open span of local time, epoch ms: start ≤ t < end. */
export type Range = { start: number; end: number };

export type StatsMode = "month" | "year" | "range";

/** "YYYY-MM-DD" → local midnight of that day. */
export function dayStart(key: string): number {
  const [y = "1970", m = "1", d = "1"] = key.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
}

function nextDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}

export function monthRange(key: string): Range {
  const { year, month } = parseMonth(key);
  return {
    start: new Date(year, month - 1, 1).getTime(),
    end: new Date(year, month, 1).getTime(),
  };
}

export function yearRange(year: number): Range {
  return { start: new Date(year, 0, 1).getTime(), end: new Date(year + 1, 0, 1).getTime() };
}

/** Both days included (spec §2.4). */
export function dayRange(from: string, to: string): Range {
  return { start: dayStart(from), end: nextDay(dayStart(to)) };
}

/** Days of the range that have begun by `now`, today included: the divisor of the average. */
export function daysElapsed(range: Range, now: number): number {
  const end = Math.min(range.end, nextDay(dayStart(dayKey(now))));
  if (end <= range.start) return 0;
  let days = 0;
  for (let t = range.start; t < end; t = nextDay(t)) days += 1;
  return days;
}

/**
 * The custom range after one end is picked: never after today, and the other end follows when
 * they would cross (spec §2.4).
 */
export function pickRangeEnd(
  current: { from: string; to: string },
  end: "from" | "to",
  picked: string,
  today: string,
): { from: string; to: string } {
  const day = picked > today ? today : picked;
  if (end === "from") return { from: day, to: current.to < day ? day : current.to };
  return { from: current.from > day ? day : current.from, to: day };
}

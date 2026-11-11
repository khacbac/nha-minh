import { describe, expect, it } from "vitest";

import { dayInfo, dayKey, monthKey, shiftMonth, timeLabel, withDate, withTime } from "./day";

const at = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min).getTime();

describe("keys", () => {
  it("formats local day and month", () => {
    expect(dayKey(at(2026, 11, 9, 23, 59))).toBe("2026-11-09");
    expect(monthKey(at(2026, 1, 1, 0, 0))).toBe("2026-01");
  });

  it("shifts months across years", () => {
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2025-12", 1)).toBe("2026-01");
    expect(shiftMonth("2026-11", 0)).toBe("2026-11");
  });
});

describe("dayInfo", () => {
  const today = at(2026, 11, 11, 9, 0);

  it("names today and yesterday", () => {
    expect(dayInfo(at(2026, 11, 11, 23, 0), today).relative).toBe("today");
    expect(dayInfo(at(2026, 11, 10, 0, 5), today).relative).toBe("yesterday");
    expect(dayInfo(at(2026, 11, 9), today).relative).toBeNull();
  });

  it("handles yesterday across a month edge", () => {
    expect(dayInfo(at(2026, 10, 31, 12), at(2026, 11, 1, 8)).relative).toBe("yesterday");
  });

  it("gives weekday and date parts", () => {
    expect(dayInfo(at(2026, 11, 9), today)).toEqual({
      relative: null,
      weekday: 1,
      day: 9,
      month: 11,
      year: 2026,
    });
  });
});

describe("time", () => {
  it("labels hours and minutes", () => {
    expect(timeLabel(at(2026, 11, 11, 8, 5))).toBe("08:05");
  });

  it("changes date or time and keeps the other", () => {
    const base = at(2026, 11, 11, 8, 30);
    expect(withDate(base, at(2026, 10, 2, 17, 0))).toBe(at(2026, 10, 2, 8, 30));
    expect(withTime(base, at(2020, 1, 1, 21, 45))).toBe(at(2026, 11, 11, 21, 45));
  });
});

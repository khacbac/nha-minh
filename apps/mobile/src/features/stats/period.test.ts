import { describe, expect, it } from "vitest";

import { dayRange, daysElapsed, monthRange, pickRangeEnd, yearRange } from "./period";

const at = (y: number, m: number, d: number, h = 0) => new Date(y, m - 1, d, h).getTime();

describe("ranges", () => {
  it("covers a whole month, half-open", () => {
    expect(monthRange("2026-02")).toEqual({ start: at(2026, 2, 1), end: at(2026, 3, 1) });
    expect(monthRange("2026-12").end).toBe(at(2027, 1, 1));
  });

  it("covers a whole year", () => {
    expect(yearRange(2026)).toEqual({ start: at(2026, 1, 1), end: at(2027, 1, 1) });
  });

  it("includes both ends of a custom range", () => {
    expect(dayRange("2026-11-01", "2026-11-11")).toEqual({
      start: at(2026, 11, 1),
      end: at(2026, 11, 12),
    });
  });
});

describe("daysElapsed", () => {
  const now = at(2026, 11, 11, 15);

  it("counts a past month in full", () => {
    expect(daysElapsed(monthRange("2026-10"), now)).toBe(31);
  });

  it("counts the current month up to today", () => {
    expect(daysElapsed(monthRange("2026-11"), now)).toBe(11);
  });

  it("counts the current year up to today", () => {
    expect(daysElapsed(yearRange(2026), now)).toBe(315);
  });

  it("is zero for a range that has not started", () => {
    expect(daysElapsed(monthRange("2026-12"), now)).toBe(0);
  });
});

describe("pickRangeEnd", () => {
  const today = "2026-11-11";
  const range = { from: "2026-11-01", to: "2026-11-05" };

  it("moves To along when From passes it", () => {
    expect(pickRangeEnd(range, "from", "2026-11-08", today)).toEqual({
      from: "2026-11-08",
      to: "2026-11-08",
    });
  });

  it("moves From back when To goes before it", () => {
    expect(pickRangeEnd(range, "to", "2026-10-20", today)).toEqual({
      from: "2026-10-20",
      to: "2026-10-20",
    });
  });

  it("never goes past today", () => {
    expect(pickRangeEnd(range, "to", "2026-12-01", today)).toEqual({
      from: "2026-11-01",
      to: today,
    });
  });
});

import type { CategoryId, Entry, MoneyKind } from "@sonha/types";
import { describe, expect, it } from "vitest";

import { averagePerDay, breakdown, inRange, spendByMonth } from "./breakdown";
import { monthRange } from "./period";

const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 9).getTime();

const MONEY: Partial<Record<CategoryId, MoneyKind>> = {
  income: "income",
  chores: "none",
  moments: "none",
};
const moneyOf = (id: CategoryId): MoneyKind => MONEY[id] ?? "expense";

let seq = 0;
const entry = (categoryId: CategoryId, occurredAt: number, amount?: number): Entry => {
  seq += 1;
  return {
    id: `e${seq}`,
    categoryId,
    title: categoryId,
    occurredAt,
    createdAt: seq,
    updatedAt: seq,
    ...(amount === undefined ? {} : { amount }),
  };
};

describe("breakdown", () => {
  const entries = [
    entry("market", at(2026, 11, 1), 100_000),
    entry("market", at(2026, 11, 2), 200_000),
    entry("bills", at(2026, 11, 3), 900_000),
    entry("market", at(2026, 11, 4)),
    entry("chores", at(2026, 11, 5)),
    entry("chores", at(2026, 11, 6)),
    entry("income", at(2026, 11, 7), 5_000_000),
  ];

  it("ranks spending by amount with shares", () => {
    expect(breakdown(entries, moneyOf).expense).toEqual([
      { categoryId: "bills", amount: 900_000, count: 1, share: 75 },
      { categoryId: "market", amount: 300_000, count: 2, share: 25 },
    ]);
  });

  it("keeps income apart", () => {
    expect(breakdown(entries, moneyOf).income).toEqual([
      { categoryId: "income", amount: 5_000_000, count: 1, share: 100 },
    ]);
  });

  it("counts entries without money by category", () => {
    expect(breakdown(entries, moneyOf).plain).toEqual([
      { categoryId: "chores", count: 2 },
      { categoryId: "market", count: 1 },
    ]);
  });

  it("filters to a range", () => {
    expect(inRange(entries, monthRange("2026-10"))).toEqual([]);
    expect(inRange(entries, monthRange("2026-11"))).toHaveLength(7);
  });
});

describe("spendByMonth", () => {
  it("sums spending per month and leaves future months empty", () => {
    const entries = [
      entry("market", at(2026, 1, 5), 100_000),
      entry("bills", at(2026, 1, 9), 50_000),
      entry("income", at(2026, 1, 9), 9_000_000),
      entry("market", at(2026, 11, 1), 70_000),
      entry("market", at(2025, 11, 1), 999_000),
    ];
    const bars = spendByMonth(entries, 2026, moneyOf, at(2026, 11, 11));
    expect(bars[0]).toBe(150_000);
    expect(bars[1]).toBe(0);
    expect(bars[10]).toBe(70_000);
    expect(bars[11]).toBeNull();
  });
});

describe("averagePerDay", () => {
  it("rounds and guards zero days", () => {
    expect(averagePerDay(1_000_000, 3)).toBe(333_333);
    expect(averagePerDay(1_000, 0)).toBe(0);
  });
});

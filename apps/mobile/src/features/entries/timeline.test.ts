import type { CategoryId, Entry, MoneyKind } from "@sonha/types";
import { describe, expect, it } from "vitest";

import { categoriesUsed, groupByDay, inMonth, sortNewestFirst, totals } from "./timeline";

const at = (y: number, m: number, d: number, h = 9) => new Date(y, m - 1, d, h).getTime();

const MONEY: Partial<Record<CategoryId, MoneyKind>> = {
  market: "expense",
  spiritual: "expense",
  income: "income",
  chores: "none",
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

describe("timeline", () => {
  const a = entry("market", at(2026, 11, 11, 7), 185_000);
  const b = entry("spiritual", at(2026, 11, 11, 6), 250_000);
  const c = entry("chores", at(2026, 11, 10, 20));
  const d = entry("income", at(2026, 11, 10, 10), 18_500_000);
  const old = entry("market", at(2026, 10, 31, 8), 80_000);

  it("sorts newest first", () => {
    expect(sortNewestFirst([b, old, a, d, c]).map((e) => e.id)).toEqual(
      [a, b, c, d, old].map((e) => e.id),
    );
  });

  it("keeps only the month", () => {
    expect(inMonth([a, old], "2026-11")).toEqual([a]);
  });

  it("totals spending and income separately", () => {
    expect(totals([a, b, c, d], moneyOf)).toEqual({ spent: 435_000, earned: 18_500_000, count: 4 });
  });

  it("groups by day with the day's spending", () => {
    const sections = groupByDay([a, b, c, d], moneyOf);
    expect(sections.map((s) => [s.key, s.entries.length, s.spent])).toEqual([
      ["2026-11-11", 2, 435_000],
      ["2026-11-10", 2, 0],
    ]);
  });

  it("lists used categories in catalog order", () => {
    expect(categoriesUsed([d, a, c, a], ["market", "chores", "income", "food"])).toEqual([
      "market",
      "chores",
      "income",
    ]);
  });
});

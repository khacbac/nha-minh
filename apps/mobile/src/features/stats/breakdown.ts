import type { CategoryId, Entry, MoneyKind } from "@sonha/types";

import { monthKey } from "@/features/entries/day";

import type { Range } from "./period";

export type CategoryAmount = {
  categoryId: CategoryId;
  amount: number;
  count: number;
  /** Share of the section's total, 0–100, rounded. */
  share: number;
};

export type CategoryCount = { categoryId: CategoryId; count: number };

export type Breakdown = {
  expense: CategoryAmount[];
  income: CategoryAmount[];
  /** Entries without an amount, by category (spec §2.4 "Việc không có tiền"). */
  plain: CategoryCount[];
};

export function inRange(entries: readonly Entry[], range: Range): Entry[] {
  return entries.filter((e) => e.occurredAt >= range.start && e.occurredAt < range.end);
}

function ranked(map: Map<CategoryId, { amount: number; count: number }>): CategoryAmount[] {
  const total = [...map.values()].reduce((s, v) => s + v.amount, 0);
  return [...map.entries()]
    .map(([categoryId, v]) => ({
      categoryId,
      amount: v.amount,
      count: v.count,
      share: total > 0 ? Math.round((v.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount || b.count - a.count);
}

/** Spending and income by category, most first; entries without money counted apart. */
export function breakdown(
  entries: readonly Entry[],
  moneyOf: (id: CategoryId) => MoneyKind,
): Breakdown {
  const expense = new Map<CategoryId, { amount: number; count: number }>();
  const income = new Map<CategoryId, { amount: number; count: number }>();
  const plain = new Map<CategoryId, number>();
  for (const e of entries) {
    const kind = moneyOf(e.categoryId);
    if (e.amount === undefined || kind === "none") {
      plain.set(e.categoryId, (plain.get(e.categoryId) ?? 0) + 1);
      continue;
    }
    const target = kind === "income" ? income : expense;
    const row = target.get(e.categoryId) ?? { amount: 0, count: 0 };
    target.set(e.categoryId, { amount: row.amount + e.amount, count: row.count + 1 });
  }
  return {
    expense: ranked(expense),
    income: ranked(income),
    plain: [...plain.entries()]
      .map(([categoryId, count]) => ({ categoryId, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/**
 * Spending per month of `year` (index 0 = T1). Months after the current one are null so the
 * chart leaves them empty (spec §2.4).
 */
export function spendByMonth(
  entries: readonly Entry[],
  year: number,
  moneyOf: (id: CategoryId) => MoneyKind,
  now: number,
): (number | null)[] {
  const current = monthKey(now);
  const months = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
  const sums = new Map(months.map((m) => [m, 0]));
  for (const e of entries) {
    if (e.amount === undefined || moneyOf(e.categoryId) !== "expense") continue;
    const m = monthKey(e.occurredAt);
    const sum = sums.get(m);
    if (sum !== undefined) sums.set(m, sum + e.amount);
  }
  return months.map((m) => (m > current ? null : (sums.get(m) ?? 0)));
}

export function averagePerDay(spent: number, days: number): number {
  return days > 0 ? Math.round(spent / days) : 0;
}

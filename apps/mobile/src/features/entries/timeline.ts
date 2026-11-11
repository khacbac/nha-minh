import type { CategoryId, Entry, MoneyKind } from "@sonha/types";

import { dayKey, monthKey } from "./day";

export type DaySection = {
  /** "YYYY-MM-DD". */
  key: string;
  /** A moment inside that day, for its header label. */
  at: number;
  entries: Entry[];
  /** Spending of the day, đồng; 0 hides the header total (spec §2.1). */
  spent: number;
};

export type Totals = { spent: number; earned: number; count: number };

/** Newest first; same moment → most recently created first. */
export function sortNewestFirst(entries: readonly Entry[]): Entry[] {
  return [...entries].sort((a, b) => b.occurredAt - a.occurredAt || b.createdAt - a.createdAt);
}

export function inMonth(entries: readonly Entry[], month: string): Entry[] {
  return entries.filter((e) => monthKey(e.occurredAt) === month);
}

/** Sum of amounts by money kind; entries without an amount only count (spec §2.1). */
export function totals(entries: readonly Entry[], moneyOf: (id: CategoryId) => MoneyKind): Totals {
  let spent = 0;
  let earned = 0;
  for (const e of entries) {
    if (e.amount === undefined) continue;
    const kind = moneyOf(e.categoryId);
    if (kind === "expense") spent += e.amount;
    else if (kind === "income") earned += e.amount;
  }
  return { spent, earned, count: entries.length };
}

/** Entries already sorted newest first → one section per day, in the same order. */
export function groupByDay(
  sorted: readonly Entry[],
  moneyOf: (id: CategoryId) => MoneyKind,
): DaySection[] {
  const sections: DaySection[] = [];
  for (const entry of sorted) {
    const key = dayKey(entry.occurredAt);
    let section = sections[sections.length - 1];
    if (!section || section.key !== key) {
      section = { key, at: entry.occurredAt, entries: [], spent: 0 };
      sections.push(section);
    }
    section.entries.push(entry);
  }
  for (const section of sections) section.spent = totals(section.entries, moneyOf).spent;
  return sections;
}

/** Categories that have entries, in catalog order: the filter chips (spec §2.1). */
export function categoriesUsed(
  entries: readonly Entry[],
  order: readonly CategoryId[],
): CategoryId[] {
  const used = new Set(entries.map((e) => e.categoryId));
  return order.filter((id) => used.has(id));
}

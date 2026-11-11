import type { CategoryId } from "@sonha/types";
import { atom } from "jotai";

import { CATEGORIES, moneyOf } from "@/features/categories/catalog";

import { monthKey, now } from "../day";
import { categoriesUsed, groupByDay, inMonth, totals } from "../timeline";
import { entryListAtom } from "./queries";

/** "YYYY-MM" being viewed; opens on the current month (spec §2.1). */
export const viewedMonthAtom = atom(monthKey(now()));

/** The filter chip; null = Tất cả. Reset when the month changes (spec §2.1). */
export const categoryFilterAtom = atom<CategoryId | null>(null);

/** Lưu waits for the server; "failed" shows Chưa lưu được (spec §2.3). */
export const saveStatusAtom = atom<"idle" | "saving" | "failed">("idle");

/** Xoá waits for the server; "failed" shows Chưa xoá được (spec §2.2). */
export const deleteStatusAtom = atom<"idle" | "deleting" | "failed">("idle");

const monthEntriesAtom = atom((get) => inMonth(get(entryListAtom), get(viewedMonthAtom)));

/** Chips after Tất cả: categories with entries this month, in grid order. */
export const filterChipsAtom = atom((get) =>
  categoriesUsed(
    get(monthEntriesAtom),
    CATEGORIES.map((c) => c.id),
  ),
);

const visibleEntriesAtom = atom((get) => {
  const filter = get(categoryFilterAtom);
  const entries = get(monthEntriesAtom);
  return filter ? entries.filter((e) => e.categoryId === filter) : entries;
});

export const daySectionsAtom = atom((get) => groupByDay(get(visibleEntriesAtom), moneyOf));

export const monthTotalsAtom = atom((get) => totals(get(visibleEntriesAtom), moneyOf));

/** No moving past the current month (spec §2.1). Read when the month changes. */
export const isCurrentMonthAtom = atom((get) => get(viewedMonthAtom) >= monthKey(now()));

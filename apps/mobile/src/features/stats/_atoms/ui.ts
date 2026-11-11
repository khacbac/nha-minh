import { atom } from "jotai";

import { moneyOf } from "@/features/categories/catalog";
import { entryListAtom } from "@/features/entries/_atoms/queries";
import { dayKey, monthKey, now } from "@/features/entries/day";
import { totals } from "@/features/entries/timeline";

import { averagePerDay, breakdown, inRange, spendByMonth } from "../breakdown";
import {
  type Range,
  type StatsMode,
  dayRange,
  daysElapsed,
  monthRange,
  yearRange,
} from "../period";

const today = now();

/** Tháng · Năm · Tuỳ chọn (spec §2.4). Set by `openStatsAtom` each time the screen opens. */
export const statsModeAtom = atom<StatsMode>("month");
export const statsMonthAtom = atom(monthKey(today));
export const statsYearAtom = atom(new Date(today).getFullYear());
export const statsFromAtom = atom(`${monthKey(today)}-01`);
export const statsToAtom = atom(dayKey(today));
/** The year bar showing its amount; a second tap opens that month. */
export const pickedBarAtom = atom<number | null>(null);

export const statsRangeAtom = atom((get): Range => {
  const mode = get(statsModeAtom);
  if (mode === "year") return yearRange(get(statsYearAtom));
  if (mode === "range") return dayRange(get(statsFromAtom), get(statsToAtom));
  return monthRange(get(statsMonthAtom));
});

const statsEntriesAtom = atom((get) => inRange(get(entryListAtom), get(statsRangeAtom)));

export const statsTotalsAtom = atom((get) => {
  const t = totals(get(statsEntriesAtom), moneyOf);
  return { ...t, perDay: averagePerDay(t.spent, daysElapsed(get(statsRangeAtom), now())) };
});

export const statsBreakdownAtom = atom((get) => breakdown(get(statsEntriesAtom), moneyOf));

export const yearBarsAtom = atom((get) =>
  spendByMonth(get(entryListAtom), get(statsYearAtom), moneyOf, now()),
);

/** ‹ › stop at the current month / year (spec §2.4). */
export const atCurrentPeriodAtom = atom((get) => {
  const at = now();
  return get(statsModeAtom) === "year"
    ? get(statsYearAtom) >= new Date(at).getFullYear()
    : get(statsMonthAtom) >= monthKey(at);
});

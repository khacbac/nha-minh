import { atom } from "jotai";

import { viewedMonthAtom } from "@/features/entries/_atoms/ui";
import { dayKey, monthKey, now, parseMonth, shiftMonth } from "@/features/entries/day";

import { type StatsMode, pickRangeEnd } from "../period";
import {
  pickedBarAtom,
  statsFromAtom,
  statsModeAtom,
  statsMonthAtom,
  statsToAtom,
  statsYearAtom,
} from "./ui";

/** Opens on the month viewed in Sổ; the custom range starts at this month so far (spec §2.4). */
export const openStatsAtom = atom(null, (get, set) => {
  const at = now();
  const viewed = get(viewedMonthAtom);
  set(statsModeAtom, "month");
  set(statsMonthAtom, viewed);
  set(statsYearAtom, parseMonth(viewed).year);
  set(statsFromAtom, `${monthKey(at)}-01`);
  set(statsToAtom, dayKey(at));
  set(pickedBarAtom, null);
});

export const setStatsModeAtom = atom(null, (_get, set, mode: StatsMode) => {
  set(statsModeAtom, mode);
  set(pickedBarAtom, null);
});

/** ‹ / › for Tháng and Năm; never past the current one. */
export const shiftStatsPeriodAtom = atom(null, (get, set, delta: -1 | 1) => {
  const at = now();
  if (get(statsModeAtom) === "year") {
    const next = get(statsYearAtom) + delta;
    if (next > new Date(at).getFullYear()) return;
    set(statsYearAtom, next);
    set(pickedBarAtom, null);
    return;
  }
  const next = shiftMonth(get(statsMonthAtom), delta);
  if (next > monthKey(at)) return;
  set(statsMonthAtom, next);
});

export const pickRangeEndAtom = atom(
  null,
  (get, set, { end, day }: { end: "from" | "to"; day: string }) => {
    const next = pickRangeEnd(
      { from: get(statsFromAtom), to: get(statsToAtom) },
      end,
      day,
      dayKey(now()),
    );
    set(statsFromAtom, next.from);
    set(statsToAtom, next.to);
  },
);

/** First tap shows the bar's amount; a second tap on it opens that month (spec §2.4). */
export const tapYearBarAtom = atom(null, (get, set, index: number) => {
  if (get(pickedBarAtom) !== index) {
    set(pickedBarAtom, index);
    return;
  }
  set(statsMonthAtom, `${get(statsYearAtom)}-${String(index + 1).padStart(2, "0")}`);
  set(statsModeAtom, "month");
  set(pickedBarAtom, null);
});

import type { CategoryId, Entry } from "@sonha/types";
import { atom } from "jotai";

import { moneyOf } from "@/features/categories/catalog";

import { monthKey, now, shiftMonth } from "../day";
import { type EntryDraft, draftToEntry, newEntryId } from "../draft";
import { entriesByIdAtom, entryAtomFamily } from "./queries";
import { categoryFilterAtom, viewedMonthAtom } from "./ui";

/** ‹ / ›: changes month, never past the current one, and clears the filter (spec §2.1). */
export const shiftMonthAtom = atom(null, (get, set, delta: -1 | 1) => {
  const next = shiftMonth(get(viewedMonthAtom), delta);
  if (next > monthKey(now())) return;
  set(viewedMonthAtom, next);
  set(categoryFilterAtom, null);
});

/** Tapping the chip that is already on goes back to Tất cả. */
export const toggleFilterAtom = atom(null, (get, set, id: CategoryId | null) => {
  set(categoryFilterAtom, get(categoryFilterAtom) === id ? null : id);
});

/**
 * Saves a draft as a new entry, or over `editingId`. Returns the stored entry, or null when the
 * draft is not valid (the Lưu button is disabled then, so this is a guard). A new entry moves
 * the journal to its month (spec §2.3).
 */
export const saveEntryAtom = atom(
  null,
  (get, set, { draft, editingId }: { draft: EntryDraft; editingId?: string }): Entry | null => {
    if (draft.categoryId === "") return null;
    const at = now();
    const existing = editingId ? get(entryAtomFamily(editingId)) : null;
    const entry = draftToEntry(draft, moneyOf(draft.categoryId), {
      id: existing?.id ?? newEntryId(at),
      createdAt: existing?.createdAt ?? at,
      updatedAt: at,
    });
    if (!entry) return null;
    set(entriesByIdAtom, (prev) => ({ ...prev, [entry.id]: entry }));
    if (!existing) {
      set(viewedMonthAtom, monthKey(entry.occurredAt));
      set(categoryFilterAtom, null);
    }
    return entry;
  },
);

export const deleteEntryAtom = atom(null, (_get, set, id: string) => {
  set(entriesByIdAtom, (prev) => {
    const { [id]: _removed, ...rest } = prev;
    return rest;
  });
});

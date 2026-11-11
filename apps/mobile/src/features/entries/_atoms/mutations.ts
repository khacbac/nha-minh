import type { CategoryId, Entry } from "@sonha/types";
import { atom } from "jotai";

import { moneyOf } from "@/features/categories/catalog";
import { apiClient } from "@/lib/api/api-client";

import { monthKey, now, shiftMonth } from "../day";
import { type EntryDraft, draftToEntry, newEntryId } from "../draft";
import { entriesByIdAtom, entriesSyncAtom, entryAtomFamily } from "./queries";
import { categoryFilterAtom, deleteStatusAtom, saveStatusAtom, viewedMonthAtom } from "./ui";

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
 * Loads the whole diary from the server (spec §3.3): at launch, on pull-to-refresh and when the
 * app comes back to the front. A failed reload keeps what is on screen (spec §2.1).
 */
export const loadEntriesAtom = atom(null, async (get, set) => {
  if (get(entriesSyncAtom).loading) return;
  set(entriesSyncAtom, (s) => ({ ...s, loading: true }));
  try {
    const entries = await apiClient.entries.list();
    set(entriesByIdAtom, Object.fromEntries(entries.map((e) => [e.id, e])));
    set(entriesSyncAtom, { loaded: true, loading: false, failed: false });
  } catch (err) {
    console.warn("[entries] load failed", err);
    set(entriesSyncAtom, (s) => ({ ...s, loading: false, failed: true }));
  }
});

/**
 * Saves a draft as a new entry, or over `editingId`, and waits for the server (spec §2.3).
 * Returns the stored entry, or null when the draft is not valid or the save failed; a failure
 * leaves `saveStatusAtom` at "failed" for the form to say so. A new entry moves the journal to
 * its month.
 */
export const saveEntryAtom = atom(
  null,
  async (
    get,
    set,
    { draft, editingId }: { draft: EntryDraft; editingId?: string },
  ): Promise<Entry | null> => {
    if (draft.categoryId === "" || get(saveStatusAtom) === "saving") return null;
    const at = now();
    const existing = editingId ? get(entryAtomFamily(editingId)) : null;
    const entry = draftToEntry(draft, moneyOf(draft.categoryId), {
      id: existing?.id ?? editingId ?? newEntryId(at),
      createdAt: existing?.createdAt ?? at,
      updatedAt: at,
    });
    if (!entry) return null;
    set(saveStatusAtom, "saving");
    let saved: Entry;
    try {
      saved = await apiClient.entries.put(entry);
    } catch (err) {
      console.warn("[entries] save failed", err);
      set(saveStatusAtom, "failed");
      return null;
    }
    set(entriesByIdAtom, (prev) => ({ ...prev, [saved.id]: saved }));
    set(saveStatusAtom, "idle");
    if (!existing) {
      set(viewedMonthAtom, monthKey(saved.occurredAt));
      set(categoryFilterAtom, null);
    }
    return saved;
  },
);

/** "Đóng" on the Chưa lưu được notice. */
export const dismissSaveErrorAtom = atom(null, (_get, set) => set(saveStatusAtom, "idle"));

/** Deletes on the server first, then here; true once gone (spec §2.2). */
export const deleteEntryAtom = atom(null, async (get, set, id: string): Promise<boolean> => {
  if (get(deleteStatusAtom) === "deleting") return false;
  set(deleteStatusAtom, "deleting");
  try {
    await apiClient.entries.remove(id);
  } catch (err) {
    console.warn("[entries] delete failed", err);
    set(deleteStatusAtom, "failed");
    return false;
  }
  set(entriesByIdAtom, (prev) => {
    const { [id]: _removed, ...rest } = prev;
    return rest;
  });
  set(deleteStatusAtom, "idle");
  return true;
});

/** "Đóng" on the Chưa xoá được notice. */
export const dismissDeleteErrorAtom = atom(null, (_get, set) => set(deleteStatusAtom, "idle"));

/** Signed out: nothing of the diary stays on the phone (spec §3.3). */
export const clearEntriesAtom = atom(null, (_get, set) => {
  set(entriesByIdAtom, {});
  set(entriesSyncAtom, { loaded: false, loading: false, failed: false });
  set(saveStatusAtom, "idle");
  set(deleteStatusAtom, "idle");
});

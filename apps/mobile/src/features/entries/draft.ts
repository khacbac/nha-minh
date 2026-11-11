import { type CategoryId, type Entry, type MoneyKind, entrySchema } from "@sonha/types";

import { parseAmount } from "./money";

/** What the form holds (spec §2.3). The amount is kept as typed digits. */
export type EntryDraft = {
  categoryId: CategoryId | "";
  title: string;
  amountDigits: string;
  note: string;
  occurredAt: number;
};

export function emptyDraft(at: number): EntryDraft {
  return { categoryId: "", title: "", amountDigits: "", note: "", occurredAt: at };
}

export function draftFromEntry(entry: Entry): EntryDraft {
  return {
    categoryId: entry.categoryId,
    title: entry.title,
    amountDigits: entry.amount === undefined ? "" : String(entry.amount),
    note: entry.note ?? "",
    occurredAt: entry.occurredAt,
  };
}

/** Lưu is enabled once there is a category and a title (spec §2.3). */
export function isDraftReady(draft: Pick<EntryDraft, "categoryId" | "title">): boolean {
  return draft.categoryId !== "" && draft.title.trim().length > 0;
}

/** Anything typed or picked since the form opened: ✕ then asks first (spec §2.3). */
export function isDraftDirty(draft: EntryDraft, initial: EntryDraft): boolean {
  return (
    draft.categoryId !== initial.categoryId ||
    draft.title.trim() !== initial.title.trim() ||
    parseAmount(draft.amountDigits) !== parseAmount(initial.amountDigits) ||
    draft.note.trim() !== initial.note.trim() ||
    draft.occurredAt !== initial.occurredAt
  );
}

/**
 * The title after picking a category: the new category's first suggestion when the title is
 * empty or still one of the old category's suggestions; otherwise what the parent typed stays
 * (spec §2.3).
 */
export function titleAfterPick(
  currentTitle: string,
  previousTitles: readonly string[],
  nextTitles: readonly string[],
): string {
  const title = currentTitle.trim();
  if (title === "" || previousTitles.includes(title)) return nextTitles[0] ?? currentTitle;
  return currentTitle;
}

/**
 * Draft → the entry to store, or null when the draft is not valid. The amount is dropped for a
 * category with no money; an empty note is not stored (spec §3.2).
 */
export function draftToEntry(
  draft: EntryDraft,
  money: MoneyKind,
  meta: { id: string; createdAt: number; updatedAt: number },
): Entry | null {
  if (draft.categoryId === "") return null;
  const amount = money === "none" ? undefined : parseAmount(draft.amountDigits);
  const note = draft.note.trim();
  const parsed = entrySchema.safeParse({
    id: meta.id,
    categoryId: draft.categoryId,
    title: draft.title.trim(),
    occurredAt: draft.occurredAt,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    ...(amount === undefined ? {} : { amount }),
    ...(note === "" ? {} : { note }),
  });
  return parsed.success ? parsed.data : null;
}

/** Ids only need to be unique on this phone (spec §3.2). */
export function newEntryId(at: number, random: () => number = Math.random): string {
  return `${at.toString(36)}-${Math.floor(random() * 36 ** 6)
    .toString(36)
    .padStart(6, "0")}`;
}

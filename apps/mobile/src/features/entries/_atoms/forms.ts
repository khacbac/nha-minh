import type { CategoryId } from "@sonha/types";
import { fieldAtom, formAtom } from "form-atoms";
import { zodValidate } from "form-atoms/zod";
import { atom } from "jotai";
import { z } from "zod";

import { categoryOf } from "@/features/categories/catalog";
import { t } from "@/lib/i18n";

import { type EntryDraft, titleAfterPick } from "../draft";
import { addToDigits, toDigits } from "../money";

const VALIDATE = { on: "change", when: "touched" } as const;

/**
 * The entry form, shared by Ghi mới and Sửa (spec §2.3). A factory rather than one module atom
 * so each visit starts from its own draft: empty for a new entry, the saved one for an edit.
 */
export function createEntryForm(initial: EntryDraft) {
  const fields = {
    categoryId: fieldAtom<CategoryId | "">({ name: "categoryId", value: initial.categoryId }),
    title: fieldAtom({
      name: "title",
      value: initial.title,
      validate: zodValidate(
        z.string().trim().min(1, t("entry.titleRequired")).max(120, t("entry.titleTooLong")),
        VALIDATE,
      ),
    }),
    amountDigits: fieldAtom({ name: "amountDigits", value: initial.amountDigits }),
    note: fieldAtom({
      name: "note",
      value: initial.note,
      validate: zodValidate(z.string().max(2000, t("entry.noteTooLong")), VALIDATE),
    }),
    occurredAt: fieldAtom({ name: "occurredAt", value: initial.occurredAt }),
  };

  /** Picks a category and fills the title from it when the title is not the parent's own. */
  const pickCategoryAtom = atom(null, (get, set, next: CategoryId) => {
    const previous = get(get(fields.categoryId).value);
    const title = get(get(fields.title).value);
    const previousTitles = previous === "" ? [] : categoryOf(previous).titles;
    set(get(fields.categoryId).value, next);
    set(get(fields.title).value, titleAfterPick(title, previousTitles, categoryOf(next).titles));
    set(get(fields.title).validate, "change");
  });

  /** A suggestion chip replaces the title. */
  const pickTitleAtom = atom(null, (get, set, title: string) => {
    set(get(fields.title).value, title);
    set(get(fields.title).touched, true);
    set(get(fields.title).validate, "change");
  });

  const typeAmountAtom = atom(null, (get, set, text: string) => {
    set(get(fields.amountDigits).value, toDigits(text));
  });

  const addAmountAtom = atom(null, (get, set, add: number) => {
    set(get(fields.amountDigits).value, addToDigits(get(get(fields.amountDigits).value), add));
  });

  return {
    form: formAtom(fields),
    fields,
    pickCategoryAtom,
    pickTitleAtom,
    typeAmountAtom,
    addAmountAtom,
  };
}

export type EntryForm = ReturnType<typeof createEntryForm>;

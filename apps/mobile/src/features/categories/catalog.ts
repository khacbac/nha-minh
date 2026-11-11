import type { CategoryId, MoneyKind } from "@sonha/types";

import type { semantic } from "@/lib/theme/tokens";

import { categories as data } from "./category-data";

export type TintKey = keyof typeof semantic.tint;

export type Category = {
  id: CategoryId;
  name: string;
  /** A key of `lib/theme/icons.js`. */
  icon: string;
  tint: TintKey;
  money: MoneyKind;
  /** Suggested titles; the first one is filled in when the category is picked (spec §2.3). */
  titles: readonly string[];
};

/** The 16 categories in grid order (spec §3.1). */
export const CATEGORIES = data as readonly Category[];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

const FALLBACK = CATEGORIES[CATEGORIES.length - 1] as Category;

/** A stored id always has a category; a missing one (should not happen) reads as "Khác". */
export function categoryOf(id: CategoryId): Category {
  return BY_ID.get(id) ?? FALLBACK;
}

export function moneyOf(id: CategoryId): MoneyKind {
  return categoryOf(id).money;
}

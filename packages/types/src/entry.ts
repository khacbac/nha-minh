import { z } from "zod";

/**
 * Category ids are permanent: they are stored in every entry. Add new ids at the end; never
 * rename or reuse one (spec §3.1). The names, icons and suggested titles live in the app's
 * catalog (`features/categories/category-data.js`).
 */
export const CATEGORY_IDS = [
  "market",
  "food",
  "bills",
  "transport",
  "kids",
  "spiritual",
  "occasions",
  "health",
  "shopping",
  "home",
  "family",
  "pets",
  "chores",
  "moments",
  "income",
  "other",
] as const;

export const categoryIdSchema = z.enum(CATEGORY_IDS);
export type CategoryId = z.infer<typeof categoryIdSchema>;

/** Whether a category asks for an amount, and which way the money goes (spec §3.1). */
export const moneyKindSchema = z.enum(["expense", "income", "none"]);
export type MoneyKind = z.infer<typeof moneyKindSchema>;

/** Largest amount accepted, in đồng: 999 tỷ (spec §2.3). */
export const MAX_AMOUNT = 999_999_999_999;

/** One diary line (spec §3.2). Times are epoch milliseconds. */
export const entrySchema = z.object({
  id: z.string().min(1),
  categoryId: categoryIdSchema,
  title: z.string().trim().min(1).max(120),
  /** Free text; absent when empty. */
  note: z.string().max(2000).optional(),
  /** Whole đồng, > 0; absent when not entered or when the category has no amount. */
  amount: z.number().int().positive().max(MAX_AMOUNT).optional(),
  /** When it happened, picked in the form; defaults to the moment the form opens. */
  occurredAt: z.number().int(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});
export type Entry = z.infer<typeof entrySchema>;

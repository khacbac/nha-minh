import { type Entry, entrySchema } from "@sonha/types";
import { z } from "zod";

/** One `public.entries` row as PostgREST returns it (supabase/migrations). */
const entryRowSchema = z.object({
  user_id: z.string(),
  id: z.string(),
  category_id: z.string(),
  title: z.string(),
  note: z.string().nullable(),
  amount: z.number().nullable(),
  occurred_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
type EntryRow = z.infer<typeof entryRowSchema>;

export function entryToRow(userId: string, entry: Entry): EntryRow {
  return {
    user_id: userId,
    id: entry.id,
    category_id: entry.categoryId,
    title: entry.title,
    note: entry.note ?? null,
    amount: entry.amount ?? null,
    occurred_at: new Date(entry.occurredAt).toISOString(),
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: new Date(entry.updatedAt).toISOString(),
  };
}

/**
 * A row back into an entry, or null when it no longer passes `entrySchema` (a category id this
 * build doesn't know, a hand-edited row). The caller skips it (spec mvp.md §3.3).
 */
export function rowToEntry(raw: unknown): Entry | null {
  const row = entryRowSchema.safeParse(raw);
  if (!row.success) return null;
  const r = row.data;
  const entry = entrySchema.safeParse({
    id: r.id,
    categoryId: r.category_id,
    title: r.title,
    occurredAt: Date.parse(r.occurred_at),
    createdAt: Date.parse(r.created_at),
    updatedAt: Date.parse(r.updated_at),
    ...(r.note === null ? {} : { note: r.note }),
    ...(r.amount === null ? {} : { amount: r.amount }),
  });
  return entry.success ? entry.data : null;
}

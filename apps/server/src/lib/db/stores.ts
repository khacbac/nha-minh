import type { Entry } from "@sonha/types";
import { type SupabaseClient, isAuthRetryableFetchError } from "@supabase/supabase-js";

import { entryToRow, rowToEntry } from "./entry-row.js";

/** The signed-in family account, from a verified access token. */
export type Account = { userId: string };

/**
 * Accounts and diaries behind interfaces, so the routes are tested without a database. Every
 * method throws when the database can't answer: a failed read is never "nothing there".
 */
export interface AccountStore {
  /** The account behind an access token; null when the token isn't valid (bad, expired, deleted). */
  verify(accessToken: string): Promise<Account | null>;
}

export interface EntryStore {
  /** The account's whole diary; rows that no longer read as an entry are left out. */
  list(userId: string): Promise<Entry[]>;
  /** Adds the entry or replaces the one with its id: the last save wins (spec mvp.md §3.3). */
  put(userId: string, entry: Entry): Promise<Entry>;
  /** Deleting an id that is already gone is not an error. */
  remove(userId: string, id: string): Promise<void>;
}

export function createSupabaseStores(db: SupabaseClient): {
  accounts: AccountStore;
  entries: EntryStore;
} {
  return {
    accounts: {
      async verify(accessToken) {
        // Asks Auth rather than only checking the signature: a deleted account or a changed
        // password stops the token at once (spec mvp.md §2.0).
        const { data, error } = await db.auth.getUser(accessToken);
        if (error) {
          if (isAuthRetryableFetchError(error) || (error.status ?? 0) >= 500) throw error;
          return null;
        }
        return { userId: data.user.id };
      },
    },
    entries: {
      async list(userId) {
        const { data, error } = await db
          .from("entries")
          .select("user_id,id,category_id,title,note,amount,occurred_at,created_at,updated_at")
          .eq("user_id", userId)
          .order("occurred_at", { ascending: false })
          // PostgREST caps a response at max_rows (1000) otherwise; a family diary stays far
          // below this for years.
          .range(0, 49_999);
        if (error) throw error;
        return (data ?? []).flatMap((row) => rowToEntry(row) ?? []);
      },
      async put(userId, entry) {
        const { error } = await db
          .from("entries")
          .upsert({ ...entryToRow(userId, entry), saved_at: new Date().toISOString() });
        if (error) throw error;
        return entry;
      },
      async remove(userId, id) {
        const { error } = await db.from("entries").delete().eq("user_id", userId).eq("id", id);
        if (error) throw error;
      },
    },
  };
}

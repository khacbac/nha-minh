import {
  type Entry,
  entryListResponseSchema,
  entryResponseSchema,
  entrySchema,
} from "@sonha/types";

import { supabase } from "@/lib/supabase";

import { http } from "./http-client";

/** Network surface over apps/server and Supabase Auth. Screens and atoms never call `fetch`. */
export const apiClient = {
  auth: {
    /** The family account made beforehand; the app has no sign-up (spec §2.0). */
    signInWithPassword(email: string, password: string) {
      return supabase.auth.signInWithPassword({ email, password });
    },
  },
  entries: {
    /** The whole diary. A row that fails the schema is skipped, never thrown (spec §3.3). */
    async list(): Promise<Entry[]> {
      const { entries } = entryListResponseSchema.parse(await http.get<unknown>("/entries"));
      return entries.flatMap((raw) => {
        const parsed = entrySchema.safeParse(raw);
        return parsed.success ? [parsed.data] : [];
      });
    },
    /** New or edited: the last save wins (spec §3.3). */
    async put(entry: Entry): Promise<Entry> {
      const body = await http.put<unknown>(`/entries/${encodeURIComponent(entry.id)}`, entry);
      return entryResponseSchema.parse(body).entry;
    },
    async remove(id: string): Promise<void> {
      await http.delete<void>(`/entries/${encodeURIComponent(id)}`);
    },
  },
};

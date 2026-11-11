import { type Entry, entrySchema } from "@sonha/types";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { MMKV } from "react-native-mmkv";

import { createAtomWithMMKV } from "@/lib/jotai/atom-with-mmkv";

import { sortNewestFirst } from "../timeline";

const atomWithMMKV = createAtomWithMMKV(new MMKV({ id: "entries" }));

/**
 * Every entry on the phone, by id (spec §3.3). Written only by the mutations; read through
 * `entryListAtom` / `entryAtomFamily`, which drop rows that fail the schema.
 */
export const entriesByIdAtom = atomWithMMKV<Record<string, unknown>>("by-id", {});

/** Valid entries, newest first. A broken row is skipped, never thrown (spec §3.3). */
export const entryListAtom = atom((get): Entry[] => {
  const valid: Entry[] = [];
  for (const raw of Object.values(get(entriesByIdAtom))) {
    const parsed = entrySchema.safeParse(raw);
    if (parsed.success) valid.push(parsed.data);
  }
  return sortNewestFirst(valid);
});

/** One entry for the detail and edit screens; null once it is deleted (spec §2.2). */
export const entryAtomFamily = atomFamily((id: string) =>
  atom((get): Entry | null => {
    const parsed = entrySchema.safeParse(get(entriesByIdAtom)[id]);
    return parsed.success ? parsed.data : null;
  }),
);

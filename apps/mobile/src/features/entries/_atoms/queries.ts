import type { Entry } from "@sonha/types";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";

import { sortNewestFirst } from "../timeline";

/**
 * The family diary as the server last sent it, by id (spec §3.3). Held in memory only: every
 * launch loads it again. Written only by the mutations, with rows already checked by the API
 * client.
 */
export const entriesByIdAtom = atom<Record<string, Entry>>({});

/**
 * `loaded` once a load has succeeded; `failed` when the last load did not reach the server.
 * Sổ shows Đang tải / Không tải được only while nothing has loaded yet (spec §2.1).
 */
export const entriesSyncAtom = atom<{ loaded: boolean; loading: boolean; failed: boolean }>({
  loaded: false,
  loading: false,
  failed: false,
});

/** Newest first. */
export const entryListAtom = atom((get): Entry[] =>
  sortNewestFirst(Object.values(get(entriesByIdAtom))),
);

/** One entry for the detail and edit screens; null once it is deleted (spec §2.2). */
export const entryAtomFamily = atomFamily((id: string) =>
  atom((get): Entry | null => get(entriesByIdAtom)[id] ?? null),
);

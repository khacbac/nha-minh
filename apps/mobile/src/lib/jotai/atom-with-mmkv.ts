import type { WritableAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { MMKV } from "react-native-mmkv";

type SyncSetter<T> = T | ((prev: T) => T);

// MMKV is fully synchronous; we cast the atom's read/write types so callers
// don't have to deal with the `T | Promise<T>` union that atomWithStorage
// returns when it can't statically tell the storage is sync.
export function createAtomWithMMKV(mmkv: MMKV) {
  const storage = {
    getItem: (key: string) => mmkv.getString(key) ?? null,
    setItem: (key: string, value: string) => mmkv.set(key, value),
    removeItem: (key: string) => mmkv.delete(key),
  };
  const jsonStorage = createJSONStorage<unknown>(() => storage);

  return function atomWithMMKV<T>(key: string, initial: T): WritableAtom<T, [SyncSetter<T>], void> {
    // `getOnInit` reads the stored value when the atom is created. Without it
    // jotai only loads storage in `onMount`, i.e. inside the subscribing
    // component's effect — so the first render, AND any effect registered after
    // that subscription in the same commit, sees `initial` instead of what the
    // user saved. A `get()` from a write-only atom (which never mounts) reads
    // `initial` forever. MMKV is synchronous, so reading at creation is safe.
    return atomWithStorage<T>(key, initial, jsonStorage as never, {
      getOnInit: true,
    }) as WritableAtom<T, [SyncSetter<T>], void>;
  };
}

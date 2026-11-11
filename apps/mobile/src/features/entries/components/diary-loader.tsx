import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { AppState } from "react-native";

import { loadEntriesAtom } from "../_atoms/mutations";

/** Loads the diary when Sổ mounts and each time the app comes back to the front (spec §2.1). */
export function DiaryLoader() {
  const load = useSetAtom(loadEntriesAtom);
  useEffect(() => {
    void load();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void load();
    });
    return () => sub.remove();
  }, [load]);
  return null;
}

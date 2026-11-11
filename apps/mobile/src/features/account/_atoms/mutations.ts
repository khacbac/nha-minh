import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { atom } from "jotai";

import { clearEntriesAtom } from "@/features/entries/_atoms/mutations";
import { apiClient } from "@/lib/api/api-client";
import { supabase } from "@/lib/supabase";

import { canSignIn, signInFailure } from "../sign-in";
import { signInFields } from "./forms";
import { signInStatusAtom } from "./ui";

/** Đăng nhập: the auth listener then opens Sổ (spec §2.0). */
export const signInAtom = atom(null, async (get, set) => {
  const email = get(get(signInFields.email).value).trim().toLowerCase();
  const password = get(get(signInFields.password).value);
  if (!canSignIn(email, password) || get(signInStatusAtom).state === "busy") return;
  set(signInStatusAtom, { state: "busy" });
  try {
    const { error } = await apiClient.auth.signInWithPassword(email, password);
    if (error) {
      set(
        signInStatusAtom,
        signInFailure({ status: error.status, retryable: isAuthRetryableFetchError(error) }),
      );
      return;
    }
    set(get(signInFields.password).value, "");
    set(signInStatusAtom, { state: "idle" });
  } catch {
    set(signInStatusAtom, { state: "offline" });
  }
});

/** The diary is only ever held in memory for the signed-in account (spec §3.3). */
export const clearAccountDataAtom = atom(null, (_get, set) => {
  set(clearEntriesAtom);
});

/** The server stopped accepting the sign-in: back to Đăng nhập (spec §2.0). */
export const signOutAtom = atom(null, async (_get, set) => {
  // Local: the other phones on the family account stay signed in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.warn("[account] sign out failed", error.message);
  set(clearAccountDataAtom);
});

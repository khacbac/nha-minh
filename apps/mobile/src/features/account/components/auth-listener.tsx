import { type Session, isAuthApiError } from "@supabase/supabase-js";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { setUnauthorizedHandler } from "@/lib/api/http-client";
import { supabase } from "@/lib/supabase";

import { clearAccountDataAtom, signOutAtom } from "../_atoms/mutations";
import { authHydratedAtom, authSessionAtom } from "../_atoms/session";

/** Keeps `authSessionAtom` in step with Supabase (spec §2.0). Mounted once at the root. */
export function AuthListener() {
  const setSession = useSetAtom(authSessionAtom);
  const setHydrated = useSetAtom(authHydratedAtom);
  const signOut = useSetAtom(signOutAtom);
  const clearAccountData = useSetAtom(clearAccountDataAtom);

  useEffect(() => {
    let cancelled = false;
    setUnauthorizedHandler(() => void signOut());

    (async () => {
      const { data } = await supabase.auth.getSession();
      // The stored session may be dead (password changed, account deleted): ask Auth before
      // trusting it. Offline keeps it; the server checks again on the first request.
      if (data.session) {
        const { error } = await supabase.auth.getUser();
        if (cancelled) return;
        if (error && isAuthApiError(error)) {
          await signOut();
          setHydrated(true);
          return;
        }
      }
      if (cancelled) return;
      setSession(data.session);
      setHydrated(true);
    })();

    const { data } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      setSession(session);
      // Also when the refresh token stopped working, not only after signOut().
      if (event === "SIGNED_OUT") clearAccountData();
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
      setUnauthorizedHandler(null);
    };
  }, [setSession, setHydrated, signOut, clearAccountData]);

  return null;
}

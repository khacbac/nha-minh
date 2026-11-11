import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import { MMKV } from "react-native-mmkv";

import { reachableInDev } from "./api/dev-host";

const storage = new MMKV({ id: "auth" });

/**
 * Sign-in to the family account (spec §2.0). Only the session sits on the phone, in MMKV; the
 * diary itself lives on the server (spec §3.3).
 */
export const supabase = createClient(
  reachableInDev(process.env.EXPO_PUBLIC_SUPABASE_URL ?? ""),
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      storage: {
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
      autoRefreshToken: true,
      persistSession: true,
      // No URL bar in React Native; sign-in is by password only.
      detectSessionInUrl: false,
    },
  },
);

// Refresh the token only while the app is in front, as Supabase advises for React Native.
AppState.addEventListener("change", (state) => {
  if (state === "active") supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

/** The current access token, refreshed first if it is about to expire; null when signed out. */
export async function accessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

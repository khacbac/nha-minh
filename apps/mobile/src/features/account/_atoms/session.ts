import type { Session } from "@supabase/supabase-js";
import { atom } from "jotai";

/** The Supabase session of the family account (spec §2.0); null when signed out. */
export const authSessionAtom = atom<Session | null>(null);

/** False until the stored session has been read at launch. */
export const authHydratedAtom = atom(false);

export const signedInAtom = atom((get) => get(authSessionAtom) !== null);

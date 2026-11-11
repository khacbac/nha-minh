import { atom } from "jotai";

import type { SignInStatus } from "../sign-in";

export const signInStatusAtom = atom<SignInStatus>({ state: "idle" });

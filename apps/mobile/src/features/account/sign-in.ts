/** What the Đăng nhập button and the line under it show (spec §2.0). */
export type SignInStatus =
  | { state: "idle" }
  | { state: "busy" }
  | { state: "wrong" }
  | { state: "offline" }
  | { state: "tooMany" };

/** Loose on purpose: Supabase Auth checks the address; this only gates the button (spec §2.0). */
export function looksLikeEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export function canSignIn(email: string, password: string): boolean {
  return looksLikeEmail(email) && password.length > 0;
}

/** A failed Supabase sign-in, reduced to what the screen says (spec §2.0). */
export function signInFailure(error: {
  status?: number | undefined;
  /** The fetch never reached Auth, or Auth answered 5xx. */
  retryable: boolean;
}): SignInStatus {
  if (error.status === 429) return { state: "tooMany" };
  if (error.retryable || !error.status || error.status >= 500) return { state: "offline" };
  return { state: "wrong" };
}

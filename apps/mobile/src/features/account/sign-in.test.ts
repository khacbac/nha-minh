import { describe, expect, it } from "vitest";

import { canSignIn, looksLikeEmail, signInFailure } from "./sign-in";

describe("sign-in rules", () => {
  it("gates the button on an email-like address and a password", () => {
    expect(looksLikeEmail(" nha@example.com ")).toBe(true);
    expect(looksLikeEmail("nha@example")).toBe(false);
    expect(looksLikeEmail("nha example.com")).toBe(false);
    expect(canSignIn("nha@example.com", "")).toBe(false);
    expect(canSignIn("nha@example.com", "x")).toBe(true);
  });

  it("tells a wrong password from no network and too many tries", () => {
    expect(signInFailure({ status: 400, retryable: false })).toEqual({ state: "wrong" });
    expect(signInFailure({ status: 429, retryable: false })).toEqual({ state: "tooMany" });
    expect(signInFailure({ status: 0, retryable: true })).toEqual({ state: "offline" });
    expect(signInFailure({ retryable: false })).toEqual({ state: "offline" });
    expect(signInFailure({ status: 503, retryable: false })).toEqual({ state: "offline" });
  });
});

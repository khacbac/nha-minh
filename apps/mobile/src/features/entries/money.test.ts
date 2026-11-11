import { MAX_AMOUNT } from "@sonha/types";
import { describe, expect, it } from "vitest";

import {
  addToDigits,
  displayDigits,
  formatAmount,
  formatVnd,
  parseAmount,
  quickLabel,
  toDigits,
} from "./money";

describe("formatAmount", () => {
  it("groups thousands with dots", () => {
    expect(formatAmount(0)).toBe("0");
    expect(formatAmount(999)).toBe("999");
    expect(formatAmount(1000)).toBe("1.000");
    expect(formatAmount(1_250_000)).toBe("1.250.000");
    expect(formatVnd(185_000)).toBe("185.000 ₫");
  });
});

describe("toDigits / parseAmount", () => {
  it("keeps digits only and drops leading zeros", () => {
    expect(toDigits("1.250.000")).toBe("1250000");
    expect(toDigits("00120")).toBe("120");
    expect(toDigits("abc")).toBe("");
    expect(toDigits("0")).toBe("");
  });

  it("caps at the maximum amount", () => {
    expect(toDigits("9999999999999999")).toBe(String(MAX_AMOUNT));
  });

  it("treats empty and zero as no amount", () => {
    expect(parseAmount("")).toBeUndefined();
    expect(parseAmount("000")).toBeUndefined();
    expect(parseAmount("185000")).toBe(185_000);
  });

  it("shows the field value with separators", () => {
    expect(displayDigits("")).toBe("");
    expect(displayDigits("185000")).toBe("185.000");
  });
});

describe("quick chips", () => {
  it("adds to the current amount", () => {
    expect(addToDigits("", 50_000)).toBe("50000");
    expect(addToDigits("185000", 10_000)).toBe("195000");
    expect(addToDigits(String(MAX_AMOUNT), 10_000)).toBe(String(MAX_AMOUNT));
  });

  it("labels in K and M", () => {
    expect(quickLabel(10_000)).toBe("+10K");
    expect(quickLabel(500_000)).toBe("+500K");
    expect(quickLabel(1_000_000)).toBe("+1M");
  });
});

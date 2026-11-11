import { MAX_AMOUNT } from "@sonha/types";

const MAX_DIGITS = String(MAX_AMOUNT).length;

/** 1250000 → "1.250.000" (Vietnamese grouping, spec §2.3). */
export function formatAmount(amount: number): string {
  return String(Math.trunc(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 1250000 → "1.250.000 ₫". */
export function formatVnd(amount: number): string {
  return `${formatAmount(amount)} ₫`;
}

/**
 * Whatever the amount field holds → the digits it stands for: separators and other characters
 * dropped, no leading zeros, at most the digits of MAX_AMOUNT and never above it.
 */
export function toDigits(text: string): string {
  const digits = text.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS);
  if (digits === "") return "";
  return Number(digits) > MAX_AMOUNT ? String(MAX_AMOUNT) : digits;
}

/** Digits → the amount to store; empty or zero means no amount (spec §3.2). */
export function parseAmount(digits: string): number | undefined {
  const value = Number(toDigits(digits));
  return value > 0 ? value : undefined;
}

/** Digits → what the field shows: "1.250.000", or "" when empty. */
export function displayDigits(digits: string): string {
  const value = parseAmount(digits);
  return value === undefined ? "" : formatAmount(value);
}

/** A quick chip (+50K…) adds to what is there, capped at MAX_AMOUNT (spec §2.3). */
export function addToDigits(digits: string, add: number): string {
  const sum = Math.min((parseAmount(digits) ?? 0) + add, MAX_AMOUNT);
  return String(sum);
}

/** The quick chips under the amount field, in đồng (spec §2.3). */
export const QUICK_AMOUNTS = [10_000, 20_000, 50_000, 100_000, 200_000, 500_000] as const;

/** 50000 → "+50K", 1000000 → "+1M". */
export function quickLabel(amount: number): string {
  return amount >= 1_000_000 ? `+${amount / 1_000_000}M` : `+${amount / 1_000}K`;
}

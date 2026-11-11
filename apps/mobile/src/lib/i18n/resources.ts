import { vi } from "./locales";

/** Vietnamese only in the MVP (spec §1); a second language adds a file here. */
export const resources = {
  vi: { translation: vi },
} as const;

export type Locale = keyof typeof resources;
export const DEFAULT_LOCALE: Locale = "vi";

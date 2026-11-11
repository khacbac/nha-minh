import { z } from "zod";

import { entrySchema } from "./entry.js";

/** `code` of an error body from the server: `{ status, code, message, details? }`. */
export const API_ERROR_CODES = {
  unauthorized: "UNAUTHORIZED",
  validation: "VALIDATION_ERROR",
  rateLimited: "RATE_LIMITED",
  internal: "INTERNAL_ERROR",
} as const;

/**
 * `GET /entries`: the whole diary of the account (spec §3.3). Rows stay `unknown` here: the app
 * checks each one with `entrySchema` and skips a broken row instead of failing the whole list.
 */
export const entryListResponseSchema = z.object({ entries: z.array(z.unknown()) });
export type EntryListResponse = z.infer<typeof entryListResponseSchema>;

/** `PUT /entries/:id` takes the whole entry (new or edited) and returns it as stored. */
export const entryResponseSchema = z.object({ entry: entrySchema });
export type EntryResponse = z.infer<typeof entryResponseSchema>;

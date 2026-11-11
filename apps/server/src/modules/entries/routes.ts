import {
  API_ERROR_CODES,
  type EntryListResponse,
  type EntryResponse,
  entrySchema,
} from "@sonha/types";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { AppError } from "../../lib/errors.js";

const idParams = z.object({ id: z.string().min(1).max(64) });

const storeFailed = (what: string) => (err: unknown) => {
  throw new AppError(API_ERROR_CODES.internal, 500, `Couldn't ${what}`, err);
};

/** The family diary (spec mvp.md §3.3): read it all, save one entry, delete one. */
export async function entryRoutes(fastify: FastifyInstance) {
  fastify.get("/entries", { preHandler: fastify.authenticate }, async (request) => {
    const entries = await fastify.entries
      .list(request.account.userId)
      .catch(storeFailed("read the diary"));
    return { entries } satisfies EntryListResponse;
  });

  fastify.put("/entries/:id", { preHandler: fastify.authenticate }, async (request) => {
    const { id } = idParams.parse(request.params);
    const entry = entrySchema.parse(request.body);
    if (entry.id !== id) {
      throw new AppError(API_ERROR_CODES.validation, 400, "The body's id is not the path's id");
    }
    const saved = await fastify.entries
      .put(request.account.userId, entry)
      .catch(storeFailed("save the entry"));
    return { entry: saved } satisfies EntryResponse;
  });

  fastify.delete("/entries/:id", { preHandler: fastify.authenticate }, async (request, reply) => {
    const { id } = idParams.parse(request.params);
    await fastify.entries.remove(request.account.userId, id).catch(storeFailed("delete the entry"));
    return reply.status(204).send();
  });
}

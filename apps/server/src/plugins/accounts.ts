import { API_ERROR_CODES } from "@sonha/types";
import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import type { Account, AccountStore, EntryStore } from "../lib/db/stores.js";
import { AppError } from "../lib/errors.js";

declare module "fastify" {
  interface FastifyInstance {
    /** The diaries in Supabase (spec mvp.md §3.3). */
    entries: EntryStore;
    /** preHandler: a valid `Authorization: Bearer <Supabase access token>`, or `UNAUTHORIZED`. */
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
  interface FastifyRequest {
    /** Set by `authenticate`. */
    account: Account;
  }
}

async function accounts(
  fastify: FastifyInstance,
  opts: { accounts: AccountStore; entries: EntryStore },
) {
  fastify.decorate("entries", opts.entries);
  fastify.decorateRequest("account", null as unknown as Account);
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
    const account = token
      ? await opts.accounts.verify(token).catch((err: unknown) => {
          throw new AppError(API_ERROR_CODES.internal, 500, "Couldn't check the sign-in", err);
        })
      : null;
    if (!account) throw new AppError(API_ERROR_CODES.unauthorized, 401, "Sign in again");
    request.account = account;
  });
}

export const accountsPlugin = fp(accounts, { name: "accounts" });

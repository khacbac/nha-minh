import rateLimit from "@fastify/rate-limit";
import { API_ERROR_CODES } from "@sonha/types";
import { createClient } from "@supabase/supabase-js";
import Fastify from "fastify";

import type { Env } from "./config.js";
import { type AccountStore, type EntryStore, createSupabaseStores } from "./lib/db/stores.js";
import { errorHandlerPlugin } from "./lib/errors.js";
import { entryRoutes } from "./modules/entries/routes.js";
import { healthRoutes } from "./modules/health/routes.js";
import { accountsPlugin } from "./plugins/accounts.js";

export type Stores = { accounts: AccountStore; entries: EntryStore };

function supabaseStores(config: Env): Stores {
  const db = createClient(config.SUPABASE_URL, config.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  return createSupabaseStores(db);
}

/** `stores` replaces Supabase in tests. */
export async function buildApp(config: Env, stores: Stores = supabaseStores(config)) {
  const app = Fastify({
    // Railway terminates TLS in front of us; without this every caller shares one rate bucket.
    trustProxy: true,
    logger:
      config.NODE_ENV === "test"
        ? false
        : {
            level: config.LOG_LEVEL,
            ...(config.NODE_ENV === "development" && { transport: { target: "pino-pretty" } }),
          },
  });

  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: "1 minute",
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      code: API_ERROR_CODES.rateLimited,
      message: `Too many requests — limit is ${context.max} per minute. Retry in ${context.after}.`,
    }),
  });
  await app.register(accountsPlugin, stores);
  await app.register(errorHandlerPlugin);

  await app.register(healthRoutes);
  await app.register(entryRoutes);

  app.log.info({ supabase: config.SUPABASE_URL }, "nha-minh server");
  return app;
}

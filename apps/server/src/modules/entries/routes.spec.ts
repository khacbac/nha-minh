import type { Entry } from "@sonha/types";
import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { type Stores, buildApp } from "../../app.js";
import type { Env } from "../../config.js";

const config: Env = {
  NODE_ENV: "test",
  PORT: 0,
  HOST: "127.0.0.1",
  LOG_LEVEL: "fatal",
  RATE_LIMIT_MAX: 1000,
  SUPABASE_URL: "http://127.0.0.1:1",
  SUPABASE_SECRET_KEY: "unused",
};

const entry: Entry = {
  id: "mhs1-abc123",
  categoryId: "market",
  title: "Đi chợ",
  amount: 185_000,
  occurredAt: 1_793_000_000_000,
  createdAt: 1_793_000_000_000,
  updatedAt: 1_793_000_000_000,
};

/** Token "family" is one account, "other" another; anything else is not signed in. */
function memoryStores(): Stores & { failing: boolean } {
  const diaries = new Map<string, Map<string, Entry>>();
  const diary = (userId: string) => {
    const d = diaries.get(userId) ?? new Map<string, Entry>();
    diaries.set(userId, d);
    return d;
  };
  const stores = {
    failing: false,
    accounts: {
      async verify(token: string) {
        if (stores.failing) throw new Error("auth down");
        return token === "family" || token === "other" ? { userId: token } : null;
      },
    },
    entries: {
      async list(userId: string) {
        if (stores.failing) throw new Error("db down");
        return [...diary(userId).values()];
      },
      async put(userId: string, e: Entry) {
        if (stores.failing) throw new Error("db down");
        diary(userId).set(e.id, e);
        return e;
      },
      async remove(userId: string, id: string) {
        if (stores.failing) throw new Error("db down");
        diary(userId).delete(id);
      },
    },
  };
  return stores;
}

describe("entry routes", () => {
  let app: FastifyInstance;
  let stores: ReturnType<typeof memoryStores>;
  const as = (token: string) => ({ authorization: `Bearer ${token}` });

  beforeEach(async () => {
    stores = memoryStores();
    app = await buildApp(config, stores);
  });
  afterEach(() => app.close());

  it("refuses a request without a valid sign-in", async () => {
    for (const headers of [{}, as("nobody")]) {
      const res = await app.inject({ method: "GET", url: "/entries", headers });
      expect(res.statusCode).toBe(401);
      expect(res.json().code).toBe("UNAUTHORIZED");
    }
  });

  it("saves, lists and deletes an entry", async () => {
    const put = await app.inject({
      method: "PUT",
      url: `/entries/${entry.id}`,
      headers: as("family"),
      payload: entry,
    });
    expect(put.statusCode).toBe(200);
    expect(put.json()).toEqual({ entry });

    const list = await app.inject({ method: "GET", url: "/entries", headers: as("family") });
    expect(list.json()).toEqual({ entries: [entry] });

    const del = await app.inject({
      method: "DELETE",
      url: `/entries/${entry.id}`,
      headers: as("family"),
    });
    expect(del.statusCode).toBe(204);
    const after = await app.inject({ method: "GET", url: "/entries", headers: as("family") });
    expect(after.json()).toEqual({ entries: [] });
  });

  it("keeps each account's diary to itself", async () => {
    await app.inject({
      method: "PUT",
      url: `/entries/${entry.id}`,
      headers: as("family"),
      payload: entry,
    });
    const other = await app.inject({ method: "GET", url: "/entries", headers: as("other") });
    expect(other.json()).toEqual({ entries: [] });
  });

  it("rejects an entry that breaks the schema", async () => {
    const res = await app.inject({
      method: "PUT",
      url: `/entries/${entry.id}`,
      headers: as("family"),
      payload: { ...entry, title: "" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe("VALIDATION_ERROR");
  });

  it("rejects a body whose id is not the path's", async () => {
    const res = await app.inject({
      method: "PUT",
      url: "/entries/another-id",
      headers: as("family"),
      payload: entry,
    });
    expect(res.statusCode).toBe(400);
  });

  it("deleting an entry that is already gone still succeeds", async () => {
    const res = await app.inject({ method: "DELETE", url: "/entries/gone", headers: as("family") });
    expect(res.statusCode).toBe(204);
  });

  it("answers 500 without details when the database fails", async () => {
    stores.failing = true;
    const res = await app.inject({ method: "GET", url: "/entries", headers: as("family") });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Couldn't check the sign-in",
    });
  });

  it("has a health check without sign-in", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
  });
});

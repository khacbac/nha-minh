import type { Entry } from "@sonha/types";
import { describe, expect, it } from "vitest";

import { entryToRow, rowToEntry } from "./entry-row.js";

const entry: Entry = {
  id: "mhs1-abc123",
  categoryId: "market",
  title: "Đi chợ",
  note: "Rau, thịt",
  amount: 185_000,
  occurredAt: Date.UTC(2026, 10, 11, 0, 40),
  createdAt: Date.UTC(2026, 10, 11, 0, 41),
  updatedAt: Date.UTC(2026, 10, 11, 0, 42),
};

describe("entry rows", () => {
  it("round-trips an entry", () => {
    expect(rowToEntry(entryToRow("u1", entry))).toEqual(entry);
  });

  it("stores a missing note and amount as null and reads them back as absent", () => {
    const { note: _n, amount: _a, ...plain } = entry;
    const row = entryToRow("u1", { ...plain, categoryId: "chores", title: "Dọn nhà" });
    expect(row.note).toBeNull();
    expect(row.amount).toBeNull();
    const back = rowToEntry(row);
    expect(back).not.toHaveProperty("note");
    expect(back).not.toHaveProperty("amount");
  });

  it("reads Postgres timestamps with a +00:00 offset", () => {
    const row = { ...entryToRow("u1", entry), occurred_at: "2026-11-11T00:40:00+00:00" };
    expect(rowToEntry(row)?.occurredAt).toBe(entry.occurredAt);
  });

  it("skips a row whose category this build doesn't know", () => {
    expect(rowToEntry({ ...entryToRow("u1", entry), category_id: "lottery" })).toBeNull();
  });

  it("skips something that isn't a row", () => {
    expect(rowToEntry({ id: 1 })).toBeNull();
  });
});

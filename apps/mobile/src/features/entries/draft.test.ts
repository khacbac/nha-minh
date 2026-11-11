import { describe, expect, it } from "vitest";

import {
  type EntryDraft,
  draftFromEntry,
  draftToEntry,
  emptyDraft,
  isDraftDirty,
  isDraftReady,
  newEntryId,
  titleAfterPick,
} from "./draft";

const meta = { id: "x1", createdAt: 100, updatedAt: 100 };
const draft = (over: Partial<EntryDraft>): EntryDraft => ({ ...emptyDraft(5_000), ...over });

describe("readiness and dirty", () => {
  it("needs a category and a title", () => {
    expect(isDraftReady(draft({}))).toBe(false);
    expect(isDraftReady(draft({ categoryId: "market", title: "  " }))).toBe(false);
    expect(isDraftReady(draft({ categoryId: "market", title: "Đi chợ" }))).toBe(true);
  });

  it("notices changes, not whitespace", () => {
    const initial = draft({});
    expect(isDraftDirty(draft({ title: "  " }), initial)).toBe(false);
    expect(isDraftDirty(draft({ amountDigits: "0" }), initial)).toBe(false);
    expect(isDraftDirty(draft({ categoryId: "food" }), initial)).toBe(true);
    expect(isDraftDirty(draft({ occurredAt: 6_000 }), initial)).toBe(true);
  });
});

describe("titleAfterPick", () => {
  const market = ["Đi chợ", "Siêu thị"];
  const food = ["Ăn ngoài", "Cà phê"];

  it("fills an empty title", () => {
    expect(titleAfterPick("", [], market)).toBe("Đi chợ");
  });

  it("replaces a suggestion of the previous category", () => {
    expect(titleAfterPick("Siêu thị", market, food)).toBe("Ăn ngoài");
  });

  it("keeps what the parent typed", () => {
    expect(titleAfterPick("Mua quà cho bà", market, food)).toBe("Mua quà cho bà");
  });
});

describe("draftToEntry", () => {
  it("stores trimmed fields and the amount", () => {
    const entry = draftToEntry(
      draft({ categoryId: "market", title: " Đi chợ ", amountDigits: "185000", note: " rau " }),
      "expense",
      meta,
    );
    expect(entry).toEqual({
      ...meta,
      categoryId: "market",
      title: "Đi chợ",
      amount: 185_000,
      note: "rau",
      occurredAt: 5_000,
    });
  });

  it("drops the amount for a category without money and an empty note", () => {
    const entry = draftToEntry(
      draft({ categoryId: "chores", title: "Dọn nhà", amountDigits: "50000", note: "  " }),
      "none",
      meta,
    );
    expect(entry).not.toBeNull();
    expect(entry && "amount" in entry).toBe(false);
    expect(entry && "note" in entry).toBe(false);
  });

  it("rejects a draft without category or title", () => {
    expect(draftToEntry(draft({ title: "x" }), "expense", meta)).toBeNull();
    expect(draftToEntry(draft({ categoryId: "food", title: " " }), "expense", meta)).toBeNull();
  });

  it("round-trips through draftFromEntry", () => {
    const entry = draftToEntry(
      draft({ categoryId: "income", title: "Lương", amountDigits: "18500000" }),
      "income",
      meta,
    );
    expect(entry).not.toBeNull();
    if (entry) expect(draftToEntry(draftFromEntry(entry), "income", meta)).toEqual(entry);
  });
});

describe("newEntryId", () => {
  it("is time-based with a random tail", () => {
    expect(newEntryId(36, () => 0)).toBe("10-000000");
    expect(newEntryId(1, () => 0.5)).not.toBe(newEntryId(1, () => 0.25));
  });
});

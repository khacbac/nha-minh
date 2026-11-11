import { createRequire } from "node:module";

import { CATEGORY_IDS, moneyKindSchema } from "@sonha/types";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { categories } = require("./category-data.js") as {
  categories: {
    id: string;
    name: string;
    icon: string;
    tint: string;
    money: string;
    titles: string[];
  }[];
};
const { icons } = require("../../lib/theme/icons.js") as { icons: Record<string, string> };
const { semantic } = require("../../lib/theme/tokens.js") as {
  semantic: { tint: Record<string, unknown> };
};

describe("category catalog (spec §3.1)", () => {
  it("has exactly the permanent ids, in the same order", () => {
    expect(categories.map((c) => c.id)).toEqual([...CATEGORY_IDS]);
  });

  it("gives every category a name, a known icon and tint, a money kind and a first title", () => {
    for (const c of categories) {
      expect(c.name.length).toBeGreaterThan(0);
      expect(icons[c.icon], c.id).toBeTypeOf("string");
      expect(semantic.tint[c.tint], c.id).toBeDefined();
      expect(moneyKindSchema.safeParse(c.money).success, c.id).toBe(true);
      expect(c.titles.length, c.id).toBeGreaterThan(0);
      expect(new Set(c.titles).size, c.id).toBe(c.titles.length);
    }
  });
});

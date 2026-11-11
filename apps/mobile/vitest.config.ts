import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Pure rule files only (spec §5): tests must not import react-native.
export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});

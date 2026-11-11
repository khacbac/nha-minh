import { defineConfig } from "vitest/config";

// Without an explicit `include`, Vitest's default glob also picks up compiled specs under dist/.
export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
});

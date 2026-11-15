import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    include: ["convex/**/*.test.ts", "lib/**/*.test.ts"],
    exclude: ["node_modules", "docs/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["convex/**/*.ts"],
      exclude: ["convex/_generated/**", "convex/**/*.test.ts"],
    },
  },
});

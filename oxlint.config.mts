import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  env: core.env,
  extends: [core, react, next, vitest],
  // components/ui is vendored shadcn source, replaced wholesale by `shadcn add --overwrite`.
  ignorePatterns: [
    ...core.ignorePatterns,
    "convex/_generated/**",
    "components/ui/**",
  ],
  options: { typeAware: true },
  overrides: [
    {
      // Convex module paths may only contain letters, digits, underscores and periods.
      files: ["convex/**"],
      rules: { "unicorn/filename-case": "off" },
    },
    {
      // Layouts that only add metadata return `children` as is. `ReactNode`
      // includes `Promise`, which the rule misreads as an async function.
      files: ["app/**/layout.tsx"],
      rules: { "typescript/promise-function-async": "off" },
    },
    {
      // Convex's Clerk adapter takes the `useAuth` hook itself as a prop.
      files: ["components/providers/convex-client-provider.tsx"],
      rules: { "react/hooks": "off" },
    },
  ],
});

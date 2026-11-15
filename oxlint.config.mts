import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  env: core.env,
  extends: [core, react, next, vitest, shadcn],
  // components/ui is vendored shadcn source, replaced wholesale by `shadcn add --overwrite`.
  ignorePatterns: [
    ...core.ignorePatterns,
    "convex/_generated/**",
    "components/ui/**",
  ],
  jsPlugins: shadcn.jsPlugins,
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
    {
      // Email clients and `next/og` image rendering only understand inline
      // styles; neither can load the site's stylesheet.
      files: ["emails/**", "app/apple-icon.tsx"],
      rules: { "shadcn/no-inline-styles": "off" },
    },
  ],
  rules: {
    // Pages place components and may adjust the text and container parts
    // listed here. Controls (Button, Badge, Input, Select) change appearance
    // only through the variants and sizes in components/ui.
    "shadcn/no-restyle": [
      "error",
      {
        allow: ["layout"],
        contracts: [
          {
            allow: ["layout", "typography", "spacing", "color"],
            pattern:
              "^(CardTitle|CardDescription|Label|SheetTitle|SheetDescription|AlertDialogTitle|AlertDialogDescription|AvatarFallback)$",
          },
          {
            allow: ["layout", "spacing", "color", "shape", "effects"],
            pattern: "^(SheetContent|SheetHeader|SheetFooter)$",
          },
          {
            allow: ["layout", "spacing", "border-destructive"],
            pattern: "^(Card|CardHeader|CardContent|CardFooter)$",
          },
          { allow: ["layout", "gap-*"], pattern: "^Button$" },
          { allow: ["layout", "pl-*", "pr-*"], pattern: "^Input$" },
          {
            allow: ["layout", "text-muted-foreground"],
            pattern: "^SelectItem$",
          },
        ],
      },
    ],
  },
});

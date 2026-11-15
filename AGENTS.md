# AGENTS.md

This file provides context for AI agents working on the Nešvęsk vienas codebase.

## Project Overview

Holiday hosting/guest matching platform for Lithuania. Connects hosts with guests for Christmas (Dec 24-26) and New Year's Eve (Dec 31) celebrations.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 7, Tailwind CSS 4, shadcn/ui on `radix-ui`, Convex (real-time database), Clerk (auth), Sentry (errors), PostHog (analytics)

## Quick Start

```bash
bun install          # Install dependencies
bun dev              # Start Next.js + Convex dev servers (port 7777)
```

## Commands

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `bun dev`       | Start dev server (Next.js on port 7777 + Convex)  |
| `bun build`     | Production build                                  |
| `bun lint`      | Run Ultracite (Oxlint + Oxfmt) + TypeScript check |
| `bun lint:fix`  | Auto-fix lint issues                              |
| `bun typecheck` | Run TypeScript type checking                      |
| `bun test`      | Run Vitest tests (watch mode)                     |
| `bun test:once` | Run tests once without watch                      |

## Project Structure

```
app/                    # Next.js App Router
  (landing)/           # Public landing page
  (dashboard)/         # Authenticated pages (browse, messages, profile, settings)
  (legal)/             # Terms, privacy, cookies pages
  api/                 # API routes
components/            # React components
  ui/                  # shadcn/ui base components
convex/                # Convex backend
  schema.ts            # Database schema (source of truth for data model)
  *.ts                 # Queries, mutations, actions
  *.test.ts            # Backend tests (use convex-test)
hooks/                 # Custom React hooks
lib/                   # Utilities (i18n, types, helpers)
contexts/              # React contexts
emails/                # React Email templates
```

## Coding Conventions

### Bun over Node.js

- Use `bun` instead of `node`, `npm`, or `yarn`
- Bun automatically loads `.env` files - don't use dotenv

### TypeScript

- Strict mode enabled (`strict: true` in tsconfig)
- Use proper typing, avoid `any`
- Prefer type inference where obvious

### Linting & Formatting

- Ultracite runs Oxlint (type-aware) for linting and Oxfmt for formatting
- A Lefthook pre-commit hook runs `ultracite fix` on staged files
- Run `bun lint:fix` to auto-fix issues

### Component Patterns

- Use shadcn/ui components from `components/ui/`
- Follow existing component structure in `components/`
- Use Tailwind CSS for styling

### Convex Backend

- Schema defined in `convex/schema.ts`
- Queries are read-only, mutations modify data
- Actions can have side effects (API calls, etc.)
- Use `convex-test` for backend tests with edge-runtime

## Testing

Tests use Vitest with `convex-test` for the Convex edge-runtime environment:

```bash
bun test              # Watch mode
bun test:once         # Single run
```

Test files are in `convex/*.test.ts`. Example:

```typescript
import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";

test("example", async () => {
  const t = convexTest(schema);
  const result = await t.query(api.profiles.listProfiles, {});
  expect(result).toEqual([]);
});
```

## Environment Variables

Required env vars are documented in `env.example`. Key ones:

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `MAILEROO_API_KEY` - Email provider API key

Convex-specific env vars are set in Convex Dashboard, not `.env.local`.

## i18n

The app supports 4 languages: Lithuanian, English, Ukrainian, Russian.

- Translations are in `lib/i18n.ts`
- Use the translation function, don't hardcode strings

## Data Model

The database schema is in `convex/schema.ts`. Key tables:

- `users` - Linked to Clerk via `clerkId`
- `profiles` - User profiles with role (host/guest/both), preferences
- `conversations` - Chat threads between users
- `messages` - Individual messages in conversations
- `invitations` - Connection requests between users
- `userConsents` - GDPR consent records

## Key Workflows

### User Flow

1. Sign up via Clerk magic link
2. Complete onboarding (multi-step profile wizard)
3. Browse hosts/guests by city, date, language
4. Send/receive invitations
5. Chat when connected

### Auth

- Clerk handles authentication
- Clerk webhooks sync user data to Convex (`convex/http.ts`)
- User deletion cascades through all related data

## Gotchas

1. **Convex is real-time**: Queries auto-update when data changes
2. **Don't use `node:fs`**: Use Bun.file or Bun APIs
3. **Port 7777**: Dev server runs on port 7777, not 3000
4. **Pre-commit hooks**: `ultracite fix` runs automatically on commit (Lefthook)
5. **TypeScript strict**: The codebase uses strict TypeScript - don't use `any`

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bunx ultracite fix`
- **Check for issues**: `bunx ultracite check`
- **Diagnose setup**: `bunx ultracite doctor`

Oxlint + Oxfmt (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Write functions as arrow functions assigned to `const`, and define them above where they're used
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- When a hook dependency rule fires, first check whether the effect is needed, and whether adding the dependency changes when it runs
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components

### Accessibility

- Use semantic HTML first; add ARIA only when no native element fits
- Provide meaningful alt text for images
- Use proper heading hierarchy
- Add labels for form inputs
- Make anything clickable a `<button>` or a link, so it works from the keyboard; don't add key handlers to a `<div>`
- Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns
- Avoid import cycles; move shared code into a module both sides import
- Don't leave TODO or FIXME comments in new code. For an existing one, do the task, delete it if it's done, or leave it; never reword it to get past the linter

### Security

- Add `rel="noopener noreferrer"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Avoid barrel files (index files that only re-export other modules) inside an app; a package's entry point is fine
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Oxlint + Oxfmt Can't Help

Oxlint + Oxfmt will catch most mechanical issues automatically. Focus your attention on:

1. **Business logic correctness** - Oxlint + Oxfmt can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Oxlint + Oxfmt. Run `bunx ultracite fix` before committing to ensure compliance.

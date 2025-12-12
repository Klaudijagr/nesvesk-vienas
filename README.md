# Nešvęsk vienas

**"Don't celebrate alone"** - A platform connecting hosts and guests for holiday celebrations in Lithuania.

## About

Nešvęsk vienas helps people find companions for holiday celebrations. Hosts can open their homes, and guests can find welcoming places to celebrate together. The platform focuses on Christmas (Dec 24-26) and New Year's Eve (Dec 31), with potential expansion to other holidays.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **UI**: React 19, [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Backend**: [Convex](https://convex.dev)
- **Auth**: [Clerk](https://clerk.com)
- **Email**: Maileroo (transactional emails)
- **Face Verification**: [@vladmandic/face-api](https://github.com/vladmandic/face-api)
- **Linting**: [Biome](https://biomejs.dev) via [Ultracite](https://github.com/haydenbleasel/ultracite)

## Features

- **Host/Guest Profiles** - Create detailed profiles with photos, preferences, and availability
- **Browse & Filter** - Find hosts or guests by city, language, date, and more
- **Messaging** - In-app chat between matched users
- **Face Verification** - Optional photo verification for trust
- **Event Management** - Create and manage holiday events
- **Multi-language** - Lithuanian, English, Ukrainian, Russian
- **Bi-directional Sync** - Clerk ↔ Convex user data stays in sync via webhooks

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account

### Installation

```bash
# Install dependencies
bun install

# Run development server (starts both Next.js and Convex)
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following:

```env
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_ISSUER_DOMAIN=https://your-clerk-issuer-domain

# Maileroo (for emails)
MAILEROO_API_KEY=...
```

Also set these in your **Convex Dashboard** (Settings → Environment Variables):

```env
  CLERK_WEBHOOK_SECRET=whsec_...   # From Clerk webhook endpoint
  CLERK_SECRET_KEY=sk_test_...     # Same as above
  CLERK_ISSUER_DOMAIN=https://your-clerk-issuer-domain
  MAILEROO_API_KEY=...             # Transactional email provider

# Optional admin allowlist for dev/admin Convex functions
ADMIN_CLERK_USER_IDS=user_...,user_...
```

### Clerk Webhook Setup

To enable bi-directional sync between Clerk and Convex:

1. Go to **Clerk Dashboard** → **Webhooks** → **+ Add Endpoint**
2. Set **Endpoint URL**: `https://YOUR-DEPLOYMENT.convex.site/clerk-users-webhook`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** and set it as `CLERK_WEBHOOK_SECRET` in Convex

### Migrating / relinking users after changing Clerk issuer or instance

If you previously had users created under a different Clerk issuer (for example, switching from a dev instance to a production instance, or moving to a custom Clerk domain), existing Convex user records may no longer match the Clerk `sub` (user id) that users receive on sign-in.

This repo includes an admin-only Convex action to **relink Convex users to Clerk by email**, preserving the existing Convex user `_id` (so profiles/messages remain intact):

- Convex action: `migrations.relinkUsersByEmailToClerk`
- Env requirements (Convex): `CLERK_SECRET_KEY`, `CLERK_ISSUER_DOMAIN`, `ADMIN_CLERK_USER_IDS`

Run it from the Convex dashboard “Functions” panel (as an admin) with a small page size first:

```json
{
  "paginationOpts": { "numItems": 25, "cursor": null },
  "createMissing": false,
  "dryRun": true
}
```

Then re-run with `"dryRun": false`. If your Clerk instance does not already contain those users, you can set `"createMissing": true` to create missing users in Clerk using their email address.

## Project Structure

```text
app/                    # Next.js App Router pages
  (landing)/           # Landing page
  (dashboard)/         # Authenticated pages
    browse/            # Browse hosts/guests
    events/            # Event management
    messages/          # Messaging
    onboarding/        # Profile setup
    profile/           # User profiles
    settings/          # User settings
  api/                 # API routes
  sign-in/             # Clerk sign-in
  sign-up/             # Clerk sign-up
  verify/              # Verification page
components/            # React components
  ui/                  # shadcn/ui components
convex/                # Convex backend
  schema.ts            # Database schema
  profiles.ts          # Profile queries/mutations
  messages.ts          # Messaging logic
  events.ts            # Event management
  invitations.ts       # Invitation system
  users.ts             # User sync (Clerk webhooks)
  http.ts              # HTTP endpoints (webhooks)
contexts/              # React contexts
hooks/                 # Custom hooks
lib/                   # Utilities
```

## Scripts

```bash
bun dev          # Start dev server (Next.js + Convex)
bun dev:next     # Start only Next.js
bun dev:convex   # Start only Convex
bun build        # Production build
bun start        # Start production server
bun lint         # Run Biome linter
bun lint:fix     # Fix lint issues
bun typecheck    # Run TypeScript check
```

## Code Quality

This project uses Ultracite (Biome) for linting and formatting:

```bash
# Fix formatting and lint issues
bunx ultracite fix

# Check for issues
bunx ultracite check
```

## Documentation

See the [docs](./docs) folder for additional documentation:

- [Planning Document](./docs/holiday-platform-planning-2.md) - Full project specification
- [Changelog](./docs/CHANGELOG.md) - Version history
- [TODO](./docs/TODO.md) - Upcoming tasks
- [Editing Guide](./docs/EDITING.md) - For non-technical content editors

## Privacy / Compliance (operational notes)

This section is **not legal advice**. It documents how this repo behaves today and what you should keep consistent when operating in production.

### Processors / Subprocessors (what we use)

- **Vercel (hosting)**: serves the Next.js app and may process technical request metadata/logs for reliability and security.
- **Convex (database + server functions)**: stores app data (profiles, messages, invitations, consent records).
- **Clerk (authentication)**: stores account identity/authentication details (e.g., email, auth events) and issues session tokens/cookies.
- **Maileroo (transactional email)**: receives email address + email content needed to send service emails.
- **Sentry (error monitoring)**: receives technical diagnostics about crashes/errors. Client replay is enabled only after analytics consent.
- **Vercel Analytics + Speed Insights (analytics/performance)**: mounted only after analytics consent via [`AnalyticsGate`](components/analytics-gate.tsx:12).

If you add a new third-party service that can access personal data, update the legal pages:
- [`PrivacyPage`](app/(legal)/privacy/page.tsx:369)
- [`CookiesPage`](app/(legal)/cookies/page.tsx:197)

### Consent records (audit trail)

This repo **already records user consent** in Convex via [`api.consents.recordConsent`](convex/consents.ts:23) / [`api.consents.recordMultipleConsents`](convex/consents.ts:64).

When you materially change Terms/Privacy/Cookies:
- Update the policy version in [`CURRENT_POLICY_VERSION`](convex/consents.ts:6)
- Consider requiring users to re-accept on next login/onboarding

### Data retention (recommended operational behavior)

The legal pages describe retention as best-practice ranges. Operationally, keep to these defaults:
- **Account/profile data**: retained while account active; delete/anonymize within ~30 days after deletion request.
- **Messages/invitations**: retain while account active; remove within ~30–90 days after deletion.
- **Consent records**: keep as long as needed to demonstrate compliance (audit trail).
- **Logs/error events**: keep short (typically 30–90 days), unless needed for incident investigation.

If you change retention behavior, update the legal pages and this section.

## License

Private project.

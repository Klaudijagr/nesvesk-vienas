# TODO - Nešvęsk vienas

Holiday hosting/guest matching platform for Lithuania.

**Last updated**: December 21, 2025

---

## Completed Features

### Core Platform

- [x] Next.js 16 App Router + Convex database + Clerk auth
- [x] Real-time messaging with conversation system
- [x] Invitation system (send/accept/decline)
- [x] Multi-step onboarding with preference cards
- [x] Photo upload + gallery (up to 5 photos)
- [x] Face verification (EdgeFace-XXS + YuNet)
- [x] i18n (LT, EN, UA, RU)
- [x] Username routing (`/people/[username]`)
- [x] In-app browser gate for Instagram/social auth

### Security & Compliance (Production Hardening)

- [x] GDPR cookie consent banner + analytics gating
- [x] Consent recording to database (`userConsents` table)
- [x] Admin guard for dev-only Convex functions (`assertAdmin`)
- [x] Sentry with PII disabled + replay consent-gated
- [x] CSP headers (report-only mode)
- [x] Clerk ↔ Convex user sync (webhooks + bi-directional delete)
- [x] IDOR fix: `deleteUser` only allows self-deletion
- [x] Email test action disabled in production
- [x] Account deletion for users without profiles

### Moderation & Safety

- [x] Block user functionality
- [x] Unblock user functionality
- [x] Report user with reasons
- [x] Archive conversations
- [x] Archive/Block UI view in messages
- [x] Blocked users hidden from conversations and browse

### Legal Pages (All 4 languages)

- [x] Safety Guidelines (`/safety`) - Client's revised version
- [x] Terms of Service (`/terms`)
- [x] Privacy Policy (`/privacy`)
- [x] Cookie Policy (`/cookies`)

### Monitoring

- [x] Sentry error tracking
- [x] Vercel Analytics (consent-gated)
- [x] Vercel Speed Insights (consent-gated)
- [x] PostHog analytics

### Performance Optimizations (Dec 2025)

- [x] N+1 query fix in `listProfiles` - batch invitation queries (100 queries → 2)
- [x] Denormalized unread counts on conversations for O(1) reads
- [x] Slim profile returns from `listProfiles` (excludes large arrays)

---

## In Progress / Remaining

### High Priority

- [ ] **Username selection in onboarding/settings** - Users can't pick their own username yet
- [ ] **Profile card unification** - Consolidate `unified-profile-card.tsx` and `listing-card.tsx` into single component with variants. Currently have duplicated `SlimProfile` types.
- [ ] **Map view for browse** - Show hosts on map with privacy circles

### Medium Priority

- [ ] **References system** - Leave/receive references after meetups
- [ ] **Profile completion indicator** - "You're 80% done!" in onboarding
- [ ] **Last active / response rate** - Show when user was last online
- [ ] **Community Guidelines page** (`/guidelines`)
- [ ] **FAQ page** (`/faq`)

### Low Priority / Post-MVP

- [ ] Phone verification (Clerk supports this)
- [ ] Compatibility score
- [ ] Save/favorite profiles
- [ ] PWA support

---

## Tech Debt

### Completed

- [x] Fix TypeScript `lastMessage` null vs undefined type mismatch
- [x] Fix city type assertion in profiles.ts
- [x] Remove unused `getConnectionStatusBetween` function (dead code after N+1 fix)
- [x] Remove unused `QueryCtx` import
- [x] Extract shared `usePhotoUpload` hook (reduces PhotoUpload/PhotoGallery complexity)

### Remaining (Complexity Warnings)

Current lint complexity limit is 15. These are flagged but work fine:

| File | Score | Notes |
|------|-------|-------|
| `OnboardingPage` | 24/15 | 7-step wizard with 15+ fields. Hook created but not integrated yet |
| `usePhotoUpload` | 21/15 | Centralized upload logic - complexity trade-off for reusability |
| `profiles.ts` handler | 17/15 | Complex server query - legitimately complex |
| `profiles.ts` filter | 17/15 | Many filter conditions - idiomatic |
| `login-form` | 16/15 | Clean code, barely over |

**Decision**: Consider raising biome complexity limit to 20 (would pass login-form & profiles.ts, still flag OnboardingPage and usePhotoUpload for future refactoring).

### Future Considerations

- [ ] Consider Cloudflare R2 for images if scaling past bandwidth limits
- [ ] Integrate `useOnboardingForm` hook (requires updating Step0-Step6 components)

---

## Environment Variables Checklist

**Convex Dashboard:**
- `CLERK_WEBHOOK_SECRET`
- `CLERK_SECRET_KEY`
- `MAILEROO_API_KEY`
- `ADMIN_CLERK_USER_IDS` (comma-separated Clerk user IDs for admin functions)

**Vercel:**
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

---

## Quick Reference

### Running the app

```bash
bun dev          # Start dev server
bun run check    # Lint + type check (ultracite + tsc)
bun run lint     # Same as check
bun test         # Run tests
```

### Key files

- `convex/schema.ts` - Database schema
- `lib/i18n.ts` - All translations
- `contexts/cookie-consent-context.tsx` - Consent state
- `convex/lib/admin.ts` - Admin guard for protected functions
- `hooks/use-photo-upload.ts` - Shared photo upload logic
- `hooks/use-onboarding-form.ts` - Onboarding form state (not yet integrated)

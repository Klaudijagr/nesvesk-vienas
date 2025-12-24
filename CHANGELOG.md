# Changelog

All notable changes to Nešvęsk vienas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-12-21

### Performance

- **N+1 query fix** in `listProfiles` - batch invitation queries reduce 100 DB queries to 2
- **Denormalized unread counts** on conversations table for O(1) reads instead of counting messages
- **Slim profile returns** - `listProfiles` now excludes large arrays (photos, amenities, houseRules)

### Fixed

- Account deletion now works for users without profiles
- In-app browser gate for Instagram/Facebook/TikTok auth (prevents WebView crashes)
- TypeScript `lastMessage` null vs undefined type mismatch
- City type assertion in profiles.ts
- Onboarding validation errors with scroll-to-field

### Refactored

- Extracted `usePhotoUpload` hook - shared upload logic between PhotoUpload and PhotoGallery
- Created `useOnboardingForm` hook (prepared for future integration)
- Removed dead code: `getConnectionStatusBetween` function, unused `QueryCtx` import

### Developer Experience

- Lint scripts now use Ultracite (`bun run lint` = `ultracite check && tsc --noEmit`)
- Added TypeScript check to lint-staged (catches type errors on commit)
- PostHog event names extracted to constants

### Technical

- `backfillUnreadCounts` now uses `internalMutation` for dashboard execution
- Slim profile types in `listing-card.tsx` and `unified-profile-card.tsx`

---

## [1.0.0] - 2025-12-11

🎉 **First Production Release**

### Core Platform

- **Authentication**: Clerk magic link auth with Convex sync
- **Profiles**: Multi-step onboarding, photo gallery (up to 5), face verification
- **Matching**: Invitation system (send/accept/decline), real-time messaging
- **Browse**: Filter by city, date, language with grid/list views
- **i18n**: Full support for Lithuanian, English, Ukrainian, Russian

### Moderation & Safety

- Block/unblock users
- Report users (Spam, Inappropriate, Harassment, Fake Profile, Other)
- Archive conversations
- Blocked users hidden from browse and messages

### Legal Pages (All 4 Languages)

- Safety Guidelines (`/safety`)
- Terms of Service (`/terms`)
- Privacy Policy (`/privacy`)
- Cookie Policy (`/cookies`)

### Security & Compliance

- GDPR cookie consent banner with analytics gating
- Consent recording to database
- Admin guard for dev-only Convex functions
- Sentry error tracking (PII disabled, replay consent-gated)
- CSP headers (report-only mode)
- IDOR fix: users can only delete themselves
- Clerk ↔ Convex bi-directional user sync

### Infrastructure

- Next.js 16 App Router
- Convex real-time database
- Clerk authentication
- Vercel Analytics + Speed Insights (consent-gated)
- Sentry error monitoring
- Migrated to `proxy.ts` (Next.js 16 convention)

---

## [0.3.0] - 2024-12-08

### Added

- **Clerk ↔ Convex bi-directional sync** via webhooks
  - `convex/http.ts` - HTTP endpoint for Clerk webhooks at `/clerk-users-webhook`
  - `convex/users.ts` - User sync handlers (upsert/delete)
  - Cascading deletes: when user deleted in Clerk, removes profile, conversations, messages, invitations, events
  - `deleteUser` action to delete from app (calls Clerk API, triggers webhook)
- Sonner toast notifications for better UI feedback
- DevPanel component for development testing
- **Visual Concepts** (Prototyping):
  - 3 Landing Page Variants (`/client1`, `/client2`, `/client3`)
  - 3 Dashboard Concept Flows (Magic Window, Community Map, Invitation Registry)
  - Location Picker Prototype (`/location-picker`):
    - Added address autocomplete via Google Places API
    - Added privacy radius slider (100m - 2000m)
    - Fixed infinite update loops and visual glitches

### Changed

- Migrated from Bun server to **Next.js 16 App Router**
- Switched auth from Convex Auth to **Clerk**
- Face verification now uses client-side `@vladmandic/face-api` instead of Python service
- Updated to React 19, Tailwind CSS 4

### Technical

- Added `svix` for webhook signature verification
- Added `@clerk/backend` for Clerk API calls
- Convex environment variables: `CLERK_WEBHOOK_SECRET`, `CLERK_SECRET_KEY`

---

## [0.2.0] - 2024-12-07

### Added

- Face verification API with EdgeFace-XXS + YuNet ONNX models
- Bun routes for `/api/face/health`, `/api/face/detect`, `/api/face/verify`
- Concurrently dev script to run Bun + Python face service together
- TODO.md for tracking features across phases
- CHANGELOG.md for release tracking
- Organized docs folder for documentation files
- E2E testing with Stagehand v3 + Gemini 2.5 Flash
- Multi-user test fixtures (hostPage, guestPage, guest2Page)

### Changed

- Moved documentation files to `docs/` folder
- Removed redundant `biome.jsonc` (keeping `biome.json`)

### Technical

- EdgeFace-XXS: 5.7MB model, 512-dim embeddings, ~8ms inference
- YuNet face detection: 227KB, ~4ms inference
- Python 3.12 + FastAPI + ONNX Runtime backend

---

## [0.1.0] - 2024-12-03

### Added

- Initial project setup with Bun + React + Convex
- Magic link authentication via Convex Auth
- Multi-step profile registration wizard (3-4 steps)
- Host/Guest/Both role selection
- Browse page with grid/list views
- Filters: city, date, language
- Profile viewing with privacy protection
- Invitation system (backend)
- Convex schema: profiles, messages, invitations
- UI components: Button, Card, Input, Label, Select, Textarea
- Tailwind CSS styling
- Biome + Ultracite linting setup
- Vitest + convex-test for backend testing
- Lithuania-specific cities and holiday dates (Dec 24-26, 31)
- Multi-language support (Lithuanian, English, Ukrainian, Russian)

### Infrastructure

- Bun for runtime and bundling
- Convex for backend and real-time sync
- React Router for navigation
- Protected routes with auth guards
- HMR in development mode

---

## Version History

| Version | Date       | Summary                                               |
| ------- | ---------- | ----------------------------------------------------- |
| 0.1.0   | 2024-12-03 | Initial release - auth, profiles, browse, invitations |
| 0.2.0   | 2024-12-07 | Face verification, E2E testing, docs organization     |
| 0.3.0   | 2024-12-08 | Next.js App Router, Clerk auth, bi-directional sync   |
| 1.0.0   | 2025-12-11 | First production release                              |
| 1.1.0   | 2025-12-21 | Performance fixes, refactoring, DX improvements       |

# Changelog

All notable changes to Nešvęsk Vienas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Clerk ↔ Convex bi-directional sync** via webhooks
  - `convex/http.ts` - HTTP endpoint for Clerk webhooks at `/clerk-users-webhook`
  - `convex/users.ts` - User sync handlers (upsert/delete)
  - Cascading deletes: when user deleted in Clerk, removes profile, conversations, messages, invitations, events
  - `deleteUser` action to delete from app (calls Clerk API, triggers webhook)
- Sonner toast notifications for better UI feedback
- DevPanel component for development testing
- **Visual Concepts** (Prototyping):
  - 3 Landing Page Variants (`/landing1`, `/landing2`, `/landing3`)
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

| Version    | Date       | Summary                                              |
| ---------- | ---------- | ---------------------------------------------------- |
| 0.1.0      | 2024-12-03 | Initial release - auth, profiles, browse, invitations |
| 0.2.0      | 2024-12-07 | Face verification, E2E testing, docs organization    |
| Unreleased | -          | Next.js App Router, Clerk auth, bi-directional sync  |

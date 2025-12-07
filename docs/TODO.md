# TODO - Nešvęsk Vienas

Holiday hosting/guest matching platform for Lithuania.

---

## Phase 1: Core Matching Flow (Priority: High) - COMPLETE

### Flow 3: Host/Guest Matching
- [x] **Invitations UI** - Display pending invitations in Dashboard/Matches page
- [x] **Accept/Decline UI** - Buttons to respond to invitations
- [x] **Match confirmation** - Success state when both parties agree
- [x] **Contact reveal** - Unlock phone/address after match (fixed `isMatched` in profiles.ts)
- [x] **Date picker in invite** - User selects date from profile's available dates

### Flow 4: Identity Verification
- [x] **Verification UI** - Add "Verify Identity" button to Dashboard
- [x] **Upload component** - ID photo + selfie capture/upload
- [x] **Connect to face service** - Call `/api/face/verify` endpoint
- [x] **Store verification result** - Update `verified` field in Convex profile
- [x] **Verification status display** - Show pending/verified/failed states

---

## Phase 2: Communication (Priority: Medium) - COMPLETE

### Flow 5: Messaging
- [x] **Chat UI component** - Real-time message thread in Dashboard
- [x] **Message list** - Conversations in sidebar + dedicated MessagesPage
- [x] **Unread indicators** - Badge count in nav + TopBar
- [x] **Notification system** - Bell icon with combined count (messages + invites)

---

## Phase 3: UX Improvements (Priority: Medium) - IN PROGRESS

### Browse Enhancements
- [x] **Shadcn Select dropdowns** - Full clickable area for filters
- [x] **Tab switch optimization** - No "0 found" flash when switching host/guest
- [ ] **Map view** - Show hosts on interactive map
- [ ] **Save/favorite profiles** - Bookmark interesting hosts/guests
- [ ] **Compatibility score** - Calculate match based on vibes/dates/languages

### Navigation & Layout
- [x] **Sidebar redesign** - AppSidebar with proper nav items
- [x] **TopBar** - Search + notifications + Clerk UserButton
- [x] **Dashboard overview** - Stats cards + quick actions
- [x] **Settings page** - Profile editing + account settings in tabs

### Registration Improvements
- [x] **Photo upload** - ~~Add during registration (currently only in edit)~~ Fixed `generateUploadUrl` to work during registration
- [ ] **Contact info** - Phone number collection
- [ ] **Interests/hobbies** - Beyond just "vibes"
- [ ] **Progress persistence** - Save form state across refreshes
- [ ] **Onboarding tour** - Tooltips for first-time users

### Profile Enhancements
- [x] **Photo gallery** - Multiple photos per profile (up to 5, with main photo selection)
- [ ] **Last active** - Show when user was last online
- [ ] **Response rate** - Track invitation response speed

### Localization (NEW - from znote.md)
- [x] **i18n setup** - 4 languages (LT, EN, UA, RU) in single TypeScript file
- [x] **LanguageSelector** - Navbar component to switch languages
- [x] **EDITING.md** - Guide for non-technical content editing
- [x] **Wire up translations** - LandingPage now uses `useLocale()` for all text

---

## Phase 4: Production Readiness (Priority: Low)

### Infrastructure
- [ ] **Error boundaries** - Graceful error handling in React
- [ ] **Analytics** - Track user flows and conversions
- [ ] **SEO** - Meta tags, OpenGraph, sitemap
- [ ] **PWA** - Installable app with offline support

### Security
- [ ] **Rate limiting** - Prevent spam invitations
- [ ] **Report user** - Flag inappropriate profiles
- [ ] **Block user** - Prevent contact from specific users

### Legal
- [ ] **Terms of Service** - Complete the /terms page
- [ ] **Privacy Policy** - GDPR compliance
- [ ] **Cookie consent** - Banner for EU users

---

## Completed

- [x] Auth (Clerk magic link)
- [x] Profile creation (multi-step wizard)
- [x] Profile editing
- [x] Browse hosts/guests with filters
- [x] Grid/list view toggle
- [x] Send invitations (backend)
- [x] Face verification API (EdgeFace-XXS + YuNet)
- [x] Verified badge display
- [x] Convex tests setup (vitest + convex-test)
- [x] Linting setup (Ultracite + Biome)
- [x] Dev server (Bun + concurrently)
- [x] Sidebar navigation
- [x] TopBar with search + notifications
- [x] Clerk UserButton integration
- [x] Dashboard with stats + quick actions
- [x] MessagesPage
- [x] HostingPage
- [x] SettingsPage with profile editing
- [x] Photo upload during registration (fixed auth flow)
- [x] Photo gallery (multiple photos, main selection)
- [x] i18n infrastructure (4 languages)
- [x] LanguageSelector component
- [x] EDITING.md guide for non-technical users
- [x] Landing page fixes (footer, image, styling)
- [x] 33 backend tests passing
- [x] E2E testing setup (Playwright + Stagehand v3 + Gemini 2.5 Flash)
- [x] Multi-user test fixtures (hostPage, guestPage, guest2Page)
- [x] Clerk test users created via API script
- [x] Face verification API response format fix

---

## Tech Debt

- [ ] Update root CLAUDE.md to mention vitest for Convex tests
- [ ] Consider migrating some tests to bun test for speed
- [ ] Remove unused dependencies from package.json

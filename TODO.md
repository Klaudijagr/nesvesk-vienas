# TODO - Nešvęsk Vienas

Holiday hosting/guest matching platform for Lithuania.

---

## Phase 1: Core Matching Flow (Priority: High)

### Flow 3: Host/Guest Matching
- [ ] **Invitations UI** - Display pending invitations in Dashboard/Matches page
- [ ] **Accept/Decline UI** - Buttons to respond to invitations
- [ ] **Match confirmation** - Success state when both parties agree
- [ ] **Contact reveal** - Unlock phone/address after match (fix `isMatched` in profiles.ts:38)
- [ ] **Date picker in invite** - Let user select specific date when inviting (currently hardcoded)

### Flow 4: Identity Verification
- [ ] **Verification UI** - Add "Verify Identity" button to Dashboard
- [ ] **Upload component** - ID photo + selfie capture/upload
- [ ] **Connect to face service** - Call `/api/face/verify` endpoint
- [ ] **Store verification result** - Update `verified` field in Convex profile
- [ ] **Verification status display** - Show pending/verified/failed states

---

## Phase 2: Communication (Priority: Medium)

### Flow 5: Messaging
- [ ] **Chat UI component** - Real-time message thread
- [ ] **Message list** - Show conversations in sidebar
- [ ] **Unread indicators** - Badge count for new messages
- [ ] **Notification system** - Alert when new message/invitation received

---

## Phase 3: UX Improvements (Priority: Medium)

### Browse Enhancements
- [ ] **Map view** - Show hosts on interactive map
- [ ] **Save/favorite profiles** - Bookmark interesting hosts/guests
- [ ] **Compatibility score** - Calculate match based on vibes/dates/languages
- [ ] **Quick filters** - One-click filter presets

### Registration Improvements
- [ ] **Progress persistence** - Save form state across refreshes
- [ ] **Photo upload** - Add during registration, not just edit
- [ ] **Onboarding tour** - Tooltips for first-time users

### Profile Enhancements
- [ ] **Photo gallery** - Multiple photos per profile
- [ ] **Last active** - Show when user was last online
- [ ] **Response rate** - Track invitation response speed

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

- [x] Auth (magic link)
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

---

## Tech Debt

- [ ] Update root CLAUDE.md to mention vitest for Convex tests
- [ ] Consider migrating some tests to bun test for speed
- [ ] Remove unused dependencies from package.json

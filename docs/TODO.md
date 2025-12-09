# TODO - Nešvęsk vienas

Holiday hosting/guest matching platform for Lithuania.

**Last updated**: December 8, 2024

---

## Completed Features

### Core Infrastructure

- [x] Next.js 16 App Router migration
- [x] Convex database + real-time sync
- [x] Clerk authentication (magic link)
- [x] Clerk ↔ Convex bi-directional sync (webhooks)
- [x] Toast notifications (Sonner) - for actions like sending invites, profile saved, errors
- [x] DevPanel for development testing
- [x] 33 backend tests passing (vitest + convex-test)
- [x] E2E testing setup (Playwright + Stagehand v3 + Gemini 2.5 Flash)
- [x] Linting setup (Ultracite + Biome)
- [x] Dev server (Bun + concurrently)

### User Flow

- [x] Multi-step onboarding (4 steps: Preferences → Basic Info → Bio → Languages)
- [x] Preference cards (Can Host / May Host / Can't Host + Guest options)
- [x] Holiday date selection per preference
- [x] Fullscreen onboarding (separate layout, no sidebar)
- [x] Profile creation + editing
- [x] Photo upload + gallery (up to 5 photos, main photo selection)
- [x] Browse hosts/guests with filters (city, date, language)
- [x] Grid/list view toggle
- [x] Shadcn Select dropdowns - Full clickable area for filters
- [x] Tab switch optimization - No "0 found" flash when switching host/guest

### Matching & Messaging

- [x] Send invitations (backend)
- [x] Invitations UI - display pending invitations
- [x] Accept/Decline UI
- [x] Match confirmation
- [x] Contact reveal after match (phone/address)
- [x] Date picker in invite
- [x] Real-time chat
- [x] Message list in sidebar + dedicated MessagesPage
- [x] Unread indicators + badge count
- [x] Notification bell (combined messages + invites)
- [x] Message Profile Integration - View full profile in "Slide-over" sheet while chatting

### Verification

- [x] Face verification API (EdgeFace-XXS + YuNet)
- [x] Verified badge display
- [x] "Verify Identity" button in Dashboard
- [x] Upload component (ID photo + selfie)
- [x] Verification status display (pending/verified/failed)

### Localization

- [x] i18n setup - 4 languages (LT, EN, UA, RU) in single TypeScript file
- [x] LanguageSelector component in navbar
- [x] Landing page fully translated
- [x] EDITING.md guide for non-technical content editing
- [x] Client copy update - Updated i18n.ts with translations from client document

### Layout & Navigation

- [x] Sidebar navigation (AppSidebar)
- [x] TopBar with search + notifications + Clerk UserButton
- [x] Dashboard with stats + quick actions
- [x] Settings page with profile editing in tabs
- [x] Public profile view - `/profile` button to see your profile as others see it
- [x] Location privacy picker (prototype at `/location-picker`)

### Data Sync

- [x] Clerk → Convex webhook - Auto-sync user creation/updates/deletions
- [x] Convex → Clerk delete - `deleteUser` action removes from both systems
- [x] Cascading deletes - User deletion removes all related data

---

## High Priority - UI/UX Redesign

### Navigation Redesign

- [ ] **Switch from sidebar to top bar navigation** - More screen real estate
  - Reference: `docs/couchsurfing-reimagined/components/Navbar.tsx`
  - Items: Dashboard | Inbox | Profile | Settings
  - Keep inbox badge count

### Username Routing

- [x] **`/people/[username]` route** - Human-readable profile URLs
  - ~~See: `docs/USERNAME-ROUTING-ANALYSIS.md` for full plan~~ (archived)
  - [x] Phase 1: Add `username` field to profiles schema + index
  - [x] Phase 2: `getProfileByUsername` query, `checkUsernameAvailability`, `setUsername` mutation
  - [x] Phase 3: New route at `app/(dashboard)/people/[username]/page.tsx`
  - [ ] Phase 4: Username selection in onboarding/settings
  - [x] Phase 5: Update all profile links (listing-card, browse, DevPanel, profile redirect)
  - [x] Keep `/profile/[id]` for backwards compatibility
  - [x] `generateMissingUsernames` mutation for existing profiles
  - [x] Run `generateMissingUsernames` on production to assign usernames

### Profile Card in Chat

- [ ] **Right sidebar mini-profile** - Show while chatting (xl screens)
  - Reference: `docs/couchsurfing-reimagined/components/InboxView.tsx`
  - Avatar, status indicator, references count
  - Verification badges
  - Interests tags
  - **Private notes field** - Yellow sticky note (only you see it)
  - **Labels/tags** - "Friend", "Potential Host", custom labels

### Profile Status System

- [ ] **Status dropdown** - Green/Yellow/Red (Accepting/Maybe/Not Accepting)
  - Reference: `docs/couchsurfing-reimagined/components/ProfileView.tsx`
  - Instant status change from profile card
  - "Wants to Meet Up" option for non-hosting scenarios

---

## High Priority - Features

### Onboarding Improvements

- [ ] **Extended date range** - Dec 23 to Jan 2 (currently only 24, 25, 26, 31)
- [ ] **Inline date selection in preference cards** - Dates should expand within/below the selected preference card itself (not in a separate colored box). When user selects "Can Host" or "Looking for Host", the date picker should feel like part of that card's expanded state - more cohesive single-choice experience
- [ ] **Typeahead city search** - Instead of dropdown, autocomplete Lithuanian cities
- [ ] **Profile completion indicator** - "You're 80% done!" encouragement UI
- [ ] **State persistence** - Auto-save each step to Convex (no data loss on refresh)

### Email Integration (Resend)

- [ ] **Set up Resend API** - For transactional emails
- [ ] **Email verification** - Optional badge, don't force signup verification (avoid drop-offs)
- [ ] **Match notifications** - Email when someone accepts your invite
- [ ] **New message notifications** - Email digest for unread messages

### Browse/Discovery Enhancements

- [ ] **Bigger filter system**:
  - Filter by interests
  - Filter by gender
  - Filter by verification status
  - Filter by hosting status (Can Host / May Host / All)
- [ ] **Map view** - Show hosts on interactive map (with privacy circles)
- [ ] **Compatibility score** - Match based on vibes/dates/languages/interests

### Chat/Inbox Improvements

- [ ] **Archive conversations**
- [ ] **Block user functionality**
- [ ] **Report user modal** with reasons (Spam, Inappropriate, Harassment, Fake Profile, Other)

---

## Medium Priority

### "My Home" Section

- [ ] **Detailed hosting preferences** in Settings/Profile tab
  - Max guests
  - Sleeping arrangements (Private/Shared/Common)
  - Pet-friendly (yes/no)
  - Smoking policy (No/Outside/Yes)
  - Kid-friendly
  - Wheelchair accessible
  - Roommate situation
  - Public transport info
  - House rules text
  - Reference: `docs/archive/PIVOT-ANALYSIS.md` for full field list

### References System

- [ ] **Leave reference** - After confirmed meetup, prompt to leave reference
- [ ] **Reference types** - Host / Guest / Personal
- [ ] **Positive/Negative indicator**
- [ ] **Respond to references** - Reply to references left on your profile
- [ ] Reference: `docs/couchsurfing-reimagined/types.ts` for Reference interface

### Verification Enhancements

- [ ] **Phone verification** - Via SMS or authenticator app (Clerk supports this)
- [ ] **Email verification badge** - Show if email is verified
- [ ] **Photo verification badge** - Current face verification
- Note: NOT doing Government ID verification

### Profile Enhancements

- [ ] **Last active** - Show when user was last online
- [ ] **Response rate** - Track invitation response speed
- [ ] **Interests/hobbies** - Beyond just "vibes"

### Dashboard i18n (~210-260 strings)

- [x] **app-sidebar.tsx** - Nav labels (~5 strings)
- [x] **top-bar.tsx** - Page titles (~5 strings)
- [ ] **verify-banner.tsx** - Banner message (~2 strings)
- [ ] **onboarding/page.tsx** - Multi-step form (~30-35 strings)
- [x] **browse/page.tsx** - Filters, empty states, buttons (~30-35 strings)
- [ ] **profile/[id]/page.tsx** - Status messages, CTAs (~25-30 strings)
- [ ] **location-picker/page.tsx** - Instructions, labels (~20-25 strings)
- [x] **settings/page.tsx** - Many labels & descriptions (~50-55 strings)
- [ ] **messages/page.tsx** - Modals, dynamic text, status messages (~35-40 strings)
- [ ] **Dynamic text helpers** - Template interpolation for "{name}", "{count}", etc.

### Content Moderation

- [ ] **Profanity filter** - Use `obscenity` library (detects evasion like "fuuuck")
- [ ] **Block on flagged message** - Message not sent, user notified
- [ ] **Admin notification** - Flag to admin/dashboard for review
- [ ] **Temporary suspension** - Repeat offenders get temp banned

### Card Playground / Dev Mode

- [ ] **`/dev/cards` route** - Experiment with card designs
- [ ] Test different card layouts, sizes, information density
- [ ] Reference the mockup cards in `docs/couchsurfing-reimagined/`

---

## Low Priority / Post-MVP

### Monitoring & Error Tracking

- [x] **Sentry integration** - Automatic error capture and alerting
  - Catches JS errors, shows stack traces, user context
  - Free tier: 5,000 errors/month
  - Configured: `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - Test page: `/sentry-example-page`
- [x] **Error boundaries** - Graceful error handling in React
  - `app/global-error.tsx` - catches and reports to Sentry
- [ ] **Report Problem button** - User feedback mechanism
  - Footer link or floating button
  - Options: simple mailto link, feedback form modal, or Sentry's feedback widget
  - Store reports in Convex or send to email

### Analytics & Performance

- [x] **Vercel Analytics** - Enabled in Vercel dashboard
  - Page views, unique visitors, referrers
- [x] **Vercel Speed Insights** - Core Web Vitals monitoring
  - Track page load times, performance scores
- [x] **SEO** - Meta tags, OpenGraph, sitemap
  - [x] Root layout metadata (title, description, keywords, OG, Twitter cards)
  - [x] `sitemap.ts` - Dynamic sitemap generation
  - [x] `robots.ts` - Search engine crawling rules
  - [x] Browse page metadata
  - [x] Dynamic profile page metadata with `generateMetadata`
  - [ ] **Manual: Create OG image** - Need `public/og-image.png` (1200x630px)
  - [ ] **Manual: Google Search Console** - Add property, verify ownership, submit sitemap
  - [ ] **Manual: Bing Webmaster Tools** - Add site, verify, submit sitemap
  - [ ] **Manual: Add verification codes** - In `app/layout.tsx` verification field
  - [ ] **Manual: Set NEXT_PUBLIC_SITE_URL** - In Vercel env vars (e.g., `https://nesveskvienas.lt`)
- [ ] **PWA** - Installable app with offline support (stretch goal)

### Legal & Safety Pages

- [ ] **Safety Guidelines Page** (`/safety`) - User safety tips and best practices
  - Review profiles carefully, trust instincts, have backup plan
  - Communicate through platform, know your limits, leave references
  - Reference: `docs/courchsurfing-pages/main-about-site/about-safety.md`
  - Reference: `docs/courchsurfing-pages/main-about-site/about-tips.md`
- [ ] **Community Guidelines Page** (`/guidelines`) - How to behave on the platform
  - Be considerate and respectful, resolve disputes together
  - Don't attack members, use good judgment, report violations
  - Reference: `docs/courchsurfing-pages/main-about-site/about-guidelines.md`
- [ ] **Policies Page** (`/policies`) - Platform rules and conduct
  - No spam, no dating/hookups, no charging for hosting
  - No harassment, one profile only, keep it legal
  - Content policy (hate speech, explicit content, etc.)
  - Reference policy (14-day window, when refs can be removed)
  - Reference: `docs/courchsurfing-pages/main-about-site/about-policies.md`
- [ ] **FAQ Page** (`/faq`) - Common questions about safety and platform
  - Is it safe? How to report problems? References explained
  - What to do in emergencies, message disputes
  - Reference: `docs/courchsurfing-pages/main-about-site/about-faq.md`
- [ ] **Terms of Service** (`/terms`) - Legal terms
  - Eligibility (18+), member conduct, liability release
  - Reference: `docs/courchsurfing-pages/main-about-site/about-terms-of-use.md`
- [ ] **Privacy Policy** (`/privacy`) - GDPR compliance
- [ ] **Cookie consent** - Banner for EU users

### Future Features

- [ ] Save/favorite profiles - Bookmark interesting hosts/guests
- [ ] Voice/video call integration (stretch goal)
- [ ] Easter event expansion
- [ ] Year-round hosting mode

---

## Tech Debt

- [x] Remove `@tensorflow/tfjs` from package.json (face-api bundles it internally) - DONE
- [x] Clean up old Bun server files (src/ folder) - DONE (folder doesn't exist)
- [x] Consolidate experiments into `app/(experiments)/` - landing1-3, client1-3, sentry-example-page, location-picker
- [x] Add `@vercel/analytics` to layout.tsx (was missing the `<Analytics />` component)
- [x] Set up Convex testing with vitest (`bun run test`) - 3 tests passing
- [ ] Reduce component complexity (BrowsePage, MessagesPage, ProfilePages) - partially done, still has warnings
- [ ] **[Future] Migrate images to Cloudflare R2** - Zero egress fees vs Convex bandwidth limits (50GB/mo on Pro). Not urgent now, consider if scaling past 1K active users.

---

## Archived Docs

The following docs have been moved to `docs/archive/`:

- `holiday-platform-planning-2.md` - Original spec (superseded by this TODO)
- `PIVOT-ANALYSIS.md` - Couchers-style analysis (key items added here)
- `verification-stack-options.md` - Verification research (implemented EdgeFace approach)

### Reference Docs (Keep Active)

- `CLAUDE.md` - Claude Code instructions
- `README.md` - Project overview
- `CHANGELOG.md` - Version history
- `reference-projects/couchsurfing-reimagined/` - **Mockup project for UI reference** (Important!)
- `client-visual/` - Visual design references
- `courchsurfing-pages/` - Scraped Couchsurfing pages for legal/safety page templates

---

## Quick Reference

### Toast Notifications

Yes, we have toasts via Sonner. Used for actions (invite sent, profile saved, errors).
NOT used for real-time message notifications (those use bell icon badge).

```tsx
import { toast } from "sonner";
toast.success("Profile saved!");
toast.error("Something went wrong");
```

### Clerk Phone Verification

Clerk supports phone verification out of the box via SMS. Can be enabled in Clerk dashboard.
Also supports authenticator app (TOTP) for 2FA if needed.

### Key Mockup Files

- `docs/reference-projects/couchsurfing-reimagined/components/Navbar.tsx` - Top bar navigation
- `docs/reference-projects/couchsurfing-reimagined/components/Dashboard.tsx` - Browse/Find page
- `docs/reference-projects/couchsurfing-reimagined/components/InboxView.tsx` - Chat with profile sidebar
- `docs/reference-projects/couchsurfing-reimagined/components/ProfileView.tsx` - Profile with status dropdown
- `docs/reference-projects/couchsurfing-reimagined/types.ts` - TypeScript interfaces for Reference, etc.

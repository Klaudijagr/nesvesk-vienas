# Nešvęsk vienas - Planning Document

**Name**: Nešvęsk vienas ("Don't celebrate alone") **URL**: <https://v0-nesvesk-vienas-app.vercel.app>

## Open Questions

1. Character limits on any free-text fields? (bio, dietary notes, etc.)

2. Video call integration - which provider? (stretch goal, not MVP)

## Answered

| Question | Answer |
| --- | --- |
| Reviews after event? | Yes, like Couchsurfing - for future events |
| What happens after Christmas? | Depends on success - could continue for Easter, etc. |
| Age restrictions? | 18+ only |

Invitations/event links should be shareable.

## Full Spec (Decided)

### Languages

- **Lithuanian, English, Ukrainian, Russian** (all four)

### Dates Available

- December 24th, 25th, 26th, 31st (users can select multiple)

### Host Registration Fields

| Field | Visibility | Notes |
| --- | --- | --- |
| Name | Public (surname hidden until match) |  |
| City + Area | Public | Vilnius, Kaunas, Klaipėda, Šiauliai, Panevėžys |
| How many guests | Public | Capacity |
| Dietary info | Public | Vegan, vegetarian, no lactose, no alcohol, etc. |
| Preferred languages | Public | Multi-select from all 4 |
| Preferred guest age | Public | Range or preference |
| Concept | Public | Party / Dinner / Hangout |
| Available dates | Public | Multi-select: 24, 25, 26, 31 Dec |
| Photos | Public (optional) |  |
| Address | **Hidden until match** |  |
| Contact (phone, email) | **Hidden until match** | Email used for registration |

### Guest Registration Fields

| Field | Visibility | Notes |
| --- | --- | --- |
| Name | Public (surname hidden until match) |  |
| Age | Public |  |
| City | Public |  |
| Dietary preferences | Public |  |
| Languages | Public |  |
| Available dates | Public | Multi-select: 24, 25, 26, 31 Dec |
| Photos | Public (optional) |  |
| Full name | **Hidden until match** |  |
| Address | **Hidden until match** |  |
| Contact (phone, email) | **Hidden until match** | Email used for registration |

### Browse & Filter

Both hosts and guests can browse and filter by:

- City
- Age
- Languages
- Date

### Matching Flow

```
1. User browses listings (hosts see guests, guests see hosts)

2. Either side can initiate:
   - Host clicks "Invite" on a guest
   - Guest clicks "Become a guest" on a host

3. Other party gets email notification

4. They accept or decline:
   - Accept → Both get contact details, moved to "Christmas matches" page
   - Decline → Requester gets polite "no" email

5. Celebrate together 🎄
```

### Pages Needed

1. **Landing page** ✅ (done)
2. **Registration** - Host flow
3. **Registration** - Guest flow
4. **Browse listings** - with filters (city, age, languages, date, photos, verified)
5. **Profile view** - individual host/guest detail
6. **Messages** - inbox/conversation view
7. **Christmas matches** - confirmed matches with contact details
8. **My profile** - edit own profile, see pending invitations
9. **Photo verification** - upload live photo to verify (optional)
10. **Terms of Service / Privacy Policy**

### Core Decisions Summary

- **Discovery model**: Browse-based with filtering
- **Who initiates**: Either side (host invites guest, OR guest requests host)
- **Selection process**: Mutual confirmation required
- **Photos**: Optional
- **Contact exchange**: Only after mutual match
- **Verification**: Email required (for registration + notifications)
- **Age restriction**: 18+ only

### Communication Features

| Feature | Priority | Notes |
| --- | --- | --- |
| In-app messaging | **MVP** | Users can message after invitation sent (before match) |
| Voice/video call | Stretch | Not MVP - depends on difficulty |

### Verification & Trust

| Feature | Required? | Notes |
| --- | --- | --- |
| Email verification | Required | For registration |
| Photo verification | Optional | Compare uploaded photos to live photo |
| Reviews/ratings | Post-event | Like Couchsurfing - builds trust for future events |

### Browse Filters

Users can filter listings by:

- City
- Age
- Languages
- Date
- **Has photos / No photos**
- **Verified / Not verified**

## Tech Stack

- **Framework**: Next.js (confirmed - deployed on Vercel)
- **Hosting**: Vercel (free tier)
- **Database**: Convex or Supabase (free tier) — TBD
- **Auth**: Clerk (free up to 50k users)
- **UI**: shadcn/ui
- **Package manager**: Bun (Chi) / pnpm or npm (her)
- **Monitoring**: Sentry (free tier)
- **Email**: Resend or similar (for match notifications)
- **i18n**: next-intl or similar (for 4 languages)
- **No AI features** for now

## Database Schema (Rough)

```
Users
├── id
├── email (unique, for auth)
├── role: "host" | "guest"
├── firstName
├── lastName (hidden until match)
├── city
├── area (for larger cities)
├── age (guests) / preferredGuestAge (hosts)
├── languages[]
├── dietaryInfo
├── concept (hosts only): "party" | "dinner" | "hangout"
├── capacity (hosts only)
├── availableDates[]
├── photos[] (optional)
├── isPhotoVerified: boolean
├── address (hidden until match)
├── phone (hidden until match)
├── createdAt
└── updatedAt

Invitations
├── id
├── fromUserId
├── toUserId
├── status: "pending" | "accepted" | "declined"
├── date (which holiday date)
├── createdAt
└── updatedAt

Messages
├── id
├── conversationId (or recipientId + senderId)
├── senderId
├── content
├── readAt
├── createdAt

Matches (derived from accepted invitations)
├── id
├── hostId
├── guestId
├── date
├── createdAt

Reviews (post-event)
├── id
├── matchId
├── reviewerId
├── revieweeId
├── rating (1-5?)
├── text
├── createdAt
```

## Legal/Safety Notes

All comparable apps (TimeLeft, 222, Couchsurfing) use the same legal approach:

**Terms of Service must include:**

- Statement that you are a "platform" not a party to interactions
- Full liability release - users release the company from claims
- User warranties: 18+, no violent/sexual crime history, agreement not to misuse
- GDPR compliance statement (required in EU/Lithuania)
- Right to terminate accounts, reporting mechanism

**For Lithuania specifically:**

- GDPR compliance required from day one
- Consider whether VšĮ (nonprofit entity) registration is needed, or if informal operation is okay for MVP

**Key difference from TimeLeft/222**: Those apps use public venues as a safety layer. Private home hosting shifts more risk to users — Terms of Service language matters more.

## Comparable Apps

**Most similar model (home hosting, mutual matching):**

| App | Model | Key Difference |
| --- | --- | --- |
| **Couchsurfing** | Browse hosts, send request, mutual accept | For travelers, not holidays |
| **Couchers.org** | Same as CS, free/nonprofit | Direct CS replacement |
| **BeWelcome** | Same as CS, free/nonprofit | Smaller, open source |

**Nešvęsk vienas is unique**: Combines home hosting with seasonal/holiday focus + support for Ukrainian refugees. Nobody else is doing exactly this.

## Next Steps

### MVP (Launch before Christmas)

1. ✅ Landing page done
2. ✅ Full spec defined
3. Build registration flows (host + guest)
4. Build browse/listing view with filters
5. Build messaging system
6. Build invitation system + email notifications
7. Build "Christmas matches" page
8. Draft Terms of Service (adapt Couchsurfing's language)
9. Add i18n for all 4 languages
10. Launch with PR push

### Post-MVP (If successful)

- Photo verification (live photo comparison)
- Reviews/ratings system
- Voice/video call integration
- Easter event
- Expand to other holidays / year-round

## Future Holidays (If Successful)

| Holiday             | Dates       | Notes               |
| ------------------- | ----------- | ------------------- |
| Christmas           | Dec 24-26   | ✅ Launch           |
| New Year's          | Dec 31      | ✅ Launch           |
| Easter              | March/April | Potential expansion |
| Midsummer (Joninės) | June 24     | Very Lithuanian!    |
| Other?              | TBD         | Based on demand     |

# Pivot Analysis: From Event-Centric to Profile-Centric Platform

## Current State vs. Proposed Vision

### What We Have Now

**Current Flow:**
1. User signs up → Multi-step onboarding (3 steps: Photo/Basic Info → Bio → Languages/Dates)
2. Pick role (Host/Guest/Both)
3. Browse page with filters by City, Date, Language
4. Send invitation → Accept/Decline → Match → Chat → Share contact details
5. Events page for confirmed gatherings

**Current Schema Fields (profiles):**
- `role` - host/guest/both
- `firstName`, `lastName`, `age`, `city`, `bio`
- `photoUrl`, `photos[]` - up to 5 photos
- `verified` - identity verification
- `languages[]`, `availableDates[]`
- `dietaryInfo[]`
- Host-specific: `concept`, `capacity`, `amenities[]`, `houseRules[]`, `vibes[]`
- Host-specific: `smokingAllowed`, `drinkingAllowed`, `petsAllowed`, `hasPets`
- Contact (hidden): `phone`, `address`

**Current Limitations:**
- Onboarding is quick but shallow (doesn't capture hosting preferences well)
- Role selection is binary (host/guest/both) - not like Couchers' fluidity
- Holiday-date focus is good for niche but limits flexibility
- No "My Home" section with detailed hosting info
- No map view (in TODO)

---

## Couchers.org / Couchsurfing Model

### Hosting Status (Preference Cards UI)
Like your `user-preferences-ui` reference project:

| Status | Icon | Description |
|--------|------|-------------|
| **Can host** | ✓ | "I am eager to let people stay with me" |
| **May host** | ? | "I might be able to host, depending on circumstances" |
| **Can't host** | ✗ | "I'm not able to host travelers at the moment" |

| Meetup Status | Icon | Description |
|---------------|------|-------------|
| **Wants to meet** | ✓ | "I'm eager to meet up with others" |
| **Open to meet** | ? | "I might meet up, depending on circumstances" |
| **Can't meet** | ✗ | "I prefer not to meet up with others" |

### "My Home" Section (Couchers/Couchsurfing)
- **Hosting Preferences**: Last-minute guests, people with children, pets, drinking
- **Maximum Guests**: Number slider
- **Smoking Policy**: No, Outside/Window, Yes
- **Sleeping Arrangement**: Private, Common, Shared
- **Household Details**: Housemates, House kids, Has pets
- **Home Facilities**: Wheelchair accessible, Tent camping, Parking
- **Household Habits**: Drinks at home, Smokes at home
- **Local Area Info**: Description of neighborhood
- **House Rules**: Custom text
- **Additional Info**: Anything else guests should know

### Key Differences

| Aspect | Nešvęsk Vienas (Current) | Couchers Model |
|--------|--------------------------|----------------|
| **Role** | Binary (host/guest/both) | Fluid (status can change anytime) |
| **Availability** | Specific dates (24-31 Dec) | Always-on (Can host / Maybe / Can't) |
| **Focus** | Event-based matching | Profile-based exploration |
| **Discovery** | Filter by dates → find hosts | Browse all → filter by preferences |
| **Events Tab** | Central feature | Could be redundant |

---

## Recommendation: Hybrid Approach

Since you're focused on **Lithuanian holidays** (niche is good!), I suggest a hybrid:

### Keep What Works
- ✅ **Holiday date focus** - Your differentiator vs. Couchers/CS
- ✅ **Verification flow** - Trust is critical
- ✅ **Multi-language support** - Important for Ukraine refugees
- ✅ **City-based filtering** - Lithuania is small, cities matter
- ✅ **Chat + invitation flow** - Good UX

### Add from Couchers Model

#### 1. **Preference Cards in Onboarding** (from `user-preferences-ui`)
Replace the simple "I want to be a host/guest/both" with:

```
Step 1: Hosting Status
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│      ✓          │  │       ?         │  │       ✗         │
│   Can Host      │  │   May Host      │  │   Can't Host    │
│ I'm eager to    │  │ Depending on    │  │ Not hosting     │
│ welcome guests  │  │ circumstances   │  │ right now       │
└─────────────────┘  └─────────────────┘  └─────────────────┘

Step 2: Meetup Status (for non-hosts or additional)
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│      ✓          │  │       ?         │  │       ✗         │
│  Wants to Meet  │  │  Open to Meet   │  │   Can't Meet    │
│ I'm eager to    │  │ Might meet up   │  │ Prefer not to   │
│ meet people     │  │ depending on... │  │ meet right now  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### 2. **"My Home" Tab in Profile/Settings**
New section with detailed hosting preferences:

```tsx
// Suggested new fields for profiles schema
hostingStatus: "can_host" | "may_host" | "cant_host",
meetupStatus: "wants_to_meet" | "open_to_meet" | "cant_meet",

// My Home section
home: {
  lastMinuteGuests: boolean,
  okWithChildren: boolean,
  okWithPets: boolean,
  maxGuests: number,
  smokingPolicy: "no" | "outside" | "yes",
  sleepingArrangement: "private" | "common" | "shared",
  wheelchairAccessible: boolean,
  parkingAvailable: boolean,
  hasHousemates: boolean,
  hasKids: boolean,
  aboutHome: string,      // "What I can share with guests"
  houseRulesText: string, // Free-form house rules
  neighborhoodInfo: string,
}
```

#### 3. **Browse Page Redesign**
- Remove host/guest toggle → Show everyone
- Add hosting status filter: "Can host", "May host", "All"
- Add capability filters: "Wheelchair accessible", "Pet-friendly", etc.
- Map view (already in TODO)
- Compatibility score (already in TODO)

#### 4. **Events Tab: Keep but Repurpose**
Instead of being the primary flow, events become:
- **Post-match confirmation** - When matched, host creates "event" with details
- **Public holiday gatherings** - Optional: hosts can post open events
- Could also work for "host is having a dinner party, looking for 3 guests"

---

## Implementation Plan

### Phase 1: Onboarding Redesign (~2-3 days)
- [ ] Add `hostingStatus` and `meetupStatus` fields to schema
- [ ] Create `PreferenceCard` component (already have reference!)
- [ ] Update onboarding to use Preference Cards instead of role buttons
- [ ] Keep holiday date selection (your differentiator)

### Phase 2: Profile "My Home" Section (~2-3 days)
- [ ] Add `home` object fields to schema
- [ ] Create "My Home" tab in Settings page
- [ ] Build form with all hosting preference fields
- [ ] Add "About My Home" rich text / textarea

### Phase 3: Browse Page Updates (~1-2 days)
- [ ] Remove host/guest toggle (or make it a filter)
- [ ] Add hosting status filter ("Can host", "May host", "All")
- [ ] Add preference filters (pets, smoking, accessibility)
- [ ] Update profile cards to show hosting status prominently

### Phase 4: Map View (~2-3 days) 
- [ ] Add approximate location to profiles (MapLibre + OpenStreetMap)
- [ ] Privacy slider for location accuracy
- [ ] Map view tab on browse page

### Phase 5: Polish (~1-2 days)
- [ ] Compatibility score algorithm
- [ ] Last active timestamps
- [ ] Response rate tracking

---

## Questions to Decide

1. **Holiday Dates vs Year-Round**
   - Keep holiday dates as primary? (niche = good)
   - Or expand to year-round hosting with "seasonal availability"?

2. **Events Feature**
   - Keep as-is for confirmed gatherings?
   - Add "public events" for open invitations?
   - Or deprecate entirely?

3. **Location Privacy**
   - Approximate circle (like Couchers)?
   - City-level only (current)?
   - Street-level after match?

4. **Onboarding Depth**
   - Quick 3-step (current) + fill "My Home" later?
   - Or longer onboarding with all preferences upfront?

---

## Reference Projects Summary

### `docs/reference-projects/user-preferences-ui`
**Use for:** Preference Cards component (Hosting Status, Meetup Status)
- Beautiful card-based selection UI
- Already styled, just needs integration
- Icons: ✓ / ? / ✗ for clear visual hierarchy

### `docs/reference-projects/couchers-event-manager`
**Use for:** Event creation modal design
- AI-powered event description
- Nice form layout with date/time/location
- Could inform public events feature

---

## Next Steps

1. **Decide on scope** - Full pivot or gradual addition?
2. **Schema migration** - Plan Convex schema changes
3. **Start with onboarding** - Integrate Preference Cards
4. **Then "My Home" section** - Add to Settings page
5. **Finally browse updates** - New filters and map view

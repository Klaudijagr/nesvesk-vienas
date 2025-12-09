# Username Routing Analysis: `/people/[username]`

## Current State

### Profile Routing

- **Current route**: `/profile/[id]` where `id` is the Convex user ID (e.g., `j123abc...`)
- **Location**: `app/(dashboard)/profile/[id]/page.tsx`
- **Query function**: `api.profiles.getProfile` takes `userId: Id<"users">`

### Database Schema

- **No username field exists** - profiles are identified only by `userId` (Convex ID)
- Profile schema in `convex/schema.ts` has:
  - `userId: v.id("users")` - links to users table
  - `firstName`, `lastName`, `bio`, etc.
  - **Missing**: `username` field

### Where Profile Links Are Used

1. `app/(dashboard)/profile/page.tsx` - redirects to own profile
2. `app/(dashboard)/profile/[id]/page.tsx` - main profile view page
3. `components/listing-card.tsx` - 3 instances (image link, bio link, button)
4. `app/(dashboard)/browse/page.tsx` - "View Profile" button
5. `components/DevPanel.tsx` - dev panel links
6. `components/top-bar.tsx` - pathname detection for page title

## Implementation Plan

### Phase 1: Database Schema Changes ⚠️ **REQUIRES MIGRATION**

**File**: `convex/schema.ts`

1. Add `username` field to `profiles` table:
   ```typescript
   username: v.optional(v.string()), // Unique, lowercase, alphanumeric + hyphens
   ```

2. Add unique index:
   ```typescript
   .index("by_username", ["username"])
   ```

**Migration considerations:**
- Existing profiles won't have usernames initially
- Need to handle null/undefined usernames during transition
- Can make username required later after migration

### Phase 2: Backend Functions

**File**: `convex/profiles.ts`

1. **Add query to get profile by username**:
   ```typescript
   export const getProfileByUsername = query({
     args: { username: v.string() },
     handler: async (ctx, args) => {
       const profile = await ctx.db
         .query("profiles")
         .withIndex("by_username", (q) => q.eq("username", args.username.toLowerCase()))
         .first();
       // ... same privacy logic as getProfile
     },
   });
   ```

2. **Add mutation to check username availability**:
   ```typescript
   export const checkUsernameAvailability = query({
     args: { username: v.string() },
     handler: async (ctx, args) => {
       const normalized = args.username.toLowerCase().trim();
       const existing = await ctx.db
         .query("profiles")
         .withIndex("by_username", (q) => q.eq("username", normalized))
         .first();
       return !existing;
     },
   });
   ```

3. **Add mutation to set/update username**:
   ```typescript
   export const setUsername = mutation({
     args: { username: v.string() },
     handler: async (ctx, args) => {
       const userId = await getCurrentUserId(ctx);
       if (!userId) throw new Error("Not authenticated");
       
       const normalized = args.username.toLowerCase().trim();
       // Validate format: alphanumeric + hyphens, 3-20 chars
       if (!/^[a-z0-9-]{3,20}$/.test(normalized)) {
         throw new Error("Invalid username format");
       }
       
       // Check availability
       const existing = await ctx.db
         .query("profiles")
         .withIndex("by_username", (q) => q.eq("username", normalized))
         .first();
       
       if (existing && existing.userId !== userId) {
         throw new Error("Username already taken");
       }
       
       // Update profile
       const profile = await ctx.db
         .query("profiles")
         .withIndex("by_userId", (q) => q.eq("userId", userId))
         .first();
       
       if (!profile) throw new Error("Profile not found");
       
       await ctx.db.patch(profile._id, { username: normalized });
     },
   });
   ```

4. **Update `upsertProfile` mutation** to accept optional username:
   ```typescript
   username: v.optional(v.string()),
   ```

### Phase 3: Frontend Routes

**New file**: `app/(dashboard)/people/[username]/page.tsx`

- Similar to `profile/[id]/page.tsx` but uses `getProfileByUsername`
- Handle both username and ID routes for backward compatibility

**Option A: Keep both routes** (recommended for gradual migration)
- `/profile/[id]` - still works for existing links
- `/people/[username]` - new preferred route

**Option B: Redirect old route to new**
- `/profile/[id]` → fetch profile → redirect to `/people/[username]`
- More complex, breaks existing links temporarily

### Phase 4: Username Selection UI

**File**: `app/onboarding/page.tsx` or `app/(dashboard)/settings/page.tsx`

Add username input field:
- Real-time availability checking
- Format validation (3-20 chars, alphanumeric + hyphens)
- Show suggestions if taken
- Make it optional initially, required later

### Phase 5: Update All Profile Links

**Files to update**:
1. `components/listing-card.tsx` - change `/profile/${userId}` → `/people/${username}`
2. `app/(dashboard)/browse/page.tsx` - update link
3. `app/(dashboard)/profile/page.tsx` - redirect to username route
4. `components/DevPanel.tsx` - update dev links
5. Any other components linking to profiles

**Helper function**: Create `getProfileUrl(profile)` utility:
```typescript
export function getProfileUrl(profile: { username?: string; userId: Id<"users"> }): string {
  if (profile.username) {
    return `/people/${profile.username}`;
  }
  // Fallback to ID route for profiles without username
  return `/profile/${profile.userId}`;
}
```

## Effort Estimate

| Phase | Time | Complexity |
|-------|------|------------|
| Schema changes | 15 min | Low |
| Backend functions | 1-2 hours | Medium |
| New route page | 30 min | Low |
| Username UI | 1-2 hours | Medium |
| Update all links | 30-45 min | Low |
| Testing & edge cases | 1 hour | Medium |
| **Total** | **4-6 hours** | **Medium** |

## Edge Cases to Handle

1. **Existing profiles without usernames**
   - Support both routes during transition
   - Prompt users to set username on next login

2. **Username validation**
   - Format: `^[a-z0-9-]{3,20}$`
   - Reserved words: `admin`, `api`, `people`, `profile`, etc.
   - Case-insensitive matching

3. **Username changes**
   - Allow changes? (recommend: yes, but limit frequency)
   - Update all links? (no, old links can redirect)

4. **Backward compatibility**
   - Keep `/profile/[id]` route working
   - Redirect to username route if username exists

5. **SEO considerations**
   - Username routes are more SEO-friendly
   - Consider adding profile metadata

## Recommended Approach

1. **Start with optional username** - don't break existing functionality
2. **Add username during onboarding** - prompt users to set it
3. **Gradually migrate links** - update as you touch each component
4. **Keep ID route** - for backward compatibility and fallback
5. **Make username required later** - after most users have set one

## Questions to Consider

1. **Should usernames be changeable?**
   - Yes: More flexible, but breaks shareable links
   - No: More stable, but users stuck with bad choices

2. **Should we migrate existing users?**
   - Auto-generate from firstName? (e.g., `john-smith-123`)
   - Require manual selection?

3. **Reserved usernames?**
   - System routes: `admin`, `api`, `people`, `profile`, `settings`, etc.
   - Common words: `about`, `help`, `contact`, etc.

4. **Username display?**
   - Show `@username` in profile?
   - Use in URLs only?

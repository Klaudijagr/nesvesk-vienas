import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

// Holiday date type for reuse
const holidayDate = v.union(
  v.literal("24 Dec"),
  v.literal("25 Dec"),
  v.literal("26 Dec"),
  v.literal("31 Dec")
);

// Get events the current user is hosting or attending
export const getMyEvents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return { hosting: [], attending: [] };
    }

    // Events I'm hosting
    const hosting = await ctx.db
      .query("events")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    // All events (need to filter for ones I'm attending)
    const allEvents = await ctx.db
      .query("events")
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    const attending = allEvents.filter(
      (e) => e.guestIds.includes(userId) && e.hostId !== userId
    );

    // Enrich with host profiles
    const enrichEvent = async (event: (typeof hosting)[0]) => {
      const hostProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", event.hostId))
        .first();

      const guestProfiles = await Promise.all(
        event.guestIds.map(async (guestId) => {
          const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", guestId))
            .first();
          return profile;
        })
      );

      return {
        ...event,
        hostProfile,
        guestProfiles: guestProfiles.filter(Boolean),
      };
    };

    return {
      hosting: await Promise.all(hosting.map(enrichEvent)),
      attending: await Promise.all(attending.map(enrichEvent)),
    };
  },
});

// Get all public events (for browse page)
export const getPublicEvents = query({
  args: {
    city: v.optional(v.string()),
    date: v.optional(holidayDate),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    let events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("status"), "upcoming"))
      .collect();

    // Filter by date if provided
    if (args.date) {
      events = events.filter((e) => e.eventDate === args.date);
    }

    // Enrich with host profiles and filter by city if provided
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const hostProfile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", event.hostId))
          .first();

        return {
          ...event,
          hostProfile,
          isOwner: event.hostId === userId,
          isAttending: userId ? event.guestIds.includes(userId) : false,
        };
      })
    );

    // Filter by city if provided
    if (args.city) {
      return enrichedEvents.filter((e) => e.hostProfile?.city === args.city);
    }

    return enrichedEvents;
  },
});

// Get single event details
export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return null;
    }

    const hostProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", event.hostId))
      .first();

    const guestProfiles = await Promise.all(
      event.guestIds.map(async (guestId) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", guestId))
          .first();
        return profile;
      })
    );

    return {
      ...event,
      hostProfile,
      guestProfiles: guestProfiles.filter(Boolean),
      isOwner: event.hostId === userId,
      isAttending: userId ? event.guestIds.includes(userId) : false,
    };
  },
});

// Create a new event
export const createEvent = mutation({
  args: {
    eventDate: holidayDate,
    title: v.optional(v.string()),
    time: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const eventId = await ctx.db.insert("events", {
      hostId: userId,
      eventDate: args.eventDate,
      title: args.title,
      time: args.time,
      address: args.address,
      notes: args.notes,
      guestIds: [],
      status: "upcoming",
      createdAt: Date.now(),
    });

    return eventId;
  },
});

// Update an event
export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    time: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.hostId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.eventId, {
      title: args.title,
      time: args.time,
      address: args.address,
      notes: args.notes,
    });

    return { success: true };
  },
});

// Cancel an event
export const cancelEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.hostId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.eventId, { status: "cancelled" });

    return { success: true };
  },
});

// Mark event as completed
export const completeEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.hostId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.eventId, { status: "completed" });

    return { success: true };
  },
});

// Get count of upcoming events for the user
export const getUpcomingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return 0;
    }

    // Events I'm hosting
    const hosting = await ctx.db
      .query("events")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.eq(q.field("status"), "upcoming"))
      .collect();

    // All upcoming events to check attendance
    const allEvents = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("status"), "upcoming"))
      .collect();

    const attending = allEvents.filter(
      (e) => e.guestIds.includes(userId) && e.hostId !== userId
    );

    return hosting.length + attending.length;
  },
});

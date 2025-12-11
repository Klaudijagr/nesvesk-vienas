import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

describe("profiles", () => {
  test("listProfiles returns empty array when no profiles exist", async () => {
    const t = convexTest(schema);
    const profiles = await t.query(api.profiles.listProfiles, {});
    expect(profiles).toEqual([]);
  });

  test("listProfiles filters by city", async () => {
    const t = convexTest(schema);

    // Create a test user first
    const userId = await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "test-clerk-id",
          email: "test@example.com",
          name: "Test User",
        })
    );

    // Create a profile in Vilnius
    await t.run(async (ctx) => {
      await ctx.db.insert("profiles", {
        userId,
        role: "host",
        firstName: "Test",
        age: 25,
        city: "Vilnius",
        bio: "Test bio",
        verified: false,
        languages: ["English"],
        availableDates: ["24 Dec"],
        dietaryInfo: [],
        amenities: [],
        houseRules: [],
        vibes: [],
        smokingAllowed: false,
        drinkingAllowed: false,
        petsAllowed: false,
        hasPets: false,
      });
    });

    // Query should find the Vilnius profile
    const vilniusProfiles = await t.query(api.profiles.listProfiles, {
      city: "Vilnius",
    });
    expect(vilniusProfiles.length).toBe(1);
    expect(vilniusProfiles[0].city).toBe("Vilnius");

    // Query for Kaunas should return empty
    const kaunasProfiles = await t.query(api.profiles.listProfiles, {
      city: "Kaunas",
    });
    expect(kaunasProfiles.length).toBe(0);
  });

  test("listProfiles filters by role", async () => {
    const t = convexTest(schema);

    // Create test users
    const hostUserId = await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "host-clerk-id",
          email: "host@example.com",
        })
    );

    const guestUserId = await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "guest-clerk-id",
          email: "guest@example.com",
        })
    );

    // Create profiles
    await t.run(async (ctx) => {
      await ctx.db.insert("profiles", {
        userId: hostUserId,
        role: "host",
        firstName: "Host",
        age: 30,
        city: "Vilnius",
        bio: "I am a host",
        verified: true,
        languages: ["Lithuanian"],
        availableDates: ["24 Dec"],
        dietaryInfo: [],
        amenities: [],
        houseRules: [],
        vibes: [],
        smokingAllowed: false,
        drinkingAllowed: true,
        petsAllowed: true,
        hasPets: false,
      });

      await ctx.db.insert("profiles", {
        userId: guestUserId,
        role: "guest",
        firstName: "Guest",
        age: 22,
        city: "Vilnius",
        bio: "I am a guest",
        verified: false,
        languages: ["English"],
        availableDates: ["25 Dec"],
        dietaryInfo: ["Vegetarian"],
        amenities: [],
        houseRules: [],
        vibes: [],
        smokingAllowed: false,
        drinkingAllowed: false,
        petsAllowed: false,
        hasPets: false,
      });
    });

    // Filter by host role
    const hosts = await t.query(api.profiles.listProfiles, { role: "host" });
    expect(hosts.length).toBe(1);
    expect(hosts[0].role).toBe("host");

    // Filter by guest role
    const guests = await t.query(api.profiles.listProfiles, { role: "guest" });
    expect(guests.length).toBe(1);
    expect(guests[0].role).toBe("guest");
  });
});

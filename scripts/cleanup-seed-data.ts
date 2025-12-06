/**
 * Clean up fake seed data from Convex.
 *
 * The seed.ts creates users with fake clerkIds like "seed_marius_001"
 * that aren't linked to real Clerk accounts. This script removes them.
 *
 * Usage:
 *   bunx convex run seed:clearSeedData
 *
 * Or use Convex dashboard:
 *   1. Go to https://dashboard.convex.dev
 *   2. Select your project
 *   3. Go to Functions tab
 *   4. Find seed:clearSeedData and run it
 */

console.log('To clean up fake seed data, run:');
console.log('');
console.log('  bunx convex run seed:clearSeedData');
console.log('');
console.log('This will remove all users/profiles/messages/invitations');
console.log('that were created by the seed script (with clerkIds starting with "seed_")');

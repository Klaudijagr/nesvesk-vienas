import { resolve } from 'node:path';
import { clerkSetup } from '@clerk/testing/playwright';
import { config } from 'dotenv';

// Load .env.local file (Playwright doesn't auto-load like Bun)
config({ path: resolve(process.cwd(), '.env.local') });

/**
 * Global setup for Playwright tests with Clerk.
 * This runs once before all tests to configure Clerk testing tokens.
 *
 * Required environment variables for auth tests:
 * - CLERK_PUBLISHABLE_KEY: Your Clerk publishable key
 * - CLERK_SECRET_KEY: Your Clerk secret key (for testing tokens)
 */
export default async function globalSetup() {
  // Only setup Clerk if keys are provided
  if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    try {
      await clerkSetup();
      console.log('Clerk testing setup complete');
    } catch (error) {
      console.warn('Clerk setup failed, auth tests may not work:', error);
    }
  } else {
    console.log('Clerk keys not set - skipping Clerk setup. Auth tests will be skipped.');
    console.log('  CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY ? 'set' : 'missing');
    console.log('  CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'set' : 'missing');
  }
}

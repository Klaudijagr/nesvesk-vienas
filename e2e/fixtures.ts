import { Stagehand } from '@browserbasehq/stagehand';
import { clerk } from '@clerk/testing/playwright';
import { type Browser, test as base, type Page } from '@playwright/test';
import { z } from 'zod';

// Test user credentials - set these in your .env.local
const TEST_USERS = {
  host: {
    email: process.env.E2E_CLERK_USER_EMAIL || 'host-test@nesvesk-vienas.lt',
    password: process.env.E2E_CLERK_USER_PASSWORD || 'TestHost123!',
  },
  guest: {
    email: process.env.E2E_CLERK_GUEST_EMAIL || 'guest-test@nesvesk-vienas.lt',
    password: process.env.E2E_CLERK_GUEST_PASSWORD || 'TestGuest123!',
  },
  guest2: {
    email: process.env.E2E_CLERK_GUEST2_EMAIL || 'guest2-test@nesvesk-vienas.lt',
    password: process.env.E2E_CLERK_GUEST2_PASSWORD || 'TestGuest2123!',
  },
};

/**
 * Sign in a user to a page using Clerk
 */
async function signInUser(page: Page, user: { email: string; password: string }) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: user.email,
      password: user.password,
    },
  });

  await page.waitForURL(/\/(browse|register)/);
}

/**
 * Extended test fixtures with Clerk auth and Stagehand AI
 */
export const test = base.extend<{
  authenticatedPage: Page;
  hostPage: Page;
  guestPage: Page;
  stagehand: Stagehand | null;
}>({
  // Single authenticated page (host user by default)
  authenticatedPage: async ({ page }, use) => {
    await signInUser(page, TEST_USERS.host);
    await use(page);
    await clerk.signOut({ page });
  },

  // Host user page - for multi-user tests
  hostPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await signInUser(page, TEST_USERS.host);
    await use(page);
    await clerk.signOut({ page });
    await context.close();
  },

  // Guest user page - for multi-user tests
  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await signInUser(page, TEST_USERS.guest);
    await use(page);
    await clerk.signOut({ page });
    await context.close();
  },

  // Stagehand AI instance for natural language browser actions
  stagehand: async ({}, use) => {
    // Only initialize if GOOGLE_GENERATIVE_AI_API_KEY is set (using Gemini via Vercel AI SDK)
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      await use(null);
      return;
    }

    const stagehand = new Stagehand({
      env: 'LOCAL',
      model: 'google/gemini-2.5-flash',
      // API key auto-loads from GOOGLE_GENERATIVE_AI_API_KEY env var
    });

    await stagehand.init();
    await use(stagehand);
    await stagehand.close();
  },
});

/**
 * Create multiple user contexts for complex multi-user tests
 */
export async function createMultiUserTest(browser: Browser) {
  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext();
  const guest2Context = await browser.newContext();

  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();
  const guest2Page = await guest2Context.newPage();

  // Sign in all users in parallel
  await Promise.all([
    signInUser(hostPage, TEST_USERS.host),
    signInUser(guestPage, TEST_USERS.guest),
    signInUser(guest2Page, TEST_USERS.guest2),
  ]);

  return {
    hostPage,
    guestPage,
    guest2Page,
    cleanup: async () => {
      await Promise.all([
        clerk.signOut({ page: hostPage }),
        clerk.signOut({ page: guestPage }),
        clerk.signOut({ page: guest2Page }),
      ]);
      await Promise.all([hostContext.close(), guestContext.close(), guest2Context.close()]);
    },
  };
}

export { expect } from '@playwright/test';
export { z };

/**
 * Helper selectors for the app
 */
export const selectors = {
  // Navigation
  nav: {
    browse: 'a[href="/browse"]',
    messages: 'a[href="/messages"]',
    settings: 'a[href="/settings"]',
    login: 'a[href="/login"]',
    userButton: '[data-clerk-component="UserButton"]',
  },

  // Browse page
  browse: {
    hostTab: 'button:has-text("Looking for Guests")',
    guestTab: 'button:has-text("Looking for Hosts")',
    profileCard: '[data-testid="profile-card"]',
    connectButton: 'button:has-text("Connect")',
    viewDetails: 'a:has-text("View Details")',
  },

  // Messages page
  messages: {
    conversationList: '[data-testid="conversation-list"]',
    conversationItem: '[data-testid="conversation-item"]',
    messageInput: 'input[placeholder*="message"], textarea[placeholder*="message"]',
    sendButton: 'button:has-text("Send")',
    eventCardButton: 'button:has-text("Share Event")',
  },

  // Profile/Register
  profile: {
    roleHost: 'button:has-text("Host")',
    roleGuest: 'button:has-text("Guest")',
    firstName: 'input[name="firstName"]',
    bio: 'textarea[name="bio"]',
    city: 'select[name="city"]',
    submitButton: 'button[type="submit"]',
  },

  // Common
  loading: '.animate-spin',
  toast: '[data-sonner-toast]',
};

/**
 * Wait for loading to complete
 */
export async function waitForLoading(page: Page) {
  // Wait for any loading spinners to disappear
  await page.waitForSelector(selectors.loading, { state: 'hidden', timeout: 10_000 }).catch(() => {
    // Ignore if no spinner was present
  });
}

/**
 * Get visible profile cards on browse page
 */
export async function getProfileCards(page: Page) {
  await waitForLoading(page);
  return page.locator('.group.flex.h-full.flex-col').all();
}

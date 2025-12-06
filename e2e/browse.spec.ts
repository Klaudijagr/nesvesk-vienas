import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

// These tests require authentication
// Set E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD env vars

test.describe('Browse Page', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token for this test
    await setupClerkTestingToken({ page });
  });

  test('displays host profiles when browsing as guest', async ({ page }) => {
    // This test uses seed data - navigate to browse and check for profiles

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if we need to sign in
    const signInButton = page.locator('text=Sign in').first();
    if (await signInButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Skip auth tests if no test user configured
      test.skip(!process.env.E2E_CLERK_USER_EMAIL, 'No test user configured');

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: process.env.E2E_CLERK_USER_EMAIL!,
          password: process.env.E2E_CLERK_USER_PASSWORD!,
        },
      });

      await page.waitForURL(/\/(browse|register)/);
    }

    // Navigate to browse
    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // Wait for profiles to load
    await page.waitForSelector('.group.flex.h-full.flex-col', { timeout: 15_000 });

    // Check that profile cards are visible
    const profileCards = page.locator('.group.flex.h-full.flex-col');
    const count = await profileCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can switch between host and guest tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip if no auth
    const needsAuth = await page
      .locator('text=Sign in')
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (needsAuth) {
      test.skip(!process.env.E2E_CLERK_USER_EMAIL, 'No test user configured');

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: process.env.E2E_CLERK_USER_EMAIL!,
          password: process.env.E2E_CLERK_USER_PASSWORD!,
        },
      });
      await page.waitForURL(/\/(browse|register)/);
    }

    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // Find tabs - they should be visible
    const hostTab = page.locator('button:has-text("Looking for Guests")');
    const guestTab = page.locator('button:has-text("Looking for Hosts")');

    // Check tabs exist
    await expect(hostTab.or(guestTab)).toBeVisible({ timeout: 10_000 });

    // Click on the other tab
    if (await hostTab.isVisible()) {
      await guestTab.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('profile cards show correct information', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip if auth required and no test user
    const needsAuth = await page
      .locator('text=Sign in')
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (needsAuth) {
      test.skip(!process.env.E2E_CLERK_USER_EMAIL, 'No test user configured');

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: process.env.E2E_CLERK_USER_EMAIL!,
          password: process.env.E2E_CLERK_USER_PASSWORD!,
        },
      });
      await page.waitForURL(/\/(browse|register)/);
    }

    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // Wait for cards to load
    await page.waitForSelector('.group.flex.h-full.flex-col', { timeout: 15_000 });

    // Get the first profile card
    const firstCard = page.locator('.group.flex.h-full.flex-col').first();

    // Check that it has key elements from seed data
    // Name should be visible
    await expect(firstCard.locator('h3')).toBeVisible();

    // Location should be visible
    await expect(firstCard.locator('text=/Vilnius|Kaunas|Klaip/i')).toBeVisible();

    // Bio quote should be visible
    await expect(firstCard.locator('p.italic')).toBeVisible();

    // View Details button should be present
    await expect(firstCard.locator('text=View Details')).toBeVisible();
  });

  test('clicking View Details navigates to profile page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Skip if auth required and no test user
    const needsAuth = await page
      .locator('text=Sign in')
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (needsAuth) {
      test.skip(!process.env.E2E_CLERK_USER_EMAIL, 'No test user configured');

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: process.env.E2E_CLERK_USER_EMAIL!,
          password: process.env.E2E_CLERK_USER_PASSWORD!,
        },
      });
      await page.waitForURL(/\/(browse|register)/);
    }

    await page.goto('/browse');
    await page.waitForLoadState('networkidle');

    // Wait for cards
    await page.waitForSelector('.group.flex.h-full.flex-col', { timeout: 15_000 });

    // Click View Details on first card
    const viewDetailsLink = page.locator('a:has-text("View Details")').first();
    await viewDetailsLink.click();

    // Should navigate to profile page
    await page.waitForURL(/\/profile\//);
    expect(page.url()).toMatch(/\/profile\//);
  });
});

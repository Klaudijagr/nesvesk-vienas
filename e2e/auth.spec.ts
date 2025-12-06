import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('shows landing page for unauthenticated users', async ({ page }) => {
    await page.goto('/');

    // Should see the landing page with the hero section
    await expect(page.locator('h1:has-text("Nešvęsk Vienas")')).toBeVisible();

    // Should see CTA buttons
    await expect(page.getByRole('link', { name: 'Find a Host' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Become a Host' }).first()).toBeVisible();
  });

  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/browse');

    // Should redirect to login
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows login page with Clerk sign-in', async ({ page }) => {
    await page.goto('/login');

    // Should show the login page content - wait for Clerk to load
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible({ timeout: 15_000 });
  });

  test('landing page navigation links work', async ({ page }) => {
    await page.goto('/');

    // Check that navigation links are present
    const browseLink = page.locator('a[href="/browse"]').first();
    if (await browseLink.isVisible()) {
      await browseLink.click();
      // Should redirect to login since not authenticated
      await page.waitForURL(/\/login/);
    }
  });
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run serially for Clerk auth state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for auth state consistency
  reporter: 'html',
  timeout: 60_000, // 60s per test

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Global setup for Clerk testing tokens
  globalSetup: './e2e/global-setup.ts',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before tests (optional)
  // Set E2E_BASE_URL env var to skip auto-starting the server
  webServer:
    process.env.CI || process.env.E2E_BASE_URL
      ? undefined
      : {
          command: 'bun run dev:bun',
          url: 'http://localhost:3001',
          reuseExistingServer: true,
          timeout: 120_000,
        },
});

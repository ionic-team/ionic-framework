import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/playwright',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    // Always reuse an existing server. In the test_runner.sh pipeline, the
    // server is started before Cypress and stays running for Playwright.
    // Locally, developers can start the server manually with `npm run dev`.
    reuseExistingServer: true,
  },
});

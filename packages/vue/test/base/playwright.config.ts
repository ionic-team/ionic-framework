import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/playwright',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
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
    url: 'http://localhost:8080',
    // test_runner.sh always starts the dev server before invoking Playwright,
    // so always reuse it. Without this, CI would try to bind a second server
    // on :8080 and deadlock against the runner's server.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

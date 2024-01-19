import type { PlaywrightTestConfig, PlaywrightTestOptions, PlaywrightWorkerOptions, Project } from '@playwright/test';
import { devices, expect } from '@playwright/test';

import { matchers } from './src/utils/test/playwright';

expect.extend(matchers);

const projects: Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] = [
  {
    /**
     * This is really just desktop Firefox
     * but with a mobile viewport.
     */
    name: 'Mobile Firefox',
    use: {
      browserName: 'firefox',
      /**
       * This is the Pixel 5 configuration.
       * We can't use devices['Pixel 5']
       * because the "isMobile" option is
       * not supported on Firefox.
       */
      viewport: {
        width: 393,
        height: 727
      },
    },
  },
  {
    name: 'Mobile Chrome',
    use: {
      browserName: 'chromium',
      ...devices['Pixel 5']
    }
  },
  {
    name: 'Mobile Safari',
    use: {
      browserName: 'webkit',
      ...devices['iPhone 12']
    }
  }
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testMatch: '*.e2e.ts',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
    toHaveScreenshot: {
      threshold: 0.1
    }
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  maxFailures: 0,
  /* Test retries help catch flaky tests on CI */
  retries: process.env.CI ? 2 : 0,
  reportSlowTests: null,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // ['html'],
    ['./src/utils/test/playwright/reporter/reporter.tsx'],
    ['github'],
    // ['json', { outputFile: 'src/utils/test/playwright/reporter/resultsUsingJson.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /**
     * All failed tests should create
     * a trace file for easier debugging.
     *
     * See https://playwright.dev/docs/trace-viewer
     */
    trace: 'retain-on-failure',
    baseURL: 'http://localhost:3333',
  },

  /* Configure projects for major browsers */
  projects,
  webServer: {
    command: 'serve -p 3333',
    port: 3333,
    reuseExistingServer: !process.env.CI
  }
};

export default config;

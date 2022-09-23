import type { PlaywrightTestConfig } from '@playwright/test';
import { devices, expect } from '@playwright/test';

import { matchers } from './src/utils/test/playwright';

expect.extend(matchers);

const projects = [
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
      screen: {
        width: 393,
        height: 851
      }
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

const modes = ['ios', 'md'];

const generateProjects = () => {
  const projectsWithMetadata = [];

  modes.forEach(mode => {
    projects.forEach(project => {
      projectsWithMetadata.push({
        ...project,
        metadata: {
          mode,
          rtl: false,
          _testing: true
        }
      });
      projectsWithMetadata.push({
        ...project,
        metadata: {
          mode,
          rtl: true,
          _testing: true
        }
      });
    });
  });

  return projectsWithMetadata;
}

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
    toMatchSnapshot: {
      /**
       * Increases the maximum allowed pixel difference to account
       * for slight browser rendering inconsistencies.
       */
      maxDiffPixelRatio: 0.05
    }
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

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
  projects: generateProjects(),
  webServer: {
    command: 'serve -p 3333',
    port: 3333,
    reuseExistingServer: !process.env.CI
  }
};

export default config;

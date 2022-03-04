/**
 * This is a temporary utils file to be removed
 * when all core tests have been migrated to Playwright.
 * Adding these utils to the utils.ts in this directory
 * causes conflicts between Stencil E2E testing and Playwright.
 */

import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const oldGoTo = page.goto.bind(page);

    page.goto = (url: string) => {
      const { mode, rtl } = testInfo.project.metadata;
      const formattedUrl = `${url}?ionic:_testing=true&ionic:mode=${mode}&rtl=${rtl}`;

      return Promise.all([
        page.waitForFunction(() => window.stencilAppLoaded === true),
        oldGoTo(formattedUrl)
      ])
    }

    page.getSnapshotSettings = () => {
      const { mode, rtl } = testInfo.project.metadata;
      const rtlString = rtl ? 'rtl' : 'ltr';
      return `${mode}-${rtlString}`;
    }

    await use(page);
  },
});

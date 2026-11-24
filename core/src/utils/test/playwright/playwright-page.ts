import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo,
} from '@playwright/test';
import { test as base } from '@playwright/test';

import { PageUtils } from '../press-keys';

import { isIosThemeTitle } from './generator';
import { initPageEvents } from './page/event-spy';
import { goto as goToPage, setContent, setIonViewport, spyOnEvent, waitForChanges, locator } from './page/utils';
import type { LocatorOptions } from './page/utils';
import type {
  E2EPage,
  E2ESkip,
  BrowserNameOrCallback,
  SetIonViewportOptions,
  E2EPageOptions,
} from './playwright-declarations';

type CustomTestArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions & {
    page: E2EPage;
  };

type CustomFixtures = {
  page: E2EPage;
  skip: E2ESkip;
  pageUtils: PageUtils;
};

/**
 * Extends the base `page` test figure within Playwright.
 * @param page The page to extend.
 * @param testInfo The test info.
 * @returns The modified playwright page with extended functionality.
 */
export async function extendPageFixture(page: E2EPage, testInfo: TestInfo) {
  const originalGoto = page.goto.bind(page);
  const originalLocator = page.locator.bind(page);

  // Overridden Playwright methods
  page.goto = (url: string, options?: E2EPageOptions) => goToPage(page, url, testInfo, originalGoto, options);
  page.setContent = (html: string, options?: E2EPageOptions) => setContent(page, html, testInfo, options);
  page.locator = (selector: string, options?: LocatorOptions) => locator(page, originalLocator, selector, options);

  // Custom Ionic methods
  page.setIonViewport = (options?: SetIonViewportOptions) => setIonViewport(page, options);
  page.waitForChanges = (timeoutMs?: number) => waitForChanges(page, timeoutMs);
  page.spyOnEvent = (eventName: string) => spyOnEvent(page, eventName);

  // Custom event behavior
  await initPageEvents(page);

  return page;
}

export const test = base.extend<CustomFixtures>({
  /**
   * Draws ios theme tests at 1 device pixel per CSS pixel in Safari and
   * Chrome, instead of their device's 3 (iPhone 12) or 2.75 (Pixel 5).
   *
   * Screenshots save 1 pixel per CSS pixel, so a page drawn at 3x is shrunk.
   * An ios hairline is one device pixel thick, so it can be lost in the
   * shrink, depending on where it lands on the page. At 1x there is nothing
   * to shrink, and the line is a full pixel. md and ionic lines are already a
   * full CSS pixel thick, and Firefox already runs at 1x.
   *
   * To test at the device's own density, add
   * `test.use({ deviceScaleFactor: undefined })` to the `test.describe`.
   * It resets the value to the project's, replacing this fixture.
   */
  deviceScaleFactor: async ({ deviceScaleFactor, browserName }, use, testInfo) => {
    const isIosTheme = testInfo.titlePath.some(isIosThemeTitle);
    const drawsAtDeviceDensity = browserName === 'webkit' || browserName === 'chromium';

    await use(isIosTheme && drawsAtDeviceDensity ? 1 : deviceScaleFactor);
  },
  page: async ({ page }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    page = await extendPageFixture(page, testInfo);
    await use(page);
  },
  skip: {
    rtl: (reason = 'The functionality that is being tested is not applicable to RTL layouts.') => {
      const testInfo: TestInfo = base.info();
      base.skip(testInfo.project.metadata.rtl === true, reason);
    },
    browser: (
      browserNameOrFunction: BrowserNameOrCallback,
      reason = `The functionality that is being tested is not applicable to this browser.`
    ) => {
      const browserName = base.info().project.use.browserName!;

      if (typeof browserNameOrFunction === 'function') {
        base.skip(browserNameOrFunction(browserName), reason);
      } else {
        base.skip(browserName === browserNameOrFunction, reason);
      }
    },
    mode: (mode: string, reason = `The functionality that is being tested is not applicable to ${mode} mode`) => {
      base.skip(base.info().project.metadata.mode === mode, reason);
    },
  },
  pageUtils: async ({ page }, use) => {
    await use(new PageUtils({ page }));
  },
});

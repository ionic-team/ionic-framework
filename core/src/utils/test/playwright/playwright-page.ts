import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo,
} from '@playwright/test';
import { test as base } from '@playwright/test';

import { PageUtils } from '../press-keys';

import { initPageEvents } from './page/event-spy';
import {
  goto as goToPage,
  setContent,
  setIonViewport,
  spyOnEvent,
  waitForChanges,
  locator,
} from './page/utils';
import type { LocatorOptions } from './page/utils';
import type {
  E2EPage,
  E2ESkip,
  BrowserNameOrCallback,
  SetIonViewportOptions,
  E2EPageOptions,
} from './playwright-declarations';

type CustomTestArgs =
  PlaywrightTestArgs &
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
export async function extendPageFixture(
  page: E2EPage,
  testInfo: TestInfo
) {
  const originalGoto =
    page.goto.bind(page);
  const originalLocator =
    page.locator.bind(page);

  // Overridden Playwright methods
  page.goto = (
    url: string,
    options?: E2EPageOptions
  ) =>
    goToPage(
      page,
      url,
      testInfo,
      originalGoto,
      options
    );
  page.setContent = (
    html: string,
    options?: E2EPageOptions
  ) =>
    setContent(
      page,
      html,
      testInfo,
      options
    );
  page.locator = (
    selector: string,
    options?: LocatorOptions
  ) =>
    locator(
      page,
      originalLocator,
      selector,
      options
    );

  // Custom Ionic methods
  page.setIonViewport = (
    options?: SetIonViewportOptions
  ) => setIonViewport(page, options);
  page.waitForChanges = (
    timeoutMs?: number
  ) => waitForChanges(page, timeoutMs);
  page.spyOnEvent = (
    eventName: string
  ) => spyOnEvent(page, eventName);

  // Custom event behavior
  await initPageEvents(page);

  return page;
}

export const test =
  base.extend<CustomFixtures>({
    page: async (
      { page }: CustomTestArgs,
      use: (
        r: E2EPage
      ) => Promise<void>,
      testInfo: TestInfo
    ) => {
      page = await extendPageFixture(
        page,
        testInfo
      );
      await use(page);
    },
    skip: {
      rtl: (
        reason = 'The functionality that is being tested is not applicable to RTL layouts.'
      ) => {
        const testInfo: TestInfo =
          base.info();
        base.skip(
          testInfo.project.metadata
            .rtl === true,
          reason
        );
      },
      browser: (
        browserNameOrFunction: BrowserNameOrCallback,
        reason = `The functionality that is being tested is not applicable to this browser.`
      ) => {
        const browserName =
          base.info().project.use
            .browserName!;

        if (
          typeof browserNameOrFunction ===
          'function'
        ) {
          base.skip(
            browserNameOrFunction(
              browserName
            ),
            reason
          );
        } else {
          base.skip(
            browserName ===
              browserNameOrFunction,
            reason
          );
        }
      },
      mode: (
        mode: string,
        reason = `The functionality that is being tested is not applicable to ${mode} mode`
      ) => {
        base.skip(
          base.info().project.metadata
            .mode === mode,
          reason
        );
      },
    },
    pageUtils: async (
      { page },
      use
    ) => {
      await use(
        new PageUtils({ page })
      );
    },
  });

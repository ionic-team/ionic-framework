import type {
  Locator,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo,
} from '@playwright/test';
import { test as base } from '@playwright/test';

import { waitForCustomEvent } from './locator/utils';
import {
  getSnapshotSettings,
  goto as goToPage,
  setIonViewport,
  waitForChanges,
  waitForCustomEvent as pageWaitForCustomEvent,
} from './page/utils';
import type { E2EPage } from './playwright-declarations';

type CustomTestArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions & {
    page: E2EPage;
  };

type CustomFixtures = {
  page: E2EPage;
};

export const test = base.extend<CustomFixtures>({
  page: async ({ page }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    const originalGoto = page.goto.bind(page);
    const originalLocator = page.locator.bind(page);

    // Overridden Playwright methods
    page.goto = (url: string) => goToPage(page, url, testInfo, originalGoto);
    page.locator = (
      selector: string,
      options?: { has?: Locator | undefined; hasText?: string | RegExp | undefined } | undefined
    ) => waitForCustomEvent(originalLocator, selector, options);
    // Custom Ionic methods
    page.getSnapshotSettings = () => getSnapshotSettings(page, testInfo);
    page.setIonViewport = () => setIonViewport(page);
    page.waitForChanges = () => waitForChanges(page);
    page.waitForCustomEvent = (eventName: string, timeoutMs?: number) =>
      pageWaitForCustomEvent(page, eventName, timeoutMs);

    await use(page);
  },
});

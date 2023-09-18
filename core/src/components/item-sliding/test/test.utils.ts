import { expect } from '@playwright/test';
import type { E2EPage, ScreenshotFn } from '@utils/test/playwright';

/**
 * Warning: This function will fail when in RTL mode.
 * TODO: There's an issue that prevents tests in RTL mode to pass.
 * Once the issue is resolved, we can remove the `directions` config.
 * https://github.com/ionic-team/ionic-framework/issues/26950
 */
export const testSlidingItem = async (
  page: E2EPage,
  itemID: string,
  screenshotNameSuffix: string,
  screenshot: ScreenshotFn,
  openStart = false
) => {
  const item = page.locator(`#${itemID}`);

  // passing a param into the eval callback is tricky due to execution context
  // so just do the check outside the callback instead to make things easy
  if (openStart) {
    await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
      await el.open('start');
    });
  } else {
    await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
      await el.open('end');
    });
  }

  // opening animation takes longer than waitForChanges accounts for
  // especially if another item sliding is already open,
  // so we wait to ensure the opened item is closed before
  // opening another
  await page.waitForTimeout(500);

  await expect(item).toHaveScreenshot(screenshot(`item-sliding-${screenshotNameSuffix}`));

  await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
    await el.close();
  });
};

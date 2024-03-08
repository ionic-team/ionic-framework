import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage, ScreenshotFn } from '@utils/test/playwright';

export const openPopover = async (page: E2EPage, buttonID: string, useEvalClick = false) => {
  const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

  const trigger = page.locator(`#${buttonID}`);
  await trigger.evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center' }));

  /**
   * Some tests aim to have many popovers open at once. When clicking a locator, Playwright
   * will simply click on that coordinate, which may instead trigger the backdrop for the
   * previous popover. Rather than set backdropDismiss=false on all popovers, we can call
   * the click method on the button directly to avoid this behavior.
   */
  if (useEvalClick) {
    await trigger.evaluate((el: HTMLElement) => el.click());
  } else {
    await trigger.click();
  }

  await ionPopoverDidPresent.next();
};

export const closePopover = async (page: E2EPage, popover?: Locator) => {
  const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
  popover = popover || page.locator('ion-popover');

  await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
  await ionPopoverDidDismiss.next();
};

export const screenshotPopover = async (
  page: E2EPage,
  screenshot: ScreenshotFn,
  buttonID: string,
  testName: string
) => {
  await page.setIonViewport();

  await openPopover(page, buttonID);
  await expect(page).toHaveScreenshot(screenshot(`popover-${testName}-${buttonID}`));
};

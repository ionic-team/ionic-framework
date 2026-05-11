import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Safe-area behavior applies to both iOS and MD modes.
 * Left/right safe areas are tested in landscape viewport.
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: safe-area'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/safe-area', config);
    });

    test('should not overlap the bottom safe area when trigger is near the bottom edge', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28411',
      });

      /**
       * Use a landscape-style viewport with bottom safe area.
       * The bottom trigger is positioned at the very bottom of the screen.
       */
      await page.setViewportSize({
        width: 414,
        height: 400,
      });

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.locator('#bottom-trigger').click();
      await ionPopoverDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot('popover-safe-area-bottom'));
    });

    test('should not overlap the right safe area when trigger is near the right edge', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28411',
      });

      /**
       * Use a landscape viewport with left/right safe areas
       * to simulate a device rotated to landscape with notch on left.
       */
      await page.setViewportSize({
        width: 600,
        height: 400,
      });

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.locator('#right-trigger').click();
      await ionPopoverDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot('popover-safe-area-right'));
    });

    test('should handle a large popover near the bottom-right corner without overlapping safe areas', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28411',
      });

      await page.setViewportSize({
        width: 600,
        height: 400,
      });

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.locator('#large-popover-trigger').click();
      await ionPopoverDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot('popover-safe-area-large'));
    });
  });
});

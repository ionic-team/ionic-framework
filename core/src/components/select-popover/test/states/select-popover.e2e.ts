import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select-popover: states'), () => {
    /**
     * `(any-hover: hover)` evaluates to "none" in all three mobile-emulated
     * projects, suppressing the hover rules:
     *
     * - Chromium and WebKit suppress it because of hasTouch and isMobile.
     * - Headless Firefox doesn't detect input devices and reports no hover
     *   capability regardless of context options, so override it via
     *   launchOptions.firefoxUserPrefs. Bit values: 4 = FINE (mouse),
     *   8 = HOVER, 12 = FINE | HOVER.
     *
     * Viewport, userAgent, and scale factor remain mobile-sized.
     */
    test.use({
      hasTouch: false,
      isMobile: false,
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/select-popover/test/states`, config);
    });

    test('should render all radio states', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      await page.locator('#single').click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('#popover-single');
      const selectPopover = popover.locator('ion-select-popover');
      await expect(selectPopover).toBeVisible();

      const defaultRow = selectPopover.locator('ion-item').first();
      await defaultRow.hover();

      await expect(selectPopover).toHaveScreenshot(screenshot('select-popover-radio-states'));
    });

    test('should render all checkbox states', async ({ page }) => {
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      await page.locator('#multiple').click();
      await ionPopoverDidPresent.next();

      const popover = page.locator('#popover-multiple');
      const selectPopover = popover.locator('ion-select-popover');
      await expect(selectPopover).toBeVisible();

      const defaultRow = selectPopover.locator('ion-item').first();
      await defaultRow.hover();

      await expect(selectPopover).toHaveScreenshot(screenshot('select-popover-checkbox-states'));
    });
  });
});

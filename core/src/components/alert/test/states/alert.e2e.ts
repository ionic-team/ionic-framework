import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('alert: input states'), () => {
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
      await page.goto(`/src/components/alert/test/states`, config);
    });

    test('should render all radio states', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      await page.locator('#radio').click();
      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      await expect(alert).toBeVisible();

      const defaultRadio = alert.locator('button.alert-radio-button').first();
      await defaultRadio.hover();

      await expect(alert).toHaveScreenshot(screenshot('alert-radio-states'));
    });

    test('should render all checkbox states', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      await page.locator('#checkbox').click();
      await ionAlertDidPresent.next();

      const alert = page.locator('ion-alert');
      await expect(alert).toBeVisible();

      const defaultCheckbox = alert.locator('button.alert-checkbox-button').first();
      await defaultCheckbox.hover();

      await page.waitForChanges();

      await expect(alert).toHaveScreenshot(screenshot('alert-checkbox-states'));
    });
  });
});

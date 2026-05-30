import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('alert: rendering - tablet'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/alert/test/basic', config);
    });

    test('should expand width and height on larger displays with text', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const button = page.locator('#longMessage');
      const alert = page.locator('ion-alert');

      await button.click();
      await ionAlertDidPresent.next();

      await expect(alert).toHaveScreenshot(screenshot('alert-tablet-text'));
    });

    test('should expand width and height on larger displays with checkboxes', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const button = page.locator('#checkbox');
      const alert = page.locator('ion-alert');

      await button.click();
      await ionAlertDidPresent.next();

      await expect(alert).toHaveScreenshot(screenshot('alert-tablet-checkboxes'));
    });

    test('should expand width and height on larger displays with radios', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const button = page.locator('#radio');
      const alert = page.locator('ion-alert');

      await button.click();
      await ionAlertDidPresent.next();

      await expect(alert).toHaveScreenshot(screenshot('alert-tablet-radios'));
    });
  });
});

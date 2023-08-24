import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: custom'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/datetime/test/custom`, config);
    });

    test('should allow styling wheel style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-wheel');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-wheel`));
    });

    test('should allow styling month/year picker in grid style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-grid');
      const monthYearToggle = datetime.locator('.calendar-month-year');

      await monthYearToggle.click();
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-month-year`));
    });

    test('should allow styling time picker in grid style datetimes', async ({ page }) => {
      const timeButton = page.locator('ion-datetime .time-body');
      const popover = page.locator('.popover-viewport');
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button`));

      await timeButton.click();
      await ionPopoverDidPresent.next();

      await expect(popover).toHaveScreenshot(screenshot(`datetime-custom-time-picker`));
      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button-active`));
    });

    test('should allow styling calendar days in grid style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-calendar-days');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-calendar-days`));
    });
  });
});

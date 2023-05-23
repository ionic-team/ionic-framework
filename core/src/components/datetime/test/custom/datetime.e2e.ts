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
      const datetime = page.locator('#custom-month-year');
      const monthYearToggle = datetime.locator('.calendar-month-year');

      await monthYearToggle.click();
      await page.waitForChanges();

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-month-year`));
    });
  });
});

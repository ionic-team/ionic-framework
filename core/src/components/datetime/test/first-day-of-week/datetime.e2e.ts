import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: first day of the week'), () => {
    test('should set the first day of the week correctly', async ({ page }) => {
      await page.goto('/src/components/datetime/test/first-day-of-week', config);

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-day-of-week`));
    });
  });
});

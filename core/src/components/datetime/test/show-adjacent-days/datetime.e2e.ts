import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: show adjacent days'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#default');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days`));
    });

    test('should not have visual regressions with a custom styled calendar', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#custom-calendar-days');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-custom-calendar`));
    });

    test('should not have visual regressions with specific date disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#specificDate');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-specific-date-disabled`));
    });

    test('should not have visual regressions with weekends disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#weekends');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-weekends-disabled`));
    });

    test('should not have visual regressions with date range disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#dateRange');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-date-range-disabled`));
    });

    test('should not have visual regressions with month disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#month');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-month-disabled`));
    });

    test('should not have visual regressions with display specified', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#display');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-display`));
    });
  });
});

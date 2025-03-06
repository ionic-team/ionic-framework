import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: showAdjacentDays'), () => {
    test('should not have visual regressions with custom grid ', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const customGrid = page.locator('#custom-grid');
      await expect(customGrid).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-custom-grid`));
    });

    test('should set the first day of the week correctly', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const customDatetime = page.locator('#custom-calendar-days');
      await expect(customDatetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-custom-calendar`));
    });

    test('should not have visual regressions with specific date disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const specificDateDisabled = page.locator('#specificDate');
      await expect(specificDateDisabled).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-specific-date`));
    });

    test('should not have any visual regressions with weekends disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const weekendsDisabled = page.locator('#weekends');
      await expect(weekendsDisabled).toHaveScreenshot(screenshot(`weekendsDisabled-with-hidden-days`));
    });

    test('should not have any visual regressions with date range disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const dateRangeDisabled = page.locator('#dateRange');
      await expect(dateRangeDisabled).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-date-range-disabled`));
    });

    test('should not have any visual regressions with month disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const monthDisabled = page.locator('#month');
      await expect(monthDisabled).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-month-disabled`));
    });

    test('should not have any visual regressions with specific display', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const display = page.locator('#display');
      await expect(display).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-display`));
    });
  });
});

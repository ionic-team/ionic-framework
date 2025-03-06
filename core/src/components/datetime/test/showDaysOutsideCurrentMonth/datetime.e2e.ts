import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: ShowDaysOutsideCustomMonth'), () => {
    test('with custom-grid should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const customGrid = page.locator('#custom-grid');
      await expect(customGrid).toHaveScreenshot(screenshot(`customGrid-with-hidden-days`));
    });

    test('should set the first day of the week correctly', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const customDatetime = page.locator('#custom-calendar-days');
      await expect(customDatetime).toHaveScreenshot(screenshot(`custom-calendar-with-hidden-days`));
    });

    test('with specific date disabled  should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const specificDateDisabled = page.locator('#specificDate');
      await expect(specificDateDisabled).toHaveScreenshot(screenshot(`specificDate-with-hidden-days`));
    });

    test('with weekends disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const weekendsDisabled = page.locator('#weekends');
      await expect(weekendsDisabled).toHaveScreenshot(screenshot(`weekendsDisabled-with-hidden-days`));
    });

    test('with date range disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const dateRangeDisabled = page.locator('#dateRange');
      await expect(dateRangeDisabled).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-date-range-disabled`));
    });

    test('with month disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const monthDisabled = page.locator('#month');
      await expect(monthDisabled).toHaveScreenshot(screenshot(`monthDisabled-with-hidden-days`));
    });

    test('with specific display should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/showDaysOutsideCurrentMonth', config);
      const display = page.locator('#display');
      await expect(display).toHaveScreenshot(screenshot(`display-with-hidden-days`));
    });
  });
});

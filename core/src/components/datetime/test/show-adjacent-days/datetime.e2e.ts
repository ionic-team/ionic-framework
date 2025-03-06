import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: ShowDaysOutsideCustomMonth'), () => {
    test('with custom-grid should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const customGrid = page.locator('#custom-grid');
      await expect(customGrid).toHaveScreenshot(screenshot(`customGrid-with-adjacent-days`));
    });

    test('should set the first day of the week correctly', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const customDatetime = page.locator('#custom-calendar-days');
      await expect(customDatetime).toHaveScreenshot(screenshot(`custom-calendar-with-adjacent-days`));
    });

    test('with specific date disabled  should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const specificDateDisabled = page.locator('#specificDate');
      await expect(specificDateDisabled).toHaveScreenshot(screenshot(`specificDate-with-adjacent-days`));
    });

    test('with weekends disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const weekendsDisabled = page.locator('#weekends');
      await expect(weekendsDisabled).toHaveScreenshot(screenshot(`weekendsDisabled-with-adjacent-days`));
    });

    test('with date range disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const dateRangeDisabled = page.locator('#dateRange');
      await expect(dateRangeDisabled).toHaveScreenshot(screenshot(`dateRangeDisabled-with-adjacent-days`));
    });

    test('with month disabled should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const monthDisabled = page.locator('#month');
      await expect(monthDisabled).toHaveScreenshot(screenshot(`monthDisabled-with-adjacent-days`));
    });

    test('with specific display should not have any visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const display = page.locator('#display');
      await expect(display).toHaveScreenshot(screenshot(`display-with-adjacent-days`));
    });
  });
});

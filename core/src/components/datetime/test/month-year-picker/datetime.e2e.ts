import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('datetime: month-year picker', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/datetime/test/month-year-picker', config);
      await page.waitForSelector('.datetime-ready');
    });

    test(title('should hide the footer when picker is open'), async ({ page }) => {
      const datetimeFooter = page.locator('#date-time .datetime-footer');
      await expect(datetimeFooter).toBeVisible();

      const pickerButton = page.locator('#date-time .calendar-month-year > ion-item');
      await pickerButton.click();
      await page.waitForChanges();
      await expect(datetimeFooter).not.toBeVisible();
    });

    test(title('should not hide the footer on month-year presentation'), async ({ page }) => {
      const monthyearFooter = page.locator('#month-year .datetime-footer');
      await expect(monthyearFooter).toBeVisible();
    });
  });
});

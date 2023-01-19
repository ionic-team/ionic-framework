import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: month-year picker', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');
    await page.goto('/src/components/datetime/test/month-year-picker');
    await page.waitForSelector('.datetime-ready');
  });

  test('should hide the footer when picker is open', async ({ page }) => {
    const datetimeFooter = page.locator('#date-time .datetime-footer');
    await expect(datetimeFooter).toBeVisible();

    const pickerButton = page.locator('#date-time .calendar-month-year > ion-item');
    await pickerButton.click();
    await page.waitForChanges();
    await expect(datetimeFooter).not.toBeVisible();
  });

  test('should not hide the footer on month-year presentation', async ({ page }) => {
    const monthyearFooter = page.locator('#month-year .datetime-footer');
    await expect(monthyearFooter).toBeVisible();
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: switching months with different number of days', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-datetime locale="en-US" presentation="date" value="2022-01-31"></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');
  });

  test('should switch the calendar header when moving to a month with a different number of days', async ({ page }) => {
    const monthYearToggle = page.locator('ion-datetime .calendar-month-year');
    const monthColumnItems = page.locator('ion-datetime .month-column .picker-item:not(.picker-item-empty)');

    await expect(monthYearToggle).toContainText('January 2022');

    await monthYearToggle.click();
    await page.waitForChanges();

    // February
    await monthColumnItems.nth(1).click();
    await page.waitForChanges();

    await expect(monthYearToggle).toContainText('February 2022');
  });

  test('should adjust the selected day when moving to a month with a different number of days', async ({ page }) => {
    const monthYearToggle = page.locator('ion-datetime .calendar-month-year');
    const monthColumnItems = page.locator('ion-datetime .month-column .picker-item:not(.picker-item-empty)');
    const datetime = page.locator('ion-datetime');
    const ionChange = await page.spyOnEvent('ionChange');

    await monthYearToggle.click();
    await page.waitForChanges();

    // February
    await monthColumnItems.nth(1).click();

    await ionChange.next();
    await expect(ionChange).toHaveReceivedEventTimes(1);
    await expect(datetime).toHaveJSProperty('value', '2022-02-28');
  });
});

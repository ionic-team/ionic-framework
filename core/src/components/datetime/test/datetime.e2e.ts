import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: switching months with different number of days'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime locale="en-US" presentation="date" value="2022-01-31"></ion-datetime>
      `,
        config
      );

      await page.locator('.datetime-ready').waitFor();
    });

    test('should switch the calendar header when moving to a month with a different number of days', async ({
      page,
    }) => {
      const monthYearToggle = page.locator('ion-datetime .calendar-month-year');
      const monthColumnItems = page.locator('ion-datetime .month-column ion-picker-column-option');

      await expect(monthYearToggle).toContainText('January 2022');

      // Click to open the picker
      await monthYearToggle.click();
      await page.waitForChanges();

      // Wait for the picker to be open
      await page.locator('.month-year-picker-open').waitFor();

      // Wait a bit for the picker to fully load
      await page.waitForTimeout(200);

      const ionChange = await page.spyOnEvent('ionChange');

      // Click on February
      await monthColumnItems.filter({ hasText: 'February' }).click();

      // Wait for changes
      await ionChange.next();
      await page.waitForChanges();

      await expect(monthYearToggle).toContainText('February 2022');
    });

    test('should adjust the selected day when moving to a month with a different number of days', async ({ page }) => {
      const monthYearToggle = page.locator('ion-datetime .calendar-month-year');
      const monthColumnItems = page.locator('ion-datetime .month-column ion-picker-column-option');
      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');

      // Click to open the picker
      await monthYearToggle.click();
      await page.waitForChanges();

      // Wait for the picker to be open
      await page.locator('.month-year-picker-open').waitFor();

      // Wait a bit for the picker to fully load
      await page.waitForTimeout(200);

      // Click on February
      await monthColumnItems.filter({ hasText: 'February' }).click();

      // Wait for changes
      await ionChange.next();
      await page.waitForChanges();

      await expect(ionChange).toHaveReceivedEventTimes(1);
      await expect(datetime).toHaveJSProperty('value', '2022-02-28');
    });
  });
});

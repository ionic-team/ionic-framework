import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: set-value'), () => {
    test('should update the active date when value is initially set', async ({ page }) => {
      await page.goto('/src/components/datetime/test/set-value', config);
      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');
      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-11-25T12:40:00.000Z'));

      await page.waitForChanges();

      const activeDate = page.locator('ion-datetime .calendar-day-active');
      await expect(activeDate).toHaveText('25');
    });

    test('should update the active time when value is initially set', async ({ page }) => {
      await page.goto('/src/components/datetime/test/set-value', config);
      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');
      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-11-25T12:40:00.000Z'));

      await page.waitForChanges();

      const activeDate = page.locator('ion-datetime .time-body');
      await expect(activeDate).toHaveText('12:40 PM');
    });

    test('should update active item when value is not initially set', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime presentation="date" locale="en-US"></ion-datetime>
      `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');
      const activeDayButton = page.locator('.calendar-day-active');

      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-10-05'));
      await page.waitForChanges();

      // Check that correct day is highlighted
      await expect(activeDayButton).toHaveAttribute('data-day', '5');
      await expect(activeDayButton).toHaveAttribute('data-month', '10');
      await expect(activeDayButton).toHaveAttribute('data-year', '2021');
    });

    test('should scroll to new month when value is initially set and then updated', async ({ page }) => {
      await page.goto('/src/components/datetime/test/set-value', config);
      await page.waitForSelector('.datetime-ready');

      const datetime = page.locator('ion-datetime');
      await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-05-25T12:40:00.000Z'));
      await page.waitForChanges();

      const calendarHeader = datetime.locator('.calendar-month-year');
      await expect(calendarHeader).toHaveText(/May 2021/);
    });
  });
});

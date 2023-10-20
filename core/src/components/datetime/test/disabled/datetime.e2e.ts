import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: disabled'), () => {
    test('date should be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const febFirstButton = page.locator(`.calendar-day[data-day='1'][data-month='2']`);

      await expect(febFirstButton).toBeDisabled;
    });

    test('month-year button should be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');
      await expect(calendarMonthYear.locator('button')).toBeDisabled();
    });

    test('next and prev buttons should be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      const prevMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button:first-of-type button');
      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button:last-of-type button');

      await expect(prevMonthButton).toBeDisabled();
      await expect(nextMonthButton).toBeDisabled();
    });

    test('clear button should be disabled', async ({ page }) => {
      await page.setContent(
        `

        <ion-datetime value="2022-02-22T16:30:00" show-default-buttons="true" show-clear-button="true" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const clearButton = page.locator('#clear-button button');

      await expect(clearButton).toBeDisabled();
    });

    test('should not navigate through months via right arrow key', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      const calendarBody = page.locator('.calendar-body');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await calendarBody.focus();
      await page.waitForChanges();

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      await expect(calendarMonthYear).toHaveText('February 2022');
    });
  });
});

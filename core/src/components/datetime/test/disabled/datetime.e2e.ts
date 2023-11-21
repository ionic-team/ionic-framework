import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('datetime: disabled'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-05T00:00:00" min="2022-01-01T00:00:00" max="2022-02-20T23:59:59" day-values="5,6,10,11,15,16,20" show-default-buttons disabled></ion-datetime>
    `,
        config
      );

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-disabled`));
    });

    test('date should be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const febFirstButton = page.locator(`.calendar-day[data-day='1'][data-month='2']`);

      await expect(febFirstButton).toBeDisabled();
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

/**
 * This behavior does not differ across
 * directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('datetime: disabled wheel'), () => {
    test('disabled wheel should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/disabled', config);

      const disabledWheel = page.locator('#inline-datetime-wheel');
      await page.waitForChanges();

      await expect(disabledWheel).toHaveScreenshot(screenshot('datetime-disabled-wheel'));
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: readonly'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );
    });

    test('should not change value when date is clicked', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');
      await page.waitForSelector('.datetime-ready');

      const febFirstButton = page.locator(`.calendar-day[data-day='1'][data-month='2']`);

      await expect(febFirstButton).not.toHaveClass(/calendar-day-active/);

      await febFirstButton.click({ force: true });
      await page.waitForChanges();

      await expect(febFirstButton).not.toHaveClass(/calendar-day-active/);
      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('should navigate months via month-year button', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');
      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await calendarMonthYear.click();
      await page.waitForChanges();
      await page.locator('.month-column .picker-item[data-value="3"]').click();
      await page.waitForChanges();
      await expect(calendarMonthYear).toHaveText('March 2022');

      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('should view next month via next button', async ({ page }) => {
      const ionChange = await page.spyOnEvent('ionChange');

      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');

      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button + ion-button');
      await nextMonthButton.click();
      await page.waitForChanges();

      await expect(calendarMonthYear).toHaveText('March 2022');
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });
});

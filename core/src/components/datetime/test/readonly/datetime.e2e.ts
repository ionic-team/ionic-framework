import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('datetime: readonly'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-05T00:00:00" min="2022-01-01T00:00:00" max="2022-02-20T23:59:59" day-values="5,6,10,11,15,16,20" show-default-buttons readonly></ion-datetime>
    `,
        config
      );

      const datetime = page.locator('ion-datetime');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-readonly`));
    });

    test('date should be disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" readonly></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const febFirstButton = page.locator(`.calendar-day[data-day='1'][data-month='2']`);

      await expect(febFirstButton).toBeDisabled();
    });

    test('should navigate months via month-year button', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );

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

    test('should open picker using keyboard navigation', async ({ page, browserName }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      const monthYearButton = page.locator('.calendar-month-year ion-item');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await page.keyboard.press(tabKey);
      await expect(monthYearButton).toBeFocused();
      await page.waitForChanges();

      await page.keyboard.press('Enter');
      await page.waitForChanges();

      const marchPickerItem = page.locator('.month-column .picker-item[data-value="3"]');
      await expect(marchPickerItem).toBeVisible();
    });

    test('should view next month via next button', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');

      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');

      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button + ion-button');
      await nextMonthButton.click();
      await page.waitForChanges();

      await expect(calendarMonthYear).toHaveText('March 2022');
      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('should not change value when the month is changed via keyboard navigation', async ({ page, browserName }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      const datetime = page.locator('ion-datetime');
      const monthYearButton = page.locator('.calendar-month-year ion-item');
      const prevButton = page.locator('.calendar-next-prev ion-button:nth-child(1)');
      const nextButton = page.locator('.calendar-next-prev ion-button:nth-child(2)');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');

      await page.keyboard.press(tabKey);
      await expect(monthYearButton).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(prevButton).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(nextButton).toBeFocused();

      // check value before & after selecting via keyboard
      const initialValue = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      expect(initialValue).toBe('2022-02-22T16:30:00');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      await page.keyboard.press('ArrowLeft');
      await page.waitForChanges();

      await expect(calendarMonthYear).toHaveText('January 2022');
      await page.keyboard.press('Enter');
      await page.waitForChanges();

      const newValue = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      // should not have changed
      expect(newValue).toBe('2022-02-22T16:30:00');
    });

    test('clear button should be disabled', async ({ page }) => {
      await page.setContent(
        `

        <ion-datetime value="2022-02-22T16:30:00" show-default-buttons="true" show-clear-button="true" readonly></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const clearButton = page.locator('#clear-button button');

      await expect(clearButton).toBeDisabled();
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: readonly'), () => {
    test('should not change value when date is clicked', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" readonly></ion-datetime>
    `,
        config
      );

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

    test('should not change value via keyboard navigation', async ({ page, browserName }) => {
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

      await page.keyboard.press(tabKey);
      await expect(monthYearButton).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(prevButton).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(nextButton).toBeFocused();

      // check value before & after selecting via keyboard
      const initialValue = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      expect(initialValue).toBe('2022-02-22T16:30:00');

      await page.keyboard.press(tabKey);
      await page.waitForChanges();

      await page.keyboard.press('ArrowLeft');
      await page.waitForChanges();

      await page.keyboard.press('Enter');
      await page.waitForChanges();

      const newValue = await datetime.evaluate((el: HTMLIonDatetimeElement) => el.value);
      // should not have changed
      expect(newValue).toBe('2022-02-22T16:30:00');
    });

    test('should not be able to clear via keyboard navigation', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" show-default-buttons="true" show-clear-button="true" readonly></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const clearButton = page.locator('#clear-button button');

      await clearButton.focus();
      await page.waitForChanges();

      await expect(clearButton).not.toBeFocused();
    });
  });
});

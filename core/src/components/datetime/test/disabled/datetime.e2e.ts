import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: disabled'), () => {
    test('should not change value when date is clicked', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
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

    test('should not navigate months via month-year button', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await calendarMonthYear.click({ force: true });
      await page.waitForChanges();

      const marchPickerItem = page.locator('.month-column .picker-item[data-value="3"]');
      await expect(marchPickerItem).not.toBeVisible();
    });

    test('should not open picker using keyboard navigation', async ({ page, browserName }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await page.waitForSelector('.datetime-ready');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      const monthYearButton = page.locator('.calendar-month-year ion-item');
      await expect(calendarMonthYear).toHaveText('February 2022');

      await page.keyboard.press(tabKey);
      await expect(monthYearButton).not.toBeFocused();
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

    test('should not view next month via next button', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');

      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      await expect(calendarMonthYear).toHaveText('February 2022');

      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button + ion-button');
      await nextMonthButton.click({ force: true });
      await page.waitForChanges();

      // should not have changed
      await expect(calendarMonthYear).toHaveText('February 2022');
      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('buttons should not be focusable', async ({ page, browserName }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-28" disabled></ion-datetime>
    `,
        config
      );

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00" disabled></ion-datetime>
    `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const monthYearButton = page.locator('.calendar-month-year ion-item');
      const prevButton = page.locator('.calendar-next-prev ion-button:nth-child(1)');
      const nextButton = page.locator('.calendar-next-prev ion-button:nth-child(2)');

      await page.keyboard.press(tabKey);
      await expect(monthYearButton).not.toBeFocused();
    });

    test('should not be able to clear via keyboard navigation', async ({ page }) => {
      await page.setContent(
        `

        <ion-datetime value="2022-02-22T16:30:00" show-default-buttons="true" show-clear-button="true" disabled></ion-datetime>
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

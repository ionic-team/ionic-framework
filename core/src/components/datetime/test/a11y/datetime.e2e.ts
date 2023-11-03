import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <div id="container" style="width: 450px;">
          <ion-datetime size="cover" show-default-title="true" show-default-buttons="true" presentation="date-time" value="2022-06-06T16:30"></ion-datetime>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await page.waitForSelector('.datetime-ready');

      await expect(container).toHaveScreenshot(screenshot(`datetime-scale`));
    });
  });
});

/**
 * This behavior does not differ across
 * modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: a11y'), () => {
    test('datetime should be keyboard navigable', async ({ page, browserName }) => {
      await page.setContent(
        `
        <ion-datetime value="2022-02-22T16:30:00"></ion-datetime>
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
      expect(newValue).not.toBe('2022-02-22T16:30:00');
    });

    test('buttons should be keyboard navigable', async ({ page }) => {
      await page.setContent(
        `

        <ion-datetime value="2022-02-22T16:30:00" show-default-buttons="true" show-clear-button="true"></ion-datetime>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const clearButton = page.locator('#clear-button button');
      const selectedDay = page.locator('.calendar-day-active');

      await expect(selectedDay).toHaveText('22');

      await clearButton.focus();
      await page.waitForChanges();

      await expect(clearButton).toBeFocused();
      await page.keyboard.press('Enter');

      await page.waitForChanges();

      await expect(selectedDay).toHaveCount(0);
    });

    test('should navigate through months via right arrow key', async ({ page }) => {
      await page.setContent(
        `

        <ion-datetime value="2022-02-28"></ion-datetime>
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

      await expect(calendarMonthYear).toHaveText('March 2022');
    });
  });
});

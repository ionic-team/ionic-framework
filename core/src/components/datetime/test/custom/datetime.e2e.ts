import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: custom'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/datetime/test/custom`, config);

      await page.locator('.datetime-ready').last().waitFor();
    });

    test('should allow styling wheel style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-wheel');

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-wheel`));
    });

    test('should allow styling time picker in grid style datetimes', async ({ page }) => {
      const timeButton = page.locator('#custom-grid .time-body');
      const popover = page.locator('.popover-viewport');
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button`));

      await timeButton.click();
      await ionPopoverDidPresent.next();

      await expect(popover).toHaveScreenshot(screenshot(`datetime-custom-time-picker`));
      await expect(timeButton).toHaveScreenshot(screenshot(`datetime-custom-time-button-active`));
    });

    test('should allow styling calendar days in grid style datetimes', async ({ page }) => {
      const datetime = page.locator('#custom-calendar-days');

      // Wait for calendar days to be rendered
      await page.waitForFunction(() => {
        const datetime = document.querySelector('#custom-calendar-days');
        const calendarDays = datetime?.shadowRoot?.querySelectorAll('.calendar-day');
        return calendarDays && calendarDays.length > 0;
      });

      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-calendar-days`));
    });
  });

  test.describe(title('CSS shadow parts'), () => {
    test('should be able to customize wheel part', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-datetime::part(wheel) {
              background-color: red;
            }
          </style>
          <ion-datetime
            prefer-wheel="true"
            value="2020-03-14T14:23:00.000Z"
          ></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const pickerColumn = datetime.locator('ion-picker-column').first();

      const backgroundColor = await pickerColumn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(255, 0, 0)');
    });

    test('should be able to customize wheel part when focused', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-datetime::part(wheel):focus {
              background-color: blue;
            }
          </style>
          <ion-datetime
            prefer-wheel="true"
            value="2020-03-14T14:23:00.000Z"
          ></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const pickerColumn = datetime.locator('ion-picker-column').first();

      await pickerColumn.click({ position: { x: 10, y: 10 } });

      const backgroundColor = await pickerColumn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(0, 0, 255)');
    });
  });
});

/**
 * This behavior does not differ across
 * directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: custom focus'), () => {
    test('should focus the selected day and then the day after', async ({ page }) => {
      await page.goto(`/src/components/datetime/test/custom`, config);

      const datetime = page.locator('#custom-calendar-days');

      const day = datetime.locator(`.calendar-day[data-day='15'][data-month='6']`);

      await day.focus();
      await page.waitForChanges();

      await expect(day).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-focus-selected-calendar-day`));

      await page.keyboard.press('ArrowRight');
      await page.waitForChanges();

      const nextDay = datetime.locator(`.calendar-day[data-day='16'][data-month='6']`);

      await expect(nextDay).toBeFocused();
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-custom-focus-calendar-day`));
    });
  });
});

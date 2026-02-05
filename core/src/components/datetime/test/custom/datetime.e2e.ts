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
    test('should be able to customize wheel part within the wheel style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30420',
      });

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

    test('should be able to customize wheel part within the month/year picker', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30420',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(wheel) {
              background-color: orange;
            }
          </style>
          <ion-datetime
            value="2020-03-14T14:23:00.000Z"
          ></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const monthYearButton = datetime.locator('.calendar-month-year-toggle');

      await monthYearButton.click();

      const pickerColumn = datetime.locator('ion-picker-column').first();

      const backgroundColor = await pickerColumn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(255, 165, 0)');
    });

    test('should be able to customize wheel part within the time picker', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30420',
      });

      await page.setContent(
        `
          <style>
            ion-picker-column {
              background-color: green;
            }
          </style>
          <ion-datetime
            value="2020-03-14T14:23:00.000Z"
          ></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const timeButton = datetime.locator('.time-body');

      await timeButton.click();

      const pickerColumn = page.locator('ion-picker-column').first();

      const backgroundColor = await pickerColumn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(0, 128, 0)');
    });

    test('should be able to customize wheel part when focused', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30420',
      });

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

    test('should be able to customize datetime header part', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30083',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(datetime-header) {
              background-color: orange;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z">
            <span slot="title">Select Date</span>
          </ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const header = datetime.locator('.datetime-header');

      const backgroundColor = await header.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(255, 165, 0)');
    });

    test('should be able to customize calendar header part within the grid style', async ({ page }) => {
      await page.setContent(
        `
          <style>
            ion-datetime::part(calendar-header) {
              background-color: orange;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const header = datetime.locator('.calendar-header');

      const backgroundColor = await header.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(255, 165, 0)');
    });

    test('should be able to customize month/year picker part within the grid style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/26596',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(month-year-button) {
              background-color: lightblue;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const monthYearButton = datetime.locator('.calendar-month-year-toggle');

      const backgroundColor = await monthYearButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(173, 216, 230)');
    });

    test('should be able to customize prev/next buttons part within the grid style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30830',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(prev-next-buttons) {
              background-color: firebrick;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const prevButton = datetime.locator('.calendar-next-prev ion-button').first();
      const nextButton = datetime.locator('.calendar-next-prev ion-button').last();

      const prevBackgroundColor = await prevButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const nextBackgroundColor = await nextButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(prevBackgroundColor).toBe('rgb(178, 34, 34)');
      expect(nextBackgroundColor).toBe('rgb(178, 34, 34)');
    });

    test('should be able to customize prev button part within the grid style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30830',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(prev-button) {
              color: blue;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const prevButton = datetime.locator('.calendar-next-prev ion-button').first();

      const color = await prevButton.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(color).toBe('rgb(0, 0, 255)');
    });

    test('should be able to customize next button part within the grid style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30830',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(next-button) {
              color: blue;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const nextButton = datetime.locator('.calendar-next-prev ion-button').last();

      const color = await nextButton.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(color).toBe('rgb(0, 0, 255)');
    });

    test('should be able to customize days of the week part within the grid style', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30830',
      });

      await page.setContent(
        `
          <style>
            ion-datetime::part(days-of-week) {
              background-color: #9ad162;
            }
          </style>
          <ion-datetime value="2020-03-14T14:23:00.000Z"></ion-datetime>
        `,
        config
      );

      const datetime = page.locator('ion-datetime');
      const daysOfWeek = datetime.locator('.calendar-days-of-week');

      const backgroundColor = await daysOfWeek.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(backgroundColor).toBe('rgb(154, 209, 98)');
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

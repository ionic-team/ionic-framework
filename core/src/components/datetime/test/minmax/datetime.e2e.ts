import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior is the same across
 * modes/directions.
 */
configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: minmax'), () => {
    test('calendar arrow navigation should respect min/max values', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25073',
      });

      await page.setContent(
        `
        <ion-datetime min="2022-04-22" max="2022-05-21" value="2022-04-22T10:00:00"></ion-datetime>

        <script>
          const observer = new MutationObserver((mutationRecords) => {
            if (mutationRecords) {
              window.dispatchEvent(new CustomEvent('datetimeMonthDidChange'));
            }
          });

          const initDatetimeChangeEvent = () => {
            observer.observe(document.querySelector('ion-datetime').shadowRoot.querySelector('.calendar-body'), {
              subtree: true,
              childList: true
            });
          }
        </script>
    `,
        config
      );

      await page.waitForSelector('.datetime-ready');

      const prevButton = page.locator('ion-datetime .calendar-next-prev ion-button:nth-child(1)');
      const nextButton = page.locator('ion-datetime .calendar-next-prev ion-button:nth-child(2)');

      await expect(nextButton).toHaveJSProperty('disabled', false);
      await expect(prevButton).toHaveJSProperty('disabled', true);

      await page.evaluate('initDatetimeChangeEvent()');

      const monthDidChangeSpy = await page.spyOnEvent('datetimeMonthDidChange');

      await nextButton.click();
      await page.waitForChanges();

      await monthDidChangeSpy.next();

      await expect(nextButton).toHaveJSProperty('disabled', true);
      await expect(prevButton).toHaveJSProperty('disabled', false);
    });

    test('datetime: minmax months disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/minmax', config);
      const calendarMonths = page.locator('ion-datetime#inside .calendar-month');

      await page.waitForSelector('.datetime-ready');

      await expect(calendarMonths.nth(0)).not.toHaveClass(/calendar-month-disabled/);
      await expect(calendarMonths.nth(1)).not.toHaveClass(/calendar-month-disabled/);
      await expect(calendarMonths.nth(2)).toHaveClass(/calendar-month-disabled/);
    });

    test('datetime: minmax navigation disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/minmax', config);
      await page.waitForSelector('.datetime-ready');

      const navButtons = page.locator('ion-datetime#outside .calendar-next-prev ion-button');

      await expect(navButtons.nth(0)).toHaveAttribute('disabled', '');
      await expect(navButtons.nth(1)).toHaveAttribute('disabled', '');
    });

    test('datetime: min including day should not disable month', async ({ page }) => {
      await page.goto('/src/components/datetime/test/minmax', config);
      await page.waitForSelector('.datetime-ready');

      const calendarMonths = page.locator('ion-datetime#min-with-day .calendar-month');

      await expect(calendarMonths.nth(0)).toHaveClass(/calendar-month-disabled/);
      await expect(calendarMonths.nth(1)).not.toHaveClass(/calendar-month-disabled/);
      await expect(calendarMonths.nth(2)).not.toHaveClass(/calendar-month-disabled/);
    });

    test.describe('when the datetime does not have a value', () => {
      test('all time values should be available for selection', async ({ page }) => {
        /**
         * When the datetime does not have an initial value and today falls outside of
         * the specified min and max values, all times values should be available for selection.
         */
        await page.setContent(
          `
          <ion-datetime min="2022-04-22T04:10:00" max="2022-05-21T21:30:00"></ion-datetime>
      `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

        await page.click('.time-body');
        await ionPopoverDidPresent.next();

        const hours = page.locator('ion-popover ion-picker-column:nth-child(1) ion-picker-column-option');
        const minutes = page.locator('ion-popover ion-picker-column:nth-child(2) ion-picker-column-option');

        expect(await hours.count()).toBe(12);
        expect(await minutes.count()).toBe(60);
      });
    });

    test.describe('setting value outside bounds should show in-bounds month', () => {
      const testDisplayedMonth = async (page: E2EPage, content: string, expectedString = /June 2021/) => {
        await page.setContent(content, config);
        await page.waitForSelector('.datetime-ready');

        const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
        await expect(calendarMonthYear).toHaveText(expectedString);
      };

      test('when min and value are defined', async ({ page }) => {
        await testDisplayedMonth(page, `<ion-datetime min="2021-06-01" value="2021-05-01"></ion-datetime>`);
      });

      test('when max and value are defined', async ({ page }) => {
        await testDisplayedMonth(page, `<ion-datetime max="2021-06-30" value="2021-07-01"></ion-datetime>`);
      });

      test('when min, max, and value are defined', async ({ page }) => {
        await testDisplayedMonth(
          page,
          `<ion-datetime min="2021-06-01" max="2021-06-30" value="2021-05-01"></ion-datetime>`
        );
      });

      test('when max is defined', async ({ page }) => {
        await testDisplayedMonth(page, `<ion-datetime max="2012-06-01"></ion-datetime>`, /June 2012/);
      });
    });

    // TODO(FW-2165)
    test('should not loop infinitely in webkit', async ({ page, skip }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25752',
      });

      skip.browser('chromium');
      skip.browser('firefox');

      await page.setContent(
        `
        <button id="bind">Bind datetimeMonthDidChange event</button>
        <ion-datetime min="2022-04-15" value="2022-04-20" presentation="date" locale="en-US"></ion-datetime>

        <script type="module">
          import { InitMonthDidChangeEvent } from '/src/components/datetime/test/utils/month-did-change-event.js';
          document.querySelector('#bind').addEventListener('click', function() {
            InitMonthDidChangeEvent();
          });
        </script>
      `,
        config
      );
      await page.waitForSelector('.datetime-ready');

      const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');
      const eventButton = page.locator('button#bind');
      await eventButton.click();

      const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');
      await buttons.nth(1).click();
      await page.waitForChanges();

      await datetimeMonthDidChange.next();

      /**
       * This is hacky, but its purpose is to make sure
       * we are not triggering a WebKit bug. When the fix
       * for the bug ships in WebKit, this will be removed.
       */
      await page.evaluate(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      });

      await expect(datetimeMonthDidChange).toHaveReceivedEventTimes(1);
    });

    test('should not include 12AM when minimum is greater than 12AM', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25183',
      });

      await page.setContent(
        `
        <ion-datetime
          presentation="time"
          min="2022-04-25T08:30:00"
          max="2022-04-25T21:30:00"
          value="2022-04-25T08:30:00"
        ></ion-datetime>
      `,
        config
      );

      const hourPickerItems = page.locator('ion-datetime ion-picker-column:first-of-type ion-picker-column-option');
      await expect(hourPickerItems).toHaveText(['8', '9', '10', '11']);
    });

    test('should include 12PM when minimum is greater than 12', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25183',
      });

      await page.setContent(
        `
        <ion-datetime
          locale="en-US"
          presentation="time"
          min="2022-07-29T08:00:00"
          value="2022-07-29T12:00:00"
        ></ion-datetime>
      `,
        config
      );

      const hourPickerItems = page.locator('ion-datetime ion-picker-column:first-of-type ion-picker-column-option');
      await expect(hourPickerItems).toHaveText(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
    });

    test.describe('minmax value adjustment when out of bounds', () => {
      test('should reset to min time if out of bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            min="2022-10-10T08:00"
            value="2022-10-11T06:00"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const datetime = page.locator('ion-datetime');
        const ionChange = await page.spyOnEvent('ionChange');
        const dayButton = page.locator('ion-datetime .calendar-day[data-day="10"][data-month="10"][data-year="2022"]');
        await dayButton.click();

        await ionChange.next();

        await expect(datetime).toHaveJSProperty('value', '2022-10-10T08:00:00');
      });

      test('should reset to max time if out of bounds', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            max="2022-10-10T08:00"
            value="2022-10-11T09:00"
          ></ion-datetime>
        `,
          config
        );

        await page.waitForSelector('.datetime-ready');

        const datetime = page.locator('ion-datetime');
        const ionChange = await page.spyOnEvent('ionChange');
        const dayButton = page.locator('ion-datetime .calendar-day[data-day="10"][data-month="10"][data-year="2022"]');
        await dayButton.click();

        await ionChange.next();

        await expect(datetime).toHaveJSProperty('value', '2022-10-10T08:00:00');
      });

      test('should adjust to in-bounds when using month picker', async ({ page }) => {
        await page.setContent(
          `
          <ion-datetime
            min="2022-01-15"
            value="2022-02-01"
            presentation="month-year"
          ></ion-datetime>
        `,
          config
        );

        const datetime = page.locator('ion-datetime');
        const monthColumnItems = page.locator('ion-datetime .month-column ion-picker-column-option');
        const ionChange = await page.spyOnEvent('ionChange');

        await page.waitForSelector('.datetime-ready');

        await monthColumnItems.nth(0).click(); // switch to January
        await ionChange.next();

        await expect(datetime).toHaveJSProperty('value', '2022-01-15T00:00:00');
      });
    });

    test.describe('datetime: confirm button', () => {
      test('should apply max and min constraints even when user confirmation is required', async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/25073',
        });

        await page.setContent(
          `
          <ion-datetime max="2022-01-10T15:30" show-default-buttons="true"></ion-datetime>

          <script>
            const mockToday = '2022-01-10T12:22';
            Date = class extends Date {
              constructor(...args) {
                if (args.length === 0) {
                  super(mockToday)
                } else {
                  super(...args);
                }
              }
            }
          </script>
        `,
          config
        );
        await page.waitForSelector('.datetime-ready');

        // Select Jan 10, 2022
        const maxDate = page.locator('ion-datetime .calendar-day[data-day="10"][data-month="1"][data-year="2022"]');
        await maxDate.click();
        await page.waitForChanges();

        // Check to see that the hours have been filtered.
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
        const timeButton = page.locator('ion-datetime .time-body');
        await timeButton.click();

        await ionPopoverDidPresent.next();

        const hours = page.locator('ion-popover ion-picker-column:nth-child(1) ion-picker-column-option');

        await expect(await hours.count()).toBe(4);
      });
    });
  });
});

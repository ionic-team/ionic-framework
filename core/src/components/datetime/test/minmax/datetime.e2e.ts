import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('datetime: minmax', () => {
  test('calendar arrow navigation should respect min/max values', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25073',
    });

    await page.setContent(`
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
  `);

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
    await page.goto('/src/components/datetime/test/minmax');
    const calendarMonths = page.locator('ion-datetime#inside .calendar-month');

    await page.waitForSelector('.datetime-ready');

    await expect(calendarMonths.nth(0)).not.toHaveClass(/calendar-month-disabled/);
    await expect(calendarMonths.nth(1)).not.toHaveClass(/calendar-month-disabled/);
    await expect(calendarMonths.nth(2)).toHaveClass(/calendar-month-disabled/);
  });

  test('datetime: minmax navigation disabled', async ({ page }) => {
    await page.goto('/src/components/datetime/test/minmax');
    await page.waitForSelector('.datetime-ready');

    const navButtons = page.locator('ion-datetime#outside .calendar-next-prev ion-button');

    await expect(navButtons.nth(0)).toHaveAttribute('disabled', '');
    await expect(navButtons.nth(1)).toHaveAttribute('disabled', '');
  });

  test('datetime: min including day should not disable month', async ({ page }) => {
    await page.goto('/src/components/datetime/test/minmax');
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
      await page.setContent(`
        <ion-datetime min="2022-04-22T04:10:00" max="2022-05-21T21:30:00"></ion-datetime>
    `);

      await page.waitForSelector('.datetime-ready');

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.click('.time-body');
      await ionPopoverDidPresent.next();

      const hours = page.locator(
        'ion-popover ion-picker-column-internal:nth-child(1) .picker-item:not(.picker-item-empty)'
      );
      const minutes = page.locator(
        'ion-popover ion-picker-column-internal:nth-child(2) .picker-item:not(.picker-item-empty)'
      );

      expect(await hours.count()).toBe(12);
      expect(await minutes.count()).toBe(60);
    });
  });

  test.describe('setting value outside bounds should show in-bounds month', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
    });
    const testDisplayedMonth = async (page: E2EPage, content: string, expectedString = 'June 2021') => {
      await page.setContent(content);
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
      await testDisplayedMonth(page, `<ion-datetime max="2012-06-01"></ion-datetime>`, 'June 2012');
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

    await page.setContent(`
      <button id="bind">Bind datetimeMonthDidChange event</button>
      <ion-datetime min="2022-04-15" value="2022-04-20" presentation="date" locale="en-US"></ion-datetime>

      <script type="module">
        import { InitMonthDidChangeEvent } from '/src/components/datetime/test/utils/month-did-change-event.js';
        document.querySelector('#bind').addEventListener('click', function() {
          InitMonthDidChangeEvent();
        });
      </script>
    `);
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

  test('should not include 12AM when minimum is greater than 12AM', async ({ page, skip }) => {
    skip.rtl();

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25183',
    });

    await page.setContent(`
      <ion-datetime
        presentation="time"
        min="2022-04-25T08:30:00"
        max="2022-04-25T21:30:00"
        value="2022-04-25T08:30:00"
      ></ion-datetime>
    `);

    const hourPickerItems = page.locator(
      'ion-datetime ion-picker-column-internal:first-of-type .picker-item:not(.picker-item-empty)'
    );
    await expect(hourPickerItems).toHaveText(['8', '9', '10', '11']);
  });

  test('should include 12PM when minimum is greater than 12', async ({ page, skip }) => {
    skip.rtl();

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25183',
    });

    await page.setContent(`
      <ion-datetime
        locale="en-US"
        presentation="time"
        min="2022-07-29T08:00:00"
        value="2022-07-29T12:00:00"
      ></ion-datetime>
    `);

    const hourPickerItems = page.locator(
      'ion-datetime ion-picker-column-internal:first-of-type .picker-item:not(.picker-item-empty)'
    );
    await expect(hourPickerItems).toHaveText(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
  });

  test('time values should be filtered based on active day even when changing working parts', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <button id="bind">Bind datetimeMonthDidChange event</button>
      <ion-datetime
        value="2022-10-12T21:15:10.972Z"
        min="2022-10-12T21:15:10.972Z"
        max="2022-11-12T21:15:51.349Z"
      ></ion-datetime>

      <script type="module">
        import { InitMonthDidChangeEvent } from '/src/components/datetime/test/utils/month-did-change-event.js';
        document.querySelector('button').addEventListener('click', function() {
          InitMonthDidChangeEvent();
        });
      </script>
    `);

    await page.waitForSelector('.datetime-ready');
    await page.click('button#bind');

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
    const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');

    // Go to the next month
    const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');
    await buttons.nth(1).click();

    // Wait for working month to change
    await datetimeMonthDidChange.next();

    // Open time popover
    await page.click('.time-body');
    await ionPopoverDidPresent.next();

    const hours = page.locator(
      'ion-popover ion-picker-column-internal:nth-child(1) .picker-item:not(.picker-item-empty)'
    );
    const minutes = page.locator(
      'ion-popover ion-picker-column-internal:nth-child(2) .picker-item:not(.picker-item-empty)'
    );

    // Ensure the number of hours and minutes are correct
    expect(await hours.count()).toBe(3);
    expect(await minutes.count()).toBe(45);
  })
});

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
});

test.describe('datetime: iso-8601', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should set initial value to max with just a year', async ({ page }) => {
    await page.setContent(`
      <ion-datetime
        presentation="date-time"
        prefer-wheel="true"
        max="2012"
        locale="en-US"
      ></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const activeDate = page.locator('ion-datetime .date-column .picker-item-active');
    const activeHour = page.locator('ion-datetime .hour-column .picker-item-active');
    const activeMinute = page.locator('ion-datetime .minute-column .picker-item-active');
    const activeDayPeriod = page.locator('ion-datetime .day-period-column .picker-item-active');

    await expect(activeDate).toHaveAttribute('data-value', '2012-12-31');
    await expect(activeHour).toHaveAttribute('data-value', '23');
    await expect(activeMinute).toHaveAttribute('data-value', '59');
    await expect(activeDayPeriod).toHaveAttribute('data-value', 'pm');
  });
  test('should set max correctly even with just time data', async ({ page }) => {
    await page.setContent(`
      <ion-datetime
        presentation="time"
        prefer-wheel="true"
        value="2022-12-31T01:00"
        max="04:59"
        locale="en-US"
      ></ion-datetime>
    `);

    await page.waitForSelector('.datetime-ready');

    const hourItems = page.locator('ion-datetime .hour-column .picker-item:not(.picker-item-empty)');

    await expect(await hourItems.count()).toEqual(4);
  });
});

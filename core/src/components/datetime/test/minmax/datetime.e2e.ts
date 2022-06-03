import { expect } from '@playwright/test';
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

    expect(nextButton).toBeEnabled();
    expect(prevButton).toBeDisabled();

    await page.evaluate('initDatetimeChangeEvent()');

    const monthDidChangeSpy = await page.spyOnEvent('datetimeMonthDidChange');

    await nextButton.click();
    await page.waitForChanges();

    await monthDidChangeSpy.next();

    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeEnabled();
  });
  test('datetime: minmax months disabled', async ({ page }) => {
    await page.goto('/src/components/datetime/test/minmax');
    const calendarMonths = page.locator('ion-datetime#inside .calendar-month');

    await page.waitForSelector('.datetime-ready');

    expect(calendarMonths.nth(0)).not.toHaveClass(/calendar-month-disabled/);
    expect(calendarMonths.nth(1)).not.toHaveClass(/calendar-month-disabled/);
    expect(calendarMonths.nth(2)).toHaveClass(/calendar-month-disabled/);
  });

  test('datetime: minmax navigation disabled', async ({ page }) => {
    await page.goto('/src/components/datetime/test/minmax');
    await page.waitForSelector('.datetime-ready');

    const navButtons = page.locator('ion-datetime#outside .calendar-next-prev ion-button');

    expect(navButtons.nth(0)).toHaveAttribute('disabled', '');
    expect(navButtons.nth(1)).toHaveAttribute('disabled', '');
  });
  test('datetime: min including day should not disable month', async ({ page }) => {
    await page.goto('/src/components/datetime/test/minmax');
    await page.waitForSelector('.datetime-ready');

    const calendarMonths = page.locator('ion-datetime#min-with-day .calendar-month');

    expect(calendarMonths.nth(0)).toHaveClass(/calendar-month-disabled/);
    expect(calendarMonths.nth(1)).not.toHaveClass(/calendar-month-disabled/);
    expect(calendarMonths.nth(2)).not.toHaveClass(/calendar-month-disabled/);
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
});

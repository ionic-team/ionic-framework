import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: show adjacent days'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#default');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days`));
    });

    test('should not have visual regressions with a custom styled calendar', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#custom-calendar-days');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-custom-calendar`));
    });

    test('should not have visual regressions with specific date disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#specificDate');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-specific-date-disabled`));
    });

    test('should not have visual regressions with weekends disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#weekends');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-weekends-disabled`));
    });

    test('should not have visual regressions with date range disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#dateRange');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-date-range-disabled`));
    });

    test('should not have visual regressions with month disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#month');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-month-disabled`));
    });

    test('should not have visual regressions with display specified', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      await page.locator('.datetime-ready').first().waitFor();
      const datetime = page.locator('#display');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-display`));
    });
  });
});

configs({ directions: ['ltr', 'rtl'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: show adjacent days'), () => {
    test('should return the same date format on current month days and on adjacent days', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-adjacent-days="true" value="2022-10-14T16:22:00.000Z" presentation="date"></ion-datetime>
      `,
        config
      );

      // Wait for the datetime to be ready.
      await page.locator('.datetime-ready').waitFor();

      const ionChange = await page.spyOnEvent('ionChange');

      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');

      /**
       * Make sure to exclude adjacent days from the query since
       * the previous/next month is rendered hidden. This causes
       * the query to possibly return different results: one for
       * the current month and one from the hidden previous/next
       * month.
       */
      const october20Button = page.locator(
        '[data-month="10"][data-year="2022"][data-day="20"]:not(.calendar-day-adjacent-day)'
      );

      await october20Button.click();

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({
        value: '2022-10-20T16:22:00',
      });

      const november1Button = page.locator(
        '.calendar-day-adjacent-day[data-month="11"][data-year="2022"][data-day="1"]'
      );

      await november1Button.click();
      // Wait for the datetime to change the month since an adjacent day
      // was clicked.
      await page.waitForChanges();

      // Wait for the title to update to the new month since it changes
      // after the month animation finishes.
      await expect(calendarMonthYear).toHaveText('November 2022');

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({
        value: '2022-11-01T16:22:00',
      });

      /**
       * Make sure to exclude adjacent days from the query since
       * the previous/next month is rendered hidden. This causes
       * the query to possibly return different results: one for
       * the current month and one from the hidden previous/next
       * month.
       */
      const november22Button = page.locator(
        '[data-month="11"][data-year="2022"][data-day="22"]:not(.calendar-day-adjacent-day)'
      );

      await november22Button.click();

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({
        value: '2022-11-22T16:22:00',
      });
    });

    test('should navigate to previous month via swipe and then select adjacent day from prior month', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-datetime show-adjacent-days="true" value="2026-02-14T16:22:00.000Z" presentation="date"></ion-datetime>
      `,
        config
      );

      // Wait for the datetime to be ready.
      await page.locator('.datetime-ready').waitFor();
      const ionChange = await page.spyOnEvent('ionChange');
      const calendarMonthYear = page.locator('ion-datetime .calendar-month-year');
      const calendarBody = page.locator('ion-datetime .calendar-body');

      // Wait for the month to be visible.
      await expect(calendarMonthYear).toHaveText('February 2026');

      // Scroll to the previous month.
      await calendarBody.evaluate((el: HTMLElement) => {
        const rtl = document.documentElement.dir === 'rtl';
        el.scrollLeft += rtl ? el.clientWidth * 2 : -el.clientWidth * 2;
      });

      // Wait for the month to change.
      await page.waitForChanges();
      await expect(calendarMonthYear).toHaveText('January 2026');

      // Select the adjacent day from the prior month.
      const dec31Adjacent = page.locator(
        '.calendar-day-adjacent-day[data-month="12"][data-year="2025"][data-day="31"]'
      );
      await dec31Adjacent.click();

      // Wait for the month to change.
      await page.waitForChanges();

      // Wait for the month to be visible.
      await expect(calendarMonthYear).toHaveText('December 2025');
      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({
        value: '2025-12-31T16:22:00',
      });
    });
  });
});

import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';
/**
 * This is testing element rendering which
 * does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('datetime: month-year picker'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/datetime/test/month-year-picker', config);
      await page.locator('.datetime-ready').first().waitFor();
    });

    test('should hide the footer when picker is open', async ({ page }) => {
      const datetimeFooter = page.locator('#date-time .datetime-footer');
      await expect(datetimeFooter).toBeVisible();

      const pickerButton = page.locator('#date-time .calendar-month-year > .calendar-month-year-toggle');
      await pickerButton.click();
      await page.waitForChanges();
      await expect(datetimeFooter).not.toBeVisible();
    });

    test('should not hide the footer on month-year presentation', async ({ page }) => {
      const monthyearFooter = page.locator('#month-year .datetime-footer');
      await expect(monthyearFooter).toBeVisible();
    });
  });

  test.describe(title('datetime: month-year picker with a hidden calendar body'), () => {
    test.beforeEach(async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31416',
      });

      await page.setContent(
        `
        <ion-datetime presentation="date-time" value="2026-04-28T10:00:00"></ion-datetime>
      `,
        config
      );
      await page.locator('.datetime-ready').waitFor();
    });

    /**
     * Opening the picker hides the calendar body, so a real scroll would
     * have to be pending at that exact moment for the scroll listener to
     * run. Dispatching the event, then waiting out the listener's debounce,
     * makes that timing deterministic.
     */
    const flushCalendarScroll = async (page: E2EPage) => {
      await page.locator('ion-datetime .calendar-body').dispatchEvent('scroll');
      await page.waitForTimeout(100);
      await page.waitForChanges();
    };

    test('should not change the month when the scroll listener runs', async ({ page }) => {
      const pickerButton = page.locator('ion-datetime .calendar-month-year-toggle');

      await expect(pickerButton).toContainText('April 2026');

      await pickerButton.click();
      await page.waitForChanges();

      await flushCalendarScroll(page);

      await expect(pickerButton).toContainText('April 2026');

      // Showing the calendar body again should not change the month either.
      await pickerButton.click();
      await page.waitForChanges();

      await flushCalendarScroll(page);

      await expect(pickerButton).toContainText('April 2026');
    });

    test('should finish scrolling to a new value when the picker opens during the animation', async ({ page }) => {
      const pickerButton = page.locator('ion-datetime .calendar-month-year-toggle');
      const nextMonthButton = page.locator('ion-datetime .calendar-next-prev ion-button + ion-button');

      await page.locator('ion-datetime').evaluate((el: HTMLIonDatetimeElement) => {
        el.value = '2026-06-15T10:00:00';
        el.shadowRoot!.querySelector('.calendar-month-year-toggle')!.dispatchEvent(new MouseEvent('click'));
      });
      await page.waitForChanges();

      await flushCalendarScroll(page);

      await expect(pickerButton).toContainText('June 2026');

      // The month arrows only keep working if the new value is no longer being forced.
      await pickerButton.click();
      await page.waitForChanges();

      await nextMonthButton.click();

      await expect(pickerButton).toContainText('July 2026');
    });
  });
});

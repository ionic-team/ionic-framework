import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: show adjacent days'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#default');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days`));
    });

    test('should not have visual regressions with a custom styled calendar', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#custom-calendar-days');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-custom-calendar`));
    });

    test('should not have visual regressions with specific date disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#specificDate');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-specific-date-disabled`));
    });

    test('should not have visual regressions with weekends disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#weekends');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-weekends-disabled`));
    });

    test('should not have visual regressions with date range disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#dateRange');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-date-range-disabled`));
    });

    test('should not have visual regressions with month disabled', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#month');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-month-disabled`));
    });

    test('should not have visual regressions with display specified', async ({ page }) => {
      await page.goto('/src/components/datetime/test/show-adjacent-days', config);
      const datetime = page.locator('#display');
      await expect(datetime).toHaveScreenshot(screenshot(`datetime-show-adjacent-days-display`));
    });

    test('should return the same date format on current month days and on adjacent days', async ({ page }) => {
      await page.setContent(
        `
        <ion-datetime show-adjacent-days="true" locale="en-US" value="2022-10-14T16:22:00.000Z" presentation="date"></ion-datetime>
      `,
        config
      );
      const datetime = page.locator('ion-datetime');
      const ionChange = await page.spyOnEvent('ionChange');
      // Oct 20, 2022
      await page.click('.calendar-day[data-month="10"][data-year="2022"][data-day="20"]');
      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({ value: '2022-10-20T16:22:00' });
      await expect(datetime).toHaveJSProperty('value', '2022-10-20T16:22:00');
      // Nov 1, 2022
      await page.click('.calendar-day[data-month="11"][data-year="2022"][data-day="1"]');
      await page.waitForChanges();
      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({ value: '2022-11-01T16:22:00' });
      await expect(datetime).toHaveJSProperty('value', '2022-11-01T16:22:00');
      // Nov 22, 2022
      await page.click('.calendar-day[data-month="11"][data-year="2022"][data-day="22"]');
      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({ value: '2022-11-22T16:22:00' });
      await expect(datetime).toHaveJSProperty('value', '2022-11-22T16:22:00');
    });
  });
});

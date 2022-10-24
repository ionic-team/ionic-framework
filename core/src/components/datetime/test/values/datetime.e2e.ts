import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: values', () => {
  test('should render correct days', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" presentation="date" day-values="1,2,3"></ion-datetime>
    `);
    await page.waitForSelector('.datetime-ready');

    const items = page.locator('.calendar-day:not([disabled])');

    /**
     * Datetime calendar grid renders 3 months by default,
     * so this ensures that dayValues is applying to all
     * rendered months, not just the initial month.
     */
    await expect(items).toHaveText(['1', '2', '3', '1', '2', '3', '1', '2', '3']);
  });
  test('should render correct months', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" presentation="month-year" month-values="5,6,10"></ion-datetime>
    `);

    const items = page.locator('.month-column .picker-item:not(.picker-item-empty)');
    await expect(items).toHaveText(['May', 'June', 'October']);
  });
  test('should render correct years', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" presentation="month-year" year-values="2022,2021,2020"></ion-datetime>
    `);

    const items = page.locator('.year-column .picker-item:not(.picker-item-empty)');
    await expect(items).toHaveText(['2022', '2021', '2020']);
  });
  test('should render correct hours', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" presentation="time" hour-values="1,2,3"></ion-datetime>
    `);

    const items = page.locator('ion-picker-column-internal:first-of-type .picker-item:not(.picker-item-empty)');
    await expect(items).toHaveText(['1', '2', '3']);
  });
  test('should render correct minutes', async ({ page }) => {
    await page.setContent(`
      <ion-datetime locale="en-US" presentation="time" minute-values="1,2,3"></ion-datetime>
    `);

    const items = page.locator('ion-picker-column-internal:nth-of-type(2) .picker-item:not(.picker-item-empty)');
    await expect(items).toHaveText(['01', '02', '03']);
  });
});

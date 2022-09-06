import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: set-value', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/datetime/test/set-value');
    await page.waitForSelector('.datetime-ready');
  });
  test('should update the active date', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-11-25T12:40:00.000Z'));

    await page.waitForChanges();

    const activeDate = page.locator('ion-datetime .calendar-day-active');
    await expect(activeDate).toHaveText('25');
  });
  test('should update the active time', async ({ page }) => {
    const datetime = page.locator('ion-datetime');
    await datetime.evaluate((el: HTMLIonDatetimeElement) => (el.value = '2021-11-25T12:40:00.000Z'));

    await page.waitForChanges();

    const activeDate = page.locator('ion-datetime .time-body');
    await expect(activeDate).toHaveText('12:40 PM');
  });
});

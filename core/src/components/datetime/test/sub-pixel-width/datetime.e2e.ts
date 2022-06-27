import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('datetime: sub-pixel width', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/datetime/test/sub-pixel-width');
  });
  test('should update the month when next button is clicked', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');

    const openModalBtn = page.locator('#open-modal');

    await openModalBtn.click();
    await ionModalDidPresent.next();
    await page.waitForSelector('.datetime-ready');

    const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');
    await buttons.nth(1).click();

    await datetimeMonthDidChange.next();

    const monthYear = page.locator('ion-datetime .calendar-month-year');
    await expect(monthYear).toHaveText('March 2022');
  });

  test('should update the month when prev button is clicked', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');

    const openModalBtn = page.locator('#open-modal');

    await openModalBtn.click();
    await ionModalDidPresent.next();
    await page.waitForSelector('.datetime-ready');

    const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');
    await buttons.nth(0).click();

    await datetimeMonthDidChange.next();

    const monthYear = page.locator('ion-datetime .calendar-month-year');
    await expect(monthYear).toHaveText('January 2022');
  });
});

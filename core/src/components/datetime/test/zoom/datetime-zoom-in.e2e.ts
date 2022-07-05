import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.use({
  viewport: {
    width: 640,
    height: 480,
  },
  deviceScaleFactor: 2,
});

/**
 * This test emulates zoom behavior in the browser to make sure
 * that key functions of the ion-datetime continue to function even
 * if the page is zoomed in or out.
 */
test.describe('datetime: zoom in interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/datetime/test/zoom');
  });

  test('should update the month when next button is clicked', async ({ page }) => {
    const openModalBtn = page.locator('#open-modal');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');

    await openModalBtn.click();
    await ionModalDidPresent.next();

    const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');

    await buttons.nth(1).click();
    await datetimeMonthDidChange.next();

    const monthYear = page.locator('ion-datetime .calendar-month-year');
    await expect(monthYear).toHaveText('March 2022');
  });

  test('should update the month when prev button is clicked', async ({ page }) => {
    const openModalBtn = page.locator('#open-modal');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const datetimeMonthDidChange = await page.spyOnEvent('datetimeMonthDidChange');

    await openModalBtn.click();
    await ionModalDidPresent.next();

    const buttons = page.locator('ion-datetime .calendar-next-prev ion-button');

    await buttons.nth(0).click();
    await datetimeMonthDidChange.next();

    const monthYear = page.locator('ion-datetime .calendar-month-year');
    await expect(monthYear).toHaveText('January 2022');
  });
});

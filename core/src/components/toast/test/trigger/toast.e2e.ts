import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toast: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/toast/test/trigger');
  });

  test('should open the toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const toast = page.locator('#default-toast');

    await page.click('#default');

    await ionToastDidPresent.next();
    await expect(alert).toBeVisible();
  });

  test('should present a previously presented toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
    const toast = page.locator('#timeout-toast');

    await page.click('#timeout');

    await ionToastDidDismiss.next();

    await page.click('#timeout');

    await ionToastDidPresent.next();
    await expect(alert).toBeVisible();
  });
});

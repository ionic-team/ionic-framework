import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('loading: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('trigger does not behave differently in RTL');
    skip.mode('md');
    await page.goto('/src/components/loading/test/trigger');
  });

  test('should open the loading indicator', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const loading = page.locator('#default-loading');
    await page.click('#default');

    await ionLoadingDidPresent.next();
    await expect(loading).toBeVisible();
  });

  test('should present a previously presented loading indicator', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');
    const loading = page.locator('#timeout-loading');

    await page.click('#timeout');

    await ionLoadingDidDismiss.next();

    await page.click('#timeout');

    await ionLoadingDidPresent.next();
    await expect(loading).toBeVisible();
  });
});

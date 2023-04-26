import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('loading: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/loading/test/is-open');
  });

  test('should open the loading indicator', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const loading = page.locator('ion-loading');

    await page.click('#default');

    await ionLoadingDidPresent.next();
    await expect(loading).toBeVisible();
  });

  test('should open the loading indicator then close after a timeout', async ({ page }) => {
    const ionLoadingDidPresent = await page.spyOnEvent('ionLoadingDidPresent');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');
    const loading = page.locator('ion-loading');

    await page.click('#timeout');

    await ionLoadingDidPresent.next();
    await expect(loading).toBeVisible();

    await ionLoadingDidDismiss.next();
    await expect(loading).toBeHidden();
  });
});

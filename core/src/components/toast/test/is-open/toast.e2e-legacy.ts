import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toast: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/toast/test/is-open');
  });

  test('should open the toast', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const toast = page.locator('ion-toast');

    await page.click('#default');

    await ionToastDidPresent.next();
    await expect(toast).toBeVisible();
  });

  test('should open the toast then close after a timeout', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
    const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
    const toast = page.locator('ion-toast');

    await page.click('#timeout');

    await ionToastDidPresent.next();
    await expect(toast).toBeVisible();

    await ionToastDidDismiss.next();
    await expect(toast).toBeHidden();
  });
});

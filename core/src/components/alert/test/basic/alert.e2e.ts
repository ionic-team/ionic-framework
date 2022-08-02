import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('alert: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/alert/test/basic');
  });

  test('should dismiss when async handler resolves', async ({ page }) => {
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
    const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');

    const alert = page.locator('ion-alert');

    await page.click('#asyncHandler');
    await ionAlertDidPresent.next();

    await page.click('.alert-button');

    await expect(alert).toBeVisible();

    await ionLoadingDidDismiss.next();
    await ionAlertDidDismiss.next();

    await expect(alert).toBeHidden();
  });
});

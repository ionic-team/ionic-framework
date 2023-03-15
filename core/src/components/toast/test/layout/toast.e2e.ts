import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toast: stacked layout', () => {
  test('should render stacked buttons', async ({ page }) => {
    await page.goto('/src/components/toast/test/layout');
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    await page.click('#stacked');
    await ionToastDidPresent.next();

    const toastWrapper = page.locator('ion-toast .toast-wrapper');
    await expect(toastWrapper).toHaveScreenshot(`toast-stacked-${page.getSnapshotSettings()}.png`);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Popover: Custom Injector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/popover-custom-injector');
  });

  test('should inject custom service via custom injector', async ({ page }) => {
    await page.locator('ion-button#open-popover-with-custom-injector').click();

    await expect(page.locator('ion-popover')).toBeVisible();

    const serviceValue = page.locator('#service-value');
    await expect(serviceValue).toHaveText('Service Value: custom-injector-value');
  });
});

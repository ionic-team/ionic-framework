import { test, expect } from '@playwright/test';

test.describe('Modal: Custom Injector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal-custom-injector');
  });

  test('should inject custom service via custom injector', async ({ page }) => {
    await page.locator('ion-button#open-modal-with-custom-injector').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    const serviceValue = page.locator('#service-value');
    await expect(serviceValue).toHaveText('Service Value: custom-injector-value');

    await page.locator('#close-modal').click();
    await expect(page.locator('ion-modal')).not.toBeVisible();
  });

  test('should fail without custom injector when service is not globally provided', async ({ page }) => {
    await page.locator('ion-button#open-modal-without-custom-injector').click();

    await page.waitForTimeout(1000);

    const errorMessage = page.locator('#error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: TestService not available');
  });
});

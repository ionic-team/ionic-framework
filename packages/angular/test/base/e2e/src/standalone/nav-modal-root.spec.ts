import { expect, test } from '@playwright/test';

test.describe('Nav: root binding inside a modal (standalone)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/nav-modal-root');
  });

  test('should render the nav root when bound from componentProps', async ({ page }) => {
    await page.locator('#open-nav-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();
    await expect(page.locator('ion-modal ion-nav')).toBeVisible();
    await expect(page.locator('#nav-modal-root-content')).toBeVisible();
  });
});

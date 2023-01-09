import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('reorder group: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Reorder group does not have per-mode styles');
  });
  test('should render the handle when reorder group is enabled', async ({ page }) => {
    await page.setContent(`
      <ion-reorder-group disabled="false">
        <ion-item>
          <ion-label>Item</ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>
      </ion-reorder-group>
    `);
    const reorder = page.locator('ion-reorder');
    await expect(reorder).toBeVisible();
  });
  test('should not render the handle when reorder group is disabled', async ({ page }) => {
    await page.setContent(`
      <ion-reorder-group disabled="true">
        <ion-item>
          <ion-label>Item</ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>
      </ion-reorder-group>
    `);
    const reorder = page.locator('ion-reorder');
    await expect(reorder).toBeHidden();
  });
});

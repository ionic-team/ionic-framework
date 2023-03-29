import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-divider: basic', () => {
  test('should display an item divider with text', async ({ page }) => {
    await page.setContent(`
      <ion-item-divider>
        <ion-label>Item Divider</ion-label>
      </ion-item-divider>
    `);

    const divider = page.locator('ion-item-divider');
    await expect(divider).toHaveScreenshot(`item-divider-text-${page.getSnapshotSettings()}.png`);
  });

  test('should display an item divider with a button in the end slot', async ({ page }) => {
    await page.setContent(`
      <ion-item-divider>
        <ion-label>Item Divider</ion-label>
        <ion-button slot="end">Button</ion-button>
      </ion-item-divider>
    `);

    const divider = page.locator('ion-item-divider');
    await expect(divider).toHaveScreenshot(`item-divider-button-end-${page.getSnapshotSettings()}.png`);
  });

  test('should display an item divider with an icon in the start slot', async ({ page }) => {
    await page.setContent(`
      <ion-item-divider>
        <ion-icon slot="start" name="star"></ion-icon>
        <ion-label>Item Divider</ion-label>
      </ion-item-divider>
    `);

    const divider = page.locator('ion-item-divider');
    await expect(divider).toHaveScreenshot(`item-divider-icon-start-${page.getSnapshotSettings()}.png`);
  });
});

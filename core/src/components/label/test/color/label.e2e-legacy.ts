import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('label: rendering', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not inherit color from content', async ({ page }) => {
    await page.goto(`/src/components/label/test/color`);

    const item = page.locator('ion-item');

    await expect(item).toHaveScreenshot(`item-color-inherit-${page.getSnapshotSettings()}.png`);
  });
  test('should set color directly', async ({ page }) => {
    await page.setContent(`
      <ion-label color="danger">Label Text</ion-label>
    `);

    const labelEl = page.locator('ion-label');

    await expect(labelEl).toHaveScreenshot(`label-color-${page.getSnapshotSettings()}.png`);
  });
  test('should use contrast color when color is set on item', async ({ page }) => {
    await page.setContent(`
      <ion-item color="danger">
        <ion-label>Label Text</ion-label>
      </ion-item>
    `);

    const labelEl = page.locator('ion-label');

    await expect(labelEl).toHaveScreenshot(`label-color-contrast-${page.getSnapshotSettings()}.png`);
  });
  test('should override color even if color set on item', async ({ page }) => {
    await page.setContent(`
      <ion-item color="danger">
        <ion-label color="dark">Label Text</ion-label>
      </ion-item>
    `);

    const labelEl = page.locator('ion-label');

    await expect(labelEl).toHaveScreenshot(`label-color-override-${page.getSnapshotSettings()}.png`);
  });
});

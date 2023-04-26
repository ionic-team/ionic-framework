import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('label: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.setContent(`
      <ion-label>My Label</ion-label>
    `);

    const labelEl = page.locator('ion-label');

    await expect(labelEl).toHaveScreenshot(`label-basic-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with fixed label', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label>My Label</ion-label>
      </ion-item>
    `);

    const itemEl = page.locator('ion-item');

    await expect(itemEl).toHaveScreenshot(`label-fixed-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with stacked label', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label position="stacked">My Label</ion-label>
        <ion-input></ion-input>
      </ion-item>
    `);

    const itemEl = page.locator('ion-item');

    await expect(itemEl).toHaveScreenshot(`label-stacked-${page.getSnapshotSettings()}.png`);
  });
  test('should not have visual regressions with floating label', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label position="floating">My Label</ion-label>
        <ion-input></ion-input>
      </ion-item>
    `);

    const itemEl = page.locator('ion-item');

    await expect(itemEl).toHaveScreenshot(`label-floating-${page.getSnapshotSettings()}.png`);
  });
});

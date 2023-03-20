import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: wrapping', () => {
  test('should not wrap text by default', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select value="brown" aria-label="Hair Color">
        <ion-select-option value="brown">Brown Hair Is The Best At Wrapping When No Label Exists And Really Long Text Exists To Make It Wrap The Text</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-wrap-${page.getSnapshotSettings()}.png`);
  });

  test('should wrap text with class', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select value="brown" aria-label="Hair Color" class="ion-text-wrap">
        <ion-select-option value="brown">Brown Hair Is The Best At Wrapping When No Label Exists And Really Long Text Exists To Make It Wrap The Text</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-wrap-${page.getSnapshotSettings()}.png`);
  });

  test('should not wrap label while wrapping text with class', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select label="Hair Color" value="brown" aria-label="Hair Color" class="ion-text-wrap">
        <ion-select-option value="brown">Brown Hair Is The Best At Wrapping When No Label Exists And Really Long Text Exists To Make It Wrap The Text</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-wrap-${page.getSnapshotSettings()}.png`);
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: wrapping', () => {
  test('should not wrap text by default', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select value="nowrap" aria-label="Should Not Wrap">
        <ion-select-option value="nowrap">Should not wrap when no label exists and no class is added to make the text wrap</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-nowrap-${page.getSnapshotSettings()}.png`);
  });

  test('should wrap text with class', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select value="wrap" aria-label="Should Wrap" class="ion-text-wrap">
        <ion-select-option value="wrap">Should wrap when no label exists and really long text exists to make it wrap the text</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-wrap-${page.getSnapshotSettings()}.png`);
  });

  test('should not wrap label while wrapping text with class', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-select value="wrap" label="Really long label should not wrap" class="ion-text-wrap">
        <ion-select-option value="wrap">Should wrap value only when label exists and really long text exists to make it wrap the text</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    await expect(select).toHaveScreenshot(`select-wrap-with-label-${page.getSnapshotSettings()}.png`);
  });
});

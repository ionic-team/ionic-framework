import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test.describe('input: fill none', () => {
    test('should set label and highlight color on expand', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-no-fill-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('input: fill solid', () => {
    test('should set label and highlight color on expand', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-solid-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('input: fill outline', () => {
    test('should set label and highlight color on expand', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" label="Label" class="select-expanded" value="apple" class="ion-focused" color="danger">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-outline-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
});

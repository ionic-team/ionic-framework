import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: highlights', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test.describe('input: no fill', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-no-fill-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select value="apple" class="ion-touched ion-invalid" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-no-fill-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select value="apple" class="ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-no-fill-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: solid', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-solid-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" value="apple" class="ion-touched ion-invalid" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-solid-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" value="apple" class="ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-solid-focus-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('input: outline', () => {
    test('should render valid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" value="apple" class="ion-valid ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-outline-valid-${page.getSnapshotSettings()}.png`);
    });
    test('should render invalid state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" value="apple" class="ion-touched ion-invalid ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-outline-invalid-${page.getSnapshotSettings()}.png`);
    });
    test('should render focused state correctly', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" value="apple" class="ion-focused" label="Favorite Fruit">
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      await expect(select).toHaveScreenshot(`select-outline-focus-${page.getSnapshotSettings()}.png`);
    });
  });
});

test.describe('select: expanded highlight', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test.describe('select: no fill', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-no-fill-highlight-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('select: solid', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="solid" label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-solid-highlight-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('select: outline', () => {
    test('should render bottom highlight', async ({ page }) => {
      await page.setContent(`
        <ion-select fill="outline" label="Label" class="select-expanded"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-outline-highlight-${page.getSnapshotSettings()}.png`
      );
    });
  });
});

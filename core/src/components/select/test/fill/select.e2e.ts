import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: fill', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('ios', 'Fill is only available in MD mode');
  });

  test.describe('select: fill solid', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-select
          fill="solid"
          label="Fruit"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-fill-solid-${page.getSnapshotSettings()}.png`);
    });
    test('should render correctly with floating label', async ({ page }) => {
      await page.setContent(`
        <ion-select
          fill="solid"
          label="Fruit"
          label-placement="floating"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-fill-solid-label-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should not have visual regressions with shaped solid', async ({ page }) => {
      await page.setContent(`
        <ion-select
          shape="round"
          fill="solid"
          label="Fruit"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-fill-shaped-solid-${page.getSnapshotSettings()}.png`);
    });
    test('padding and border radius should be customizable', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-select {
            --border-radius: 10px !important;
            --padding-start: 50px !important;
            --padding-end: 50px !important;
          }
        </style>
        <ion-select
          shape="round"
          fill="solid"
          label="Fruit"
          label-placement="floating"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-fill-shaped-solid-custom-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('select: fill outline', () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
        <ion-select
          fill="outline"
          label="Fruit"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-fill-outline-${page.getSnapshotSettings()}.png`);
    });
    test('should render correctly with floating label', async ({ page }) => {
      await page.setContent(`
        <ion-select
          fill="outline"
          label="Fruit"
          label-placement="floating"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-fill-outline-label-floating-${page.getSnapshotSettings()}.png`
      );
    });
    test('should not have visual regressions with shaped outline', async ({ page }) => {
      await page.setContent(`
        <ion-select
          shape="round"
          fill="outline"
          label="Fruit"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-fill-shaped-outline-${page.getSnapshotSettings()}.png`);
    });
    test('padding and border radius should be customizable', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-select {
            --border-radius: 10px !important;
            --padding-start: 50px !important;
            --padding-end: 50px !important;
          }
        </style>
        <ion-select
          shape="round"
          fill="outline"
          label="Fruit"
          label-placement="floating"
          value="apple"
        >
          <ion-select-option value="apple">Apple</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-fill-shaped-outline-custom-${page.getSnapshotSettings()}.png`
      );
    });
  });
});

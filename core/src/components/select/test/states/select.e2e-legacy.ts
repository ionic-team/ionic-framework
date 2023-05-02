import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render enabled select with a placeholder correctly', async ({ page }) => {
    await page.setContent(`
      <ion-select label="Favorite Fruit" placeholder="Select a fruit"></ion-select>
    `);

    const select = page.locator('ion-select');
    expect(await select.screenshot()).toMatchSnapshot(`select-placeholder-${page.getSnapshotSettings()}.png`);
  });

  test('should render enabled select with a value correctly', async ({ page }) => {
    await page.setContent(`
      <ion-select label="Favorite Fruit" value="apples">
        <ion-select-option value="apples">Apples</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    expect(await select.screenshot()).toMatchSnapshot(`select-value-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled select with a placeholder correctly', async ({ page }) => {
    await page.setContent(`
      <ion-select label="Favorite Fruit" placeholder="Select a fruit" disabled="true"></ion-select>
    `);

    const select = page.locator('ion-select');
    expect(await select.screenshot()).toMatchSnapshot(`select-disabled-placeholder-${page.getSnapshotSettings()}.png`);
  });

  test('should render disabled select with a value correctly', async ({ page }) => {
    await page.setContent(`
      <ion-select label="Favorite Fruit" value="apples" disabled="true">
        <ion-select-option value="apples">Apples</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    expect(await select.screenshot()).toMatchSnapshot(`select-disabled-value-${page.getSnapshotSettings()}.png`);
  });
});

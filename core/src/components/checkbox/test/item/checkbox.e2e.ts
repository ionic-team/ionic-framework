import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: item', () => {
  test('should render correctly in list', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-checkbox>Enable Notifications</ion-checkbox>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`checkbox-list-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-checkbox>Enable Notifications</ion-checkbox>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`checkbox-inset-list-${page.getSnapshotSettings()}.png`);
  });
  test('label should have correct contrast when used in an item', async ({ page, skip }) => {
    skip.rtl();
    await page.setContent(`
      <ion-item color="primary">
        <ion-checkbox>Enable Notifications</ion-checkbox>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    expect(await item.screenshot()).toMatchSnapshot(`checkbox-item-color-${page.getSnapshotSettings()}.png`);
  });
  test('should not apply item hover styles', async ({ page, skip }) => {
    skip.rtl();
    await page.setContent(`
      <ion-item>
        <ion-checkbox>Enable Notifications</ion-checkbox>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    await item.hover();
    expect(await item.screenshot()).toMatchSnapshot(`checkbox-item-hover-${page.getSnapshotSettings()}.png`);
  });
});

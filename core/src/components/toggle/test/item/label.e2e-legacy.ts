import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: item', () => {
  test('should render correctly in list', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-toggle>Enable Notifications</ion-toggle>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`toggle-list-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-toggle>Enable Notifications</ion-toggle>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`toggle-inset-list-${page.getSnapshotSettings()}.png`);
  });
  test('label should have correct contrast when used in an item', async ({ page, skip }) => {
    skip.rtl();
    await page.setContent(`
      <ion-item color="primary">
        <ion-toggle>Enable Notifications</ion-toggle>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    expect(await item.screenshot()).toMatchSnapshot(`toggle-item-color-${page.getSnapshotSettings()}.png`);
  });
});

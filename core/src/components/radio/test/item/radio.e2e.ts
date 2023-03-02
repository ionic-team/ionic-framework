import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: item', () => {
  test('should render correctly in list', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-radio-group>
          <ion-item>
            <ion-radio>Enable Notifications</ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`toggle-list-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-radio-group>
          <ion-item>
            <ion-radio>Enable Notifications</ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`radio-inset-list-${page.getSnapshotSettings()}.png`);
  });
  test('should not apply item hover styles', async ({ page, skip }) => {
    skip.rtl();
    await page.setContent(`
      <ion-radio-group>
        <ion-item>
          <ion-radio>Enable Notifications</ion-radio>
        </ion-item>
      </ion-radio-group>
    `);
    const item = page.locator('ion-item');
    await item.hover();
    expect(await item.screenshot()).toMatchSnapshot(`radio-item-hover-${page.getSnapshotSettings()}.png`);
  });
});

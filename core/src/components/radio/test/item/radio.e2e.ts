import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: item', () => {
  test('should render correctly in list', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-radio-group>
            <ion-radio>Enable Notifications</ion-radio>
          </ion-radio-group>
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
          <ion-radio-group>
            <ion-radio>Enable Notifications</ion-radio>
          </ion-radio-group>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`radio-inset-list-${page.getSnapshotSettings()}.png`);
  });
});

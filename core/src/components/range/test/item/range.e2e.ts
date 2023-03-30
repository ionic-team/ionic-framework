import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: item', () => {
  test('should render correctly in list', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-range><div slot="label">Temperature</div></ion-range>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`range-list-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-range><div slot="label">Temperature</div></ion-range>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`range-inset-list-${page.getSnapshotSettings()}.png`);
  });
  test('label should have correct contrast when used in an item', async ({ page, skip }) => {
    skip.rtl();
    await page.setContent(`
      <ion-item color="danger">
        <ion-range><div slot="label">Temperature</div></ion-range>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    expect(await item.screenshot()).toMatchSnapshot(`range-item-color-${page.getSnapshotSettings()}.png`);
  });
});

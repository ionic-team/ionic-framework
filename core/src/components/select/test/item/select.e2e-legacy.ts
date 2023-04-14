import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: item', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render correctly in list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list>
        <ion-item>
          <ion-select
            label="Email"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`select-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
  test('should render correctly in inset list with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-list inset="true">
        <ion-item>
          <ion-select
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    `);
    const list = page.locator('ion-list');
    expect(await list.screenshot()).toMatchSnapshot(`select-inset-list-no-fill-${page.getSnapshotSettings()}.png`);
  });
});

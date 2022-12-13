import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render enabled state', async ({ page }) => {
    await page.setContent(`
      <ion-range>
        <ion-icon name="volume-off" slot="start"></ion-icon>
        <ion-icon name="volume-high" slot="end"></ion-icon>
        <span slot="label">Temperature</span>
      </ion-range>
    `);

    const range = page.locator('ion-range');

    expect(await range.screenshot()).toMatchSnapshot(`range-enabled-${page.getSnapshotSettings()}.png`);
  });
  test('should render disabled state', async ({ page }) => {
    await page.setContent(`
      <ion-range disabled="true">
        <ion-icon name="volume-off" slot="start"></ion-icon>
        <ion-icon name="volume-high" slot="end"></ion-icon>
        <span slot="label">Temperature</span>
      </ion-range>
    `);

    const range = page.locator('ion-range');

    expect(await range.screenshot()).toMatchSnapshot(`range-disabled-${page.getSnapshotSettings()}.png`);
  });
});

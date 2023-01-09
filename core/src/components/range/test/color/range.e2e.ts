import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should apply color', async ({ page }) => {
    await page.setContent(`
      <ion-range color="danger" value="50">
        <ion-icon name="volume-off" slot="start"></ion-icon>
        <ion-icon name="volume-high" slot="end"></ion-icon>
        <span slot="label">Volume</span>
      </ion-range>
    `);

    const range = page.locator('ion-range');
    expect(await range.screenshot()).toMatchSnapshot(`range-color-${page.getSnapshotSettings()}.png`);
  });
});

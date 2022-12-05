import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('tab-bar: translucent', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('md', 'Translucent is only available in iOS mode');
    skip.browser('firefox', 'Firefox does not support translucent effect');
  });
  test('should render translucent tab bar', async ({ page }) => {
    await page.setContent(`
      <style>
        body {
          background: linear-gradient(to right, orange, yellow, green, cyan, blue, violet);
        }
      </style>
      <ion-tab-bar translucent="true" selected-tab="1">
        <ion-tab-button tab="1">
          <ion-label>Recents</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="2">
          <ion-label>Favorites</ion-label>
          <ion-badge>23</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="3">
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    `);

    const tabBar = page.locator('ion-tab-bar');

    expect(await tabBar.screenshot()).toMatchSnapshot(`tab-bar-translucent-${page.getSnapshotSettings()}.png`);
  });
});

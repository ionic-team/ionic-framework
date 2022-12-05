import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('tab-bar: basic', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('md', 'Translucent is only available in iOS mode');
  });
  test('should render tab bar', async ({ page }) => {
    await page.setContent(`
      <ion-tab-bar selected-tab="1">
        <ion-tab-button tab="1">
          <ion-label>Recents</ion-label>
          <ion-icon name="call"></ion-icon>
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

    expect(await tabBar.screenshot()).toMatchSnapshot(`tab-bar-basic-${page.getSnapshotSettings()}.png`);
  });
});

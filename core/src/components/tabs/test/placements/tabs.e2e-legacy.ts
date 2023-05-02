import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('tabs: placement', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setViewportSize({
      width: 300,
      height: 200,
    });
  });
  test('should show tab bar at the top of tabs', async ({ page }) => {
    await page.setContent(`
      <ion-tabs>
        <ion-tab tab="one">My Content</ion-tab>
        <ion-tab-bar slot="top">
          <ion-tab-button tab="one">One</ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    `);

    const tabs = page.locator('ion-tabs');
    await expect(tabs).toHaveScreenshot(`tabs-tab-bar-top-${page.getSnapshotSettings()}.png`);
  });
  test('should show tab bar at the bottom of tabs', async ({ page }) => {
    await page.setContent(`
      <ion-tabs>
        <ion-tab tab="one">My Content</ion-tab>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="one">One</ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    `);

    const tabs = page.locator('ion-tabs');
    await expect(tabs).toHaveScreenshot(`tabs-tab-bar-bottom-${page.getSnapshotSettings()}.png`);
  });
});

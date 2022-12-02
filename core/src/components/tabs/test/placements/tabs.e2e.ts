import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('tabs: placement', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: 300,
        height: 200,
      });
    });
    test(title('should show tab bar at the top of tabs'), async ({ page }) => {
      await page.setContent(
        `
        <ion-tabs>
          <ion-tab tab="one">My Content</ion-tab>
          <ion-tab-bar slot="top">
            <ion-tab-button tab="one">One</ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      `,
        config
      );

      const tabs = page.locator('ion-tabs');
      expect(await tabs.screenshot()).toMatchSnapshot(`tabs-tab-bar-top-${page.getSnapshotSettings()}.png`);
    });
    test(title('should show tab bar at the bottom of tabs'), async ({ page }) => {
      await page.setContent(
        `
        <ion-tabs>
          <ion-tab tab="one">My Content</ion-tab>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="one">One</ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      `,
        config
      );

      const tabs = page.locator('ion-tabs');
      expect(await tabs.screenshot()).toMatchSnapshot(`tabs-tab-bar-bottom-${page.getSnapshotSettings()}.png`);
    });
  });
});

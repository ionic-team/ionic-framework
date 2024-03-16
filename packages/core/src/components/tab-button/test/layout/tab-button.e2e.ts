import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-button: basic'), () => {
    test('should render tab button with icons left of text', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar color="light" selected-tab="1">
          <ion-tab-button tab="1" layout="icon-start">
            <ion-label>Recents</ion-label>
            <ion-icon name="call"></ion-icon>
            <ion-badge color="danger">12</ion-badge>
          </ion-tab-button>

          <ion-tab-button tab="2" layout="icon-start">
            <ion-label>Favorites</ion-label>
            <ion-icon name="heart"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3" layout="icon-start">
            <ion-label>Settings</ion-label>
            <ion-icon name="settings"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-button-icon-left`));
    });

    test('should render tab button with icons right of text', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar color="danger" selected-tab="1">
          <ion-tab-button tab="1" layout="icon-end">
            <ion-label>Recents</ion-label>
            <ion-icon name="call"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="2" layout="icon-end">
            <ion-label>Favorites</ion-label>
            <ion-icon name="heart"></ion-icon>
            <ion-badge color="dark">33</ion-badge>
          </ion-tab-button>

          <ion-tab-button tab="3" layout="icon-end">
            <ion-label>Settings</ion-label>
            <ion-icon name="settings"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-button-icon-right`));
    });

    test('should render tab button with icons below text', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar color="dark" selected-tab="1">
          <ion-tab-button tab="1" layout="icon-bottom">
            <ion-label>Recents</ion-label>
            <ion-icon name="call"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="2">
            <ion-badge>16</ion-badge>
            <ion-label>Favorites</ion-label>
            <ion-icon name="heart"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3" layout="icon-bottom">
            <ion-label>Settings</ion-label>
            <ion-icon name="settings"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-button-icon-below`));
    });

    test('should render tab button with icons on top of text', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar color="secondary" selected-tab="1">
          <ion-tab-button tab="1">
            <ion-label>Location</ion-label>
            <ion-icon name="navigate"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="2">
            <ion-badge color="danger">44</ion-badge>
            <ion-icon name="heart"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3">
            <ion-label>Radio</ion-label>
            <ion-icon name="musical-notes"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-button-icon-top`));
    });

    test('should render tab button with no icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar color="primary" selected-tab="1">
          <ion-tab-button tab="1" layout="icon-hide">
            <ion-label>Recents</ion-label>
            <ion-icon name="call"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="2" layout="icon-hide">
            <ion-label>Favorites</ion-label>
            <ion-icon name="heart"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3" layout="icon-hide">
            <ion-label>Settings</ion-label>
            <ion-icon name="settings"></ion-icon>
            <ion-badge color="danger">2</ion-badge>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-button-no-icon`));
    });
  });
});

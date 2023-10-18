import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-bar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-tab-bar selected-tab="1">
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
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');
      await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-diff`));
    });
  });
});

/**
 * This behavior needs to be tested in both modes and directions to
 * make sure the safe area padding is applied only to that side
 * regardless of direction
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-bar: basic'), () => {
    test.describe('safe area left', () => {
      test('should have padding on the left only', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-safe-area-left: 40px;
            }
          </style>

          <ion-tab-bar selected-tab="1">
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
        `,
          config
        );

        const tabBar = page.locator('ion-tab-bar');

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-safe-area-left`));
      });
    });

    test.describe('safe area right', () => {
      test('should have padding on the right only', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-safe-area-right: 40px;
            }
          </style>

          <ion-tab-bar selected-tab="1">
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
        `,
          config
        );

        const tabBar = page.locator('ion-tab-bar');

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-safe-area-right`));
      });
    });
  });
});

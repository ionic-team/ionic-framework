import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior needs to be tested in all modes and directions
 */
configs({ modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('tab-bar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <style>
          :root {
            background: #ccc7c7;
          }
        </style>

        <ion-tab-bar selected-tab="2">
          <ion-tab-button tab="1">
            <ion-icon name="home-outline"></ion-icon>
            <ion-label>Label</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="2">
            <ion-icon name="home-outline"></ion-icon>
            <ion-label>Label</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="3" class="ion-focused">
            <ion-icon name="home-outline"></ion-icon>
            <ion-label>Label</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="4" class="ion-activated">
            <ion-icon name="home-outline"></ion-icon>
            <ion-label>Label</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      `,
        config
      );

      const tabBar = page.locator('ion-tab-bar');

      await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-default`));
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
    test.describe('safe area', () => {
      test('should have padding added by the safe area', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-safe-area-left: 40px;
              --ion-safe-area-right: 20px;
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

        await expect(tabBar).toHaveScreenshot(screenshot(`tab-bar-safe-area`));
      });
    });
  });
});

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
          .ionic {
            --ion-background-color: #ccc7c7;
          }

          #container {
            padding-top: 2px;
          }
        </style>

        <div id="container" class="ionic">
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
        </div>
      `,
        config
      );

      // The border top is not being captured in the screenshot
      // so we need padding on a container to make sure it's visible
      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`tab-bar-default`));
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

            #container {
              padding-top: 2px;
            }
          </style>

          <div id="container">
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
          </div>
        `,
          config
        );

        // The border top is not being captured in the screenshot
        // so we need padding on a container to make sure it's visible
        const container = page.locator('#container');

        await expect(container).toHaveScreenshot(screenshot(`tab-bar-safe-area`));
      });
    });
  });
});

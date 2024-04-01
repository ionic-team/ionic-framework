import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * Translucent is only available in iOS mode
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('tab-bar: translucent'),
      () => {
        test.beforeEach(({ skip }) => {
          skip.browser(
            'firefox',
            'Firefox does not support translucent effect'
          );
        });
        test('should render translucent tab bar', async ({
          page,
        }) => {
          await page.setContent(
            `
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
      `,
            config
          );

          const tabBar = page.locator(
            'ion-tab-bar'
          );

          await expect(
            tabBar
          ).toHaveScreenshot(
            screenshot(
              `tab-bar-translucent`
            )
          );
        });
        test('should render translucent tab bar even when wrapped in a page container', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          ion-content {
            --background: linear-gradient(to right, orange, yellow, green, cyan, blue, violet);
          }
        </style>
        <ion-tabs>
          <div class="ion-page">
            <ion-content fullscreen="true">My Content</ion-content>
          </div>
          <ion-tab-bar slot="bottom" translucent="true" selected-tab="1">
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
        </ion-tabs>
      `,
            config
          );

          const tabBar = page.locator(
            'ion-tab-bar'
          );

          await expect(
            tabBar
          ).toHaveScreenshot(
            screenshot(
              `tab-bar-translucent-container`
            )
          );
        });
      }
    );
  }
);

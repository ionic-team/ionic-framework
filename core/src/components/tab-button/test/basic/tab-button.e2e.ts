import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('tab-button: basic'),
      () => {
        test('should render tab button with label', async ({
          page,
        }) => {
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

          const tabBar = page.locator(
            'ion-tab-bar'
          );

          await expect(
            tabBar
          ).toHaveScreenshot(
            screenshot(
              `tab-button-label`
            )
          );
        });

        test('should render tab button with badges', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-tab-bar selected-tab="1">
          <ion-tab-button tab="1">
            <ion-icon name="heart"></ion-icon>
            <ion-label>Favorites</ion-label>
            <ion-badge color="danger"></ion-badge>
          </ion-tab-button>

          <ion-tab-button tab="2">
            <ion-icon name="musical-note"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3">
            <ion-icon name="today"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="4">
            <ion-icon name="calendar"></ion-icon>
            <ion-badge color="danger">47</ion-badge>
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
              `tab-button-badge`
            )
          );
        });

        test('should render tab button with icons', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-tab-bar selected-tab="1">
          <ion-tab-button tab="1">
            <ion-icon name="heart"></ion-icon>
            <ion-label>Favorites</ion-label>
            <ion-badge color="danger"></ion-badge>
          </ion-tab-button>

          <ion-tab-button tab="2">
            <ion-icon name="musical-note"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="3">
            <ion-icon name="today"></ion-icon>
          </ion-tab-button>

          <ion-tab-button tab="4">
            <ion-icon name="calendar"></ion-icon>
            <ion-badge color="danger">47</ion-badge>
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
              `tab-button-badge`
            )
          );
        });
      }
    );
  }
);

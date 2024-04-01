import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'tab-button: states with no translucency'
      ),
      () => {
        test.describe('focus', () => {
          test('should render correct focus state with default theme and no translucency', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-tab-bar style="width: 300px">
            <ion-tab-button href="#" class="ion-focused">
              <ion-label>Favorites</ion-label>
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
                'tab-button-focus-no-translucency'
              )
            );
          });

          test('should render correct focus state with custom theme and no translucency', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-tab-bar style="width: 300px" color="success">
            <ion-tab-button href="#" class="ion-focused">
              <ion-label>Favorites</ion-label>
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
                'tab-button-focus-color-no-translucency'
              )
            );
          });
        });
      }
    );
  }
);

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'tab-button: states with translucency'
      ),
      () => {
        test.describe('focus', () => {
          test('should render correct focus state with default theme and translucency', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-content color="dark">
            <ion-tab-bar style="width: 300px" translucent="true">
              <ion-tab-button href="#" class="ion-focused">
                <ion-label>Favorites</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-content>
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
                'tab-button-focus-translucency'
              )
            );
          });

          test('should render correct focus state with custom theme and translucency', async ({
            page,
          }) => {
            await page.setContent(
              `
          <ion-content color="dark">
            <ion-tab-bar style="width: 300px" color="success" translucent="true">
              <ion-tab-button href="#" class="ion-focused">
                <ion-label>Favorites</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-content>
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
                'tab-button-focus-color-translucency'
              )
            );
          });
        });
      }
    );
  }
);

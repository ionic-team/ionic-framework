import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('list: shape'), () => {
    test.describe(title('shape: round'), () => {
      test('should render without header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="round">
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-round-without-header`));
      });

      test('should render with header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="round">
                <ion-list-header>
                  <ion-label>Header</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-round-with-header`));
      });
    });

    test.describe(title('shape: soft'), () => {
      test('should render without header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="soft">
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-soft-without-header`));
      });

      test('should render with header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="soft">
                <ion-list-header>
                  <ion-label>Header</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-soft-with-header`));
      });
    });

    test.describe(title('shape: rectangular'), () => {
      test('should render without header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="rectangular">
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-rectangular-without-header`));
      });

      test('should render with header', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-content {
              --background: #e5e5e5;
            }
          </style>

          <ion-content>
            <div class="wrapper" style="display: flex">
              <ion-list inset="true" style="width: 100%" shape="rectangular">
                <ion-list-header>
                  <ion-label>Header</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    Title
                    <p>Subtitle</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        `,
          config
        );

        const listWrapper = page.locator('.wrapper');

        await expect(listWrapper).toHaveScreenshot(screenshot(`list-shape-rectangular-with-header`));
      });
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('menu: custom'), () => {
    test('should allow styling the menu box shadow when inside a split pane', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21530',
      });

      await page.setContent(
        `
        <style>
          ion-split-pane {
            --side-width: 200px;
            --side-min-width: 200px;
          }

          ion-menu {
            box-shadow: 10px 5px 5px red;
            z-index: 1;
          }
        </style>

        <ion-app>
          <ion-split-pane when="xs" id="splitPane" content-id="split-content">
            <ion-menu side="start" content-id="split-content">
              <ion-header>
                <ion-toolbar color="secondary">
                  <ion-title>Menu</ion-title>
                </ion-toolbar>
              </ion-header>

              <ion-content class="ion-padding">Menu Content</ion-content>
            </ion-menu>

            <div class="ion-page" id="split-content">
              <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                  </ion-buttons>

                  <ion-title>Content</ion-title>
                </ion-toolbar>
              </ion-header>

              <ion-content class="ion-padding">Main Content</ion-content>
            </div>
          </ion-split-pane>
        </ion-app>
      `,
        config
      );

      const app = page.locator('ion-app');

      await expect(app).toHaveScreenshot(screenshot(`menu-custom-split-pane`));
    });
  });
});

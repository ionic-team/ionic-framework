import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Title placement is only supported by the `ionic` theme.
 */
configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toolbar: title-placement'), () => {
    ['start', 'center', 'end'].forEach((placement) => {
      test(`should not have visual regressions with ${placement} placement`, async ({ page }) => {
        const placementTitle = placement.charAt(0).toUpperCase() + placement.slice(1);

        await page.setContent(
          `
              <ion-header>
                <ion-toolbar title-placement="${placement}">
                  <ion-title>${placementTitle} Placement</ion-title>
                </ion-toolbar>
                <ion-toolbar title-placement="${placement}">
                  <ion-buttons slot="start">
                    <ion-button>
                      <ion-icon slot="icon-only" name="menu"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                  <ion-title>${placementTitle} Placement</ion-title>
                </ion-toolbar>
                <ion-toolbar title-placement="${placement}">
                  <ion-title>${placementTitle} Placement</ion-title>
                  <ion-buttons slot="primary">
                    <ion-button>
                      <ion-icon slot="icon-only" name="search"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
            `,
          config
        );

        const header = page.locator('ion-header');
        await expect(header).toHaveScreenshot(screenshot(`toolbar-title-placement-${placement}`));
      });
    });
  });
});

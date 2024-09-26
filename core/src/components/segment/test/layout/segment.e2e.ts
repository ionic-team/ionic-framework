import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: layout'), () => {
    ['icon-top', 'icon-bottom', 'icon-start', 'icon-end'].forEach((layout) => {
      test(`${layout} layout - should not have visual regressions`, async ({ page }) => {
        await page.setContent(
          `
          <ion-segment value="a">
            <ion-segment-button layout="${layout}" value="a">
              <ion-icon name="triangle-outline"></ion-icon>
              <ion-label>Tab</ion-label>
            </ion-segment-button>
            <ion-segment-button layout="${layout}" value="b">
              <ion-icon name="triangle-outline"></ion-icon>
              <ion-label>Tab</ion-label>
            </ion-segment-button>
            <ion-segment-button layout="${layout}" value="c">
              <ion-icon name="triangle-outline"></ion-icon>
              <ion-label>Tab</ion-label>
            </ion-segment-button>
          </ion-segment>
        `,
          config
        );

        const segment = page.locator('ion-segment');

        await expect(segment).toHaveScreenshot(screenshot(`segment-layout-${layout}`));
      });
    });

    test('icon only layout - should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="a">
          <ion-segment-button value="a">
            <ion-icon name="triangle-outline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="b">
            <ion-icon name="triangle-outline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-icon name="triangle-outline"></ion-icon>
          </ion-segment-button>
        </ion-segment>
      `,
        config
      );

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(screenshot(`segment-layout-icon-only`));
    });

    test('label only layout - should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="a">
          <ion-segment-button value="a">
            <ion-label>Tab</ion-label>
          </ion-segment-button>
          <ion-segment-button value="b">
            <ion-label>Tab</ion-label>
          </ion-segment-button>
          <ion-segment-button value="c">
            <ion-label>Tab</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
        config
      );

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(screenshot(`segment-layout-label-only`));
    });
  });
});

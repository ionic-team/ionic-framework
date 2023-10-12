import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: scrollable (rendering)'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment scrollable="true" value="2">
          <ion-segment-button value="1">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3">
            <ion-label>Third</ion-label>
          </ion-segment-button>
          <ion-segment-button value="4">
            <ion-label>Fourth</ion-label>
          </ion-segment-button>
          <ion-segment-button value="5">
            <ion-label>Fifth</ion-label>
          </ion-segment-button>
          <ion-segment-button value="6">
            <ion-label>Sixth</ion-label>
          </ion-segment-button>
          <ion-segment-button value="7">
            <ion-label>Seventh</ion-label>
          </ion-segment-button>
          <ion-segment-button value="8">
            <ion-label>Eighth</ion-label>
          </ion-segment-button>
          <ion-segment-button value="9">
            <ion-label>Ninth</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
        config
      );

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(screenshot(`segment-scrollable`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment: scrollable (functionality)'), () => {
    test('should scroll active button into view when value is already set', async ({ page }) => {
      await page.setContent(
        `
          <ion-segment scrollable="true" value="8">
            <ion-segment-button value="1">
              <ion-label>First</ion-label>
            </ion-segment-button>
            <ion-segment-button value="2">
              <ion-label>Second</ion-label>
            </ion-segment-button>
            <ion-segment-button value="3">
              <ion-label>Third</ion-label>
            </ion-segment-button>
            <ion-segment-button value="4">
              <ion-label>Fourth</ion-label>
            </ion-segment-button>
            <ion-segment-button value="5">
              <ion-label>Fifth</ion-label>
            </ion-segment-button>
            <ion-segment-button value="6">
              <ion-label>Sixth</ion-label>
            </ion-segment-button>
            <ion-segment-button value="7">
              <ion-label>Seventh</ion-label>
            </ion-segment-button>
            <ion-segment-button id="activeButton" value="8">
              <ion-label>Eighth</ion-label>
            </ion-segment-button>
            <ion-segment-button value="9">
              <ion-label>Ninth</ion-label>
            </ion-segment-button>
          </ion-segment>
        `,
        config
      );

      const activeButton = page.locator('#activeButton');
      await expect(activeButton).toBeInViewport();
    });
  });
});

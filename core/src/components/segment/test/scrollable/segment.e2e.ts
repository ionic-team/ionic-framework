import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: scrollable'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment scrollable="true" value="2">
          <ion-segment-button value="1">First</ion-segment-button>
          <ion-segment-button value="2">Second</ion-segment-button>
          <ion-segment-button value="3">Third</ion-segment-button>
          <ion-segment-button value="4">Fourth</ion-segment-button>
          <ion-segment-button value="5">Fifth</ion-segment-button>
          <ion-segment-button value="6">Sixth</ion-segment-button>
          <ion-segment-button value="7">Seventh</ion-segment-button>
          <ion-segment-button value="8">Eigth</ion-segment-button>
          <ion-segment-button value="9">Nineth</ion-segment-button>
        </ion-segment>
      `,
        config
      );

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(screenshot(`segment-scrollable`));
    });
  });
});

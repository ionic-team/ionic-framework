import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('segment: scrollable', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
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

      expect(await segment.screenshot()).toMatchSnapshot(`segment-scrollable-${page.getSnapshotSettings()}.png`);
    });
  });
});

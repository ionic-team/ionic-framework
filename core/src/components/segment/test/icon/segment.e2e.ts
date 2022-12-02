import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('segment: icons', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="2">
          <ion-segment-button value="1">
            <ion-icon name="book"></ion-icon>
            <ion-label>Bookmarks</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2">
            <ion-icon name="search"></ion-icon>
            <ion-label>Reading List</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3">
            <ion-icon name="time"></ion-icon>
            <ion-label>Shared Links</ion-label>
          </ion-segment-button>
        </ion-segment>
      `,
        config
      );

      const segment = page.locator('ion-segment');

      expect(await segment.screenshot()).toMatchSnapshot(`segment-icons-${page.getSnapshotSettings()}.png`);
    });
  });
});

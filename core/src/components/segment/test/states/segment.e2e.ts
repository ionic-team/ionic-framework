import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment: states'), () => {
    test('should render focused segment correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="2">
            <ion-segment-button value="1">
            <ion-label>Bookmarks</ion-label>
            </ion-segment-button>
            <ion-segment-button class="ion-focused" value="2">
            <ion-label>Reading List</ion-label>
            </ion-segment-button>
            <ion-segment-button value="3">
            <ion-label>Shared Links</ion-label>
            </ion-segment-button>
        </ion-segment>
        `,
        config
      );

      const segment = page.locator('ion-segment');

      await expect(segment).toHaveScreenshot(screenshot(`segment-focused`));
    });
  });
});

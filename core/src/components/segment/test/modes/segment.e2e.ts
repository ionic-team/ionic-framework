import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('segment: modes', () => {
  configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should allow overriding of modes to iOS'), async ({ page }) => {
      await page.setContent(
        `
          <ion-segment mode="ios" value="kittens">
            <ion-segment-button mode="ios" value="puppies">
              <ion-label>Puppies</ion-label>
            </ion-segment-button>
          </ion-segment>
        `,
        config
      );

      const segment = page.locator('ion-segment');
      const segmentButtons = page.locator('ion-segment-button');
      await expect(segment).toHaveClass(/ios/);
      await expect(segmentButtons).toHaveClass(/ios/);
    });
  });
  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should allow overriding of modes to MD'), async ({ page }) => {
      await page.setContent(
        `
          <ion-segment mode="md" value="kittens">
            <ion-segment-button mode="md" value="puppies">
              <ion-label>Puppies</ion-label>
            </ion-segment-button>
          </ion-segment>
        `,
        config
      );

      const segment = page.locator('ion-segment');
      const segmentButtons = page.locator('ion-segment-button');
      await expect(segment).toHaveClass(/md/);
      await expect(segmentButtons).toHaveClass(/md/);
    });
  });
});

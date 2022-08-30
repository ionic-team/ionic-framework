import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: modes', () => {
  test('should allow overriding of modes to iOS', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'This tests that users can override the mode to iOS when the app is in MD mode');

    await page.setContent(`
        <ion-segment mode="ios" value="kittens">
          <ion-segment-button mode="ios" value="puppies">
            <ion-label>Puppies</ion-label>
          </ion-segment-button>
        </ion-segment>
      `);

    const segment = page.locator('ion-segment');
    const segmentButtons = page.locator('ion-segment-button');
    await expect(segment).toHaveClass(/ios/);
    await expect(segmentButtons).toHaveClass(/ios/);
  });

  test('should allow overriding of modes to MD', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md', 'This tests that users can override the mode to MD when the app is in iOS mode');

    await page.setContent(`
        <ion-segment mode="md" value="kittens">
          <ion-segment-button mode="md" value="puppies">
            <ion-label>Puppies</ion-label>
          </ion-segment-button>
        </ion-segment>
      `);

    const segment = page.locator('ion-segment');
    const segmentButtons = page.locator('ion-segment-button');
    await expect(segment).toHaveClass(/md/);
    await expect(segmentButtons).toHaveClass(/md/);
  });
});

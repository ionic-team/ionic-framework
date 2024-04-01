import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This tests that users can override the mode to iOS when the app is in MD mode
 */
configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('segment: modes'),
    () => {
      test('should allow overriding of modes to iOS', async ({
        page,
      }) => {
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

        const segment = page.locator(
          'ion-segment'
        );
        const segmentButtons =
          page.locator(
            'ion-segment-button'
          );
        await expect(
          segment
        ).toHaveClass(/ios/);
        await expect(
          segmentButtons
        ).toHaveClass(/ios/);
      });

      test('should allow overriding of modes to MD', async ({
        page,
      }) => {
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

        const segment = page.locator(
          'ion-segment'
        );
        const segmentButtons =
          page.locator(
            'ion-segment-button'
          );
        await expect(
          segment
        ).toHaveClass(/md/);
        await expect(
          segmentButtons
        ).toHaveClass(/md/);
      });
    }
  );
});

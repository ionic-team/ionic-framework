import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <style>
          /* Styles are here to show the disabled state */
          ion-segment-view {
            height: 100px;
            background: #3880ff;
          }
        </style>

        <ion-segment-view disabled>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segment = page.locator('ion-segment-view');

      await expect(segment).toHaveScreenshot(screenshot(`segment-view-disabled`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should show the second content when first segment content is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment disabled>
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content disabled id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentContent = page.locator('ion-segment-content[id="free"]');
      await expect(segmentContent).toBeInViewport();
    });

    test.only('should scroll to the third content and update the segment value when the second segment content is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment>
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button disabled content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content disabled id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentContent = page.locator('ion-segment-content[id="top"]');
      await segmentContent.scrollIntoViewIfNeeded();
      await expect(segmentContent).toBeInViewport();

      const segment = page.locator('ion-segment');
      expect(await segment.evaluate((el: HTMLIonSegmentElement) => el.value)).toBe('top');
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/segment-view/test/disabled', config);

      await expect(page).toHaveScreenshot(screenshot(`segment-view-disabled`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should keep button enabled even when disabled prop is set', async ({ page }) => {
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
          <ion-segment-content disabled id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentButton = page.locator('ion-segment-button[value="free"]');
      await expect(segmentButton).not.toHaveClass(/segment-button-disabled/);
    });
  });
});

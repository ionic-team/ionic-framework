import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * The resize behavior does not vary across directions or modes.
 */
configs({
  directions: ['ltr'],
  modes: ['md'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('spinner: resize'),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.setViewportSize({
              width: 320,
              height: 340,
            });
          }
        );
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          ion-spinner {
            width: 100px;
            height: 100px;
          }
        </style>
        <ion-spinner name="lines"></ion-spinner>
        <ion-spinner name="lines-small"></ion-spinner>
        <ion-spinner name="lines-sharp"></ion-spinner>
        <ion-spinner name="lines-sharp-small"></ion-spinner>
        <ion-spinner name="circular"></ion-spinner>
        <ion-spinner name="dots"></ion-spinner>
        <ion-spinner name="bubbles"></ion-spinner>
        <ion-spinner name="circles"></ion-spinner>
        <ion-spinner name="crescent"></ion-spinner>
      `,
            config
          );

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `spinner-resize-diff`
            )
          );
        });
      }
    );
  }
);

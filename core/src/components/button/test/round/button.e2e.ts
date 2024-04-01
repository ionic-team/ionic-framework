import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * All content takes up the full width, so RTL has no effect.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('button: round'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/button/test/round`,
            config
          );

          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(`button-round`)
          );
        });
      }
    );
  }
);

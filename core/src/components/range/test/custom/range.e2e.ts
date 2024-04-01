import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('range: customization'),
      () => {
        test('should be customizable', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/range/test/custom`,
            config
          );

          const range = page.locator(
            'ion-range'
          );
          await expect(
            range
          ).toHaveScreenshot(
            screenshot(`range-custom`)
          );
        });
      }
    );
  }
);

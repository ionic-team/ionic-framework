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
      title('checkbox: indeterminate'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/checkbox/test/indeterminate`,
            config
          );

          const checkbox = page.locator(
            'ion-checkbox:first-child'
          );
          await expect(
            checkbox
          ).toHaveScreenshot(
            screenshot(
              `checkbox-indeterminate`
            )
          );
        });
      }
    );
  }
);

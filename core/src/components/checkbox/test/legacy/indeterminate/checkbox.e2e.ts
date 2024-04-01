import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'checkbox: indeterminate (legacy)'
      ),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/checkbox/test/legacy/indeterminate`,
            config
          );

          const content = page.locator(
            '#checkboxes'
          );
          await expect(
            content
          ).toHaveScreenshot(
            screenshot(
              `checkbox-legacy-indeterminate`
            )
          );
        });
      }
    );
  }
);

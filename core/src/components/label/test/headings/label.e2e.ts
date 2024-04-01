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
      title('label: rendering'),
      () => {
        test('should inherit text overflow for headings', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/label/test/headings`,
            config
          );

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `item-headings-inherit`
            )
          );
        });
      }
    );
  }
);

import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('icon: basic'),
      () => {
        test('should render icon when passed', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-icon name="star"></ion-icon>
      `,
            config
          );

          const icon =
            page.locator('ion-icon');
          await expect(
            icon
          ).toHaveScreenshot(
            screenshot(`icon`)
          );
        });
      }
    );
  }
);

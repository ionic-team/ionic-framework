import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This does not test LTR vs. RTL layout.
 */
configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('footer: with tabs'),
      () => {
        test('should not have extra padding when near a tab bar', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/footer/test/with-tabs',
            config
          );

          const footer = page.locator(
            '[tab="tab-one"] ion-footer'
          );
          await expect(
            footer
          ).toHaveScreenshot(
            screenshot(
              `footer-with-tabs`
            )
          );
        });
      }
    );
  }
);

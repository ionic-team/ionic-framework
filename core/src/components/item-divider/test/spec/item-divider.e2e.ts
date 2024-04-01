import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('item-divider: spec'),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.goto(
              '/src/components/item-divider/test/spec',
              config
            );
          }
        );

        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `list-item-divider`
            )
          );
        });
      }
    );
  }
);

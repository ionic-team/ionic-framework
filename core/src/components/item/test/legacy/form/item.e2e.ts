import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('item: form'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/item/test/legacy/form`,
            config
          );

          await page.setIonViewport({
            resizeViewportWidth: true,
          });

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(`item-form-diff`)
          );
        });
      }
    );
  }
);

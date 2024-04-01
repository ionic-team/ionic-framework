import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('select: spec'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/select/test/legacy/spec`,
            config
          );

          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `select-spec-diff`
            )
          );
        });
      }
    );
  }
);

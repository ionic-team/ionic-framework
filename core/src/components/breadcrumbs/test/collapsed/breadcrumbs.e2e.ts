import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ config, screenshot, title }) => {
    test.describe(
      title('breadcrumbs: collapsed'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/breadcrumbs/test/collapsed`,
            config
          );

          await page.setIonViewport();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `breadcrumb-collapsed-diff`
            )
          );
        });
      }
    );
  }
);

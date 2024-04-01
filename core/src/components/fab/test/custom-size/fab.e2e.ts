import { expect } from '@playwright/test';
import {
  configs,
  test,
  Viewports,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes
 */
configs({ modes: ['ios'] }).forEach(
  ({ title, config, screenshot }) => {
    test.describe(
      title('fab: custom size'),
      () => {
        test('should position fabs correctly with custom sizes', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/fab/test/custom-size`,
            config
          );

          await page.setViewportSize(
            Viewports.tablet.landscape
          );

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `fab-custom-size`
            )
          );
        });
      }
    );
  }
);

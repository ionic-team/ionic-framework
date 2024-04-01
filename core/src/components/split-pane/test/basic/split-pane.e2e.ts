import { expect } from '@playwright/test';
import {
  configs,
  test,
  Viewports,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('split-pane: basic'),
      () => {
        test('should render on the correct side', async ({
          page,
        }) => {
          await page.setViewportSize(
            Viewports.large
          );
          await page.goto(
            `/src/components/split-pane/test/basic`,
            config
          );

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(`split-pane`)
          );
        });
      }
    );
  }
);

configs({
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('split-pane: functionality'),
    () => {
      test('should collapse on smaller viewports', async ({
        page,
      }) => {
        await page.goto(
          `/src/components/split-pane/test/basic`,
          config
        );

        const menu =
          page.locator('ion-menu');
        await expect(menu).toBeHidden();
      });
      test('should expand on larger viewports', async ({
        page,
      }) => {
        await page.setViewportSize(
          Viewports.large
        );
        await page.goto(
          `/src/components/split-pane/test/basic`,
          config
        );

        const menu =
          page.locator('ion-menu');
        await expect(
          menu
        ).toBeVisible();
      });
    }
  );
});

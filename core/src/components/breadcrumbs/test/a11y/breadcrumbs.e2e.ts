import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ config, title }) => {
    test.describe(
      title('breadcrumbs: axe'),
      () => {
        test('should not have accessibility violations', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/breadcrumbs/test/a11y`,
            config
          );

          const results =
            await new AxeBuilder({
              page,
            }).analyze();
          expect(
            results.violations
          ).toEqual([]);
        });
      }
    );
  }
);

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'breadcrumbs: font scaling'
      ),
      () => {
        test('should scale text on larger font sizes', async ({
          page,
        }) => {
          await page.setContent(
            `
        <style>
          html {
            font-size: 36px;
          }
        </style>

        <ion-breadcrumbs max-items="2" items-before-collapse="1">
          <ion-breadcrumb>Home</ion-breadcrumb>
          <ion-breadcrumb>Electronics</ion-breadcrumb>
          <ion-breadcrumb>Photography</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
            config
          );

          const breadcrumbs =
            page.locator(
              'ion-breadcrumbs'
            );

          await expect(
            breadcrumbs
          ).toHaveScreenshot(
            screenshot(
              `breadcrumbs-scale`
            )
          );
        });
      }
    );
  }
);

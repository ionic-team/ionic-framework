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
      title(
        'progress-bar: determinate'
      ),
      () => {
        test.describe(
          'with a dynamic progress value',
          () => {
            test('should not have visual regressions', async ({
              page,
            }) => {
              await page.setContent(
                `
          <ion-progress-bar value="0.20"></ion-progress-bar>
        `,
                config
              );

              await page.setIonViewport();

              const progressBar =
                await page.locator(
                  'ion-progress-bar'
                );

              await progressBar.evaluate(
                (
                  node: HTMLIonProgressBarElement
                ) => (node.value = 0.8)
              );

              await expect(
                progressBar
              ).toHaveScreenshot(
                screenshot(
                  `progress-bar-buffer-dynamic-value`
                )
              );
            });
          }
        );
      }
    );
  }
);

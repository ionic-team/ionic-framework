import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * Fade effect is only available in iOS mode.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('footer: fade'),
      () => {
        test('should not have visual regressions with fade footer', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/footer/test/fade',
            config
          );

          const footer = page.locator(
            'ion-footer'
          );
          await expect(
            footer
          ).toHaveScreenshot(
            screenshot(
              `footer-fade-blurred-diff`
            )
          );

          const content = page.locator(
            'ion-content'
          );
          await content.evaluate(
            (
              el: HTMLIonContentElement
            ) => el.scrollToBottom(0)
          );
          await page.waitForChanges();

          await expect(
            footer
          ).toHaveScreenshot(
            screenshot(
              `footer-fade-not-blurred-diff`
            )
          );
        });
      }
    );
  }
);

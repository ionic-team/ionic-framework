import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('modal: dark mode'),
      () => {
        test('should render the correct text color when outside ion-content', async ({
          page,
        }) => {
          test.info().annotations.push({
            type: 'issue',
            description:
              'https://github.com/ionic-team/ionic-framework/issues/26060',
          });

          await page.goto(
            '/src/components/modal/test/dark-mode',
            config
          );

          const ionModalDidPresent =
            await page.spyOnEvent(
              'ionModalDidPresent'
            );

          await page.click(
            '#basic-modal'
          );

          await ionModalDidPresent.next();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `modal-dark-color`
            )
          );
        });
      }
    );
  }
);

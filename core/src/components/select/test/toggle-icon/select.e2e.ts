import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
  modes: ['md'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('select: toggleIcon'),
      () => {
        test('should render a custom toggleIcon', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-select toggle-icon="pizza" label="Select" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
        `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          await expect(
            select
          ).toHaveScreenshot(
            screenshot(
              `select-toggle-icon`
            )
          );
        });

        test('should render a custom expandedIcon', async ({
          page,
        }) => {
          await page.setContent(
            `
          <ion-select expanded-icon="pizza" interface="popover" label="Select" value="a">
            <ion-select-option value="a">Apple</ion-select-option>
          </ion-select>
        `,
            config
          );

          const select = page.locator(
            'ion-select'
          );
          const popoverDidPresent =
            await page.spyOnEvent(
              'ionPopoverDidPresent'
            );

          await select.click();
          await popoverDidPresent.next();

          await expect(
            select
          ).toHaveScreenshot(
            screenshot(
              `select-expanded-icon`
            )
          );
        });
      }
    );
  }
);

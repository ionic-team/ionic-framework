import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('datetime: position'),
      () => {
        test('should position the time picker relative to the click target', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/datetime/test/position',
            config
          );
          const ionPopoverDidPresent =
            await page.spyOnEvent(
              'ionPopoverDidPresent'
            );

          const openDateTimeBtn =
            page.locator(
              'ion-button#open-datetime'
            );
          await openDateTimeBtn.click();

          await ionPopoverDidPresent.next();
          await page
            .locator('.datetime-ready')
            .waitFor();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `datetime-position-base`
            )
          );

          const timepickerBtn =
            page.locator(
              'ion-datetime .time-body'
            );
          await timepickerBtn.click();

          await ionPopoverDidPresent.next();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(
              `datetime-position-popover`
            )
          );
        });
      }
    );
  }
);

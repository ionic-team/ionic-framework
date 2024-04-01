import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'popover: alignment with async component'
      ),
      async () => {
        test('should align popover centered with button when component is added async', async ({
          page,
        }) => {
          await page.goto(
            '/src/components/popover/test/async',
            config
          );

          const ionPopoverDidPresent =
            await page.spyOnEvent(
              'ionPopoverDidPresent'
            );

          const button =
            page.locator('#button');
          await button.click();

          await ionPopoverDidPresent.next();

          await expect(
            page
          ).toHaveScreenshot(
            screenshot(`popover-async`)
          );
        });
        /**
         * Framework delegate should fall back to returning the host
         * component when no child content is passed otherwise
         * the overlay will get stuck when trying to re-present.
         */
        test('should open popover even if nothing was passed', async ({
          page,
        }) => {
          await page.setContent(
            `
        <ion-popover></ion-popover>
      `,
            config
          );

          const popover = page.locator(
            'ion-popover'
          );
          const ionPopoverDidPresent =
            await page.spyOnEvent(
              'ionPopoverDidPresent'
            );
          const ionPopoverDidDismiss =
            await page.spyOnEvent(
              'ionPopoverDidDismiss'
            );

          await popover.evaluate(
            (
              el: HTMLIonPopoverElement
            ) => el.present()
          );

          await ionPopoverDidPresent.next();
          await expect(
            popover
          ).toBeVisible();

          await popover.evaluate(
            (
              el: HTMLIonPopoverElement
            ) => el.dismiss()
          );

          await ionPopoverDidDismiss.next();
          await expect(
            popover
          ).toBeHidden();

          await popover.evaluate(
            (
              el: HTMLIonPopoverElement
            ) => el.present()
          );

          await ionPopoverDidPresent.next();
          await expect(
            popover
          ).toBeVisible();
        });
      }
    );
  }
);

import { expect } from '@playwright/test';
import {
  configs,
  test,
  dragElementBy,
} from '@utils/test/playwright';

/**
 * Card modals are an iOS-only feature
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: canDismiss'),
    () => {
      test.describe(
        'card modal - iOS swiping',
        () => {
          test.beforeEach(
            async ({ page }) => {
              await page.goto(
                '/src/components/modal/test/can-dismiss',
                config
              );
            }
          );

          test('should dismiss on swipe when canDismiss is true', async ({
            page,
          }) => {
            const ionModalDidPresent =
              await page.spyOnEvent(
                'ionModalDidPresent'
              );
            const ionModalDidDismiss =
              await page.spyOnEvent(
                'ionModalDidDismiss'
              );

            await page.click(
              '#card-can-dismiss-true'
            );

            await ionModalDidPresent.next();

            const modalHeader =
              page.locator(
                'ion-modal #modal-header'
              );
            await dragElementBy(
              modalHeader,
              page,
              0,
              500
            );

            await ionModalDidDismiss.next();
          });
          test('should not dismiss on swipe when canDismiss is false', async ({
            page,
          }) => {
            const ionModalDidPresent =
              await page.spyOnEvent(
                'ionModalDidPresent'
              );

            await page.click(
              '#card-can-dismiss-false'
            );

            await ionModalDidPresent.next();

            const modalHeader =
              page.locator(
                '#modal-header'
              );
            await dragElementBy(
              modalHeader,
              page,
              0,
              500
            );

            const modal = page.locator(
              'ion-modal'
            );
            expect(modal).not.toBe(
              null
            );
          });
          test('should dismiss on swipe when canDismiss is Promise<true>', async ({
            page,
          }) => {
            const ionModalDidPresent =
              await page.spyOnEvent(
                'ionModalDidPresent'
              );
            const ionModalDidDismiss =
              await page.spyOnEvent(
                'ionModalDidDismiss'
              );

            await page.click(
              '#card-can-dismiss-promise-true'
            );

            await ionModalDidPresent.next();

            const modalHeader =
              page.locator(
                '#modal-header'
              );
            await dragElementBy(
              modalHeader,
              page,
              0,
              500
            );

            await ionModalDidDismiss.next();
          });
          test('should not dismiss on swipe when canDismiss is Promise<false>', async ({
            page,
          }) => {
            const ionModalDidPresent =
              await page.spyOnEvent(
                'ionModalDidPresent'
              );
            const ionHandlerDone =
              await page.spyOnEvent(
                'ionHandlerDone'
              );

            await page.click(
              '#card-can-dismiss-promise-false'
            );

            await ionModalDidPresent.next();

            const modalHeader =
              page.locator(
                '#modal-header'
              );
            await dragElementBy(
              modalHeader,
              page,
              0,
              500
            );

            await ionHandlerDone.next();

            const modal = page.locator(
              'ion-modal'
            );
            expect(modal).not.toBe(
              null
            );
          });
        }
      );
    }
  );
});

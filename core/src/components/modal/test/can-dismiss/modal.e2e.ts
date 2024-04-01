import { expect } from '@playwright/test';
import {
  configs,
  test,
  dragElementBy,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: canDismiss'),
    () => {
      test.describe(
        'function params',
        () => {
          test.beforeEach(
            async ({ page }) => {
              await page.goto(
                '/src/components/modal/test/can-dismiss',
                config
              );
            }
          );
          test('should pass data and role when swiping', async ({
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
              '#sheet-can-dismiss-promise-true'
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
            await expect(
              ionHandlerDone
            ).toHaveReceivedEventDetail(
              {
                data: undefined,
                role: 'gesture',
              }
            );
          });
        }
      );
    }
  );
});

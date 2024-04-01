import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('toast: standalone'),
    () => {
      test('should open overlay without ion-app', async ({
        page,
      }) => {
        await page.goto(
          `/src/components/toast/test/standalone`,
          config
        );

        const ionToastDidPresent =
          await page.spyOnEvent(
            'ionToastDidPresent'
          );
        const toast = page.locator(
          'ion-toast'
        );

        const basicButton =
          page.locator('#basic-toast');
        await basicButton.click();

        await ionToastDidPresent.next();
        await expect(
          toast
        ).toBeVisible();
      });
    }
  );
});

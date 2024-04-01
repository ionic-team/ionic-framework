import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  directions: ['ltr'],
  modes: ['ios'],
}).forEach(({ config, title }) => {
  test.describe(
    title('action sheet: isOpen'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/action-sheet/test/is-open',
            config
          );
        }
      );
      test('should open the action sheet', async ({
        page,
      }) => {
        const ionActionSheetDidPresent =
          await page.spyOnEvent(
            'ionActionSheetDidPresent'
          );
        const actionSheet =
          page.locator(
            'ion-action-sheet'
          );

        await page.click('#default');

        await ionActionSheetDidPresent.next();
        await expect(
          actionSheet
        ).toBeVisible();
      });

      test('should open the action sheet then close after a timeout', async ({
        page,
      }) => {
        const ionActionSheetDidPresent =
          await page.spyOnEvent(
            'ionActionSheetDidPresent'
          );
        const ionActionSheetDidDismiss =
          await page.spyOnEvent(
            'ionActionSheetDidDismiss'
          );
        const actionSheet =
          page.locator(
            'ion-action-sheet'
          );

        await page.click('#timeout');

        await ionActionSheetDidPresent.next();
        await expect(
          actionSheet
        ).toBeVisible();

        await ionActionSheetDidDismiss.next();

        await expect(
          actionSheet
        ).toBeHidden();
      });

      test('should open if isOpen is true on load', async ({
        page,
      }) => {
        await page.setContent(
          '<ion-action-sheet is-open="true"></ion-action-sheet>',
          config
        );
        await expect(
          page.locator(
            'ion-action-sheet'
          )
        ).toBeVisible();
      });
    }
  );
});

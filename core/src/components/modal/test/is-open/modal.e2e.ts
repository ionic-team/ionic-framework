import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: isOpen'),
    () => {
      test('should open and close the modal', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/modal/test/is-open',
          config
        );

        const ionModalDidPresent =
          await page.spyOnEvent(
            'ionModalDidPresent'
          );
        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );
        const modal = page.locator(
          'ion-modal'
        );

        await page.click('#default');

        await ionModalDidPresent.next();
        await expect(
          modal
        ).toBeVisible();

        await modal.evaluate(
          (el: HTMLIonModalElement) =>
            (el.isOpen = false)
        );

        await ionModalDidDismiss.next();
        await expect(
          modal
        ).toBeHidden();
      });

      test('should open if isOpen is true on load', async ({
        page,
      }) => {
        await page.setContent(
          '<ion-modal is-open="true"></ion-modal>',
          config
        );
        await expect(
          page.locator('ion-modal')
        ).toBeVisible();
      });
    }
  );
});

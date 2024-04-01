import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ config, title }) => {
  test.describe(
    title('modal: animations'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.setContent(
            `
        <ion-modal is-open="true" trigger="open-modal"></ion-modal>
      `,
            config
          );
        }
      );
      test('card modal should clean up animations on dismiss', async ({
        page,
      }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description:
            'https://github.com/ionic-team/ionic-framework/issues/28352',
        });

        const ionModalDidDismiss =
          await page.spyOnEvent(
            'ionModalDidDismiss'
          );

        const modal = page.locator(
          'ion-modal'
        );

        const initialAnimations =
          await modal.evaluate(
            (
              el: HTMLIonModalElement
            ) => {
              return el.shadowRoot!.getAnimations();
            }
          );

        // While the modal is open, it should have animations
        expect(
          initialAnimations.length
        ).toBeGreaterThan(0);

        await modal.evaluate(
          (el: HTMLIonModalElement) => {
            el.dismiss();
          }
        );

        await ionModalDidDismiss.next();

        const currentAnimations =
          await modal.evaluate(
            (
              el: HTMLIonModalElement
            ) => {
              return el.shadowRoot!.getAnimations();
            }
          );

        // Once the modal has finished closing, there should be no animations
        expect(
          currentAnimations.length
        ).toBe(0);
      });
    }
  );
});

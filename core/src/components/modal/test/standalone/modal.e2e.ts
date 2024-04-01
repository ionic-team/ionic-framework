import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('modal: standalone'),
    () => {
      test('should open even without an ion-app', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/modal/test/standalone',
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

        await page.click(
          '#basic-modal'
        );
        await ionModalDidPresent.next();

        const modal = page.locator(
          'ion-modal'
        );
        await modal.evaluate(
          (el: HTMLIonModalElement) =>
            el.dismiss()
        );

        await ionModalDidDismiss.next();

        await page
          .locator('ion-modal')
          .waitFor({
            state: 'detached',
          });
      });
    }
  );
});

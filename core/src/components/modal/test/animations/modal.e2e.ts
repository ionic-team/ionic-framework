import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('modal: animations'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-modal is-open="true" trigger="open-modal"></ion-modal>
      `,
        config
      );
    });
    test('card modal should clean up animations on dismiss', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28352',
      });

      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const modal = page.locator('ion-modal');

      const initialAnimations = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.shadowRoot!.getAnimations();
      });

      // While the modal is open, it should have animations
      expect(initialAnimations.length).toBeGreaterThan(0);

      await modal.evaluate((el: HTMLIonModalElement) => {
        el.dismiss();
      });

      await ionModalDidDismiss.next();

      const currentAnimations = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.shadowRoot!.getAnimations();
      });

      // Once the modal has finished closing, there should be no animations
      expect(currentAnimations.length).toBe(0);
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('modal: animations'), () => {
    test('should not keep the enter animation applied to the wrapper', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31603',
      });

      await page.setContent(
        `
        <ion-modal></ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());
      await ionModalDidPresent.next();

      const wrapper = page.locator('ion-modal .modal-wrapper');

      /**
       * An applied opacity animation makes the wrapper a backdrop root,
       * which breaks `backdrop-filter` on content inside the modal.
       */
      const wrapperAnimations = await wrapper.evaluate((el: HTMLElement) => el.getAnimations().length);
      expect(wrapperAnimations).toBe(0);

      await expect(wrapper).toHaveCSS('opacity', '1');
      await expect(wrapper).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    });
  });
});

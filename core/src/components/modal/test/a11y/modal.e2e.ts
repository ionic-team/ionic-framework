import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');
      const modal = page.locator('ion-modal .modal-wrapper');

      await expect(modal).toHaveAttribute('role', 'dialog');

      await button.click();
      await ionModalDidPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    // Focus the wrapper with role="dialog" on present so screen readers
    // (e.g. TalkBack) enter the dialog.
    test('should focus the modal wrapper on present', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'FW-7611',
      });
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');
      const wrapper = page.locator('ion-modal .modal-wrapper');

      await button.click();
      await ionModalDidPresent.next();

      await expect(wrapper).toHaveAttribute('role', 'dialog');
      await expect(wrapper).toBeFocused();
    });

    test('should focus the sheet modal wrapper on present', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'FW-7611',
      });
      await page.setContent(
        `
        <ion-modal initial-breakpoint="0.5" breakpoints="[0, 0.5, 1]">
          <ion-content>Sheet Modal Content</ion-content>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');
      const wrapper = page.locator('ion-modal .modal-wrapper');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());
      await ionModalDidPresent.next();

      await expect(wrapper).toHaveAttribute('role', 'dialog');
      await expect(wrapper).toBeFocused();
    });

    test('should focus the card modal wrapper on present', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'FW-7611',
      });
      await page.setContent(
        `
        <div class="ion-page">
          <ion-content>Root Content</ion-content>
        </div>
        <ion-modal>
          <ion-content>Card Modal Content</ion-content>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');
      const wrapper = page.locator('ion-modal .modal-wrapper');

      await modal.evaluate((el: HTMLIonModalElement) => {
        el.presentingElement = document.querySelector<HTMLElement>('.ion-page')!;
        return el.present();
      });
      await ionModalDidPresent.next();

      await expect(wrapper).toHaveAttribute('role', 'dialog');
      await expect(wrapper).toBeFocused();
    });
  });
});

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

    test('should allow for custom role', async ({ page }) => {
      /**
       * Note: This example should not be used in production.
       * This only serves to check that `role` can be customized.
       */
      await page.setContent(
        `
        <ion-modal role="alertdialog"></ion-modal>
      `,
        config
      );
      const modal = page.locator('ion-modal .modal-wrapper');

      await expect(modal).toHaveAttribute('role', 'alertdialog');
    });
  });
});

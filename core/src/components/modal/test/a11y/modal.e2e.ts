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

    // role="dialog" lives on .modal-wrapper, not the host, so focus must land
    // there on present for screen readers (e.g. TalkBack) to enter the dialog
    // (IONIC-91 / FW-7611).
    test('should move focus to the dialog wrapper, not the role-less host, on present', async ({ page }) => {
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');
      const wrapper = page.locator('ion-modal .modal-wrapper');

      await button.click();
      await ionModalDidPresent.next();

      await expect(wrapper).toHaveAttribute('role', 'dialog');
      await expect(wrapper).toBeFocused();
    });
  });
});

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

    // The focused wrapper must not show a focus ring when opened via keyboard.
    test('should not render a focus ring on the wrapper when presented via keyboard', async ({ page }) => {
      await page.goto(`/src/components/modal/test/a11y`, config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const button = page.locator('#open-modal');
      const wrapper = page.locator('ion-modal .modal-wrapper');

      // Open with the keyboard so :focus-visible applies to the wrapper.
      await button.focus();
      await page.keyboard.press('Enter');
      await ionModalDidPresent.next();

      await expect(wrapper).toBeFocused();
      await expect(wrapper).toHaveCSS('outline-style', 'none');
    });
  });
});

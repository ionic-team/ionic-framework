import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('toast: a11y', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/toast/test/a11y`, config);
    });
    test(title('should not have any axe violations with polite toasts'), async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      const politeButton = page.locator('#polite');
      await politeButton.click();

      await ionToastDidPresent.next();

      /**
       * IonToast overlays the entire screen, so
       * Axe will be unable to verify color contrast
       * on elements under the toast.
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
    test(title('should not have any axe violations with assertive toasts'), async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      const politeButton = page.locator('#assertive');
      await politeButton.click();

      await ionToastDidPresent.next();

      /**
       * IonToast overlays the entire screen, so
       * Axe will be unable to verify color contrast
       * on elements under the toast.
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

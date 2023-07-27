import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This test does not check LTR vs RTL layouts
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toast: a11y'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/toast/test/a11y`, config);
    });
    test('should not have any axe violations with inline toasts', async ({ page }) => {
      const didPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#inline-toast-trigger');
      await didPresent.next();

      /**
       * IonToast overlays the entire screen, so
       * Axe will be unable to verify color contrast
       * on elements under the toast.
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });
    test('should not have any axe violations with controller toasts', async ({ page }) => {
      const didPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#controller-toast-trigger');
      await didPresent.next();

      /**
       * IonToast overlays the entire screen, so
       * Axe will be unable to verify color contrast
       * on elements under the toast.
       */
      const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
      expect(results.violations).toEqual([]);
    });

    test('should have aria-labelledby and aria-label added to the button when htmlAttributes is set', async ({
      page,
    }) => {
      const didPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#aria-label-toast-trigger');
      await didPresent.next();

      const toastButton = page.locator('#aria-label-toast .toast-button');

      await expect(toastButton).toHaveAttribute('aria-labelledby', 'close-label');
      await expect(toastButton).toHaveAttribute('aria-label', 'close button');
    });
  });
});

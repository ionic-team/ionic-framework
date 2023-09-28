import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toast: positionAnchor'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/toast/test/position-anchor', config);

      /**
       * We need to screenshot the whole page to ensure the toasts are positioned
       * correctly, but we don't need much extra white space between the header
       * and footer.
       */
      await page.setViewportSize({
        width: 425,
        height: 425,
      });
    });
    
    test('should place top-position toast underneath anchor', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#headerAnchor');
      await ionToastDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`toast-header-anchor`));
    });

    test('should place bottom-position toast above anchor', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#footerAnchor');
      await ionToastDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`toast-footer-anchor`));
    });

    test('should ignore anchor for middle-position toast', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#middleAnchor');
      await ionToastDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`toast-middle-anchor`));
    });

    test('should correctly anchor toast when using an element reference', async ({ page }) => {
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#headerElAnchor');
      await ionToastDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`toast-header-el-anchor`));
    });
  });
});

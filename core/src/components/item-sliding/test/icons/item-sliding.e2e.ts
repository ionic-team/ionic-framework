import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * item-sliding doesn't have mode-specific styling,
 * but the child components, item-options and item-option, do.
 *
 * It is important to test all modes to ensure that the
 * child components are being rendered correctly.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: icons'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/icons`, config);

      const itemIDs = ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'];
      for (const itemID of itemIDs) {
        const itemIDKebab = itemID.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const item = page.locator(`#${itemID}`);

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         * Positive dragByX value to drag element from the left to the right
         * to reveal the options on the left side.
         */
        const dragByX = config.direction === 'rtl' ? 150 : -150;

        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-${itemIDKebab}`));
      }
    });
  });
});
